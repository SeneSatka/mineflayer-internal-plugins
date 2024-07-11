import { Vec3 } from "vec3";
import { Painting as PaintingType } from "./types";
class Painting implements PaintingType {
  id: number;
  position: Vec3;
  name: string;
  direction: Vec3;
  constructor(id: number, position: Vec3, name: string, direction: Vec3) {
    this.id = id;
    this.position = position;
    this.name = name;
    this.direction = direction;
  }
}
export default Painting;
