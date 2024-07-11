const colors = ["pink", "blue", "red", "green", "yellow", "purple", "white"];
const divisions = [0, 6, 10, 12, 20];
import ChatMessageD, { ChatMessage } from "prismarine-chat";
import { BossBar as BossBarType } from "./types";
function loader(registry) {
  const ChatMessage = ChatMessageD(registry);
  return class BossBar implements BossBarType {
    entityUUID: string;
    title: ChatMessage;
    health: number;
    dividers: number;
    color: (typeof colors)[number];
    shouldDarkenSky: boolean | number;
    isDragonBar: boolean | number;
    createFog: boolean | number;
    shouldCreateFog: boolean;
    constructor(
      uuid: string,
      title: ChatMessage,
      health: number,
      dividers: number,
      color: string,
      flags: any
    ) {
      this.entityUUID = uuid;
      this.title = ChatMessage.fromNotch(title.toString());
      this.health = health;
      this.dividers = divisions[dividers];
      this.color = colors[color];
      this.shouldDarkenSky = flags & 0x1;
      this.isDragonBar = flags & 0x2;
      this.createFog = flags & 0x4;
    }
  };
}

export default loader;
