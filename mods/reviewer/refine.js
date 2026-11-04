// Finer token classes on top of highlight.js, after Zed's highlight queries:
// control keywords (branch, loop, jump) apart from the ones that declare,
// names, brackets, ALL_CAPS constants, and this/self. A palette without a
// color for a class draws it in the row's text color.

const words = (s) => new Set(s.split(" "));
const C_LIKE = "if else for while do switch case default break continue return try catch finally throw goto";

// Zed's lists (its highlights.scm files) for js, rust, go, c and sh; Zed has
// none for java, ruby, php and swift, so theirs are a close guess. Zed colors
// no Python keyword as control, and sql/css/html/yaml/json keep one color.
const CONTROL = {
  js: words(`${C_LIKE} await yield`),
  rust: words("if else for while loop match in break continue return await yield"),
  go: words("if else for switch select case default break continue return goto fallthrough go defer range"),
  c: words(`${C_LIKE} co_await co_return co_yield`),
  java: words(`${C_LIKE} yield when`),
  ruby: words(`${C_LIKE} elsif unless until then when next redo retry yield begin rescue ensure raise end`),
  php: words(`${C_LIKE} foreach elseif match yield`),
  sh: words("if then else elif fi for while until do done case esac in select"),
  swift: words(`${C_LIKE} guard repeat fallthrough defer await`),
};
// Python's word operators, which Zed draws in the text color.
const PY_OPERATORS = words("and or not in is");
// The languages whose other words are names; in sh a plain word is an argument.
const NAMED = words("js rust python go c java ruby php swift");
const SELF = words("this self Self super cls");
const CAPS_BOOLEANS = words("NULL TRUE FALSE");
const NAME_OR_BRACKET = /([A-Za-z_$][\w$]*)|[()[\]{}]/g;
// Each span is an element, and the row renderer runs twice a frame (RECIPE,
// Watch out): a row splits at most this many names and brackets out.
const MAX_PARTS = 40;

/** The spans of one tokenized line, with the finer classes. */
export function refine(spans, lang) {
  if (!lang) return spans;
  const line = spans.map((s) => s.text).join(""), out = [];
  let at = 0, parts = 0;
  for (const s of spans) {
    if (s.cls) out.push({ text: s.text, cls: classOf(s, lang, line, at) });
    else if (parts < MAX_PARTS) parts += split(s.text, lang, out, MAX_PARTS - parts);
    else out.push(s);
    at += s.text.length;
  }
  return out;
}

// Cuts a plain span into names, brackets and the text between them, at most
// `room` parts; returns how many it cut out.
function split(text, lang, out, room) {
  let i = 0, n = 0;
  for (const m of text.matchAll(NAME_OR_BRACKET)) {
    if (n === room) break;
    if (m[1] && !NAMED.has(lang)) continue;
    if (m.index > i) out.push({ text: text.slice(i, m.index), cls: "" });
    out.push({ text: m[0], cls: m[1] ? "name" : "bracket" });
    i = m.index + m[0].length; n++;
  }
  if (i < text.length) out.push({ text: text.slice(i), cls: "" });
  return n;
}

// A span holds one word: spaces split them. `at` is where it starts in `line`.
function classOf({ text, cls }, lang, line, at) {
  if (cls === "keyword") return keywordClass(text, lang, line, at);
  if (cls === "variable" && SELF.has(text)) return "self";
  if (cls === "boolean" && /^[A-Z][A-Z0-9_]+$/.test(text) && !CAPS_BOOLEANS.has(text)) return "constant";
  return cls;
}

// A `default` outside a switch and Rust's `for` in an `impl` header declare, as in Zed.
function keywordClass(text, lang, line, at) {
  if (lang === "python" && PY_OPERATORS.has(text)) return "";
  if (!CONTROL[lang]?.has(text)) return "keyword";
  const declares = (text === "default" && !/^\s*(:|->)/.test(line.slice(at + text.length)))
    || (lang === "rust" && text === "for" && /\bimpl\b[^{]*$/.test(line.slice(0, at)));
  return declares ? "keyword" : "control";
}
