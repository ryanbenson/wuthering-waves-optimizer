/**
 * Triggers a browser download of the given text content as a file, via a
 * throwaway Blob URL + anchor click (no server round trip).
 */
export function downloadBlob(
  content: string,
  filename: string,
  mimeType = "application/json",
) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
