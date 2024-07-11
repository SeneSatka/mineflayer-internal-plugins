import { Vec3 } from "vec3";
import { Bot } from "../utils/types";

export default (bot: Bot) => {
  bot.spawnPoint = new Vec3(0, 0, 0);
  bot._client.on("spawn_position", (packet) => {
    bot.spawnPoint = new Vec3(
      packet.location.x,
      packet.location.y,
      packet.location.z
    );
    bot.emit("game");
  });
};
