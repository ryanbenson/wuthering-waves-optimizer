/**
  // 707 * (.2678 * (1+0+0)) * (1+.1) * (1+0) * 0.5136986301369864 * (1-.1 + 0) => 97 => same as in-game
  // attack * (talent * (1 + bonusTotalSkillDmg + bonusSpecificSkillDmg)) * (1 + bonusElementDmg) * (1 + totalDeepenEffect) * DEFModifier * (1- EnemyResistence + ResistenceReduction)
 * @param charLevel 
 * @param enemyLevel 
 * @param enemyResist 
 * @param talent 
 * @param attack 
 * @param defIgnore 
 * @param bonusTotalSkillDmg 
 * @param bonusSpecificSkillDmg 
 * @param bonusElementDmg 
 * @param totalDeepenEffect 
 * @param resistenceReduction 
 * @returns 
 */
export function calcDamage(
  charLevel: number,
  enemyLevel: number,
  enemyResist: number,
  talent: string,
  attack: number,
  defIgnore: number = 0,
  bonusTotalSkillDmg: number = 0,
  bonusSpecificSkillDmg: number = 0,
  bonusElementDmg: number = 0,
  totalDeepenEffect: number = 0,
  resistenceReduction: number = 0
  // critRate: number,
  // critDamage: number,
): number {
  const talentValue = getTalentValue(talent);
  const baseDamageValue = getBaseDamageValue(
    talentValue,
    bonusTotalSkillDmg,
    bonusSpecificSkillDmg
  );
  const bonusDamageValue = getBonusDamageValue(
    bonusElementDmg,
    totalDeepenEffect
  );
  const defModifier = getDefenseModifier(charLevel, enemyLevel, defIgnore);
  const resistValue = getEnemyResistValue(enemyResist, resistenceReduction);
  const baseDamage = getBaseDamage(
    attack,
    baseDamageValue,
    bonusDamageValue,
    defModifier,
    resistValue
  );
  return baseDamage;
}

export function getBaseDamage(
  attack: number,
  baseDamageValue: number,
  bonusDamageValue: number,
  defModifier: number,
  resistValue: number
): number {
  return (
    attack * baseDamageValue * bonusDamageValue * defModifier * resistValue
  );
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

export function getBaseDamageValue(
  talentValue: number,
  bonusTotalSkillDmg: number,
  bonusSpecificSkillDmg: number
): number {
  return talentValue * (1 + bonusTotalSkillDmg * bonusSpecificSkillDmg);
}

export function getBonusDamageValue(
  bonusElementDmg: number,
  totalDeepenEffect: number
): number {
  return (1 + bonusElementDmg) * (1 + totalDeepenEffect);
}

export function getEnemyResistValue(
  enemyResist: number,
  resistenceReduction: number
): number {
  return 1 - enemyResist + resistenceReduction;
}
