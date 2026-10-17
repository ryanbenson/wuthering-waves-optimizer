import { describe, it, expect } from "vitest";
import sharp from "sharp";
import { EQUIPPED_BY_LINE, toPixelRegion } from "../../src/scanner/layout";
import { matchEquippedBy } from "@wutheringtools/scanner-core/equippedBy";
import { allCharactersList } from "../../src/characters/characters";

// A real 1920x1080 (16:9) Echo Management capture of an echo "Equipped by Hsin"
// (the player's User ID is blacked out).
const FIXTURE = "tests/scanner/fixtures/echo-panel-equipped-1920x1080.jpg";

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

describe("EQUIPPED_BY_LINE", () => {
  it("frames the whole 'Equipped by <name>' line on a real capture, without clipping it", async () => {
    const region = toPixelRegion(EQUIPPED_BY_LINE, { width: 1920, height: 1080 });
    const { data, info } = await sharp(FIXTURE)
      .extract({ left: region.x, top: region.y, width: region.width, height: region.height })
      .greyscale()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const rows = inkLines(data, info.width, info.height, true);
    const cols = inkLines(data, info.width, info.height, false);
    expect(rows.length, "text rows inside the crop").toBeGreaterThan(10);
    expect(rows[0], "margin above the text").toBeGreaterThan(0);
    expect(rows.at(-1)!, "margin below the text").toBeLessThan(info.height - 1);
    expect(cols[0], "margin left of the text (avatar excluded)").toBeGreaterThan(0);
    expect(cols.at(-1)!, "room right of 'Hsin' for longer names").toBeLessThan(info.width * 0.6);
  });

  it("reads as Hsin with the app's character list", () => {
    expect(matchEquippedBy(["Equipped by Hsin"], allCharactersList, null)).toMatchObject({
      kind: "character",
      key: "Hsin",
    });
  });
});
