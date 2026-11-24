//// Convert each shape into a list of points called a RenderPath.

import gleam/list
import shape.{type Path, type Point, Line}

/// One path as canvas.mjs setDrawing consumes it (field by field): the
/// polyline, stroke colour/width, and the start and end times (in tenths of a second)
/// between which the reveal runs — so the renderer's clock needs no shape
/// knowledge.
pub type RenderPath {
  RenderPath(
    points: List(Point),
    thickness: Float,
    color: String,
    start: Float,
    end: Float,
  )
}

// ── The canvas (canvas.mjs) ───────────────────────────────────────────────────

/// Replace the drawing being animated in the page's
/// `<canvas id="animation-canvas">` element. If that element doesn't appear within
/// about 10 seconds, this logs an error to the browser console. This keeps the
/// current time, so a drawing that replaces a finished one appears complete. To
/// animate it from the start, also call reset_clock.
@external(javascript, "./canvas.mjs", "setDrawing")
pub fn set_drawing(paths: List(RenderPath)) -> Nil

/// Set the animation's speed, as a multiple of its normal speed: 1.0 is normal and
/// is where it starts, 0.0 pauses, and a negative rate plays it backward.
/// Time stops at the start of the drawing and when its last path finishes, so
/// playing a finished drawing again takes a call to reset_clock.
@external(javascript, "./canvas.mjs", "setSpeed")
pub fn set_speed(rate: Float) -> Nil

/// Jump the animation back to its start, where the canvas is empty.
@external(javascript, "./canvas.mjs", "resetClock")
pub fn reset_clock() -> Nil

pub fn render_path(path: Path, color: String) -> RenderPath {
  case path.shape {
    Line(a, b) ->
      RenderPath([a, b], path.thickness, color, path.start, path.end)
  }
}

fn mirror_point(point: Point) -> Point {
  shape.Point(0.0 -. point.x, point.y)
}

pub fn mirror_path(path: RenderPath) -> RenderPath {
  let mirrored_points = list.map(path.points, mirror_point)
  RenderPath(..path, points: mirrored_points)
}
pub fn rotate_path(path: RenderPath) -> RenderPath {
  let rotated_points = list.map(path.points, fn(point) {
    shape.Point(0.0 -. point.y, point.x)
  })
  RenderPath(..path, points: rotated_points)
}