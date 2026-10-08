import { describe, it, expect } from "vitest";
import {
  BUILD_CARD_HEIGHT,
  BUILD_CARD_WIDTH,
  buildCardRegions,
  isBuildCardSize,
  preprocessForOcr,
} from "@wutheringtools/build-card-scanner";

describe("buildCardRegions", () => {
  const slots = buildCardRegions();

  it("has five slots with five substat lines each", () => {
    expect(slots).toHaveLength(5);
    for (const slot of slots) expect(slot.substats).toHaveLength(5);
  });

  it("keeps the first slot's measured positions", () => {
    expect(slots[0].cost).toEqual({ x: 336, y: 674, width: 18, height: 24 });
    expect(slots[0].echoImage).toEqual({ x: 22, y: 650, width: 192, height: 182 });
    expect(slots[0].set).toEqual({ x: 264, y: 660, width: 56, height: 56 });
  });

  it("spaces slots 374px apart", () => {
    expect(slots[4].mainStatLabel.x - slots[0].mainStatLabel.x).toBe(4 * 374);
  });

  it("keeps every region inside the card", () => {
    for (const slot of slots) {
      for (const r of [slot.cost, slot.mainStatLabel, slot.echoImage, slot.set, ...slot.substats]) {
        expect(r.x + r.width).toBeLessThanOrEqual(BUILD_CARD_WIDTH);
        expect(r.y + r.height).toBeLessThanOrEqual(BUILD_CARD_HEIGHT);
      }
    }
  });
});

describe("isBuildCardSize", () => {
  it("accepts only 1920×1080", () => {
    expect(isBuildCardSize(1920, 1080)).toBe(true);
    expect(isBuildCardSize(1080, 1920)).toBe(false);
    expect(isBuildCardSize(3840, 2160)).toBe(false);
  });
});

describe("preprocessForOcr", () => {
  // The app's original two passes (grayscale, then contrast on the gray channel), kept
  // here to prove the one-pass version produces identical bytes.
  function originalTwoPass(data: Uint8ClampedArray, factor = 1.5) {
    for (let i = 0; i < data.length; i += 4) {
      const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
      data[i] = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;
    }
    for (let i = 0; i < data.length; i += 4) {
      const adjusted = Math.max(0, Math.min(255, (data[i] - 128) * factor + 128));
      data[i] = adjusted;
      data[i + 1] = adjusted;
      data[i + 2] = adjusted;
    }
  }

  it("matches the original grayscale + contrast passes byte for byte", () => {
    let seed = 42;
    const rand = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31) * 256;
    const pixels = new Uint8ClampedArray(4 * 5000).map(() => rand());
    const expected = new Uint8ClampedArray(pixels);
    originalTwoPass(expected);
    preprocessForOcr(pixels);
    expect(Array.from(pixels)).toEqual(Array.from(expected));
  });

  it("leaves alpha untouched", () => {
    const px = new Uint8ClampedArray([10, 200, 90, 77]);
    preprocessForOcr(px);
    expect(px[3]).toBe(77);
  });
});
