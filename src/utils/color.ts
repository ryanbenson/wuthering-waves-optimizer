// DaisyUI stores theme colors as raw OKLCH component triples (e.g.
// "65.69% 0.196 275.75") consumed via `oklch(var(--p) / <alpha>)`, not as
// hex or a full `oklch()` string. To let a user-picked <input type="color">
// hex value override DaisyUI's `--p`/`--pc` variables (see
// CalculatorBuildCard.vue), it has to be converted into that same format.
// Conversion follows the standard sRGB -> linear -> LMS -> OKLab -> OKLCH
// pipeline (Björn Ottosson's OKLab, as used by the CSS Color 4 spec).

function srgbChannelToLinear(value: number): number {
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function hexToRgb(hex: string): [number, number, number] {
  const normalized = hex.replace("#", "");
  const r = parseInt(normalized.slice(0, 2), 16) / 255;
  const g = parseInt(normalized.slice(2, 4), 16) / 255;
  const b = parseInt(normalized.slice(4, 6), 16) / 255;
  return [r, g, b];
}

export function hexToOklch(hex: string): { l: number; c: number; h: number } {
  const [r, g, b] = hexToRgb(hex).map(srgbChannelToLinear);

  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
  const bLab = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;

  const c = Math.sqrt(a * a + bLab * bLab);
  let h = (Math.atan2(bLab, a) * 180) / Math.PI;
  if (h < 0) h += 360;

  return { l: L, c, h };
}

// DaisyUI's `--p`/`--pc` variables hold space-separated OKLCH components
// (lightness as a percentage, no `oklch()` wrapper) so they can be composed
// as `oklch(var(--p) / <alpha>)`.
export function hexToOklchTriple(hex: string): string {
  const { l, c, h } = hexToOklch(hex);
  return `${(l * 100).toFixed(2)}% ${c.toFixed(4)} ${h.toFixed(2)}`;
}

// A readable "content" color to pair with a custom primary (e.g. DaisyUI's
// `--pc`, used for text/icons on top of `badge-primary` etc.): plain
// near-black or near-white chosen from the primary's own lightness, since a
// user-picked color can't rely on a pre-authored theme's contrast pairing.
export function contrastOklchTriple(hex: string): string {
  const { l } = hexToOklch(hex);
  return l > 0.6 ? "15% 0 0" : "96% 0 0";
}
