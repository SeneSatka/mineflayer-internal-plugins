import { Vec3 } from "vec3";
import { Location as LocationType } from "./types";
const CHUNK_SIZE = new Vec3(16, 16, 16);

class Location implements LocationType {
  constructor(absoluteVector) {
    this.floored = absoluteVector.floored();
    this.blockPoint = this.floored.modulus(CHUNK_SIZE);
    this.chunkCorner = this.floored.minus(this.blockPoint);
    this.blockIndex =
      this.blockPoint.x +
      CHUNK_SIZE.x * this.blockPoint.z +
      CHUNK_SIZE.x * CHUNK_SIZE.z * this.blockPoint.y;
    this.biomeBlockIndex = this.blockPoint.x + CHUNK_SIZE.x * this.blockPoint.z;
    this.chunkYIndex = Math.floor(absoluteVector.y / 16);
  }
  floored: Vec3;
  blockPoint: Vec3;
  chunkCorner: Vec3;
  blockIndex: number;
  biomeBlockIndex: number;
  chunkYIndex: number;
}
export default Location;
