// Shared position/scale/fit model for the build card's two user-supplied
// images (full background, character portrait) — see issue #405. Kept as a
// plain data shape + pure style function (no Vue) so both
// CalculatorBuildCard.vue and CalculatorBuildCardPortraitUpload.vue render
// identically from the same math, and so the "how do these fields turn into
// CSS" logic has one place to be correct/tested.

export type ImageFit = "cover" | "contain" | "repeat" | "none";

export interface ImageTransform {
  fit: ImageFit;
  /** Zoom, as a percent — 100 is untouched. */
  scale: number;
  /** Horizontal shift, as a percent of the image layer's own box. */
  offsetX: number;
  /** Vertical shift, as a percent of the image layer's own box. */
  offsetY: number;
}

export const DEFAULT_IMAGE_TRANSFORM: ImageTransform = {
  fit: "cover",
  scale: 100,
  offsetX: 0,
  offsetY: 0,
};

export const IMAGE_FIT_OPTIONS: Array<{ value: ImageFit; label: string }> = [
  { value: "cover", label: "Cover" },
  { value: "contain", label: "Contain" },
  { value: "none", label: "Actual Size" },
  { value: "repeat", label: "Repeat" },
];

export const IMAGE_SCALE_MIN = 50;
export const IMAGE_SCALE_MAX = 300;
export const IMAGE_OFFSET_MIN = -50;
export const IMAGE_OFFSET_MAX = 50;

// Merges in defaults for any field a persisted/partial transform is missing,
// so callers never have to null-check individual fields.
export function resolveImageTransform(
  transform?: Partial<ImageTransform> | null,
): ImageTransform {
  return { ...DEFAULT_IMAGE_TRANSFORM, ...(transform ?? {}) };
}

// Renders a transform as the inline style for a dedicated, absolutely
// positioned background layer (an `inset-0` div behind the card's real
// content). `fit` maps to `background-size`/`background-repeat` using CSS's
// own `cover`/`contain` keywords rather than a hand-computed percentage, so
// the untouched default (scale 100, offset 0) is pixel-identical to a plain
// `bg-cover bg-center` element. Scale/position are then layered on top via
// `transform`, independent of `fit`, so zooming/moving is simple percent
// math instead of depending on the image's natural size.
export function imageLayerStyle(
  imageUrl: string | null | undefined,
  transform?: Partial<ImageTransform> | null,
): Record<string, string> {
  if (!imageUrl) return {};
  const { fit, scale, offsetX, offsetY } = resolveImageTransform(transform);
  const backgroundSize = fit === "cover" || fit === "contain" ? fit : "auto";
  const backgroundRepeat = fit === "repeat" ? "repeat" : "no-repeat";
  return {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize,
    backgroundRepeat,
    backgroundPosition: "center",
    transform: `translate(${offsetX}%, ${offsetY}%) scale(${scale / 100})`,
  };
}
