import { describe, it, expect, beforeEach, vi } from "vitest";

const toBlobMock = vi.fn();
vi.mock("html-to-image", () => ({
  toBlob: (...args: unknown[]) => toBlobMock(...args),
}));

import {
  captureCardAsPngBlob,
  copyCardImageToClipboard,
  downloadCardImage,
  isClipboardImageWriteSupported,
  EXPORT_WIDTH,
  EXPORT_HEIGHT,
} from "../../src/utils/exportCardImage";

function makeNode() {
  return document.createElement("div");
}

describe("captureCardAsPngBlob", () => {
  beforeEach(() => {
    toBlobMock.mockReset();
  });

  it("calls html-to-image's toBlob with the fixed export dimensions", async () => {
    const blob = new Blob(["fake"], { type: "image/png" });
    toBlobMock.mockResolvedValue(blob);
    const node = makeNode();

    const result = await captureCardAsPngBlob(node);

    expect(toBlobMock).toHaveBeenCalledWith(node, {
      width: EXPORT_WIDTH,
      height: EXPORT_HEIGHT,
      pixelRatio: 1,
    });
    expect(result).toBe(blob);
  });

  it("throws when toBlob resolves to null", async () => {
    toBlobMock.mockResolvedValue(null);

    await expect(captureCardAsPngBlob(makeNode())).rejects.toThrow(
      "Failed to render the build card to an image",
    );
  });
});

describe("isClipboardImageWriteSupported", () => {
  it("returns false when navigator.clipboard.write is unavailable", () => {
    vi.stubGlobal("navigator", {});
    expect(isClipboardImageWriteSupported()).toBe(false);
    vi.unstubAllGlobals();
  });

  it("returns true when clipboard.write and ClipboardItem are both available", () => {
    vi.stubGlobal("navigator", { clipboard: { write: vi.fn() } });
    vi.stubGlobal("ClipboardItem", class {});
    expect(isClipboardImageWriteSupported()).toBe(true);
    vi.unstubAllGlobals();
  });
});

describe("copyCardImageToClipboard", () => {
  it("writes the captured blob to the clipboard as a ClipboardItem", async () => {
    const blob = new Blob(["fake"], { type: "image/png" });
    toBlobMock.mockResolvedValue(blob);
    const write = vi.fn().mockResolvedValue(undefined);
    class MockClipboardItem {
      data: Record<string, Blob>;
      constructor(data: Record<string, Blob>) {
        this.data = data;
      }
    }
    vi.stubGlobal("navigator", { clipboard: { write } });
    vi.stubGlobal("ClipboardItem", MockClipboardItem);

    await copyCardImageToClipboard(makeNode());

    expect(write).toHaveBeenCalledTimes(1);
    const [items] = write.mock.calls[0];
    expect(items[0]).toBeInstanceOf(MockClipboardItem);
    expect(items[0].data["image/png"]).toBe(blob);
    vi.unstubAllGlobals();
  });
});

describe("downloadCardImage", () => {
  it("creates an object URL, clicks a download anchor, and revokes the URL", async () => {
    const blob = new Blob(["fake"], { type: "image/png" });
    toBlobMock.mockResolvedValue(blob);
    const createObjectURL = vi.fn(() => "blob:mock-url");
    const revokeObjectURL = vi.fn();
    vi.stubGlobal("URL", { createObjectURL, revokeObjectURL });
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});

    await downloadCardImage(makeNode(), "test-card.png");

    expect(createObjectURL).toHaveBeenCalledWith(blob);
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");

    clickSpy.mockRestore();
    vi.unstubAllGlobals();
  });

  it("defaults the filename to build-card.png", async () => {
    const blob = new Blob(["fake"], { type: "image/png" });
    toBlobMock.mockResolvedValue(blob);
    vi.stubGlobal("URL", {
      createObjectURL: vi.fn(() => "blob:mock-url"),
      revokeObjectURL: vi.fn(),
    });
    let capturedDownload = "";
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(function (this: HTMLAnchorElement) {
        capturedDownload = this.download;
      });

    await downloadCardImage(makeNode());

    expect(capturedDownload).toBe("build-card.png");

    clickSpy.mockRestore();
    vi.unstubAllGlobals();
  });
});
