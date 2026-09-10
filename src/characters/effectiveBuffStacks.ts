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
  SequenceNode3DreamsFadeSwordAbides?: ResonanceChainEntry;
  SequenceNode2LikePetalsThatFallWithoutASound?: ResonanceChainEntry;
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

  if (character === "Qingxiao" && uniqueKey === "Mindlock") {
    if (resonanceChains?.SequenceNode2LikePetalsThatFallWithoutASound?.isEnabled) {
      effectiveMaxStacks = 25;
    }
  }

  return effectiveMaxStacks;
}

/**
 * Some buffs have a hard cap (`maxStacks`) that is technically real but not
 * realistically reachable in a normal rotation/team (see issue #514) — e.g. a
 * buff whose in-game text caps it at 150 stacks that no feasible combo
 * actually generates. `realisticMaxStacks` is an optional, hand-verified
 * value authors can set per buff for that case; it must never exceed the
 * hard cap it's describing, so it's clamped here rather than trusted as-is.
 */
export function getRealisticMaxStacks(
  effectiveMaxStacks: number,
  realisticMaxStacks: number | undefined,
): number {
  if (realisticMaxStacks === undefined) {
    return effectiveMaxStacks;
  }

  return Math.min(realisticMaxStacks, effectiveMaxStacks);
}
