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
  flatBonus: number
): number {
  const baseDamage = getBaseDamage(talent, attack, flatDamage, flatBonus);
  const damageBonusValue = 1 + damageBonus;
  const critValue = 1 + critRate * critDamage;
  const defModifier = getDefenseModifier(charLevel, enemyLevel, defIgnore);
  const enemyResistValue = 1 - enemyResist;
  return (
    baseDamage * damageBonusValue * critValue * defModifier * enemyResistValue
  );
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
