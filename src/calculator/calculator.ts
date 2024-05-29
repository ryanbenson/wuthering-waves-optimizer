import { def } from "@vue/shared";

/**
 * Functionally working:
 * let dmg2 = calcDamage(
40,
26,
.1,
"23.00%",
.05,
1.5,
0,
345.648
);
console.log(dmg2); => 40.48 -> matches Excel
 * @param charLevel 
 * @param enemyLevel 
 * @param enemyResist 
 * @param talent 
 * @param critRate 
 * @param critDamage 
 * @param damageBonus 
 * @param attack 
 * @returns 
 */
export function calcDamage(
  charLevel: number,
  enemyLevel: number,
  enemyResist: number,
  talent: string,
  critRate: number,
  critDamage: number,
  damageBonus: number,
  attack: number,
  defIgnore: number,
  flatDamage: number,
  flatBonus: number,
  resistPen: number,
  damageReductionBase: number,
  damageReductionAdditional: number
): number {
  const baseDamage = getBaseDamage(talent, attack, flatDamage, flatBonus);
  const damageBonusValue = 1 + damageBonus;
  const critValue = 1 + critRate * critDamage;
  const defModifier = getDefenseModifier(charLevel, enemyLevel, defIgnore);
  const enemyResistValue = getEnemyResistValue(
    enemyResist,
    resistPen,
    defModifier,
    damageReductionBase,
    damageReductionAdditional
  );
  return baseDamage * damageBonusValue * critValue * enemyResistValue;
}

export function getBaseDamage(
  talent: string,
  attack: number,
  flatDamage: number,
  flatBonus: number
): number {
  const talentMv = getTalentValue(talent);
  const talentDamageValue = talentMv * attack;
  return talentDamageValue + flatDamage + flatBonus;
}

export function getTalentValue(talentStringWithPercent: string): number {
  // Remove the '%' sign and convert the percentage part to a decimal
  const talentValue = parseFloat(talentStringWithPercent) / 100;
  return talentValue;
}

export function getDefenseModifier(
  charLevl: number,
  enemyLevel: number,
  defIgnore: number
): number {
  const enemyDef = getEnemyDefense(enemyLevel);
  return (
    (800 + 8 * charLevl) / (800 + 8 * charLevl + enemyDef * (1 - defIgnore))
  );
}

export function getEnemyDefense(enemyLevel: number): number {
  return 8 * enemyLevel + 792;
}

export function getEnemyResistValue(
  baseEnemyResist: number,
  resistPen: number,
  defModifier: number,
  damageReductionBase: number,
  damageReductionAdditional: number
): number {
  const resistTotal = baseEnemyResist - resistPen;
  const elementalResist = getElementalResist(resistTotal);
  const damageReduction = getDamageReduction(
    damageReductionBase,
    damageReductionAdditional
  );
  return resistTotal * elementalResist * defModifier * damageReduction;
}

export function getElementalResist(resistTotal: number): number {
  if (resistTotal < 0) {
    return 1 - resistTotal / 2;
  }
  if (resistTotal > 0.8) {
    return 1 / (1 + 5 * resistTotal);
  }
  return resistTotal / 2;
}

export function getDamageReduction(
  damageReductionBase: number,
  damageReductionAdditional: number
): number {
  return 1 - (damageReductionBase + damageReductionAdditional);
}
