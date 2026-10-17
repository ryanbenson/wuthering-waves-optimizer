import { describe, it, expect } from "vitest";
import sharp from "sharp";
import { EQUIPPED_BY_LINE, toPixelRegion } from "../../src/scanner/layout";
import { matchEquippedBy } from "@wutheringtools/scanner-core/equippedBy";
import { allCharactersList } from "../../src/characters/characters";

// Real Echo Management captures at 16:9 (1080p, 720p) and 16:10 (User ID blacked out).
const fixture = (name: string) => `tests/scanner/fixtures/echo-panel-${name}.jpg`;

/** Rows / columns of a greyscale crop whose luma varies like text does. */
function inkLines(data: Buffer, width: number, height: number, byRow: boolean): number[] {
  const [outer, inner] = byRow ? [height, width] : [width, height];
  const ink: number[] = [];
  for (let i = 0; i < outer; i++) {
    let sum = 0;
    let sumSq = 0;
    for (let j = 0; j < inner; j++) {
      const v = data[byRow ? i * width + j : j * width + i];
      sum += v;
      sumSq += v * v;
    }
    const mean = sum / inner;
    if (Math.sqrt(sumSq / inner - mean * mean) > 18) ink.push(i);
  }
  return ink;
}

async function equippedLineCrop(file: string) {
  const { width, height } = await sharp(file).metadata();
  const region = toPixelRegion(EQUIPPED_BY_LINE, { width: width!, height: height! });
  return sharp(file)
    .extract({ left: region.x, top: region.y, width: region.width, height: region.height })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
}

describe("EQUIPPED_BY_LINE", () => {
  it.each(["equipped-1920x1080", "equipped-locked-1920x1200", "equipped-locked-1280x720"])(
    "frames the whole 'Equipped by <name>' line without clipping it (%s)",
    async (name) => {
      const { data, info } = await equippedLineCrop(fixture(name));
      const rows = inkLines(data, info.width, info.height, true);
      const cols = inkLines(data, info.width, info.height, false);
      expect(rows.length, "text rows inside the crop").toBeGreaterThan(info.height * 0.4);
      expect(rows[0], "margin above the text").toBeGreaterThan(0);
      expect(rows.at(-1)!, "margin below the text").toBeLessThan(info.height - 1);
      expect(cols[0], "margin left of the text (avatar excluded)").toBeGreaterThan(0);
      expect(cols.at(-1)!, "room right of 'Hsin' for longer names").toBeLessThan(info.width * 0.6);
    },
  );

  it("is empty when nobody wears the echo", async () => {
    for (const name of ["locked-1920x1200", "locked-1280x720"]) {
      const { data, info } = await equippedLineCrop(fixture(name));
      expect(inkLines(data, info.width, info.height, true), name).toEqual([]);
    }
  });

  it("reads as Hsin with the app's character list", () => {
    expect(matchEquippedBy(["Equipped by Hsin"], allCharactersList, null)).toMatchObject({
      kind: "character",
      key: "Hsin",
    });
  });
});
