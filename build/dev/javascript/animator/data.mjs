//# sourceMappingURL=data.mjs.map
import * as $json from "../gleam_json/gleam/json.mjs";
import * as $decode from "../gleam_stdlib/gleam/dynamic/decode.mjs";
import * as $list from "../gleam_stdlib/gleam/list.mjs";
import * as $result from "../gleam_stdlib/gleam/result.mjs";
import {
  storageGet as storage_get,
  storageSet as storage_set,
  promptDrawingName as prompt_drawing_name,
} from "./data_ffi.mjs";
import * as $examples from "./examples.mjs";
import {
  Ok,
  Empty as $Empty,
  List$Empty$const as $List$Empty$const,
  prepend as listPrepend,
  CustomType as $CustomType,
} from "./gleam.mjs";

export { prompt_drawing_name, storage_get, storage_set };

export class Library extends $CustomType {
  constructor(current, drawings) {
    super();
    this.current = current;
    this.drawings = drawings;
  }
}
export const Library$Library = (current, drawings) =>
  new Library(current, drawings);
export const Library$isLibrary = (value) => value instanceof Library;
export const Library$Library$current = (value) => value.current;
export const Library$Library$0 = (value) => value.current;
export const Library$Library$drawings = (value) => value.drawings;
export const Library$Library$1 = (value) => value.drawings;

const storage_key = "animator.library";

function drawing_decoder() {
  return $decode.field(
    "name",
    $decode.string,
    (name) => {
      return $decode.field(
        "source",
        $decode.string,
        (source) => { return $decode.success([name, source]); },
      );
    },
  );
}

function library_decoder() {
  return $decode.field(
    "current",
    $decode.string,
    (current) => {
      return $decode.field(
        "drawings",
        $decode.list(drawing_decoder()),
        (drawings) => { return $decode.success(new Library(current, drawings)); },
      );
    },
  );
}

export function load() {
  let saved = $result.try$(
    storage_get(storage_key),
    (stored) => {
      let _pipe = $json.parse(stored, library_decoder());
      return $result.replace_error(_pipe, undefined);
    },
  );
  if (saved instanceof Ok) {
    let $ = saved[0].drawings;
    if ($ instanceof $Empty) {
      return new Library("fan", $examples.all);
    } else {
      let current = saved[0].current;
      let drawings = $;
      let first = $.head[0];
      let $1 = $list.key_find(drawings, current);
      if ($1 instanceof Ok) {
        return new Library(current, drawings);
      } else {
        return new Library(first, drawings);
      }
    }
  } else {
    return new Library("fan", $examples.all);
  }
}

export function save(library) {
  let drawings = $json.array(
    library.drawings,
    (drawing) => {
      let name = drawing[0];
      let source$1 = drawing[1];
      return $json.object(
        listPrepend(
          ["name", $json.string(name)],
          listPrepend(["source", $json.string(source$1)], $List$Empty$const),
        ),
      );
    },
  );
  let encoded = $json.object(
    listPrepend(
      ["current", $json.string(library.current)],
      listPrepend(["drawings", drawings], $List$Empty$const),
    ),
  );
  return storage_set(storage_key, $json.to_string(encoded));
}

export function source(library) {
  let _pipe = $list.key_find(library.drawings, library.current);
  return $result.unwrap(_pipe, "");
}

export function set_source(library, source) {
  let drawings = $list.map(
    library.drawings,
    (drawing) => {
      let name = drawing[0];
      let $ = name === library.current;
      if ($) {
        return [name, source];
      } else {
        return drawing;
      }
    },
  );
  return new Library(library.current, drawings);
}

export function open(library, name, initial_source) {
  let _block;
  let $ = $list.key_find(library.drawings, name);
  if ($ instanceof Ok) {
    _block = library.drawings;
  } else {
    _block = $list.append(
      library.drawings,
      listPrepend([name, initial_source], $List$Empty$const),
    );
  }
  let drawings = _block;
  return new Library(name, drawings);
}
