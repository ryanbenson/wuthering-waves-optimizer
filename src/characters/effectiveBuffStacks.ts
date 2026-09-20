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

/**
 * Team buffs (from a teammate's kit) that each raise the max stacks of the
 * receiving Resonator's Unison Boon by 1. Applies to every character that has
 * a `UnisonBoon` buff (Hsin, Suoming, future Unison Resonators).
 */
const UNISON_BOON_TEAM_MAX_STACK_BUFFS = [
  "InherentSkillGleaningSimpleJoysUnison",
  "SequenceNode6TheMoonOwesItsLightToTheLiving",
] as const;

export function getEffectiveMaxStacks(
  character: string,
  uniqueKey: string,
  maxStacks: number | undefined,
  resonanceChains: ResonanceChains | undefined,
  selfBuffs: SelfBuffs | undefined = undefined,
  teamBuffs: Record<string, SelfBuffEntry | undefined> | undefined = undefined,
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

  if (uniqueKey === "UnisonBoon") {
    // Teammate-granted +1 max stacks. Hsin's own copies of these effects are
    // handled through selfBuffs/resonanceChains above, so she is excluded to
    // avoid counting the same effect twice.
    if (character !== "Hsin") {
      for (const teamKey of UNISON_BOON_TEAM_MAX_STACK_BUFFS) {
        if (teamBuffs?.[teamKey]?.isEnabled) {
          effectiveMaxStacks += 1;
        }
      }
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
