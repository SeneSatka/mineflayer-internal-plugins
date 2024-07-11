import { Bot } from "../utils/types";
import prismarineChat from "prismarine-chat";

const escapeValueNewlines = (str) => {
  return str.replace(/(": *"(?:\\"|[^"])+")/g, (_, match) =>
    match.replace(/\n/g, "\\n")
  );
};

export default (bot: Bot) => {
  const ChatMessage = prismarineChat(bot.registry);

  bot.tablist = {
    header: new ChatMessage(""),
    footer: new ChatMessage(""),
  };

  bot._client.on("playerlist_header", (packet) => {
    if (bot.supportFeature("chatPacketsUseNbtComponents")) {
      // 1.20.3+
      bot.tablist.header = ChatMessage.fromNotch(packet.header);
      bot.tablist.footer = ChatMessage.fromNotch(packet.footer);
    } else {
      if (packet.header) {
        const header = escapeValueNewlines(packet.header);
        bot.tablist.header = ChatMessage.fromNotch(header);
      }

      if (packet.footer) {
        const footer = escapeValueNewlines(packet.footer);
        bot.tablist.footer = ChatMessage.fromNotch(footer);
      }
    }
  });
};
