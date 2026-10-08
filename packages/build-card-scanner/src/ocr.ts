/**
 * Tesseract settings the regions were tuned with: a character whitelist covering stat
 * labels and values, and page segmentation mode 7 ("treat the image as a single text line").
 */
export const RECOMMENDED_OCR_PARAMS = {
  tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.%+ ",
  tessedit_pageseg_mode: 7,
} as const;

/**
 * Prepares a cropped region for OCR, in place: converts RGBA pixels to grayscale
 * (Rec. 601 luma) and stretches contrast around mid-gray. Alpha is untouched.
 *
 * Pass `ImageData.data` from a canvas crop, or any RGBA `Uint8ClampedArray`.
 */
export function preprocessForOcr(rgba: Uint8ClampedArray, contrast = 1.5): void {
  for (let i = 0; i < rgba.length; i += 4) {
    const gray = Math.round(0.299 * rgba[i] + 0.587 * rgba[i + 1] + 0.114 * rgba[i + 2]);
    const adjusted = Math.max(0, Math.min(255, (gray - 128) * contrast + 128));
    rgba[i] = adjusted;
    rgba[i + 1] = adjusted;
    rgba[i + 2] = adjusted;
  }
}
