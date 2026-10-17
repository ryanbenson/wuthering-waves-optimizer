import { describe, it, expect } from "vitest";
import sharp from "sharp";
import { DISCARD_ICON_BOX, LOCK_ICON_BOX, toPixelRegion } from "../../src/scanner/layout";
import { readEchoMarks } from "@wutheringtools/scanner-core/echoMarks";
import type { RegionFrac } from "../../src/scanner/types";

// Real 1920x1080 Echo Management captures (User ID blacked out).
const fixture = (name: string) => `tests/scanner/fixtures/echo-panel-${name}-1920x1080.jpg`;

async function iconPixels(file: string, region: RegionFrac) {
  const r = toPixelRegion(region, { width: 1920, height: 1080 });
  const { data, info } = await sharp(file)
    .extract({ left: r.x, top: r.y, width: r.width, height: r.height })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height, channels: 3 };
}

describe("readEchoMarks on real captures", () => {
  it.each([
    ["locked", { locked: true, trash: false }],
    ["unlocked", { locked: false, trash: false }],
    ["discarded", { locked: false, trash: true }],
    ["equipped", { locked: false, trash: false }],
  ])("%s echo", async (name, expected) => {
    const file = fixture(name);
    expect(readEchoMarks(await iconPixels(file, DISCARD_ICON_BOX), await iconPixels(file, LOCK_ICON_BOX))).toEqual(expected);
  });
});
