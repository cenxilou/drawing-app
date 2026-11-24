//# sourceMappingURL=app.mjs.map
import * as $float from "../gleam_stdlib/gleam/float.mjs";
import * as $int from "../gleam_stdlib/gleam/int.mjs";
import * as $list from "../gleam_stdlib/gleam/list.mjs";
import * as $result from "../gleam_stdlib/gleam/result.mjs";
import * as $string from "../gleam_stdlib/gleam/string.mjs";
import * as $lustre from "../lustre/lustre.mjs";
import * as $attr from "../lustre/lustre/attribute.mjs";
import * as $effect from "../lustre/lustre/effect.mjs";
import * as $element from "../lustre/lustre/element.mjs";
import * as $html from "../lustre/lustre/element/html.mjs";
import * as $keyed from "../lustre/lustre/element/keyed.mjs";
import * as $event from "../lustre/lustre/event.mjs";
import * as $builtins from "./builtins.mjs";
import * as $data from "./data.mjs";
import * as $drawing from "./drawing.mjs";
import * as $editor from "./editor.mjs";
import * as $errors from "./errors.mjs";
import {
  Ok,
  List$Empty$const as $List$Empty$const,
  prepend as listPrepend,
  CustomType as $CustomType,
  makeError,
} from "./gleam.mjs";
import * as $parser from "./parser.mjs";
import * as $render from "./render.mjs";
import * as $shape from "./shape.mjs";

const FILEPATH = "src/app.gleam";

export class Model extends $CustomType {
  constructor(library, shape_slider, speed, code_open, output, menu_revision, pattern) {
    super();
    this.library = library;
    this.shape_slider = shape_slider;
    this.speed = speed;
    this.code_open = code_open;
    this.output = output;
    this.menu_revision = menu_revision;
    this.pattern = pattern;
  }
}
export const Model$Model = (library, shape_slider, speed, code_open, output, menu_revision, pattern) =>
  new Model(library,
  shape_slider,
  speed,
  code_open,
  output,
  menu_revision,
  pattern);
export const Model$isModel = (value) => value instanceof Model;
export const Model$Model$library = (value) => value.library;
export const Model$Model$0 = (value) => value.library;
export const Model$Model$shape_slider = (value) => value.shape_slider;
export const Model$Model$1 = (value) => value.shape_slider;
export const Model$Model$speed = (value) => value.speed;
export const Model$Model$2 = (value) => value.speed;
export const Model$Model$code_open = (value) => value.code_open;
export const Model$Model$3 = (value) => value.code_open;
export const Model$Model$output = (value) => value.output;
export const Model$Model$4 = (value) => value.output;
export const Model$Model$menu_revision = (value) => value.menu_revision;
export const Model$Model$5 = (value) => value.menu_revision;
export const Model$Model$pattern = (value) => value.pattern;
export const Model$Model$6 = (value) => value.pattern;

export class SetCode extends $CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
}
export const Msg$SetCode = ($0) => new SetCode($0);
export const Msg$isSetCode = (value) => value instanceof SetCode;
export const Msg$SetCode$0 = (value) => value[0];

export class SetShape extends $CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
}
export const Msg$SetShape = ($0) => new SetShape($0);
export const Msg$isSetShape = (value) => value instanceof SetShape;
export const Msg$SetShape$0 = (value) => value[0];

export class SetSpeed extends $CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
}
export const Msg$SetSpeed = ($0) => new SetSpeed($0);
export const Msg$isSetSpeed = (value) => value instanceof SetSpeed;
export const Msg$SetSpeed$0 = (value) => value[0];

export class SetPattern extends $CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
}
export const Msg$SetPattern = ($0) => new SetPattern($0);
export const Msg$isSetPattern = (value) => value instanceof SetPattern;
export const Msg$SetPattern$0 = (value) => value[0];

export class SelectDrawing extends $CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
}
export const Msg$SelectDrawing = ($0) => new SelectDrawing($0);
export const Msg$isSelectDrawing = (value) => value instanceof SelectDrawing;
export const Msg$SelectDrawing$0 = (value) => value[0];

export class ToggleCode extends $CustomType {}
export const Msg$ToggleCode$const = new ToggleCode();
export const Msg$ToggleCode = () => Msg$ToggleCode$const;
export const Msg$isToggleCode = (value) => value instanceof ToggleCode;

const new_drawing = "fn draw(shape_slider: Int) -> List(Path) {\n  []\n}\n";

