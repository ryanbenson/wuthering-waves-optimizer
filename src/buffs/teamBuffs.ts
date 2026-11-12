import { computeDeniaOffTuneBuildupTuneBreakBoost, countStatSteps } from "../calculator/stats";

export type PartyBuffModifier = {
  modifier?: string;
  modifierValue?: unknown;
  modifierByRefinement?: Record<string, number>;
  specificCharacters?: string[];
  modifySpecificTalents?: string[];
  modifierValueTalentRef?: string;
  modifierTalentKey?: string;
  modifierTalentTarget?: "talentModifierMultiplyAdd" | "talentModifierMultiply";
  modifierStep?: number;
  maximumValue?: number;
  /** `inputBase` + `hasStacks` only: caps each stack before multiplying ("up to 7%" per stack). */
  perStackMaximumValue?: number;
  minStatValue?: number;
  modifierValueCalculated?: number;
};

export interface TeamBuffDef {
  key: string;
  alwaysEnabled?: boolean;
  hasStacks?: boolean;
  hasRefinements?: boolean;
  inputBase?: boolean;
  modifierBasedOn?: string | null;
  modifiers: PartyBuffModifier[];
}

export interface TeamBuffConfigEntry {
  isEnabled?: boolean;
  stacks?: number;
  refinement?: string | number;
  baseAttrValue?: number;
}

export interface TeamBuffInstanceResult {
  key: string;
  data: Record<string, unknown>;
}

/**
 * Team buffs that cannot be active together (e.g. one per Resonance Mode).
 * Enabling one in the UI disables its partners; the first key in a group
 * wins in `resolveTeamBuffInstance` if legacy data has both enabled.
 */
export const TEAM_BUFF_EXCLUSIVE_GROUPS: readonly (readonly string[])[] = [
  [
    "OutroSkillHerselfaThousandLanterns",
    "OutroSkillHerselfaThousandLanternsElectroFlare",
  ],
];

export function getExclusiveTeamBuffKeys(key: string): string[] {
  const group = TEAM_BUFF_EXCLUSIVE_GROUPS.find((g) => g.includes(key));
  return group ? group.filter((k) => k !== key) : [];
}

export const ELEMENT_NAMES = ["Glacio", "Fusion", "Electro", "Aero", "Spectro", "Havoc"] as const;
export type ElementName = (typeof ELEMENT_NAMES)[number];

/**
 * Pulls "Requires S6" style copy out of the common
 * "Sequence Node N: <title>" buff-name convention, so the workspace can flag
 * copy-gated buffs without a hand-maintained list.
 */
export function getSequenceNodeRequirement(buffName: string): string | null {
  const match = /^Sequence Node (\d+):/.exec(buffName);
  return match ? `Requires S${match[1]}` : null;
}

/**
 * A short, human-readable label for a *resolved* stat key (as produced by
 * `resolveTeamBuffInstance`/`aggregateTeamBuffStats`) — e.g. "ATK",
 * "Crit DMG", "Heavy Attack DMG Amplify", "Fusion DMG Bonus". Used for the
 * Active Buffs tray's "+20% Crit DMG" readout. An exhaustive flat lookup
 * (not a pattern guess) over every distinct modifier string that exists in
 * `src/buffs/index.ts` today; an unrecognized future key falls back to the
 * raw key itself rather than a wrong-sounding guess.
 */
