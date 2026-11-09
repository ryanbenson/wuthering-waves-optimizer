// Curated art for the Build Card (ADR 0056): pre-picked character art and
// backgrounds players can choose without uploading anything. Players can
// still upload their own image for either slot.
//
// Adding art: append an entry below. Host the image on the assets repo
// (ryanbenson.github.io/wuthering-waves-assets): the card's PNG export
// re-fetches every image with CORS, so a host without CORS headers makes
// the export drop the image. Use webp or png, ideally 1920px wide for
// backgrounds and about 1000px tall for character art.
//
//   { id: "iuno-moonlit", kind: "character", label: "Moonlit",
//     url: "https://ryanbenson.github.io/wuthering-waves-assets/images/build-card/iuno-moonlit.webp",
//     characters: ["Iuno"], credit: "Kuro Games" },
//
// `id` is persisted in players' saved data, so never rename or reuse one;
// to retire an art, delete its entry and anyone who picked it falls back
// to the default.

export type BuildCardArtKind = "character" | "background";

export interface BuildCardArt {
  /** Stable key saved in user data. Never rename or reuse. */
  id: string;
  kind: BuildCardArtKind;
  label: string;
  url: string;
  /**
   * Character keys (as in `characters.ts`) this art is offered for.
   * Required for character art. Optional for backgrounds: omitted means
   * the background is offered for every character.
   */
  characters?: string[];
  /** Shown in small print on the card, e.g. the artist's handle. */
  credit?: string;
}

export const BUILD_CARD_ARTS: readonly BuildCardArt[] = [];

function isOfferedFor(art: BuildCardArt, characterId: string): boolean {
  if (!art.characters?.length) return art.kind === "background";
  return art.characters.includes(characterId);
}

export function getBuildCardArtOptions(
  kind: BuildCardArtKind,
  characterId: string,
  arts: readonly BuildCardArt[] = BUILD_CARD_ARTS,
): BuildCardArt[] {
  return arts.filter((art) => art.kind === kind && isOfferedFor(art, characterId));
}

// ---------------------------------------------------------------------------
// Which image a slot shows.
//
// Each slot (character art, background) has a saved "source":
//   - "default": the built-in look (the character's own art)
//   - "upload":  the player's uploaded image
//   - an art id: one of the curated entries above
//   - null/absent: saved before sources existed, so behave as before:
//     the upload if there is one, otherwise the default
// An unknown id, an id not offered for this character, or "upload" with no
// uploaded image all fall back to the default rather than showing nothing.

export const ART_SOURCE_DEFAULT = "default";
export const ART_SOURCE_UPLOAD = "upload";

export type ResolvedArt =
  | { kind: "default" }
  | { kind: "upload"; url: string }
  | { kind: "curated"; url: string; art: BuildCardArt };

export function resolveArtSource(
  source: string | null | undefined,
  upload: string | null | undefined,
  options: readonly BuildCardArt[],
): ResolvedArt {
  if (source == null || source === ART_SOURCE_UPLOAD) {
    return upload ? { kind: "upload", url: upload } : { kind: "default" };
  }
  if (source === ART_SOURCE_DEFAULT) return { kind: "default" };
  const art = options.find((option) => option.id === source);
  return art ? { kind: "curated", url: art.url, art } : { kind: "default" };
}

// Background image opacity, saved as a whole percent (0-100) in
// `config.buildCard.backgroundOpacity`. Absent or invalid means fully
// opaque, so cards saved before the slider existed look the same.
export const BACKGROUND_OPACITY_DEFAULT = 100;

export function resolveBackgroundOpacity(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (value == null || value === "" || !Number.isFinite(n)) return BACKGROUND_OPACITY_DEFAULT;
  return Math.min(Math.max(Math.round(n), 0), 100);
}
