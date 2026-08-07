import { computeDeniaOffTuneBuildupTuneBreakBoost } from "../calculator/stats";

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
  if (uniqueKey === "PactofNeonlightLeap") {
    data["ATK"] = 0.15;
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
        const currentAmount = baseAttrValueVal;
        const additionalAmount = (currentAmount - base) / 100;
        const steps = Math.floor(additionalAmount / (modifierItem.modifierStep as number));
        let buffValue = steps * (modifierItem.modifierValue as number);
        if (buffValue > (modifierItem.maximumValue as number)) {
          buffValue = modifierItem.maximumValue as number;
        }
        if (buffValue < 0) {
          buffValue = 0;
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
