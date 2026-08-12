import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { compressImageToDataUrl } from "../../src/utils/imageCompression";

function mockImage(width: number, height: number): HTMLImageElement {
  return {
    naturalWidth: width,
    naturalHeight: height,
    width,
    height,
  } as HTMLImageElement;
}

describe("compressImageToDataUrl", () => {
  let drawImage: ReturnType<typeof vi.fn>;
  let toDataURL: ReturnType<typeof vi.fn>;
  let lastCanvas: { width: number; height: number };

  beforeEach(() => {
    drawImage = vi.fn();
    toDataURL = vi.fn(() => "data:image/jpeg;base64,mock");
    lastCanvas = { width: 0, height: 0 };

    const originalCreateElement =
      document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      if (tag !== "canvas") {
        return originalCreateElement(tag);
      }
      const canvas = {
        get width() {
          return lastCanvas.width;
        },
        set width(v: number) {
          lastCanvas.width = v;
        },
        get height() {
          return lastCanvas.height;
        },
        set height(v: number) {
          lastCanvas.height = v;
        },
        getContext: () => ({ drawImage }),
        toDataURL,
      };
      return canvas as unknown as HTMLElement;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("scales a landscape image down to fit maxDimension on the long edge", () => {
    const img = mockImage(4000, 2000);
    compressImageToDataUrl(img, { maxDimension: 800 });

    expect(lastCanvas.width).toBe(800);
    expect(lastCanvas.height).toBe(400);
    expect(drawImage).toHaveBeenCalledWith(img, 0, 0, 4000, 2000, 0, 0, 800, 400);
  });

  it("scales a portrait image down to fit maxDimension on the long edge", () => {
    const img = mockImage(1200, 2400);
    compressImageToDataUrl(img, { maxDimension: 800 });

    expect(lastCanvas.width).toBe(400);
    expect(lastCanvas.height).toBe(800);
  });

  it("scales a square image down to fit maxDimension", () => {
    const img = mockImage(3000, 3000);
    compressImageToDataUrl(img, { maxDimension: 800 });

    expect(lastCanvas.width).toBe(800);
    expect(lastCanvas.height).toBe(800);
  });

  it("never scales an image up when it's already smaller than maxDimension", () => {
    const img = mockImage(300, 200);
    compressImageToDataUrl(img, { maxDimension: 800 });

    expect(lastCanvas.width).toBe(300);
    expect(lastCanvas.height).toBe(200);
  });

  it("defaults to an 800px max dimension and 0.8 quality", () => {
    const img = mockImage(1600, 800);
    compressImageToDataUrl(img);

    expect(lastCanvas.width).toBe(800);
    expect(lastCanvas.height).toBe(400);
    expect(toDataURL).toHaveBeenCalledWith("image/jpeg", 0.8);
  });

  it("passes a custom quality through to toDataURL", () => {
    const img = mockImage(800, 800);
    compressImageToDataUrl(img, { quality: 0.5 });

    expect(toDataURL).toHaveBeenCalledWith("image/jpeg", 0.5);
  });

  it("returns the compressed data URL", () => {
    const img = mockImage(800, 800);
    const result = compressImageToDataUrl(img);

    expect(result).toBe("data:image/jpeg;base64,mock");
  });

  it("throws when a 2D context is unavailable", () => {
    vi.mocked(document.createElement).mockRestore();
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      if (tag !== "canvas") {
        return originalCreateElement(tag);
      }
      return {
        width: 0,
        height: 0,
        getContext: () => null,
      } as unknown as HTMLElement;
    });

    const img = mockImage(800, 800);
    expect(() => compressImageToDataUrl(img)).toThrow(
      "Canvas 2D context is not available",
    );
  });
});
