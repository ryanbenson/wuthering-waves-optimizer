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
  attack: number
): number {
  // =((D17*B21))*(1+B25)*(100%+B22*B23)*B29*(1-B30)
  // =((talent*attack)) * (1+damage bonus) * (100%+Crit Rate * Crit Damage) * Def modifier * (1-enemy resist)
  const talentMv = getTalentValue(talent);
  const talentDamageValue = talentMv * attack;
  const damageBonusValue = 1 + damageBonus;
  const critValue = 1 + critRate * critDamage;
  const defModifier = getDefenseModifier(charLevel, enemyLevel);
  const enemyResistValue = 1 - enemyResist;
  return (
    talentDamageValue *
    damageBonusValue *
    critValue *
    defModifier *
    enemyResistValue
  );
}

export function getTalentValue(talentStringWithPercent: string): number {
  // Remove the '%' sign and convert the percentage part to a decimal
  const talentValue = parseFloat(talentStringWithPercent) / 100;
  return talentValue;
}

export function getDefenseModifier(
  charLevl: number,
  enemyLevel: number
): number {
  return (charLevl + 100) / (charLevl + 100 + (enemyLevel + 100));
}
