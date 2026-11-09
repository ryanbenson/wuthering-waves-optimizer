import { describe, expect, it } from "vitest";
import {
  BUILD_CARD_ARTS,
  getBuildCardArtOptions,
  resolveArtSource,
  type BuildCardArt,
} from "../../src/buildCard/arts";

const ARTS: BuildCardArt[] = [
  { id: "iuno-a", kind: "character", label: "Iuno A", url: "iuno-a.webp", characters: ["Iuno"] },
  { id: "loose-character", kind: "character", label: "No owner", url: "x.webp" },
  { id: "stars", kind: "background", label: "Stars", url: "stars.webp", credit: "Artist" },
  { id: "iuno-bg", kind: "background", label: "Iuno BG", url: "iuno-bg.webp", characters: ["Iuno"] },
];

describe("BUILD_CARD_ARTS", () => {
  it("has unique ids, valid kinds and character tags on character art", () => {
    const ids = BUILD_CARD_ARTS.map((art) => art.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const art of BUILD_CARD_ARTS) {
      expect(["character", "background"]).toContain(art.kind);
      expect(art.url).toMatch(/^https:\/\//);
      if (art.kind === "character") expect(art.characters?.length).toBeGreaterThan(0);
    }
  });
});

describe("getBuildCardArtOptions", () => {
  it("offers character art only to its tagged characters", () => {
    expect(getBuildCardArtOptions("character", "Iuno", ARTS).map((a) => a.id)).toEqual(["iuno-a"]);
    expect(getBuildCardArtOptions("character", "Lupa", ARTS)).toEqual([]);
  });

  it("offers untagged backgrounds to everyone and tagged ones to their characters", () => {
    expect(getBuildCardArtOptions("background", "Iuno", ARTS).map((a) => a.id)).toEqual(["stars", "iuno-bg"]);
    expect(getBuildCardArtOptions("background", "Lupa", ARTS).map((a) => a.id)).toEqual(["stars"]);
  });
});

describe("resolveArtSource", () => {
  const options = getBuildCardArtOptions("background", "Iuno", ARTS);

  it("keeps the old behavior when no source was saved: upload if any, else default", () => {
    expect(resolveArtSource(null, "data:upload", options)).toEqual({ kind: "upload", url: "data:upload" });
    expect(resolveArtSource(undefined, null, options)).toEqual({ kind: "default" });
  });

  it("honours an explicit default even when an upload exists", () => {
    expect(resolveArtSource("default", "data:upload", options)).toEqual({ kind: "default" });
  });

  it("resolves a curated id", () => {
    const resolved = resolveArtSource("stars", "data:upload", options);
    expect(resolved).toMatchObject({ kind: "curated", url: "stars.webp" });
  });

  it("falls back to default for an unknown id, an id not offered here, or upload with no image", () => {
    expect(resolveArtSource("removed-art", null, options)).toEqual({ kind: "default" });
    const lupaOptions = getBuildCardArtOptions("background", "Lupa", ARTS);
    expect(resolveArtSource("iuno-bg", null, lupaOptions)).toEqual({ kind: "default" });
    expect(resolveArtSource("upload", null, options)).toEqual({ kind: "default" });
  });
});
