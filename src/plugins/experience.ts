import { Bot } from "../utils/types";

export default (bot: Bot) => {
  bot.experience = {
    level: null,
    points: null,
    progress: null,
  };
  bot._client.on("experience", (packet) => {
    bot.experience.level = packet.level;
    bot.experience.points = packet.totalExperience;
    bot.experience.progress = packet.experienceBar;
    bot.emit("experience");
  });
};
