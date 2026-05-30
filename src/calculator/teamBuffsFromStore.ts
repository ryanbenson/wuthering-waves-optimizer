import {
  buffsByCharacter,
  allEchoBuffs,
  allWeaponTeamBuffs,
} from "../buffs/index.ts";
import { computeDeniaOffTuneBuildupTuneBreakBoost } from "./stats";
import type { TeamBuffsState } from "./rotationPerformer";

type BuffConfigEntry = {
  isEnabled?: boolean;
  stacks?: number;
  refinement?: string | number;
  baseAttrValue?: number;
};

type PartyModifier = {
  modifier?: string;
  modifierValue?: unknown;
  modifierByRefinement?: Record<string, number>;
  specificCharacters?: string[];
  modifySpecificTalents?: string[];
  modifierValueTalentRef?: string;
  modifierTalentKey?: string;
  modifierTalentTarget?: string;
  modifierStep?: number;
  maximumValue?: number;
  minStatValue?: number;
  modifierValueCalculated?: number;
};

type PartyBuffDef = {
  key: string;
  alwaysEnabled?: boolean;
  hasStacks?: boolean;
  minStacks?: number;
  maxStacks?: number;
  modifiers?: PartyModifier[];
  inputBase?: boolean;
  modifierBasedOn?: string | null;
  hasRefinements?: boolean;
};

function mergePartyBuffParts(
  parts: Array<Record<string, unknown>>,
): Record<string, unknown> {
  const finalBuffData: Record<string, unknown> = {};
  let modifySpecificTalents: PartyModifier[] = [];
  parts.forEach((buffInstance) => {
    Object.entries(buffInstance).forEach(([stat, value]) => {
      if (stat === "modifySpecificTalents") {
        modifySpecificTalents = modifySpecificTalents.concat(
          value as PartyModifier[],
        );
      } else if (stat === "EnableAttack") {
        finalBuffData[stat] = value;
      } else {
        finalBuffData[stat] =
          ((finalBuffData[stat] as number) || 0) + (value as number);
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
          (specificTalentBuffs[talentName] || 0) +
          (buffInstance.modifierValueCalculated ?? 0);
      });
    });
    finalBuffData.specificTalentBuffs = specificTalentBuffs;
  }
  return finalBuffData;
}

/** Mirrors CalculatorPartyBuff buffStats for a single party buff definition. */
export function computePartyBuffDataFromStore(
  buffDef: PartyBuffDef,
  buffState: BuffConfigEntry | undefined,
  recipientCharacterKey: string,
  talentData: Record<string, string | number>,
  allBuffsConfig: Record<string, BuffConfigEntry>,
): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  const isEnabled = buffDef.alwaysEnabled || buffState?.isEnabled;
  if (!isEnabled) {
    return data;
  }

  if (
    buffDef.key === "InherentSkillApplauseofVictory" ||
    buffDef.key === "InherentSkillApplauseofVictoryFullFusionTeam"
  ) {
    if (allBuffsConfig?.SequenceNode3WolflameHowlsinHerWake?.isEnabled) {
      return data;
    }
  }
  if (buffDef.key === "ThunderSpellHeavenEarthMind") {
    if (allBuffsConfig?.SequenceNode6AlmightyForumLordofThunderSpell?.isEnabled) {
      return data;
    }
  }
  if (buffDef.key === "OutroSkillUnfinishedLiesTuneStrain") {
    if (allBuffsConfig?.OutroSkillUnfinishedLiesTuneStrain2?.isEnabled) {
      return data;
    }
  }
  if (buffDef.key === "PactofNeonlightLeap") {
    data["ATK"] = 0.15;
  }
  if (buffDef.key === "InherentSkillEtchedColorsOffTuneBuildupRate") {
    const stacks = buffState?.stacks ?? 0;
    if (stacks >= 1) {
      const tuneBreakBoost = computeDeniaOffTuneBuildupTuneBreakBoost(stacks);
      if (tuneBreakBoost > 0) {
        data["tuneBreakBoost"] = tuneBreakBoost;
      }
    }
    return data;
  }

  const modifiers = buffDef.modifiers ?? [];
  const refinement = String(buffState?.refinement ?? "1");
  const stacks = buffState?.stacks ?? 0;
  const baseAttrValue = buffState?.baseAttrValue ?? 0;

  if (!buffDef.hasStacks) {
    modifiers.forEach((modifierItem) => {
      if (modifierItem?.specificCharacters?.length) {
        if (!modifierItem.specificCharacters.includes(recipientCharacterKey)) {
          return;
        }
      }
      if (modifierItem?.modifySpecificTalents) {
        if (!data.modifySpecificTalents) {
          data.modifySpecificTalents = [];
        }
        let modifierValue: number;
        if (buffDef.hasRefinements && modifierItem.modifierByRefinement) {
          modifierValue =
            modifierItem.modifierByRefinement[refinement] ?? 0;
        } else {
          modifierValue = modifierItem.modifierValue as number;
        }
        modifierItem.modifierValueCalculated = modifierValue;
        (data.modifySpecificTalents as PartyModifier[]).push(modifierItem);
      } else if (modifierItem.modifier === "EnableAttack") {
        const mv = modifierItem.modifierValue as unknown[];
        if (Array.isArray(data[modifierItem.modifier!])) {
          (data[modifierItem.modifier!] as unknown[]).push(...mv);
        } else {
          data[modifierItem.modifier!] = [...mv];
        }
      } else if (modifierItem.modifier === "Talent") {
        const talentRef =
          talentData?.[String(modifierItem.modifierValueTalentRef ?? "")] ?? "10";
        const modVal = modifierItem.modifierValue as Record<string, number>;
        const talentVal = modVal[String(talentRef)];
        data[String(modifierItem.modifierTalentKey)] = talentVal;
      } else if (modifierItem.modifier === "talentModifierMultiply") {
        if (!data.talentModifierMultiply) {
          data.talentModifierMultiply = [];
        }
        (data.talentModifierMultiply as PartyModifier[]).push(modifierItem);
      } else if (buffDef.inputBase === true) {
        let base = modifierItem?.minStatValue ?? 0;
        switch (buffDef.modifierBasedOn) {
          case "CritRate":
            base = modifierItem?.minStatValue ?? 0.05;
            break;
          case "CritDMG":
            base = modifierItem?.minStatValue ?? 1.5;
            break;
          default:
            break;
        }
        const currentAmount = baseAttrValue ?? 0;
        const additionalAmount = (currentAmount - base) / 100;
        const steps = Math.floor(
          additionalAmount / (modifierItem.modifierStep as number),
        );
        let buffValue = steps * (modifierItem.modifierValue as number);
        if (buffValue > (modifierItem.maximumValue as number)) {
          buffValue = modifierItem.maximumValue as number;
        }
        if (buffValue < 0) {
          buffValue = 0;
        }
        data[String(modifierItem.modifier)] = buffValue;
      } else {
        let modifierValue: number;
        if (buffDef.hasRefinements && modifierItem.modifierByRefinement) {
          modifierValue =
            modifierItem.modifierByRefinement[refinement] ?? 0;
        } else {
          modifierValue = modifierItem.modifierValue as number;
        }
        const key = String(modifierItem.modifier);
        data[key] = ((data[key] as number) || 0) + modifierValue;
      }
    });
    return data;
  }

  if (stacks === 0) {
    return data;
  }
  modifiers.forEach((modifierItem) => {
    if (modifierItem?.modifySpecificTalents) {
      if (!data.modifySpecificTalents) {
        data.modifySpecificTalents = [];
      }
      let modifierValue: number;
      if (buffDef.hasRefinements && modifierItem.modifierByRefinement) {
        modifierValue = modifierItem.modifierByRefinement[refinement] ?? 0;
      } else {
        modifierValue = modifierItem.modifierValue as number;
      }
      modifierItem.modifierValueCalculated = modifierValue * stacks;
      (data.modifySpecificTalents as PartyModifier[]).push(modifierItem);
    } else if (modifierItem.modifier === "Talent") {
      const talentRef =
        talentData?.[String(modifierItem.modifierValueTalentRef ?? "")] ?? "10";
      const modVal = modifierItem.modifierValue as Record<string, number>;
      const talentVal = modVal[String(talentRef)];
      data[String(modifierItem.modifierTalentKey)] = talentVal * stacks;
    } else {
      let modifierValue: number;
      if (buffDef.hasRefinements && modifierItem.modifierByRefinement) {
        modifierValue = modifierItem.modifierByRefinement[refinement] ?? 0;
      } else {
        modifierValue = modifierItem.modifierValue as number;
      }
      const totalValue = modifierValue * stacks;
      const key = String(modifierItem.modifier);
      data[key] = ((data[key] as number) || 0) + totalValue;
    }
  });
  return data;
}