/**
 * Your app's public address, once you've deployed it in Problem 13, such as
 * "https://your-username.github.io/animator/".
 */
export const public_url = "";

/**
 * Set to True if you would like your app's URL included in the course gallery.
 */
export const include_app_in_gallery = false;

/**
 * A link to your video from Problem 14, which anyone with the link can watch.
 */
export const video_url = "";

/**
 * Set to True if you would like your video included in the course gallery.
 */
export const include_video_in_gallery = false;

function run_source(shape_slider, source) {
  let $ = $parser.parse_program(source, $builtins.global_frame());
  if ($ instanceof Ok) {
    let program = $[0];
    let _pipe = $drawing.try_draw(shape_slider, program);
    return $result.map_error(_pipe, $errors.error_message);
  } else {
    return $;
  }
}

function draw(model, source, restart) {
  let _block;
  let $1 = run_source(model.shape_slider, source);
  if ($1 instanceof Ok) {
    let paths = $1[0];
    let original = $list.map(
      paths,
      (_capture) => { return $render.render_path(_capture, "#d4c5a0"); },
    );
    let _block$1;
    let $2 = model.pattern;
    if ($2 === "mirror") {
      _block$1 = $list.append(
        original,
        $list.map(original, $render.mirror_path),
      );
    } else if ($2 === "pinwheel") {
      let rotated_90 = $list.map(original, $render.rotate_path);
      let rotated_180 = $list.map(rotated_90, $render.rotate_path);
      let rotated_270 = $list.map(rotated_180, $render.rotate_path);
      _block$1 = $list.flatten(
        listPrepend(
          original,
          listPrepend(
            rotated_90,
            listPrepend(
              rotated_180,
              listPrepend(rotated_270, $List$Empty$const),
            ),
          ),
        ),
      );
    } else {
      _block$1 = original;
    }
    let displayed = _block$1;
    _block = [displayed, ""];
  } else {
    let message = $1[0];
    _block = [$List$Empty$const, message];
  }
  let $ = _block;
  let paths = $[0];
  let output = $[1];
  return [
    new Model(
      model.library,
      model.shape_slider,
      model.speed,
      model.code_open,
      output,
      model.menu_revision,
      model.pattern,
    ),
    $effect.from(
      (_) => {
        $render.set_drawing(paths);
        if (restart) {
          return $render.reset_clock();
        } else {
          return undefined;
        }
      },
    ),
  ];
}

function open_drawing(model) {
  let source = $data.source(model.library);
  let $ = draw(model, source, true);
  let updated = $[0];
  let animation = $[1];
  return [
    updated,
    $effect.batch(
      listPrepend(
        $editor.mount(source, (var0) => { return new SetCode(var0); }),
        listPrepend(animation, $List$Empty$const),
      ),
    ),
  ];
}

export function init(_) {
  let model = new Model($data.load(), 10, 1.0, true, "", 0, "original");
  return open_drawing(model);
}

