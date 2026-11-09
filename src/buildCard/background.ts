// Where a character's Build Card background settings come from (ADR 0056).
//
// Background settings belong to each character, saved on the character
// record beside customPortrait (so they're build-scoped like it):
//   buildCardBackground           uploaded image (data URL)
//   buildCardBackgroundTransform  its framing
//   buildCardBackgroundSource     "default", "upload" or a curated art id
//   buildCardBackgroundOpacity    0-100, absent means 100
//   buildCardShowArtOverBackground
//
// Before this, one uploaded background was shared by every card, saved as
// config.buildCard.background / backgroundTransform in the settings store.
// That image is still used, as the "shared upload", by any character that
// has no upload of its own, so nobody's existing cards change. Copying it
// onto every character instead could fill localStorage, since each copy is
// a full image.

import { resolveBackgroundOpacity } from "./arts";
import type { ImageTransform } from "../utils/imageTransform";

export interface LegacySharedBackground {
  background?: string | null;
  backgroundTransform?: Partial<ImageTransform> | null;
}

export interface CharacterBackgroundSettings {
  /** The saved choice; null means "the upload if there is one". */
  source: string | null;
  /** The upload this character can use: its own, else the shared one. */
  upload: string | null;
  /** True when `upload` is the old shared image, not this character's. */
  uploadIsShared: boolean;
  transform: Partial<ImageTransform> | null;
  /** 0-100. */
  opacity: number;
  showArtOverBackground: boolean;
}

export function resolveCharacterBackground(
  characterData: Record<string, any> | null | undefined,
  legacy: LegacySharedBackground | null | undefined,
): CharacterBackgroundSettings {
  const own = characterData?.buildCardBackground || null;
  const shared = legacy?.background || null;
  const uploadIsShared = !own && Boolean(shared);
  return {
    source: characterData?.buildCardBackgroundSource ?? null,
    upload: own ?? shared,
    uploadIsShared,
    transform:
      (uploadIsShared
        ? legacy?.backgroundTransform
        : characterData?.buildCardBackgroundTransform) ?? null,
    opacity: resolveBackgroundOpacity(characterData?.buildCardBackgroundOpacity),
    showArtOverBackground: Boolean(characterData?.buildCardShowArtOverBackground),
  };
}
