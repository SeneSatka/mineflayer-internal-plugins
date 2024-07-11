import { onceWithCleanup } from "../utils/promise_utils";
import { Bot, BotOptions } from "../utils/types";
import prismarineChat from "prismarine-chat";
const USERNAME_REGEX = "(?:\\(.{1,15}\\)|\\[.{1,15}\\]|.){0,5}?(\\w+)";
const LEGACY_VANILLA_CHAT_REGEX = new RegExp(
  `^${USERNAME_REGEX}\\s?[>:\\-»\\]\\)~]+\\s(.*)$`
);

export default (bot: Bot, options: BotOptions) => {
  const CHAT_LENGTH_LIMIT =
    options.chatLengthLimit ??
    (bot.supportFeature("lessCharsInChat") ? 100 : 256);
  const defaultChatPatterns = options.defaultChatPatterns ?? true;

  const ChatMessage = prismarineChat(bot.registry);
  const _patterns: { [name: string]: any } = {};
  let _length = 0;
  bot.chatAddPattern = (patternValue, typeValue) => {
    return bot.addChatPattern(typeValue, patternValue, { deprecated: true });
  };
  bot.addChatPatternSet = (name, patterns, opts = {}) => {
    if (!patterns.every((p) => p instanceof RegExp))
      throw new Error("Pattern parameter should be of type RegExp");
    const { repeat = true, parse = false } = opts;
    _patterns[_length++] = {
      name,
      patterns,
      position: 0,
      matches: [],
      messages: [],
      repeat,
      parse,
    };
    return _length;
  };

  bot.addChatPattern = (name, pattern, opts = {}) => {
    if (!(pattern instanceof RegExp))
      throw new Error("Pattern parameter should be of type RegExp");
    const { repeat = true, deprecated = false, parse = false } = opts;
    _patterns[_length] = {
      name,
      patterns: [pattern],
      position: 0,
      matches: [],
      messages: [],
      deprecated,
      repeat,
      parse,
    };
    return _length++;
  };

  bot.removeChatPattern = (name) => {
    if (typeof name === "number") {
      _patterns[name] = undefined;
    } else {
      const matchingPatterns = Object.entries(_patterns).filter(
        (pattern) => pattern[1]?.name === name
      );
      matchingPatterns.forEach(([indexString]) => {
        _patterns[+indexString] = undefined;
      });
    }
  };

  function findMatchingPatterns(msg) {
    const found = [];
    for (const [indexString, pattern] of Object.entries(_patterns)) {
      if (!pattern) continue;
      const { position, patterns } = pattern;
      if (patterns[position].test(msg)) {
        found.push(+indexString);
      }
    }
    return found;
  }

  bot.on("messagestr", (msg, _, originalMsg) => {
    const foundPatterns = findMatchingPatterns(msg);

    for (const ix of foundPatterns) {
      _patterns[ix].matches.push(msg);
      _patterns[ix].messages.push(originalMsg);
      _patterns[ix].position++;

      if (_patterns[ix].deprecated) {
        const [, ...matches] = _patterns[ix].matches[0].match(
          _patterns[ix].patterns[0]
        );
        bot.emit(
          _patterns[ix].name,
          ...matches,
          _patterns[ix].messages[0].translate,
          ..._patterns[ix].messages
        );
        _patterns[ix].messages = [];
      } else {
        if (_patterns[ix].patterns.length > _patterns[ix].matches.length)
          return;
        if (_patterns[ix].parse) {
          const matches = _patterns[ix].patterns.map((pattern, i) => {
            const [, ...matches] = _patterns[ix].matches[i].match(pattern);
            return matches;
          });
          //@ts-ignore
          bot.emit(`chat:${_patterns[ix].name}`, matches);
        } else {
          //@ts-ignore
          bot.emit(`chat:${_patterns[ix].name}`, _patterns[ix].matches);
        }
      }
      if (_patterns[ix]?.repeat) {
        _patterns[ix].position = 0;
        _patterns[ix].matches = [];
      } else {
        _patterns[ix] = undefined;
      }
    }
  });

  addDefaultPatterns();

  bot._client.on("playerChat", (data) => {
    const message = data.formattedMessage;
    const verified = data.verified;
    let msg;
    if (bot.supportFeature("clientsideChatFormatting")) {
      const parameters = {
        sender: data.senderName ? JSON.parse(data.senderName) : undefined,
        //@ts-ignore
        target: data.targetName ? JSON.parse(data.targetName) : undefined,
        //@ts-ignore
        content: message ? JSON.parse(message) : { text: data.plainMessage },
      }; //@ts-ignore
      msg = ChatMessage.fromNetwork(data.type, parameters);
      //@ts-ignore
      if (data.unsignedContent) {
        //@ts-ignore
        msg.unsigned = ChatMessage.fromNetwork(data.type, {
          sender: parameters.sender,
          target: parameters.target,
          //@ts-ignore
          content: JSON.parse(data.unsignedContent),
        });
      }
    } else {
      msg = ChatMessage.fromNotch(message);
    }
    //@ts-ignore
    bot.emit("message", msg, "chat", data.sender, verified);
    //@ts-ignore
    bot.emit("messagestr", msg.toString(), "chat", msg, data.sender, verified);
  });

  bot._client.on("systemChat", (data) => {
    const msg = ChatMessage.fromNotch(data.formattedMessage);
    const chatPositions = {
      1: "system",
      2: "game_info",
    };
    bot.emit("message", msg, chatPositions[data.positionId]);
    bot.emit("messagestr", msg.toString(), chatPositions[data.positionId], msg);
    if (data.positionId === 2) bot.emit("actionBar", msg);
  });

  function chatWithHeader(header, message) {
    if (typeof message === "number") message = message.toString();
    if (typeof message !== "string") {
      throw new Error(
        "Chat message type must be a string or number: " + typeof message
      );
    }

    if (!header && message.startsWith("/")) {
      bot._client.chat(message);
      return;
    }

    const lengthLimit = CHAT_LENGTH_LIMIT - header.length;
    message.split("\n").forEach((subMessage) => {
      if (!subMessage) return;
      let i;
      let smallMsg;
      for (i = 0; i < subMessage.length; i += lengthLimit) {
        smallMsg = header + subMessage.substring(i, i + lengthLimit);
        bot._client.chat(smallMsg);
      }
    });
  }

  async function tabComplete(
    text,
    assumeCommand = false,
    sendBlockInSight = true,
    timeout = 5000
  ) {
    let position;

    if (sendBlockInSight) {
      const block = bot.blockAtCursor();

      if (block) {
        position = block.position;
      }
    }

    bot._client.write("tab_complete", {
      text,
      assumeCommand,
      lookedAtBlock: position,
    });

    const [packet] = await onceWithCleanup(bot._client, "tab_complete", {
      timeout,
    });
    return packet.matches;
  }

  bot.whisper = (username, message) => {
    chatWithHeader(`/tell ${username} `, message);
  };
  bot.chat = (message) => {
    chatWithHeader("", message);
  };

  bot.tabComplete = tabComplete;

  function addDefaultPatterns() {
    if (!defaultChatPatterns) return;
    bot.addChatPattern(
      "whisper",
      new RegExp(`^${USERNAME_REGEX} whispers(?: to you)?:? (.*)$`),
      { deprecated: true }
    );
    bot.addChatPattern(
      "whisper",
      new RegExp(`^\\[${USERNAME_REGEX} -> \\w+\\s?\\] (.*)$`),
      { deprecated: true }
    );
    bot.addChatPattern("chat", LEGACY_VANILLA_CHAT_REGEX, { deprecated: true });
  }

  function awaitMessage(...args: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      const resolveMessages = args.flatMap((x) => x);
      function messageListener(msg) {
        if (
          resolveMessages.some((x: any) =>
            x instanceof RegExp ? x.test(msg) : msg === x
          )
        ) {
          resolve(msg);
          bot.off("messagestr", messageListener);
        }
      }
      bot.on("messagestr", messageListener);
    });
  }
  bot.awaitMessage = awaitMessage;
};
