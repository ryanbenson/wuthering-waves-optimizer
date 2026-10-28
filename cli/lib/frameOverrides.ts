import { OFF_FIELD, type FrameOverrides } from "./frames.js";

/**
 * Hand-picked frame matches for attacks the motion-value matcher can't place
 * (cli/lib/frames.ts). Keyed by character folder, then our attack key; the
 * value is the wuwalab ability name to take frames from, `OFF_FIELD` for a
 * proc that never takes field time of its own, or null to leave the attack
 * without frames on purpose.
 *
 * Add an entry when `import frames` lists an attack as unmatched and you've
 * confirmed on wuwalab which ability it is.
 */
export const frameOverrides: Record<string, FrameOverrides> = {
  // Damage that rides on other actions rather than being cast.
  Aemeath: { SeraphicDuetBonusDMGPerInstance: OFF_FIELD },
  Cantarella: { DiffusionDMG: OFF_FIELD },
  Danjin: { CrimsonErosion1: OFF_FIELD, CrimsonErosion2: OFF_FIELD },
  Hsin: { HeartOfThunderDelayedDMG: OFF_FIELD },
  Mortefi: { SequenceNodeFuneraryQuartet: OFF_FIELD },
  // Same motion values as Basic Attack 2; ours is the heavy follow-up.
  RoverSpectroFemale: { VibrationManifestationHeavyAttackResonanceDMG: "Heavy 2: Resonance" },
  RoverSpectroMale: { VibrationManifestationHeavyAttackResonanceDMG: "Heavy 2: Resonance" },
};
