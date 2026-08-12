import { toBlob } from "html-to-image";

export const EXPORT_WIDTH = 1920;
export const EXPORT_HEIGHT = 1080;

// Elements the user only needs while editing the card in the browser (e.g.
// the portrait upload's reset button) are marked `data-export-hide` and
// excluded from the captured image via this filter, rather than trying to
// toggle their visibility around the capture — html-to-image clones the
// live node, so a filter is the simplest way to omit a node from just the
// export without it flashing in the on-screen preview.
function excludeExportHiddenNodes(domNode: HTMLElement): boolean {
  return !(domNode instanceof Element && domNode.hasAttribute("data-export-hide"));
}

// html-to-image defaults pixelRatio to the browser's own devicePixelRatio,
// which is what makes its *on-screen preview* renders look sharp — but we
// pin it to a fixed value for the actual export so quality is consistent
// (and high) regardless of which device/monitor triggered the download,
// rather than varying with whatever the exporting user's screen happens to
// report (1 on a plain desktop monitor, 2-3 on most laptops/phones).
const EXPORT_PIXEL_RATIO = 2;

export async function captureCardAsPngBlob(node: HTMLElement): Promise<Blob> {
  const blob = await toBlob(node, {
    width: EXPORT_WIDTH,
    height: EXPORT_HEIGHT,
    pixelRatio: EXPORT_PIXEL_RATIO,
    filter: excludeExportHiddenNodes,
  });
  if (!blob) {
    throw new Error("Failed to render the build card to an image");
  }
  return blob;
}

export function isClipboardImageWriteSupported(): boolean {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.clipboard?.write === "function" &&
    typeof window !== "undefined" &&
    typeof window.ClipboardItem === "function"
  );
}

export async function copyCardImageToClipboard(node: HTMLElement): Promise<void> {
  const blob = await captureCardAsPngBlob(node);
  await navigator.clipboard.write([
    new ClipboardItem({ "image/png": blob }),
  ]);
}

export async function downloadCardImage(
  node: HTMLElement,
  filename = "build-card.png",
): Promise<void> {
  const blob = await captureCardAsPngBlob(node);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
