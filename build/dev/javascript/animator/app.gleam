//// Animator -- an application for program-generated drawings.

import builtins
import data.{type Library}
import drawing
import editor
import errors
import gleam/float
import gleam/int
import gleam/list
import gleam/result
import gleam/string
import lustre
import lustre/attribute as attr
import lustre/effect.{type Effect}
import lustre/element.{type Element}
import lustre/element/html
import lustre/element/keyed
import lustre/event
import parser
import render
import shape.{type Path}

/// Your app's public address, once you've deployed it in Problem 13, such as
/// "https://your-username.github.io/animator/".
pub const public_url = ""

/// Set to True if you would like your app's URL included in the course gallery.
pub const include_app_in_gallery = False

/// A link to your video from Problem 14, which anyone with the link can watch.
pub const video_url = ""

/// Set to True if you would like your video included in the course gallery.
pub const include_video_in_gallery = False

const new_drawing = "fn draw(shape_slider: Int) -> List(Path) {\n  []\n}\n"

pub type Model {
  Model(
    library: Library,
    shape_slider: Int,
    speed: Float,
    code_open: Bool,
    output: String,
    menu_revision: Int,
    pattern: String,
  )
}

pub type Msg {
  SetCode(String)
  SetShape(String)
  SetSpeed(String)
  SetPattern(String)
  SelectDrawing(String)
  ToggleCode
}

pub fn init(_flags: Nil) -> #(Model, Effect(Msg)) {
  let model = Model(data.load(), 10, 1.0, True, "", 0, "original")
  open_drawing(model)
}

// Parse and evaluate a draw function at the given shape-slider value, returning
// the rendered paths on success, or a human-readable message on failure.
fn run_source(shape_slider: Int, source: String) -> Result(List(Path), String) {
  case parser.parse_program(source, builtins.global_frame()) {
    Error(msg) -> Error(msg)
    Ok(program) ->
      drawing.try_draw(shape_slider, program)
      // Convert Error(EvalError) to Error(String) with a useful error message.
      |> result.map_error(errors.error_message)
  }
}

// ── Update ─────────────────────────────────────────────────────────────────────

pub fn update(model: Model, msg: Msg) -> #(Model, Effect(Msg)) {
  case msg {
    ToggleCode -> #(Model(..model, code_open: !model.code_open), effect.none())

    SetCode(text) -> {
      let library = data.set_source(model.library, text)
      data.save(library)
      draw(Model(..model, library: library), text, True)
    }

    SetShape(text) ->
      case int.parse(text) {
        Ok(value) if value != model.shape_slider ->
          draw(
            Model(..model, shape_slider: value),
            data.source(model.library),
            False,
          )
        _ -> #(model, effect.none())
      }

    SetSpeed(text) ->
      case
        float.parse(text)
        |> result.or(int.parse(text) |> result.map(int.to_float))
      {
        Ok(rate) if rate != model.speed -> #(
          Model(..model, speed: rate),
          effect.from(fn(_) { render.set_speed(rate) }),
        )
        _ -> #(model, effect.none())
      }
    SetPattern(pattern) ->
      draw(Model(..model, pattern: pattern), data.source(model.library), False)
    SelectDrawing("") -> {
      let name = data.prompt_drawing_name() |> string.trim
      case name {
        "" -> #(
          Model(..model, menu_revision: model.menu_revision + 1),
          effect.none(),
        )
        _ -> {
          let library = data.open(model.library, name, new_drawing)
          data.save(library)
          open_drawing(Model(..model, library: library))
        }
      }
    }

    SelectDrawing(name) ->
      case list.key_find(model.library.drawings, name) {
        Ok(_) -> {
          let library = data.Library(..model.library, current: name)
          data.save(library)
          open_drawing(Model(..model, library: library))
        }
        Error(_) -> #(model, effect.none())
      }
  }
}

fn open_drawing(model: Model) -> #(Model, Effect(Msg)) {
  let source = data.source(model.library)
  let #(updated, animation) = draw(model, source, True)
  #(updated, effect.batch([editor.mount(source, SetCode), animation]))
}

