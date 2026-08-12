import { toBlob } from "html-to-image";

export const EXPORT_WIDTH = 1920;
export const EXPORT_HEIGHT = 1080;

export async function captureCardAsPngBlob(node: HTMLElement): Promise<Blob> {
  const blob = await toBlob(node, {
    width: EXPORT_WIDTH,
    height: EXPORT_HEIGHT,
    pixelRatio: 1,
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
