interface ResonanceChainEntry {
  isEnabled?: boolean;
}

interface ResonanceChains {
  SequenceNode1StainedinScorchedEarth?: ResonanceChainEntry;
  SequenceNode6EngravedinRadiantLight?: ResonanceChainEntry;
  SequenceNode3FervorSightlyBurnsBrightasNew?: ResonanceChainEntry;
  SequenceNode6AZephyrKissedJourneytoYou?: ResonanceChainEntry;
  SequenceNode3IFleeYetISeek?: ResonanceChainEntry;
  SequenceNode3ThroughDarkandWindtheErlkingFollows?: ResonanceChainEntry;
}

export function getEffectiveMaxStacks(
  character: string,
  uniqueKey: string,
  maxStacks: number | undefined,
  resonanceChains: ResonanceChains | undefined,
): number {
  let effectiveMaxStacks = maxStacks || 1;

  if (character === "Augusta" && uniqueKey === "CrownofWills") {
    if (resonanceChains?.SequenceNode1StainedinScorchedEarth?.isEnabled) {
      effectiveMaxStacks = 2;
    }

    if (resonanceChains?.SequenceNode6EngravedinRadiantLight?.isEnabled) {
      effectiveMaxStacks = 4;
    }
  }

  if (
    character === "Aemeath" &&
    (uniqueKey === "InherentSkillBetweentheStarsTuneRupture" ||
      uniqueKey === "InherentSkillBetweentheStarsFusionBurst")
  ) {
    if (resonanceChains?.SequenceNode3FervorSightlyBurnsBrightasNew?.isEnabled) {
      effectiveMaxStacks = 0;
    }
  }

  if (
    character === "Aemeath" &&
    (uniqueKey === "SeraphicDuetTuneRupture" ||
      uniqueKey === "SeraphicDuetFusionBurst")
  ) {
    if (resonanceChains?.SequenceNode6AZephyrKissedJourneytoYou?.isEnabled) {
      effectiveMaxStacks = 60;
    }
  }

  if (character === "Sigrika" && uniqueKey === "InnateGift") {
    if (resonanceChains?.SequenceNode3IFleeYetISeek?.isEnabled) {
      effectiveMaxStacks = 4;
    }
  }

  if (character === "Denia" && uniqueKey === "DarkCore") {
    if (
      resonanceChains?.SequenceNode3ThroughDarkandWindtheErlkingFollows?.isEnabled
    ) {
      effectiveMaxStacks = 5;
    }
  }

  return effectiveMaxStacks;
}
