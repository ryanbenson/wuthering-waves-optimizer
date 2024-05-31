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
  damageReductionAdditional: number,
  damageAmplifyTarget: number,
  damageAmplifyAttaker: number,
  specialDamageBase: number,
  specialDamageBonus: number
): number {
  const baseDamageValue = getBaseDamage(talent, attack, flatDamage, flatBonus);
  console.log("base damage", baseDamageValue);
  // const critValue = 1 + critRate * critDamage;
  const defModifier = getDefenseModifier(charLevel, enemyLevel, defIgnore);
  console.log("def modifier", defModifier);
  const damageBonusValue = getDamageBonusModifer(
    damageBonus,
    damageAmplifyTarget,
    damageAmplifyAttaker,
    specialDamageBase,
    specialDamageBonus
  );
  console.log("damage bonus value", damageBonusValue);
  const enemyResistValue = getEnemyResistValue(
    enemyResist,
    resistPen,
    defModifier,
    damageReductionBase,
    damageReductionAdditional
  );
  console.log("enemy resist value", enemyResistValue);
  // doesn't use crit damage and crit rate yet
  // return baseDamage * damageBonus * critValue * enemyResistValue;
  return baseDamageValue * enemyResistValue * damageBonusValue;
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
  baseEnemyResist: number = 0,
  resistPen: number = 0,
  defModifier: number = 0,
  damageReductionBase: number = 0,
  damageReductionAdditional: number = 0
): number {
  console.log(
    baseEnemyResist,
    resistPen,
    defModifier,
    damageReductionBase,
    damageReductionAdditional
  );
  const resistTotal = baseEnemyResist - resistPen;
  const elementalResist = getElementalResist(resistTotal);
  const damageReduction = getDamageReduction(
    damageReductionBase,
    damageReductionAdditional
  );
  console.log(resistTotal, elementalResist, defModifier, damageReduction);
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

export function getDamageBonusModifer(
  damageBonus: number = 0,
  damageAmplifyTarget: number = 0,
  damageAmplifyAttaker: number = 0,
  specialDamageBase: number = 0,
  specialDamageBonus: number = 0
): number {
  const damageBonusValue = 1 + damageBonus;
  const damageAmplifyValue = 1 + (damageAmplifyTarget + damageAmplifyAttaker);
  const specialDamageValue = 1 + (specialDamageBase + specialDamageBonus);
  return damageBonusValue * damageAmplifyValue * specialDamageValue;
}