const MODIFIER_LABELS: Record<string, string> = {
  ATK: "ATK",
  ATK_FLAT: "ATK (Flat)",
  HP: "HP",
  HP_FLAT: "HP (Flat)",
  DEF: "DEF",
  DEF_FLAT: "DEF (Flat)",
  CritRate: "Crit Rate",
  CritDMG: "Crit DMG",
  "CritRate:Echo": "Echo Crit Rate",
  "CritDMG:Echo": "Echo Crit DMG",
  EnergyRegen: "Energy Regen",
  DEFIgnore: "DEF Ignore",
  "DEFIgnore:Havoc": "Havoc DEF Ignore",
  DefReduction: "DEF Reduction",
  DMGBonus: "DMG Bonus",
  DMGDeepen: "DMG Amplify",
  "DMGDeepen:Aero": "Aero DMG Amplify",
  "DMGDeepen:AeroErosion": "Aero DMG Amplify",
  "DMGDeepen:Basic": "Basic Attack DMG Amplify",
  "DMGDeepen:Coordinated": "Coordinated Attack DMG Amplify",
  "DMGDeepen:Echo": "Echo Skill DMG Amplify",
  "DMGDeepen:Electro": "Electro DMG Amplify",
  "DMGDeepen:ElectroFlare": "Electro DMG Amplify",
  "DMGDeepen:Fusion": "Fusion DMG Amplify",
  "DMGDeepen:FusionBurst": "Fusion DMG Amplify",
  "DMGDeepen:Glacio": "Glacio DMG Amplify",
  "DMGDeepen:GlacioChafe": "Glacio DMG Amplify",
  "DMGDeepen:Havoc": "Havoc DMG Amplify",
  "DMGDeepen:Heavy": "Heavy Attack DMG Amplify",
  "DMGDeepen:Liberation": "Resonance Liberation DMG Amplify",
  "DMGDeepen:Skill": "Resonance Skill DMG Amplify",
  "DMGDeepen:SpectroFrazzle": "Spectro DMG Amplify",
  EchoDMGBonus: "Echo Skill DMG Bonus",
  Electro: "Electro DMG Bonus",
  Fusion: "Fusion DMG Bonus",
  Glacio: "Glacio DMG Bonus",
  Aero: "Aero DMG Bonus",
  Spectro: "Spectro DMG Bonus",
  Havoc: "Havoc DMG Bonus",
  AllElementAttributeBonus: "All-Attribute DMG Bonus",
  BasicAttackDMGBonus: "Basic Attack DMG Bonus",
  HeavyAttackDMGBonus: "Heavy Attack DMG Bonus",
  ResonanceSkillDMGBonus: "Resonance Skill DMG Bonus",
  ResonanceLiberationDMGBonus: "Resonance Liberation DMG Bonus",
  "ResistShred:Aero": "Aero RES Shred",
  "ResistShred:Glacio": "Glacio RES Shred",
  "ResistShred:Havoc": "Havoc RES Shred",
  "ResistShred:Spectro": "Spectro RES Shred",
  "ResistIgnore:Fusion": "Fusion RES Ignore",
  specialMultiplier: "Vulnerability",
  tuneBreakBoost: "Tune Break Boost",
};

export function getModifierLabel(modifierKey: string): string {
  return MODIFIER_LABELS[modifierKey] ?? modifierKey;
}

/**
 * Resolves a single team-buff definition + its stored toggle/stack/etc
 * config into a numeric buff stats object. Mirrors CalculatorPartyBuff.vue's
 * `buffStats` computed exactly, including every special case:
 * - The three hardcoded mutex checks (a buff silently no-ops if a
 *   conflicting buff on the same character is enabled).
 * - `PactofNeonlightLeap`'s hardcoded `ATK: 0.15`.
 * - `InherentSkillEtchedColorsOffTuneBuildupRate`'s stack-based tune-break
 *   boost formula.
 * - `hasRefinements`/`modifierByRefinement`, `inputBase`/`baseAttrValue`
 *   stepped formula, `modifier.includes("AdditionalBase")` skip,
 *   `EnableAttack` array-merge, `modifySpecificTalents`, `Talent` modifier
 *   lookup.
 *
 * IMPORTANT: the live UI (CalculatorPartyBuffs.vue) always passes an empty
 * `{}` for `talentData` — a pre-existing, never-wired prop — so any
 * `Talent`-modifier team buff silently always resolves against level "10".
 * Callers that want output identical to the live Calculator page MUST pass
 * `{}` here too, not the buff owner's real talent levels. This is
 * intentionally preserved, not fixed, so a future correction is a
 * deliberate, visible change rather than an accidental drift introduced by
 * this extraction.
 */
/**
 * Value of one `inputBase` modifier for the buffer's entered stat (e.g. 260
 * for 260% Energy Regen), before any maximum is applied. Never negative.
 */
function computeInputBaseValue(
  def: TeamBuffDef,
  modifierItem: PartyBuffModifier,
  baseAttrValue: number,
): number {
  let base = 0;
  switch (def.modifierBasedOn) {
    case "Energy Regen":
      base = modifierItem?.minStatValue ?? 0;
      break;
    case "CritRate":
      base = modifierItem?.minStatValue ?? 0.05;
      break;
    case "CritDMG":
      base = modifierItem?.minStatValue ?? 1.5;
      break;
    default:
      base = modifierItem?.minStatValue ?? 0;
      break;
  }
  const additionalAmount = (baseAttrValue - base) / 100;
  const steps = countStatSteps(additionalAmount, modifierItem.modifierStep as number);
  return Math.max(0, steps * (modifierItem.modifierValue as number));
}

