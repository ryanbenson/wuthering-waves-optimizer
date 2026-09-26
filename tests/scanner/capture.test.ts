import { describe, expect, it } from "vitest";
import { detectIconBounds } from "../../src/scanner/capture";

/** Builds a flat RGBA buffer: `background` everywhere, `fill` inside the given rect. */
function buildImage(
  width: number,
  height: number,
  background: [number, number, number],
  fill?: { x: number; y: number; width: number; height: number; color: [number, number, number] },
): Uint8ClampedArray {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const inFill =
        fill && x >= fill.x && x < fill.x + fill.width && y >= fill.y && y < fill.y + fill.height;
      const [r, g, b] = inFill ? fill.color : background;
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = 255;
    }
  }
  return data;
}

describe("detectIconBounds", () => {
  it("finds a centered icon block that's visibly different from the background it sits on", () => {
    // 20x20 crop: a dark reddish-brown panel background (real WuWa panel
    // color, not black) with a bright icon-ish block in the middle —
    // mirrors a real SET_ICON_BOX crop with margin still left around the
    // actual icon.
    const data = buildImage(20, 20, [90, 40, 30], {
      x: 4,
      y: 4,
      width: 12,
      height: 12,
      color: [220, 200, 60],
    });
    const bounds = detectIconBounds(data, 20, 20);
    expect(bounds).toEqual({ x: 4, y: 4, width: 12, height: 12 });
  });

  it("returns null for a flat crop with nothing distinguishable from its own corners", () => {
    const data = buildImage(16, 16, [90, 40, 30]);
    expect(detectIconBounds(data, 16, 16)).toBeNull();
  });

  it("returns null when the found content already fills essentially the whole crop (nothing to tighten)", () => {
    const data = buildImage(16, 16, [90, 40, 30], {
      x: 0,
      y: 0,
      width: 16,
      height: 16,
      color: [220, 200, 60],
    });
    // The corners themselves are the "icon" color here, so there's no
    // background to sample in the first place — same as a flat crop.
    expect(detectIconBounds(data, 16, 16)).toBeNull();
  });

  it("ignores a tiny noise speck rather than tightening to it", () => {
    const data = buildImage(20, 20, [90, 40, 30], {
      x: 9,
      y: 9,
      width: 2,
      height: 2,
      color: [220, 200, 60],
    });
    // Far under the 50%-of-crop guard, so treated as unreliable/noise.
    expect(detectIconBounds(data, 20, 20)).toBeNull();
  });

  it("is tolerant of minor color noise in the background sample (real video compression)", () => {
    const data = buildImage(20, 20, [90, 40, 30], {
      x: 4,
      y: 4,
      width: 12,
      height: 12,
      color: [220, 200, 60],
    });
    // Perturb a few background pixels slightly, as compression artifacts would.
    data[0] = 94; // top-left corner R, +4 off background
    data[(19 * 20 + 19) * 4 + 1] = 44; // bottom-right corner G, +4 off background
    const bounds = detectIconBounds(data, 20, 20);
    expect(bounds).toEqual({ x: 4, y: 4, width: 12, height: 12 });
  });
});
