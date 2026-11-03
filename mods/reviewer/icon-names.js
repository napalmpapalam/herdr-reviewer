// Material Icon Theme's name rules, shared by icons.js and tools/build-icons.mjs so the table's keys and the lookup agree.
// A folder name without its ".", "_", "-" or "__x__" decoration.
export const bare = name => name.replace(/^__(.+)__$/, "$1").replace(/^[._-]/, "");
// The open variant of a folder icon.
export const opened = id => id.endsWith("_light") ? `${id.slice(0, -6)}-open_light` : `${id}-open`;
