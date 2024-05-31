export function calcDamage(
  charLevel: number,
  enemyLevel: number,
  enemyResist: number,
  talent: string,
  // critRate: number,
  // critDamage: number,
  // damageBonus: number,
  attack: number,
  defIgnore: number = 0,
  bonusTotalSkillDmg: number = 0,
  bonusSpecificSkillDmg: number = 0,
  bonusElementDmg: number = 0,
  totalDeepenEffect: number = 0,
  resistenceReduction: number = 0
): number {
  // 707 * (.2678 * (1+0+0)) * (1+.1) * (1+0) * 0.5136986301369864 * (1-.1 + 0) => 97 => same as in-game
  // attack * (talent * (1 + bonusTotalSkillDmg + bonusSpecificSkillDmg)) * (1 + bonusElementDmg) * (1 + totalDeepenEffect) * DEFModifier * (1- EnemyResistence + ResistenceReduction)
  const defModifier = getDefenseModifier(charLevel, enemyLevel, defIgnore);
  const talentValue = getTalentValue(talent);
  console.log(defModifier, talentValue);
  console.log(
    `(
      ${attack} *
      (${talentValue} * (1 + ${bonusTotalSkillDmg} * ${bonusSpecificSkillDmg})) *
      (1 + ${bonusElementDmg}) *
      (1 + ${totalDeepenEffect}) *
        ${defModifier} *
      (1 - ${enemyResist} + ${resistenceReduction})
    )
    `
  );
  return (
    attack *
    (talentValue * (1 + bonusTotalSkillDmg * bonusSpecificSkillDmg)) *
    (1 + bonusElementDmg) *
    (1 + totalDeepenEffect) *
    defModifier *
    (1 - enemyResist + resistenceReduction)
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