fn draw(model: Model, source: String, restart: Bool) -> #(Model, Effect(Msg)) {
  let #(paths, output) = case run_source(model.shape_slider, source) {
    Ok(paths) -> {
      let original = list.map(paths, render.render_path(_, "#d4c5a0"))
      let displayed = case model.pattern {
        "mirror" ->
          list.append(original, list.map(original, render.mirror_path))
        "pinwheel" -> {
          let rotated_90 = list.map(original, render.rotate_path)
          let rotated_180 = list.map(rotated_90, render.rotate_path)
          let rotated_270 = list.map(rotated_180, render.rotate_path)
          list.flatten([original, rotated_90, rotated_180, rotated_270])
        }
        _ -> original
      }
      #(displayed, "")
    }
    Error(message) -> #([], message)
  }

  #(
    Model(..model, output: output),
    effect.from(fn(_) {
      render.set_drawing(paths)
      case restart {
        True -> render.reset_clock()
        False -> Nil
      }
    }),
  )
}

// ── View ──────────────────────────────────────────────────────────────────
//
// Two side-by-side panes: the code editor on the left and its rendered output on
// the right. The code column can be hidden to expand the right pane.

pub fn view(model: Model) -> Element(Msg) {
  let app_class = case model.code_open {
    True -> "app"
    False -> "app code-hidden"
  }
  // The code column still exists even when hidden (CSS collapses it) so the
  // mounted CodeMirror editor keeps its state across show/hide.
  html.div([attr.class(app_class)], [
    html.div([attr.class("code-col")], [
      editor.view_panel(ToggleCode),
    ]),
    view_anim(model),
  ])
}

fn view_anim(model: Model) -> Element(Msg) {
  html.div([attr.class("animation-panel")], [
    view_controls(model),
    html.div([attr.class("canvas-area")], [
      view_reveal_code(model),
      html.canvas([attr.id("animation-canvas"), attr.class("canvas")]),
      case model.output {
        "" -> element.none()
        message ->
          html.pre([attr.class("drawing-error"), attr.role("alert")], [
            html.text(message),
          ])
      },
    ]),
  ])
}

fn view_controls(model: Model) -> Element(Msg) {
  let options =
    list.map(model.library.drawings, fn(drawing) {
      let #(name, _) = drawing
      html.option(
        [attr.value(name), attr.selected(name == model.library.current)],
        name,
      )
    })

  let menu =
    html.select(
      [
        attr.attribute("data-test-id", "drawing-select"),
        attr.value(model.library.current),
        event.on_change(SelectDrawing),
      ],
      list.append(options, [
        html.option([attr.value("")], "New drawing…"),
      ]),
    )

  html.div([attr.class("animation-controls")], [
    keyed.element("label", [], [
      #("label", html.text("Drawing")),
      #(int.to_string(model.menu_revision), menu),
    ]),
    html.label([], [
      html.text("Shape"),
      html.input([
        attr.type_("range"),
        attr.attribute("data-test-id", "shape-slider"),
        attr.min("0"),
        attr.max("100"),
        attr.step("1"),
        attr.value(int.to_string(model.shape_slider)),
        event.on_input(SetShape),
        event.on_change(SetShape),
      ]),
    ]),
    html.label([], [
      html.text("Pattern"),
      html.select(
        [
          attr.value(model.pattern),
          event.on_change(SetPattern),
        ],
        [
          html.option(
            [attr.value("original"), attr.selected(model.pattern == "original")],
            "Original",
          ),
          html.option(
            [attr.value("mirror"), attr.selected(model.pattern == "mirror")],
            "Mirror",
          ),
          html.option(
            [attr.value("pinwheel"), attr.selected(model.pattern == "pinwheel")],
            "Pinwheel",
          ),
        ],
      ),
    ]),
    html.label([], [
      html.text("Speed"),
      html.input([
        attr.type_("range"),
        attr.attribute("data-test-id", "speed-slider"),
        attr.min("-3"),
        attr.max("3"),
        attr.step("0.1"),
        attr.value(float.to_string(model.speed)),
        event.on_input(SetSpeed),
        event.on_change(SetSpeed),
      ]),
    ]),
  ])
}

// The button that brings the code column back, overlaid on the top-left of the
// right pane. Nothing is rendered while the column is already showing (its own
// header holds the button that hides it).
fn view_reveal_code(model: Model) -> Element(Msg) {
  case model.code_open {
    True -> element.none()
    False ->
      html.button(
        [
          attr.class("icon-btn reveal-code"),
          attr.attribute("title", "Show code"),
          event.on_click(ToggleCode),
        ],
        [html.text("⟩")],
      )
  }
}

// ── Main ───────────────────────────────────────────────────────────────────────

pub fn main() -> Nil {
  let app = lustre.application(init, update, view)
  let assert Ok(_) = lustre.start(app, "#app", Nil)
  Nil
}
