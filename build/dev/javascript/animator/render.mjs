//# sourceMappingURL=render.mjs.map
import * as $list from "../gleam_stdlib/gleam/list.mjs";
import {
  setDrawing as set_drawing,
  setSpeed as set_speed,
  resetClock as reset_clock,
} from "./canvas.mjs";
import {
  List$Empty$const as $List$Empty$const,
  prepend as listPrepend,
  CustomType as $CustomType,
} from "./gleam.mjs";
import * as $shape from "./shape.mjs";
import { Line } from "./shape.mjs";

export { reset_clock, set_drawing, set_speed };

export class RenderPath extends $CustomType {
  constructor(points, thickness, color, start, end) {
    super();
    this.points = points;
    this.thickness = thickness;
    this.color = color;
    this.start = start;
    this.end = end;
  }
}
export const RenderPath$RenderPath = (points, thickness, color, start, end) =>
  new RenderPath(points, thickness, color, start, end);
export const RenderPath$isRenderPath = (value) => value instanceof RenderPath;
export const RenderPath$RenderPath$points = (value) => value.points;
export const RenderPath$RenderPath$0 = (value) => value.points;
export const RenderPath$RenderPath$thickness = (value) => value.thickness;
export const RenderPath$RenderPath$1 = (value) => value.thickness;
export const RenderPath$RenderPath$color = (value) => value.color;
export const RenderPath$RenderPath$2 = (value) => value.color;
export const RenderPath$RenderPath$start = (value) => value.start;
export const RenderPath$RenderPath$3 = (value) => value.start;
export const RenderPath$RenderPath$end = (value) => value.end;
export const RenderPath$RenderPath$4 = (value) => value.end;

export function render_path(path, color) {
  let $ = path.shape;
  let a = $.start;
  let b = $.end;
  return new RenderPath(
    listPrepend(a, listPrepend(b, $List$Empty$const)),
    path.thickness,
    color,
    path.start,
    path.end,
  );
}

function mirror_point(point) {
  return new $shape.Point(0.0 - point.x, point.y);
}

export function mirror_path(path) {
  let mirrored_points = $list.map(path.points, mirror_point);
  return new RenderPath(
    mirrored_points,
    path.thickness,
    path.color,
    path.start,
    path.end,
  );
}

export function rotate_path(path) {
  let rotated_points = $list.map(
    path.points,
    (point) => { return new $shape.Point(0.0 - point.y, point.x); },
  );
  return new RenderPath(
    rotated_points,
    path.thickness,
    path.color,
    path.start,
    path.end,
  );
}
