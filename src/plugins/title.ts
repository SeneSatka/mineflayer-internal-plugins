import { Bot } from "../utils/types";

export default (bot: Bot) => {
  bot._client.on("title", (packet) => {
    if (packet.action === 0 || packet.action === 1) {
      bot.emit("title", packet.text);
    }
  });
};
