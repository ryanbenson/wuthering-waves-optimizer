/**
 * Reads who an echo is equipped by from the echo panel's "Equipped by <name>" line.
 *
 * The character list is passed in rather than taken from `ScannerGameData`, so the game
 * data contract doesn't change: Wuthering Tools has its own character registry, and
 * Wavescan has the `characters` array of `scanner-data.json`.
 *
 * The main character (Rover) is special. The game shows the name the player chose
 * ("Equipped by Clover"), never "Rover", so Rover is matched against `playerName` instead
 * of the character list, and comes back as `kind: "player"`. Rover only has one build at a
 * time, so the panel never needs to say which element: the app that applies the equip
 * decides which of its Rover entries that is.
 */
import { levenshteinSimilarity, prefixTolerantSimilarity } from "./levenshtein.js";
import { NAME_MATCH_THRESHOLD, normalizeOcrText } from "./parse.js";

/** One character the echo could be equipped by. */
export interface EquipCharacter {
  key: string;
  name: string;
}

/**
 * - `none`: there's no "Equipped by" line, so the echo isn't equipped.
 * - `character`: equipped by this character.
 * - `player`: equipped by the main character (Rover), recognised by the player's name.
 * - `unknown`: there's an "Equipped by" line, but the name didn't clearly match anyone
 *   (OCR noise, no player name given, or a player name that's also a character's name).
 *   Callers flag it rather than guess.
 */
export type EquippedByMatch =
  | { kind: "none" }
  | { kind: "character"; key: string; similarity: number }
  | { kind: "player"; similarity: number }
  | { kind: "unknown"; name: string };

/**
 * The character key a scan uses for "equipped by the main character". It isn't a real
 * character key: the importing app maps it to its own Rover entry.
 */
export const PLAYER_CHARACTER_KEY = "Rover";

/** How close an OCR'd word must be to "equipped" ("quipped" from a cropped line is 0.875). */
const EQUIPPED_WORD_SIMILARITY = 0.7;
/** Same trailing-junk discount as echo names (parse.ts TRAILING_DROP_WEIGHT). */
const TRAILING_DROP_WEIGHT = 0.5;
/**
 * The best match must beat the runner-up by this much. Otherwise two names fit the text
 * about equally well (a player named after a character, or a badly garbled name), and the
 * echo is flagged instead.
 */
const MIN_MARGIN = 0.1;

/** Rover's entries (one per element and gender). The panel never shows these names. */
export function isPlayerCharacterKey(key: string): boolean {
  return /^rover/i.test(key);
}

/**
 * The name after "Equipped by" in any of `lines`, or null when no line has it. Tolerates a
 * cropped or misread "Equipped" ("quipped by", "Equlpped by") and a missing space
 * ("Equippedby Clover"). Returns null when nothing with a letter follows.
 */
export function findEquippedByName(lines: readonly string[]): string | null {
  for (const line of lines) {
    const words = line.trim().split(/\s+/);
    for (let i = 0; i < words.length; i++) {
      const word = normalizeOcrText(words[i]!);
      let nameStart = -1;
      if (normalizeOcrText(words[i + 1] ?? "") === "by" && isEquippedWord(word)) {
        nameStart = i + 2;
      } else if (word.endsWith("by") && isEquippedWord(word.slice(0, -2))) {
        nameStart = i + 1;
      }
      if (nameStart < 0) continue;
      const name = words.slice(nameStart).join(" ").trim();
      return /\p{L}/u.test(name) ? name : null;
    }
  }
  return null;
}

function isEquippedWord(normalized: string): boolean {
  return normalized.length > 0 && levenshteinSimilarity(normalized, "equipped") >= EQUIPPED_WORD_SIMILARITY;
}

/**
 * Who the echo in `lines` (the OCR'd lines below the Echo Skill description) is equipped
 * by. `characters` is every playable character; Rover's entries in it are ignored (see the
 * module comment). `playerName` is the name the player gave the main character in game, or
 * null when the user hasn't said, in which case an echo equipped by Rover comes back
 * `unknown`.
 */
export function matchEquippedBy(
  lines: readonly string[],
  characters: readonly EquipCharacter[],
  playerName: string | null,
): EquippedByMatch {
  const name = findEquippedByName(lines);
  if (name === null) return { kind: "none" };
  const target = normalizeOcrText(name);

  const candidates = characters.filter((c) => !isPlayerCharacterKey(c.key));
  const player = playerName ? normalizeOcrText(playerName) : "";
  const scored = [
    ...candidates.map((c) => ({ key: c.key, similarity: similarity(target, c.name) })),
    ...(player ? [{ key: PLAYER_CHARACTER_KEY, similarity: similarity(target, playerName!) }] : []),
  ].sort((a, b) => b.similarity - a.similarity);

  const [best, second] = scored;
  if (!best || best.similarity < NAME_MATCH_THRESHOLD) return { kind: "unknown", name };
  if (second && best.similarity - second.similarity < MIN_MARGIN) return { kind: "unknown", name };
  return best.key === PLAYER_CHARACTER_KEY
    ? { kind: "player", similarity: best.similarity }
    : { kind: "character", key: best.key, similarity: best.similarity };
}

function similarity(normalizedText: string, name: string): number {
  return prefixTolerantSimilarity(normalizedText, normalizeOcrText(name), TRAILING_DROP_WEIGHT);
}
