import { describe, expect, it } from "vitest";
import { resolveCharacterBackground } from "../../src/buildCard/background";

describe("resolveCharacterBackground", () => {
  it("defaults to nothing chosen at full opacity", () => {
    expect(resolveCharacterBackground({}, {})).toEqual({
      source: null,
      upload: null,
      uploadIsShared: false,
      transform: null,
      opacity: 100,
      showArtOverBackground: false,
    });
  });

  it("uses the character's own upload and framing", () => {
    const result = resolveCharacterBackground(
      {
        buildCardBackground: "own",
        buildCardBackgroundTransform: { scale: 120 },
        buildCardBackgroundSource: "upload",
        buildCardBackgroundOpacity: 40,
        buildCardShowArtOverBackground: true,
      },
      { background: "shared", backgroundTransform: { scale: 80 } },
    );
    expect(result).toMatchObject({
      source: "upload",
      upload: "own",
      uploadIsShared: false,
      transform: { scale: 120 },
      opacity: 40,
      showArtOverBackground: true,
    });
  });

  it("falls back to the old shared upload and its framing", () => {
    const result = resolveCharacterBackground(
      { buildCardBackgroundTransform: { scale: 120 } },
      { background: "shared", backgroundTransform: { scale: 80 } },
    );
    expect(result).toMatchObject({
      upload: "shared",
      uploadIsShared: true,
      transform: { scale: 80 },
    });
  });

  it("handles a missing character record or settings", () => {
    expect(resolveCharacterBackground(undefined, null).upload).toBeNull();
  });
});
