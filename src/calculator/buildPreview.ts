import { getCharByName, getCharacterRosterDisplayName } from "../characters/characters";
import { getWeaponByName } from "../weapons/weapons";
import { buildCharacterCalculationContext, resolveCharacterEchoes, type TeamEnemyConfig } from "./buildCharacterContext";
import { getEchoSetIconByType, getEchoSetLabelByType } from "../echoes/stats";
import { getSetBonusThreshold } from "../echoes/sets";
import { resolveCharactersForBuildPreview } from "./buildOverride";
import { resolveActiveStance } from "./stances";

const CHARACTER_IMAGE_BASE = "https://ryanbenson.github.io/wuthering-waves-assets/images";

/**
 * Generic, non-enemy-specific preview context — matches `CalculatorBuildCard.vue`'s
 * own choice, since a build-list preview has no notion of "which enemy."
 */
const PREVIEW_ENEMY_CONFIG: TeamEnemyConfig = { enemyLevel: 90, enemyResist: 0.1, enemyType: "Calamity" };

export function characterImageUrl(characterId: string): string {
  return `${CHARACTER_IMAGE_BASE}/${characterId}.png`;
}

export interface BuildPreviewEchoSet {
  key: string;
  count: number;
  label: string;
  icon: string;
}

export interface BuildPreviewTeammate {
  key: string;
  name: string;
  icon: string;
}

export interface BuildPreviewStats {
  totalHp: number;
  totalDef: number;
  totalAtk: number;
  critRate: number;
  critDMG: number;
  /** Already scaled to percentage points (0-100), unlike `finalStats.energyRegen`'s 0-1 ratio. */
  energyRegen: number;
}

export interface BuildPreview {
  weaponName: string | null;
  weaponIcon: string | null;
  echoSets: BuildPreviewEchoSet[];
  teammates: BuildPreviewTeammate[];
  stats: BuildPreviewStats | null;
  /** Active mode/stance (e.g. Phoebe's Absolution/Confession), null for characters without one. */
  stance: string | null;
}

/**
 * Computes a build's "showcase" preview — weapon, equipped echo set(s),
 * assumed teammates, and headline stats — for the Manage Builds list and
 * the Team Rotations build picker. Stats reflect that build's full
 * effective totals (all enabled conditional self-buffs, team buffs, custom
 * buffs, and resonance chains) using that specific build's own stored
 * toggle state — live data for the active build, stored snapshot data for
 * any other build — so they match what the Results tab would show if that
 * build were active. This is intentionally different from
 * `CalculatorBuildCard.vue`, which stays equipment + permanent-unlocks-only
 * per issue #383; don't "fix" them back into alignment.
 *
 * `buildId` may be the character's active build or any other saved build —
 * `resolveCharactersForBuildPreview` resolves either correctly (the active
 * build's own `builds[]` entry can be stale between switches; this reads
 * its live current data instead in that case).
 */
export async function computeBuildPreview(
  characterId: string,
  buildId: string,
  characters: Record<string, any>,
  inventoryEchoes: any[],
): Promise<BuildPreview> {
  const effectiveCharacters = resolveCharactersForBuildPreview(characters, characterId, buildId);
  const characterData = effectiveCharacters?.[characterId] ?? {};

  const chosenChar = await getCharByName(characterId);
  const weaponType = chosenChar?.basic?.weapon ?? "Swords";
  const stances: string[] = chosenChar?.basic?.stances ?? [];
  const stance =
    stances.length > 1
      ? resolveActiveStance(stances, characterData.activeStance, characterData.buffs)
      : null;
  const weaponKey: string | null = characterData.weapon ?? null;
  let weaponName: string | null = null;
  let weaponIcon: string | null = null;
  if (weaponKey) {
    const chosenWeapon = await getWeaponByName(weaponType, weaponKey);
    weaponName = chosenWeapon?.info?.name ?? null;
    weaponIcon = chosenWeapon?.info?.image ?? null;
  }

  const echoSlots = resolveCharacterEchoes(characterData.echoes, inventoryEchoes);
  const echoSetCounts: Record<string, number> = {};
  for (const echo of echoSlots as Array<{ echoSet?: string }>) {
    const key = echo?.echoSet;
    if (key && key !== "none") {
      echoSetCounts[key] = (echoSetCounts[key] ?? 0) + 1;
    }
  }
  const echoSets: BuildPreviewEchoSet[] = Object.entries(echoSetCounts)
    .filter(([key, count]) => count >= getSetBonusThreshold(key))
    .sort(([, a], [, b]) => b - a)
    .map(([key, count]) => ({
      key,
      count,
      label: getEchoSetLabelByType(key),
      icon: getEchoSetIconByType(key),
    }));

  const teammates: BuildPreviewTeammate[] = [
    characterData.teamBuffs?.selectedCharacter1,
    characterData.teamBuffs?.selectedCharacter2,
  ]
    .filter((key): key is string => Boolean(key))
    .map((key) => ({ key, name: getCharacterRosterDisplayName(key), icon: characterImageUrl(key) }));

  let stats: BuildPreviewStats | null = null;
  try {
    const built = await buildCharacterCalculationContext(
      characterId,
      effectiveCharacters,
      PREVIEW_ENEMY_CONFIG,
      inventoryEchoes,
    );
    stats = {
      totalHp: built.finalStats.totalHp,
      totalDef: built.finalStats.totalDef,
      totalAtk: built.finalStats.totalAtk,
      critRate: built.finalStats.critRate,
      critDMG: built.finalStats.critDMG,
      energyRegen: built.finalStats.energyRegen * 100,
    };
  } catch {
    stats = null;
  }

  return { weaponName, weaponIcon, echoSets, teammates, stats, stance };
}
