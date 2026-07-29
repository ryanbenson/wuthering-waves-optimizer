import type { EchoBuffEffect } from "../echoes/mainEchoBuffs";

type TalentLevels = Record<string, string | number | undefined>;

type MutableEffect = EchoBuffEffect & {
  modifierValueCalculated?: number;
};

function talentModifierValue(
  effect: EchoBuffEffect,
  talentRefRaw: string | number | undefined,
): number | undefined {
  const map = effect.modifierValue as unknown as
    | Record<string, number>
    | undefined;
  if (!map || typeof map !== "object") {
    return undefined;
  }
  const talentRef = String(talentRefRaw ?? "10");
  return map[talentRef];
}

/**
 * Apply enabled main-echo buff effects into a stats object.
 * Mirrors the previous CalculatorEchoes / OptimizerMainEcho logic.
 */
export function applyMainEchoBuffEffects(options: {
  effects: EchoBuffEffect[];
  character: string;
  hasStacks: boolean;
  stacks: number;
  talentData?: TalentLevels;
  stats?: Record<string, unknown>;
}): Record<string, unknown> {
  const data = options.stats ?? {};
  const { effects, character, hasStacks, stacks, talentData = {} } = options;

  if (hasStacks && stacks === 0) {
    return data;
  }

  const stackMultiplier = hasStacks ? stacks : 1;

  for (const rawEffect of effects) {
    const effect = rawEffect as MutableEffect;
    const specificCharacters = effect?.specificCharacters ?? [];
    if (
      specificCharacters.length > 0 &&
      !specificCharacters.includes(character)
    ) {
      continue;
    }

    if (effect?.modifySpecificTalents) {
      if (!data.modifySpecificTalents) {
        data.modifySpecificTalents = [];
      }
      effect.modifierValueCalculated =
        Number(effect.modifierValue) * stackMultiplier;
      (data.modifySpecificTalents as MutableEffect[]).push(effect);

      if (!data.specificTalentBuffs) {
        data.specificTalentBuffs = {};
      }
      const specificTalentBuffs = data.specificTalentBuffs as Record<
        string,
        unknown
      >;
      for (const talent of effect.modifySpecificTalents) {
        let key = `${talent}`;
        if (typeof talent === "object" && (talent as { modifier?: string })?.modifier) {
          key = `${key}:${(talent as { modifier?: string }).modifier}`;
        }
        specificTalentBuffs[key] = effect.modifierValueCalculated;
      }
      continue;
    }

    if (effect.modifier === "Talent") {
      const talentRef =
        talentData?.[effect.modifierValueTalentRef ?? ""] ?? "10";
      const talentVal = talentModifierValue(effect, talentRef);
      if (effect.modifierTalentKey != null && talentVal != null) {
        data[effect.modifierTalentKey] = talentVal * stackMultiplier;
      }
      continue;
    }

    if (effect.modifier === "EnableAttack") {
      data[effect.modifier] = effect.modifierValue;
      continue;
    }

    if (effect.modifier === "talentModifierMultiply") {
      if (!data.talentModifierMultiply) {
        data.talentModifierMultiply = [];
      }
      (data.talentModifierMultiply as EchoBuffEffect[]).push(effect);
      continue;
    }

    if (effect.modifier) {
      const modVal = Number(effect.modifierValue) * stackMultiplier * 100;
      if (data[effect.modifier]) {
        data[effect.modifier] = Number(data[effect.modifier]) + modVal;
      } else {
        data[effect.modifier] = modVal;
      }
    }
  }

  return data;
}
