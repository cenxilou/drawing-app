//// The library of saved drawings. A drawing is a name and the source of its draw
//// function.
import examples
import gleam/dynamic/decode
import gleam/json
import gleam/list
import gleam/result

const storage_key = "animator.library"

pub type Library {
  Library(current: String, drawings: List(#(String, String)))
}

pub fn load() -> Library {
  let saved = {
    use stored <- result.try(storage_get(storage_key))
    json.parse(stored, library_decoder()) |> result.replace_error(Nil)
  }

  case saved {
    Ok(Library(current, [#(first, _), ..] as drawings)) ->
      case list.key_find(drawings, current) {
        Ok(_) -> Library(current, drawings)
        Error(_) -> Library(first, drawings)
      }
    _ -> Library("fan", examples.all)
  }
}

pub fn save(library: Library) -> Nil {
  let drawings =
    json.array(library.drawings, fn(drawing) {
      let #(name, source) = drawing
      json.object([
        #("name", json.string(name)),
        #("source", json.string(source)),
      ])
    })

  let encoded =
    json.object([
      #("current", json.string(library.current)),
      #("drawings", drawings),
    ])

  storage_set(storage_key, json.to_string(encoded))
}

pub fn source(library: Library) -> String {
  list.key_find(library.drawings, library.current) |> result.unwrap("")
}

pub fn set_source(library: Library, source: String) -> Library {
  let drawings =
    list.map(library.drawings, fn(drawing) {
      let #(name, _) = drawing
      case name == library.current {
        True -> #(name, source)
        False -> drawing
      }
    })

  Library(..library, drawings: drawings)
}

pub fn open(library: Library, name: String, initial_source: String) -> Library {
  let drawings = case list.key_find(library.drawings, name) {
    Ok(_) -> library.drawings
    Error(_) -> list.append(library.drawings, [#(name, initial_source)])
  }

  Library(name, drawings)
}

fn library_decoder() -> decode.Decoder(Library) {
  use current <- decode.field("current", decode.string)
  use drawings <- decode.field("drawings", decode.list(drawing_decoder()))
  decode.success(Library(current, drawings))
}

fn drawing_decoder() -> decode.Decoder(#(String, String)) {
  use name <- decode.field("name", decode.string)
  use source <- decode.field("source", decode.string)
  decode.success(#(name, source))
}
// ── localStorage (data_ffi.mjs) ───────────────────────────────────────────────

/// The string stored in localStorage under key, or an Error if there isn't one.
@external(javascript, "./data_ffi.mjs", "storageGet")
pub fn storage_get(key: String) -> Result(String, Nil)

/// Store value in localStorage under key, replacing anything already there. If that
/// isn't possible, this logs the reason to the browser console.
@external(javascript, "./data_ffi.mjs", "storageSet")
pub fn storage_set(key: String, value: String) -> Nil

// ── The new-drawing prompt (data_ffi.mjs) ─────────────────────────────────────

/// Prompt the user to name a new drawing; "" (empty string) means they
/// cancelled or left it blank.
@external(javascript, "./data_ffi.mjs", "promptDrawingName")
pub fn prompt_drawing_name() -> String