export function resolveTeamBuffInstance(
  def: TeamBuffDef,
  config: TeamBuffConfigEntry | undefined,
  character: string,
  talentData: Record<string, string> | undefined,
  buffsMap: Record<string, { isEnabled?: boolean }> | undefined,
): TeamBuffInstanceResult {
  const isEnabled = def.alwaysEnabled ? true : (config?.isEnabled ?? false);
  const data: Record<string, unknown> = {};
  if (!isEnabled) {
    return { key: def.key, data };
  }

  const uniqueKey = def.key;
  const stacksVal = config?.stacks ?? 0;
  const refinementVal = config?.refinement != null ? String(config.refinement) : "1";
  const baseAttrValueVal = config?.baseAttrValue ?? 0;

  if (
    uniqueKey === "InherentSkillApplauseofVictory" ||
    uniqueKey === "InherentSkillApplauseofVictoryFullFusionTeam"
  ) {
    if (buffsMap?.SequenceNode3WolflameHowlsinHerWake?.isEnabled) {
      return { key: def.key, data };
    }
  }
  if (uniqueKey === "ThunderSpellHeavenEarthMind") {
    if (buffsMap?.SequenceNode6AlmightyForumLordofThunderSpell?.isEnabled) {
      return { key: def.key, data };
    }
  }
  if (uniqueKey === "OutroSkillUnfinishedLiesTuneStrain") {
    if (buffsMap?.OutroSkillUnfinishedLiesTuneStrain2?.isEnabled) {
      return { key: def.key, data };
    }
  }
  for (const group of TEAM_BUFF_EXCLUSIVE_GROUPS) {
    const idx = group.indexOf(uniqueKey);
    if (idx > 0 && group.slice(0, idx).some((k) => buffsMap?.[k]?.isEnabled)) {
      return { key: def.key, data };
    }
  }
  if (uniqueKey === "PactofNeonlightLeap") {
    data["ATK"] = 0.15;
  }
  if (uniqueKey === "S2BreakingThunderSlayingEvil") {
    // Casting Outro Skill grants a flat 10% Crit. DMG on activation, on top
    // of the 6%/Unison Boon stack handled by the generic hasStacks path
    // below.
    data["CritDMG"] = 0.1;
  }
  if (uniqueKey === "InherentSkillEtchedColorsOffTuneBuildupRate") {
    if (stacksVal >= 1) {
      const tuneBreakBoost = computeDeniaOffTuneBuildupTuneBreakBoost(stacksVal);
      if (tuneBreakBoost > 0) {
        data["tuneBreakBoost"] = tuneBreakBoost;
      }
    }
    return { key: def.key, data };
  }

  if (!def.hasStacks) {
    def.modifiers.forEach((modifierItem) => {
      if (modifierItem?.specificCharacters?.length) {
        if (!modifierItem.specificCharacters.includes(character)) {
          return;
        }
      }
      if (modifierItem?.modifySpecificTalents) {
        if (!data.modifySpecificTalents) {
          data.modifySpecificTalents = [];
        }
        let modifierValue: number;
        if (def.hasRefinements && modifierItem.modifierByRefinement) {
          modifierValue = modifierItem.modifierByRefinement[refinementVal];
        } else {
          modifierValue = modifierItem.modifierValue as number;
        }
        modifierItem.modifierValueCalculated = modifierValue;
        (data.modifySpecificTalents as PartyBuffModifier[]).push(modifierItem);
      } else if (modifierItem.modifier === "EnableAttack") {
        const mv = modifierItem.modifierValue as unknown[];
        if (Array.isArray(data[modifierItem.modifier!])) {
          (data[modifierItem.modifier!] as unknown[]).push(...mv);
        } else {
          data[modifierItem.modifier!] = [...mv];
        }
      } else if (modifierItem.modifier === "Talent") {
        const talentRef = talentData?.[modifierItem.modifierValueTalentRef!] ?? "10";
        const modVal = modifierItem.modifierValue as Record<string, number>;
        const talentVal = modVal[talentRef];
        data[modifierItem.modifierTalentKey!] = talentVal;
      } else if (modifierItem.modifier === "talentModifierMultiply") {
        if (!data.talentModifierMultiply) {
          data.talentModifierMultiply = [];
        }
        (data.talentModifierMultiply as PartyBuffModifier[]).push(modifierItem);
      } else if (modifierItem.modifier?.includes("AdditionalBase")) {
        return;
      } else if (def.inputBase === true) {
        let buffValue = computeInputBaseValue(def, modifierItem, baseAttrValueVal);
        if (buffValue > (modifierItem.maximumValue as number)) {
          buffValue = modifierItem.maximumValue as number;
        }
        data[modifierItem.modifier!] = buffValue;
      } else {
        let modifierValue: number;
        if (def.hasRefinements && modifierItem.modifierByRefinement) {
          modifierValue = modifierItem.modifierByRefinement[refinementVal];
        } else {
          modifierValue = modifierItem.modifierValue as number;
        }
        const key = modifierItem.modifier!;
        data[key] = ((data[key] as number) || 0) + modifierValue;
      }
    });
    return { key: def.key, data };
  }

  if (stacksVal === 0) {
    return { key: def.key, data };
  }
  def.modifiers.forEach((modifierItem) => {
    if (modifierItem?.modifySpecificTalents) {
      if (!data.modifySpecificTalents) {
        data.modifySpecificTalents = [];
      }
      let modifierValue: number;
      if (def.hasRefinements && modifierItem.modifierByRefinement) {
        modifierValue = modifierItem.modifierByRefinement[refinementVal];
      } else {
        modifierValue = modifierItem.modifierValue as number;
      }
      modifierItem.modifierValueCalculated = modifierValue * stacksVal;
      (data.modifySpecificTalents as PartyBuffModifier[]).push(modifierItem);
    } else if (modifierItem.modifier === "Talent") {
      const talentRef = talentData?.[modifierItem.modifierValueTalentRef!] ?? "10";
      const modVal = modifierItem.modifierValue as Record<string, number>;
      const talentVal = modVal[talentRef];
      data[modifierItem.modifierTalentKey!] = talentVal * stacksVal;
    } else if (def.inputBase === true) {
      // e.g. Lily's Dream Aroma: each stack scales off her entered Energy Regen
      // and caps on its own ("up to 7%") before the stacks are added up
      let perStackValue = computeInputBaseValue(def, modifierItem, baseAttrValueVal);
      if (
        modifierItem.perStackMaximumValue !== undefined &&
        perStackValue > modifierItem.perStackMaximumValue
      ) {
        perStackValue = modifierItem.perStackMaximumValue;
      }
      let totalValue = perStackValue * stacksVal;
      if (modifierItem.maximumValue !== undefined && totalValue > modifierItem.maximumValue) {
        totalValue = modifierItem.maximumValue;
      }
      const key = modifierItem.modifier!;
      data[key] = ((data[key] as number) || 0) + totalValue;
    } else {
      let modifierValue: number;
      if (def.hasRefinements && modifierItem.modifierByRefinement) {
        modifierValue = modifierItem.modifierByRefinement[refinementVal];
      } else {
        modifierValue = modifierItem.modifierValue as number;
      }
      const totalValue = modifierValue * stacksVal;
      const key = modifierItem.modifier!;
      data[key] = ((data[key] as number) || 0) + totalValue;
    }
  });
  return { key: def.key, data };
}

