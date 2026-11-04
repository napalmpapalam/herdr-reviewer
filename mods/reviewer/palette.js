// Token colors for the diff rows and the preview. "dark-plus" is VS Code's
// Dark+ and the default. "one-dark-pro" is One Dark Pro's token colors (its
// Night Flat variant differs only in editor backgrounds, which a mod can't
// set). "theme" follows the Herdr theme. Keys are the editor's token classes
// plus refine.js's: control, self, name, bracket; `text` is the row's color.
export const ONE_DARK_PRO = { keyword: "#c678dd", control: "#c678dd", self: "#e06c75", string: "#98c379", "string.escape": "#56b6c2", comment: "#7f848e", function: "#61afef", type: "#e5c07b", number: "#d19a66", constant: "#d19a66", variable: "#e06c75", operator: "#56b6c2", punctuation: "#abb2bf", boolean: "#d19a66", added: "#98c379", removed: "#e06c75" };
export const DARK_PLUS = { text: "#d4d4d4", keyword: "#569cd6", control: "#c586c0", self: "#569cd6", name: "#9cdcfe", bracket: "#ffd700", string: "#ce9178", "string.escape": "#d7ba7d", comment: "#6a9955", function: "#dcdcaa", type: "#4ec9b0", number: "#b5cea8", constant: "#4fc1ff", variable: "#9cdcfe", operator: "#d4d4d4", punctuation: "#d4d4d4", boolean: "#569cd6", added: "#3fb950", removed: "#f85149" };

/** The color map for a palette name, given the theme (`t`) for "theme". */
export function palette(name, t) {
  if (name === "theme") return { keyword: t.ansi5, control: t.ansi5, self: t.ansi6, string: t.ansi2, "string.escape": t.ansi3, comment: t.dim, function: t.ansi4, type: t.ansi3, number: t.ansi1, constant: t.ansi6, variable: t.ansi6, operator: t.ansi5, punctuation: t.muted, boolean: t.ansi1, added: t.ansi2, removed: t.ansi1 };
  if (name === "one-dark-pro") return ONE_DARK_PRO;
  return DARK_PLUS;
}
