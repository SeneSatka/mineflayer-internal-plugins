import { Bot, ScoreBoardItem, ScoreBoard as ScoreBoardType } from "./types";

const sortItems = (a, b) => {
  if (a.value > b.value) return -1;
  if (a.value < b.value) return 1;
  return 1;
};

export default (bot: Bot) => {
  const ChatMessage = require("prismarine-chat")(bot.registry);

  class ScoreBoard implements ScoreBoardType {
    static positions: any;
    name: string;
    title: string;
    itemsMap: { [name: string]: ScoreBoardItem };

    constructor(packet) {
      this.name = packet.name;
      this.setTitle(packet.displayText);
      this.itemsMap = {};
    }

    setTitle(title) {
      try {
        this.title = JSON.parse(title).text; // version>1.13
      } catch {
        this.title = title;
      }
    }

    add(name: string, value: any) {
      //@ts-ignore
      this.itemsMap[name] = { name, value };
      this.itemsMap[name] = {
        name,
        value,
        get displayName() {
          if (name in bot.teamMap) {
            return bot.teamMap[name].displayName(name);
          }
          return new ChatMessage(name);
        },
      };
      return this.itemsMap[name];
    }

    remove(name) {
      const removed = this.itemsMap[name];
      delete this.itemsMap[name];
      return removed;
    }

    get items() {
      return Object.values(this.itemsMap).sort(sortItems);
    }
  }

  ScoreBoard.positions = {
    get list() {
      return this[0];
    },

    get sidebar() {
      return this[1];
    },

    get belowName() {
      return this[2];
    },
  };
  return ScoreBoard;
};
