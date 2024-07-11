import { Bot } from "../utils/types";
import particle from "../utils/particle";
export default (bot: Bot) => {
  const Particle = particle(bot.registry);
  bot._client.on("world_particles", (packet) => {
    bot.emit("particle", Particle.fromNetwork(packet));
  });
};
