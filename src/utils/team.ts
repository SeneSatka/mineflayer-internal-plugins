import { ChatMessage } from "prismarine-chat";
import { Team as TeamType } from "./types";
function colorString(color) {
  const formatting = [
    "black",
    "dark_blue",
    "dark_green",
    "dark_aqua",
    "dark_red",
    "dark_purple",
    "gold",
    "gray",
    "dark_gray",
    "blue",
    "green",
    "aqua",
    "red",
    "light_purple",
    "yellow",
    "white",
    "obfuscated",
    "bold",
    "strikethrough",
    "underlined",
    "italic",
    "reset",
  ];
  if (color === undefined || color > 21 || color === -1) return "reset";
  return formatting[color];
}

function loader(registry) {
  const ChatMessage = require("prismarine-chat")(registry);
  const MessageBuilder = ChatMessage.MessageBuilder;
  return class Team implements TeamType {
    constructor(
      team,
      name,
      friendlyFire,
      nameTagVisibility,
      collisionRule,
      formatting,
      prefix,
      suffix
    ) {
      this.team = team;
      this.update(
        name,
        friendlyFire,
        nameTagVisibility,
        collisionRule,
        formatting,
        prefix,
        suffix
      );
      this.memberMap = {};
    }
    team: string;
    name: ChatMessage;
    friendlyFire: number;
    nameTagVisibility: string;
    collisionRule: string;
    color: string;
    prefix: ChatMessage;
    suffix: ChatMessage;
    memberMap: { [name: string]: "" };

    parseMessage(value) {
      if (registry.supportFeature("teamUsesChatComponents")) {
        // 1.13+
        return ChatMessage.fromNotch(value);
      } else {
        const result = MessageBuilder.fromString(value, {
          colorSeparator: "§",
        });
        if (result === null) {
          return new ChatMessage("");
        }
        return new ChatMessage(result.toJSON());
      }
    }

    add(name) {
      this.memberMap[name] = "";
      return this.memberMap[name];
    }

    remove(name) {
      const removed = this.memberMap[name];
      delete this.memberMap[name];
      return removed;
    }

    update(
      name,
      friendlyFire,
      nameTagVisibility,
      collisionRule,
      formatting,
      prefix,
      suffix
    ) {
      this.name = this.parseMessage(name);
      this.friendlyFire = friendlyFire;
      this.nameTagVisibility = nameTagVisibility;
      this.collisionRule = collisionRule;
      this.color = colorString(formatting);
      this.prefix = this.parseMessage(prefix);
      this.suffix = this.parseMessage(suffix);
    }

    // Return a chat component with prefix + color + name + suffix
    displayName(member) {
      const name = this.prefix.clone();
      name.append(
        new ChatMessage({ text: member, color: this.color }),
        this.suffix
      );
      return name;
    }

    get members() {
      return Object.keys(this.memberMap);
    }
  };
}

export default loader;