export function update(model, msg) {
  if (msg instanceof SetCode) {
    let text = msg[0];
    let library = $data.set_source(model.library, text);
    $data.save(library);
    return draw(
      new Model(
        library,
        model.shape_slider,
        model.speed,
        model.code_open,
        model.output,
        model.menu_revision,
        model.pattern,
      ),
      text,
      true,
    );
  } else if (msg instanceof SetShape) {
    let text = msg[0];
    let $ = $int.parse(text);
    if ($ instanceof Ok) {
      let value = $[0];
      if (value !== model.shape_slider) {
        return draw(
          new Model(
            model.library,
            value,
            model.speed,
            model.code_open,
            model.output,
            model.menu_revision,
            model.pattern,
          ),
          $data.source(model.library),
          false,
        );
      } else {
        return [model, $effect.none()];
      }
    } else {
      return [model, $effect.none()];
    }
  } else if (msg instanceof SetSpeed) {
    let text = msg[0];
    let $ = (() => {
      let _pipe = $float.parse(text);
      return $result.or(
        _pipe,
        (() => {
          let _pipe$1 = $int.parse(text);
          return $result.map(_pipe$1, $int.to_float);
        })(),
      );
    })();
    if ($ instanceof Ok) {
      let rate = $[0];
      if (rate !== model.speed) {
        return [
          new Model(
            model.library,
            model.shape_slider,
            rate,
            model.code_open,
            model.output,
            model.menu_revision,
            model.pattern,
          ),
          $effect.from((_) => { return $render.set_speed(rate); }),
        ];
      } else {
        return [model, $effect.none()];
      }
    } else {
      return [model, $effect.none()];
    }
  } else if (msg instanceof SetPattern) {
    let pattern = msg[0];
    return draw(
      new Model(
        model.library,
        model.shape_slider,
        model.speed,
        model.code_open,
        model.output,
        model.menu_revision,
        pattern,
      ),
      $data.source(model.library),
      false,
    );
  } else if (msg instanceof SelectDrawing) {
    let $ = msg[0];
    if ($ === "") {
      let _block;
      let _pipe = $data.prompt_drawing_name();
      _block = $string.trim(_pipe);
      let name = _block;
      if (name === "") {
        return [
          new Model(
            model.library,
            model.shape_slider,
            model.speed,
            model.code_open,
            model.output,
            model.menu_revision + 1,
            model.pattern,
          ),
          $effect.none(),
        ];
      } else {
        let library = $data.open(model.library, name, new_drawing);
        $data.save(library);
        return open_drawing(
          new Model(
            library,
            model.shape_slider,
            model.speed,
            model.code_open,
            model.output,
            model.menu_revision,
            model.pattern,
          ),
        );
      }
    } else {
      let name = $;
      let $1 = $list.key_find(model.library.drawings, name);
      if ($1 instanceof Ok) {
        let _block;
        let _record = model.library;
        _block = new $data.Library(name, _record.drawings);
        let library = _block;
        $data.save(library);
        return open_drawing(
          new Model(
            library,
            model.shape_slider,
            model.speed,
            model.code_open,
            model.output,
            model.menu_revision,
            model.pattern,
          ),
        );
      } else {
        return [model, $effect.none()];
      }
    }
  } else {
    return [
      new Model(
        model.library,
        model.shape_slider,
        model.speed,
        !model.code_open,
        model.output,
        model.menu_revision,
        model.pattern,
      ),
      $effect.none(),
    ];
  }
}

function view_reveal_code(model) {
  let $ = model.code_open;
  if ($) {
    return $element.none();
  } else {
    return $html.button(
      listPrepend(
        $attr.class$("icon-btn reveal-code"),
        listPrepend(
          $attr.attribute("title", "Show code"),
          listPrepend($event.on_click(Msg$ToggleCode$const), $List$Empty$const),
        ),
      ),
      listPrepend($html.text("⟩"), $List$Empty$const),
    );
  }
}