/**
 * Builds team buff totals for a character from their saved party tab configuration
 * (teammate buffs, echo buffs, weapon buffs), matching CalculatorPartyBuffs output.
 */
export function computeTeamBuffsDataFromStore(
  recipientCharacterKey: string,
  charactersStore: Record<string, Record<string, unknown>>,
): Record<string, unknown> {
  const charStore = charactersStore[recipientCharacterKey] ?? {};
  const teamBuffsState = (charStore.teamBuffs ?? {}) as TeamBuffsState & {
    buffs?: Record<string, BuffConfigEntry>;
  };
  const buffsConfig = teamBuffsState.buffs ?? {};
  const storeTalents = (charStore.talents ?? {}) as Record<string, string | number>;
  const talentData: Record<string, string | number> = {
    basic: storeTalents.basic ?? "10",
    skill: storeTalents.skill ?? "10",
    forte: storeTalents.forte ?? "10",
    liberation: storeTalents.liberation ?? "10",
    intro: storeTalents.intro ?? "10",
  };

  const parts: Record<string, unknown>[] = [];
  const teammateBuffMap = buffsByCharacter as Record<string, PartyBuffDef[]>;

  const appendTeammateBuffs = (teammateKey: string | null | undefined) => {
    if (!teammateKey) {
      return;
    }
    const defs = teammateBuffMap[teammateKey] ?? [];
    defs.forEach((def) => {
      parts.push(
        computePartyBuffDataFromStore(
          def,
          buffsConfig[def.key],
          recipientCharacterKey,
          talentData,
          buffsConfig,
        ),
      );
    });
  };

  appendTeammateBuffs(teamBuffsState.selectedCharacter1);
  appendTeammateBuffs(teamBuffsState.selectedCharacter2);

  (allEchoBuffs as PartyBuffDef[]).forEach((def) => {
    parts.push(
      computePartyBuffDataFromStore(
        def,
        buffsConfig[def.key],
        recipientCharacterKey,
        talentData,
        buffsConfig,
      ),
    );
  });

  (allWeaponTeamBuffs as PartyBuffDef[]).forEach((def) => {
    parts.push(
      computePartyBuffDataFromStore(
        { ...def, hasRefinements: true },
        buffsConfig[def.key],
        recipientCharacterKey,
        talentData,
        buffsConfig,
      ),
    );
  });

  return mergePartyBuffParts(parts);
}
