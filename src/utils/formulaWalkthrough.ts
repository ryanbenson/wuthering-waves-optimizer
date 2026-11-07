import {
  getBonusDamageValue,
  getDefenseModifier,
  getEnemyResistValue,
} from "@wutheringtools/formulas";

export interface SampleHitInput {
  attack: number;
  /** As a fraction: 0.6 is 60%. */
  damageBonus: number;
  enemyResist: number;
}

export interface SampleHitStep {
  label: string;
  /** Display text for what this step multiplies by; empty for the starting value. */
  factor: string;
  /** The running total after this step. */
  total: number;
  /** True for the steps the enemy takes away from. */
  reduces: boolean;
}

// Fixed sample values, so the page explains the formula rather than a real character.
export const SAMPLE_MOTION_VALUE = 2; // 200%
export const SAMPLE_CRIT_DAMAGE = 2.5; // 250%
export const SAMPLE_LEVEL = 90;

const percent = (fraction: number) => `${Number((fraction * 100).toFixed(1))}%`;

/**
 * The Formulas page's walkthrough of one crit, step by step. Defense, resistance and
 * bonus damage come from the same functions as real damage, and a unit test pins the
 * total to calcHitDamage.
 */
export function buildSampleHitSteps({ attack, damageBonus, enemyResist }: SampleHitInput): SampleHitStep[] {
  const bonus = getBonusDamageValue(damageBonus);
  const defense = getDefenseModifier(String(SAMPLE_LEVEL), SAMPLE_LEVEL, 0);
  const resist = getEnemyResistValue(enemyResist, 0);
  const chain: Omit<SampleHitStep, "total">[] = [
    { label: "Total ATK", factor: "", reduces: false },
    { label: "Skill multiplier (MV)", factor: `× ${percent(SAMPLE_MOTION_VALUE)}`, reduces: false },
    { label: "DMG Bonus", factor: `× ${percent(bonus)}`, reduces: false },
    { label: "Crit DMG", factor: `× ${percent(SAMPLE_CRIT_DAMAGE)}`, reduces: false },
    { label: "Enemy defense", factor: `× ${percent(defense)}`, reduces: true },
    { label: "Enemy resistance", factor: `× ${percent(resist)}`, reduces: true },
  ];
  const multipliers = [attack, SAMPLE_MOTION_VALUE, bonus, SAMPLE_CRIT_DAMAGE, defense, resist];
  let total = 1;
  return chain.map((step, index) => {
    total *= multipliers[index];
    return { ...step, total };
  });
}
