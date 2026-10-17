import { describe, it, expect } from "vitest";
import sharp from "sharp";
import { DISCARD_ICON_BOX, LOCK_ICON_BOX, toPixelRegion } from "../../src/scanner/layout";
import { readEchoMarks } from "@wutheringtools/scanner-core/echoMarks";
import type { RegionFrac } from "../../src/scanner/types";

// Real Echo Management captures at 16:9 (1080p, 720p) and 16:10 (User ID blacked out).
const fixture = (name: string) => `tests/scanner/fixtures/echo-panel-${name}.jpg`;

async function iconPixels(file: string, region: RegionFrac) {
  const { width, height } = await sharp(file).metadata();
  const r = toPixelRegion(region, { width: width!, height: height! });
  const { data, info } = await sharp(file)
    .extract({ left: r.x, top: r.y, width: r.width, height: r.height })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height, channels: 3 };
}

describe("readEchoMarks on real captures", () => {
  it.each([
    ["locked-1920x1080", { locked: true, trash: false }],
    ["unlocked-1920x1080", { locked: false, trash: false }],
    ["discarded-1920x1080", { locked: false, trash: true }],
    ["equipped-1920x1080", { locked: false, trash: false }],
    ["equipped-locked-1920x1200", { locked: true, trash: false }],
    ["equipped-unlocked-1920x1200", { locked: false, trash: false }],
    ["equipped-discarded-1920x1200", { locked: false, trash: true }],
    ["locked-1920x1200", { locked: true, trash: false }],
    ["equipped-locked-1280x720", { locked: true, trash: false }],
    ["equipped-unlocked-1280x720", { locked: false, trash: false }],
    ["equipped-discarded-1280x720", { locked: false, trash: true }],
    ["locked-1280x720", { locked: true, trash: false }],
  ])("%s", async (name, expected) => {
    const file = fixture(name);
    expect(readEchoMarks(await iconPixels(file, DISCARD_ICON_BOX), await iconPixels(file, LOCK_ICON_BOX))).toEqual(expected);
  });
});
