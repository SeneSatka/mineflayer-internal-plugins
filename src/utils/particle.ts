import { Vec3 } from "vec3";
import { Particle as ParticleTYpe } from "./types";
export default loader;

function loader(registry) {
  class Particle implements ParticleTYpe {
    constructor(
      id,
      position,
      offset,
      count = 1,
      movementSpeed = 0,
      longDistanceRender = false
    ) {
      Object.assign(this, registry.particles[id]);
      this.id = id;
      this.position = position;
      this.offset = offset;
      this.count = count;
      this.movementSpeed = movementSpeed;
      this.longDistanceRender = longDistanceRender;
    }
    id: number;
    position: Vec3;
    offset: Vec3;
    count: number;
    movementSpeed: number;
    longDistanceRender: boolean;
    static fromNetwork(packet) {
      return new Particle(
        packet.particleId,
        new Vec3(packet.x, packet.y, packet.z),
        new Vec3(packet.offsetX, packet.offsetY, packet.offsetZ),
        packet.particles,
        packet.particleData,
        packet.longDistance
      );
    }
  }

  return Particle;
}
