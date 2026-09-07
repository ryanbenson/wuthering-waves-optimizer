interface ResonanceChainEntry {
  isEnabled?: boolean;
}

interface SelfBuffEntry {
  isEnabled?: boolean;
}

interface SelfBuffs {
  InherentSkillGleaningSimpleJoysUnison?: SelfBuffEntry;
}

interface ResonanceChains {
  SequenceNode1StainedinScorchedEarth?: ResonanceChainEntry;
  SequenceNode6EngravedinRadiantLight?: ResonanceChainEntry;
  SequenceNode3FervorSightlyBurnsBrightasNew?: ResonanceChainEntry;
  SequenceNode6AZephyrKissedJourneytoYou?: ResonanceChainEntry;
  SequenceNode3IFleeYetISeek?: ResonanceChainEntry;
  SequenceNode3ThroughDarkandWindtheErlkingFollows?: ResonanceChainEntry;
  SequenceNode3DreamsFadeSwordAbides?: ResonanceChainEntry;
  SequenceNode2LikePetalsThatFallWithoutASound?: ResonanceChainEntry;
  SequenceNode6TheMoonOwesItsLightToTheLiving?: ResonanceChainEntry;
  SequenceNode6NineShadowsAtHerSide?: ResonanceChainEntry;
}

export function getEffectiveMaxStacks(
  character: string,
  uniqueKey: string,
  maxStacks: number | undefined,
  resonanceChains: ResonanceChains | undefined,
  selfBuffs: SelfBuffs | undefined = undefined,
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

  if (character === "Qingxiao" && uniqueKey === "Mindlock") {
    if (resonanceChains?.SequenceNode2LikePetalsThatFallWithoutASound?.isEnabled) {
      effectiveMaxStacks = 25;
    }
  }

  if (character === "Hsin" && uniqueKey === "UnisonBoon") {
    // Inherent Skill: Gleaning Simple Joys and Sequence Node 6 each
    // independently grant +1 max Unison Boon stacks; both stack additively.
    if (selfBuffs?.InherentSkillGleaningSimpleJoysUnison?.isEnabled) {
      effectiveMaxStacks += 1;
    }
    if (resonanceChains?.SequenceNode6TheMoonOwesItsLightToTheLiving?.isEnabled) {
      effectiveMaxStacks += 1;
    }
  }

  if (character === "Suoming" && uniqueKey === "UnisonBoon") {
    // Sequence Node 6: Nine Shadows at Her Side raises the max stacks of
    // Unison Boon from 2 to 4 (the per-stack value increase is handled in
    // stats.ts's computeSelfBuffs).
    if (resonanceChains?.SequenceNode6NineShadowsAtHerSide?.isEnabled) {
      effectiveMaxStacks = 4;
    }
  }

  return effectiveMaxStacks;
}