/**
 * Aggregates already-resolved team-buff instances into the final
 * `teamBuffsData` object consumed by calculateAllStats. Mirrors
 * CalculatorPartyBuffs.vue's `buffsFormatted` computed exactly.
 */
export function aggregateTeamBuffStats(
  resolvedBuffs: TeamBuffInstanceResult[],
): Record<string, unknown> {
  const finalBuffData: Record<string, unknown> = {};
  let modifySpecificTalents: PartyBuffModifier[] = [];
  resolvedBuffs.forEach((buffInstance) => {
    Object.entries(buffInstance.data).forEach(([stat, value]) => {
      if (stat === "modifySpecificTalents") {
        modifySpecificTalents = modifySpecificTalents.concat(value as PartyBuffModifier[]);
      } else if (stat === "EnableAttack") {
        finalBuffData[stat] = value;
      } else {
        finalBuffData[stat] = ((finalBuffData[stat] as number) || 0) + (value as number);
      }
    });
  });
  if (modifySpecificTalents.length > 0) {
    const specificTalentBuffs: Record<string, number> = {};
    modifySpecificTalents.forEach((buffInstance) => {
      const talentKeys = buffInstance?.modifySpecificTalents ?? [];
      talentKeys.forEach((talent) => {
        let talentName = talent;
        if (buffInstance?.modifier) {
          talentName = `${talentName}:${buffInstance.modifier}`;
        }
        specificTalentBuffs[talentName] =
          (specificTalentBuffs[talentName] || 0) + (buffInstance.modifierValueCalculated ?? 0);
      });
    });
    finalBuffData.specificTalentBuffs = specificTalentBuffs;
  }
  return finalBuffData;
}
