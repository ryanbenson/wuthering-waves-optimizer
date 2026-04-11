import { describe, expect, it } from "vitest";
import {
  ASTRITE_FANTASIES_THOUSAND_GATEWAYS,
  ASTRITE_TOWER_OF_ADVERSITY,
  ASTRITE_WHIMPERING_WASTES,
  astriteFromStaticContentRuns,
} from "../../src/convene/contentAstrite";

describe("astriteFromStaticContentRuns", () => {
  it("multiplies runs by fixed rewards", () => {
    expect(astriteFromStaticContentRuns(1, 1, 1)).toBe(
      ASTRITE_FANTASIES_THOUSAND_GATEWAYS +
        ASTRITE_TOWER_OF_ADVERSITY +
        ASTRITE_WHIMPERING_WASTES,
    );
  });

  it("ignores negative and fractional runs", () => {
    expect(astriteFromStaticContentRuns(-1, 2.7, 0)).toBe(
      2 * ASTRITE_TOWER_OF_ADVERSITY,
    );
  });
});
