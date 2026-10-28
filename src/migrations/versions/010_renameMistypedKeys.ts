import { transformPersistedStores, type Migration } from "../types";

/**
 * Attack / buff / resonance chain / weapon passive keys that shipped with
 * typos or stray spaces. Users' saved data references these keys in many
 * places — rotation and team actions (`key`), per-character `buffs` /
 * `resonanceChains` / `teamBuffs` / `weaponPassives` toggle maps, rotation
 * `advancedConfig` overrides, and the same fields inside `builds[]` — so the
 * walk below renames any exact match wherever it appears.
 */
export const MISTYPED_KEY_RENAMES: Record<string, string> = {
  // Qiuyuan attack
  "Undaunted ayfarerDMG": "UndauntedWayfarerDMG",
  // Roccia intro attack
  PerloHelpDMG: "PeroHelpDMG",
  // Camellya S6
  "S6Blooming orYouThousandsofTimesDeepSlumberEternalFlowerBuff":
    "S6BloomingforYouThousandsofTimesDeepSlumberEternalFlowerBuff",
  // Lumi S6
  "SequenceNode6Giv MeAFivestarRating": "SequenceNode6GiveMeAFivestarRating",
  // Ciaccona S5 (resonance chain + team buff)
  SequenceNode5EternalIdylltoLastinSummer:
    "SequenceNode5EternalIdylltoLastingSummer",
  // Chisa S3
  "SequenceNode3Across the Confusion of the Long Night":
    "SequenceNode3AcrosstheConfusionoftheLongNight",
  // Rover (Aero) S5
  "Sequence Node 5: Life and Death Intertwine":
    "SequenceNode5LifeandDeathIntertwine",
  // Baizhi / Calcharo / Yuanwu inherent skills
  "Inherent Skill: Harmonic Range": "InherentSkillHarmonicRange",
  "InherentSkillBloodshed Awaken": "InherentSkillBloodshedAwaken",
  "InherentSkillThunderous Determination":
    "InherentSkillThunderousDetermination",
  // Guardian Gauntlets passive
  "Guardian GauntletsResonanceLiberationDMGBonus":
    "GuardianGauntletsResonanceLiberationDMGBonus",
  // Bell-Borne Geochelone team buff
  "BellBorne eochelone": "BellBorneGeochelone",
};

const OLD_KEYS = Object.keys(MISTYPED_KEY_RENAMES);

/** Cheap check — avoids parse/walk when none of the old keys are present. */
function needsRename(json: string): boolean {
  return OLD_KEYS.some((key) => json.includes(key));
}

function renameValue(value: unknown): unknown {
  if (typeof value === "string") {
    return MISTYPED_KEY_RENAMES[value] ?? value;
  }
  if (Array.isArray(value)) {
    return value.map(renameValue);
  }
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    for (const key of Object.keys(record)) {
      const nextKey = MISTYPED_KEY_RENAMES[key] ?? key;
      const nextValue = renameValue(record[key]);
      if (nextKey !== key) {
        delete record[key];
        // never clobber an entry already stored under the corrected key
        if (!(nextKey in record)) {
          record[nextKey] = nextValue;
        }
      } else {
        record[key] = nextValue;
      }
    }
  }
  return value;
}

/**
 * Pure JSON-string transform. Also used by the rotation / team import paths,
 * whose payloads are versioned separately from the data-version timeline.
 */
export function renameMistypedKeys(json: string): string {
  if (!needsRename(json)) {
    return json;
  }

  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch {
    return json;
  }

  return JSON.stringify(renameValue(data));
}

const migration: Migration = {
  version: 10,
  description:
    "Rename mistyped attack, buff, resonance chain and weapon passive keys",
  transform: renameMistypedKeys,
  up() {
    transformPersistedStores(renameMistypedKeys);
  },
};

export default migration;
