import fs from "node:fs";
import path from "node:path";

const RAW_PATH = path.resolve("tokens/tokens.raw.json");
const OUT_PATH = path.resolve("src/styles/tokens.css");

// ---- read
const raw = JSON.parse(fs.readFileSync(RAW_PATH, "utf8"));

// ---- normalize helper
function flatten(obj, prefix = []) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const next = [...prefix, k];
    if (v && typeof v === "object" && !Array.isArray(v)) {
      // Figma export formats vary: {value: ...} or nested objects
      if ("value" in v && Object.keys(v).length <= 3) {
        out[next.join("/")] = v.value;
      } else {
        Object.assign(out, flatten(v, next));
      }
    } else {
      out[next.join("/")] = v;
    }
  }
  return out;
}

const flat = flatten(raw);

// ---- build css vars
const lines = [];
lines.push(":root{");

for (const [key, value] of Object.entries(flat)) {
  // key like "color/default" -> --color-default
  const cssName = "--" + key.replaceAll("/", "-").replaceAll(" ", "-");

  // value can be color object formats; handle common ones
  let cssValue = value;

  // If plugin outputs {r,g,b,a} etc, convert if needed
  if (value && typeof value === "object") {
    // common: {r:0..1,g:0..1,b:0..1,a:0..1}
    if ("r" in value && "g" in value && "b" in value) {
      const r = Math.round(value.r * 255);
      const g = Math.round(value.g * 255);
      const b = Math.round(value.b * 255);
      const a = "a" in value ? value.a : 1;
      cssValue = a === 1 ? `rgb(${r} ${g} ${b})` : `rgb(${r} ${g} ${b} / ${a})`;
    } else if ("hex" in value) {
      cssValue = value.hex;
    }
  }

  // add px for number tokens except colors
  const isNumber = typeof cssValue === "number";
  if (isNumber) {
    // heuristic: if key includes radius/space/font -> px
    if (key.startsWith("radius/") || key.startsWith("space/") || key.startsWith("font/")) {
      cssValue = `${cssValue}px`;
    }
  }

  lines.push(`  ${cssName}: ${cssValue};`);
}

lines.push("}");

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, lines.join("\n"));
console.log(`✅ generated: ${OUT_PATH}`);
