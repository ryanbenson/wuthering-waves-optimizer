export type BuffConfigSlice = Record<
  string,
  { isEnabled?: boolean; stacks?: number }
>;

export type EffectiveSelfBuffStacksInput = {
  character: string;
  buffKey: string;
  baseMaxStacks?: number;
  baseMinStacks?: number;
  buffsConfig?: BuffConfigSlice;
  resonanceChainsConfig?: BuffConfigSlice;
};

export type EffectiveSelfBuffStacksResult = {
  effectiveMaxStacks: number;
  effectiveMinStacks: number;
  /** Hide stack input and treat stacks as 0 (e.g. Aemeath S3). */
  stacksDisabled: boolean;
};

function chainEnabled(
  resonanceChainsConfig: BuffConfigSlice | undefined,
  chainKey: string,
): boolean {
  return resonanceChainsConfig?.[chainKey]?.isEnabled ?? false;
}

/**
 * Resolves min/max stack limits for a self buff based on enabled resonance chains
 * and other buff config. Mirrors CalculatorCharacterBuff.vue edge cases.
 */
export function getEffectiveSelfBuffStackLimits(
  input: EffectiveSelfBuffStacksInput,
): EffectiveSelfBuffStacksResult {
  const {
    character,
    buffKey,
    baseMaxStacks = 1,
    baseMinStacks = 0,
    resonanceChainsConfig = {},
  } = input;

  let effectiveMaxStacks = baseMaxStacks || 1;
  let effectiveMinStacks = baseMinStacks ?? 0;
  let stacksDisabled = false;

  if (character === "Augusta" && buffKey === "CrownofWills") {
    if (chainEnabled(resonanceChainsConfig, "SequenceNode1StainedinScorchedEarth")) {
      effectiveMaxStacks = 2;
    }
    if (chainEnabled(resonanceChainsConfig, "SequenceNode6EngravedinRadiantLight")) {
      effectiveMaxStacks = 4;
    }
  }

  if (
    character === "Aemeath" &&
    (buffKey === "InherentSkillBetweentheStarsTuneRupture" ||
      buffKey === "InherentSkillBetweentheStarsFusionBurst")
  ) {
    if (
      chainEnabled(
        resonanceChainsConfig,
        "SequenceNode3FervorSightlyBurnsBrightasNew",
      )
    ) {
      effectiveMaxStacks = 0;
      stacksDisabled = true;
    }
  }

  if (
    character === "Aemeath" &&
    (buffKey === "SeraphicDuetTuneRupture" || buffKey === "SeraphicDuetFusionBurst")
  ) {
    if (
      chainEnabled(
        resonanceChainsConfig,
        "SequenceNode6AZephyrKissedJourneytoYou",
      )
    ) {
      effectiveMaxStacks = 60;
    }
  }

  if (character === "Sigrika" && buffKey === "InnateGift") {
    if (
      chainEnabled(resonanceChainsConfig, "SequenceNode3IFleeYetISeek")
    ) {
      effectiveMaxStacks = 4;
    }
  }

  if (character === "Denia" && buffKey === "DarkCore") {
    if (
      chainEnabled(
        resonanceChainsConfig,
        "SequenceNode3ThroughDarkandWindtheErlkingFollows",
      )
    ) {
      effectiveMaxStacks = 5;
    }
  }

  return {
    effectiveMaxStacks,
    effectiveMinStacks,
    stacksDisabled,
  };
}

export function clampSelfBuffStacks(
  input: EffectiveSelfBuffStacksInput,
  stacks: number,
): number {
  const limits = getEffectiveSelfBuffStackLimits(input);
  if (limits.stacksDisabled) {
    return 0;
  }
  return Math.max(
    limits.effectiveMinStacks,
    Math.min(limits.effectiveMaxStacks, stacks),
  );
}

/** Keys whose enabled state can change self-buff stack limits for this character. */
export function getResonanceChainKeysAffectingSelfBuffStacks(
  character: string,
  buffKey: string,
): string[] {
  if (character === "Augusta" && buffKey === "CrownofWills") {
    return [
      "SequenceNode1StainedinScorchedEarth",
      "SequenceNode6EngravedinRadiantLight",
    ];
  }
  if (
    character === "Aemeath" &&
    (buffKey === "InherentSkillBetweentheStarsTuneRupture" ||
      buffKey === "InherentSkillBetweentheStarsFusionBurst" ||
      buffKey === "SeraphicDuetTuneRupture" ||
      buffKey === "SeraphicDuetFusionBurst")
  ) {
    return [
      "SequenceNode3FervorSightlyBurnsBrightasNew",
      "SequenceNode6AZephyrKissedJourneytoYou",
    ];
  }
  if (character === "Sigrika" && buffKey === "InnateGift") {
    return ["SequenceNode3IFleeYetISeek"];
  }
  if (character === "Denia" && buffKey === "DarkCore") {
    return ["SequenceNode3ThroughDarkandWindtheErlkingFollows"];
  }
  return [];
}