function view_controls(model) {
  let options = $list.map(
    model.library.drawings,
    (drawing) => {
      let name = drawing[0];
      return $html.option(
        listPrepend(
          $attr.value(name),
          listPrepend(
            $attr.selected(name === model.library.current),
            $List$Empty$const,
          ),
        ),
        name,
      );
    },
  );
  let menu = $html.select(
    listPrepend(
      $attr.attribute("data-test-id", "drawing-select"),
      listPrepend(
        $attr.value(model.library.current),
        listPrepend(
          $event.on_change((var0) => { return new SelectDrawing(var0); }),
          $List$Empty$const,
        ),
      ),
    ),
    $list.append(
      options,
      listPrepend(
        $html.option(
          listPrepend($attr.value(""), $List$Empty$const),
          "New drawing…",
        ),
        $List$Empty$const,
      ),
    ),
  );
  return $html.div(
    listPrepend($attr.class$("animation-controls"), $List$Empty$const),
    listPrepend(
      $keyed.element(
        "label",
        $List$Empty$const,
        listPrepend(
          ["label", $html.text("Drawing")],
          listPrepend(
            [$int.to_string(model.menu_revision), menu],
            $List$Empty$const,
          ),
        ),
      ),
      listPrepend(
        $html.label(
          $List$Empty$const,
          listPrepend(
            $html.text("Shape"),
            listPrepend(
              $html.input(
                listPrepend(
                  $attr.type_("range"),
                  listPrepend(
                    $attr.attribute("data-test-id", "shape-slider"),
                    listPrepend(
                      $attr.min("0"),
                      listPrepend(
                        $attr.max("100"),
                        listPrepend(
                          $attr.step("1"),
                          listPrepend(
                            $attr.value($int.to_string(model.shape_slider)),
                            listPrepend(
                              $event.on_input(
                                (var0) => { return new SetShape(var0); },
                              ),
                              listPrepend(
                                $event.on_change(
                                  (var0) => { return new SetShape(var0); },
                                ),
                                $List$Empty$const,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              $List$Empty$const,
            ),
          ),
        ),
        listPrepend(
          $html.label(
            $List$Empty$const,
            listPrepend(
              $html.text("Pattern"),
              listPrepend(
                $html.select(
                  listPrepend(
                    $attr.value(model.pattern),
                    listPrepend(
                      $event.on_change(
                        (var0) => { return new SetPattern(var0); },
                      ),
                      $List$Empty$const,
                    ),
                  ),
                  listPrepend(
                    $html.option(
                      listPrepend(
                        $attr.value("original"),
                        listPrepend(
                          $attr.selected(model.pattern === "original"),
                          $List$Empty$const,
                        ),
                      ),
                      "Original",
                    ),
                    listPrepend(
                      $html.option(
                        listPrepend(
                          $attr.value("mirror"),
                          listPrepend(
                            $attr.selected(model.pattern === "mirror"),
                            $List$Empty$const,
                          ),
                        ),
                        "Mirror",
                      ),
                      listPrepend(
                        $html.option(
                          listPrepend(
                            $attr.value("pinwheel"),
                            listPrepend(
                              $attr.selected(model.pattern === "pinwheel"),
                              $List$Empty$const,
                            ),
                          ),
                          "Pinwheel",
                        ),
                        $List$Empty$const,
                      ),
                    ),
                  ),
                ),
                $List$Empty$const,
              ),
            ),
          ),
          listPrepend(
            $html.label(
              $List$Empty$const,
              listPrepend(
                $html.text("Speed"),
                listPrepend(
                  $html.input(
                    listPrepend(
                      $attr.type_("range"),
                      listPrepend(
                        $attr.attribute("data-test-id", "speed-slider"),
                        listPrepend(
                          $attr.min("-3"),
                          listPrepend(
                            $attr.max("3"),
                            listPrepend(
                              $attr.step("0.1"),
                              listPrepend(
                                $attr.value($float.to_string(model.speed)),
                                listPrepend(
                                  $event.on_input(
                                    (var0) => { return new SetSpeed(var0); },
                                  ),
                                  listPrepend(
                                    $event.on_change(
                                      (var0) => { return new SetSpeed(var0); },
                                    ),
                                    $List$Empty$const,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                  $List$Empty$const,
                ),
              ),
            ),
            $List$Empty$const,
          ),
        ),
      ),
    ),
  );
}

function view_anim(model) {
  return $html.div(
    listPrepend($attr.class$("animation-panel"), $List$Empty$const),
    listPrepend(
      view_controls(model),
      listPrepend(
        $html.div(
          listPrepend($attr.class$("canvas-area"), $List$Empty$const),
          listPrepend(
            view_reveal_code(model),
            listPrepend(
              $html.canvas(
                listPrepend(
                  $attr.id("animation-canvas"),
                  listPrepend($attr.class$("canvas"), $List$Empty$const),
                ),
              ),
              listPrepend(
                (() => {
                  let $ = model.output;
                  if ($ === "") {
                    return $element.none();
                  } else {
                    let message = $;
                    return $html.pre(
                      listPrepend(
                        $attr.class$("drawing-error"),
                        listPrepend($attr.role("alert"), $List$Empty$const),
                      ),
                      listPrepend($html.text(message), $List$Empty$const),
                    );
                  }
                })(),
                $List$Empty$const,
              ),
            ),
          ),
        ),
        $List$Empty$const,
      ),
    ),
  );
}

export function view(model) {
  let _block;
  let $ = model.code_open;
  if ($) {
    _block = "app";
  } else {
    _block = "app code-hidden";
  }
  let app_class = _block;
  return $html.div(
    listPrepend($attr.class$(app_class), $List$Empty$const),
    listPrepend(
      $html.div(
        listPrepend($attr.class$("code-col"), $List$Empty$const),
        listPrepend($editor.view_panel(Msg$ToggleCode$const), $List$Empty$const),
      ),
      listPrepend(view_anim(model), $List$Empty$const),
    ),
  );
}

export function main() {
  let app = $lustre.application(init, update, view);
  let $ = $lustre.start(app, "#app", undefined);
  if (!($ instanceof Ok)) {
    throw makeError(
      "let_assert",
      FILEPATH,
      "app",
      316,
      "main",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $,
        start: 9519,
        end: 9568,
        pattern_start: 9530,
        pattern_end: 9535
      }
    )
  }
  return undefined;
}
