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
export function calcHitDamage(
  charLevel: number,
  enemyLevel: number,
  enemyResist: number,
  talent: number,
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
  const baseDamageValue = getBonusDamageValue(
    bonusTotalSkillDmg,
    bonusSpecificSkillDmg,
    bonusElementDmg,
    totalDeepenEffect
  );
  const defModifier = getDefenseModifier(charLevel, enemyLevel, defIgnore);
  const resistValue = getEnemyResistValue(enemyResist, resistenceReduction);
  const baseDamage = getBaseDamage(
    talent,
    attack,
    baseDamageValue,
    defModifier,
    resistValue
  );
  return baseDamage;
}

export function getBaseDamage(
  talent: number,
  attack: number,
  baseDamageValue: number,
  defModifier: number,
  resistValue: number
): number {
  return attack * talent * baseDamageValue * defModifier * resistValue;
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

export function getBonusDamageValue(
  bonusTotalSkillDmg: number = 0,
  bonusSpecificSkillDmg: number = 0,
  bonusElementDmg: number = 0,
  totalDeepenEffect: number = 0
): number {
  return (
    (1 + bonusTotalSkillDmg + bonusSpecificSkillDmg + bonusElementDmg) *
    (1 + totalDeepenEffect)
  );
}

export function getEnemyResistValue(
  enemyResist: number,
  resistenceReduction: number
): number {
  return 1 - enemyResist + resistenceReduction;
}

interface InstanceDamage {
  [instanceDamage: string]: number;
}
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
  resistenceReduction: number = 0,
  critRate: number = 0,
  critDamage: number = 0,
  talentModifierAdd: number = 0
) {
  // Parse the talent string to get individual percentage values
  let talents = parseTalentString(talent);

  // Calculate the base damage for each talent value
  let totalTalentValue = 0;

  // Calculate individual instance damages
  let instanceDamage: InstanceDamage = {};
  talents.forEach((t) => {
    totalTalentValue += t;
    // add the modifier to the total talent value which is used in the normal/avg/crit calcs
    if (talentModifierAdd) {
      totalTalentValue += talentModifierAdd;
    }
    let percentageString = (t * 100).toFixed(2).toString() + "%";
    if (!instanceDamage[percentageString]) {
      let hitTalentValue = t;
      // add any talent modifiers to the instance damage which is used in the tooltips
      if (talentModifierAdd) {
        hitTalentValue += talentModifierAdd;
      }
      instanceDamage[percentageString] = calcHitDamage(
        charLevel,
        enemyLevel,
        enemyResist,
        hitTalentValue,
        attack,
        defIgnore,
        bonusTotalSkillDmg,
        bonusSpecificSkillDmg,
        bonusElementDmg,
        totalDeepenEffect,
        resistenceReduction
      );
    }
  });

  // Apply defense shred and any other multipliers
  let finalDamage = calcHitDamage(
    charLevel,
    enemyLevel,
    enemyResist,
    totalTalentValue,
    attack,
    defIgnore,
    bonusTotalSkillDmg,
    bonusSpecificSkillDmg,
    bonusElementDmg,
    totalDeepenEffect,
    resistenceReduction
  );
  // Build the detailed damage calculation string
  let detailedCalculation = buildDetailedCalculationString(
    talent,
    instanceDamage,
    critRate,
    critDamage
  );
  let detailedCalculationCrit = buildDetailedCalculationString(
    talent,
    instanceDamage,
    critRate,
    critDamage,
    "crit"
  );
  let detailedCalculationAvg = buildDetailedCalculationString(
    talent,
    instanceDamage,
    critRate,
    critDamage,
    "average"
  );

  let totalCritDmg = calcCritDamage(finalDamage, critDamage);
  let totalAvgDmg = calcAvgDamage(finalDamage, critRate, critDamage);

  // Return detailed damage information
  return {
    instanceDamage,
    totalDamage: finalDamage,
    critDamage: totalCritDmg,
    avgDamage: totalAvgDmg,
    detailedCalculation,
    detailedCalculationCrit,
    detailedCalculationAvg,
  };
}

function calcCritDamage(damage: number, critDamage: number): number {
  return damage * critDamage;
}

function calcAvgDamage(
  damage: number,
  critRate: number,
  critDamage: number
): number {
  // don't allow over-crit rate to affect the damage
  if (critRate > 1) {
    critRate = 1;
  }
  return damage * (1 + critRate * (critDamage - 1));
}

// Helper function to parse the talent string
function parseTalentString(talent: string) {
  let talents: any[] = [];
  let talentParts = talent.split("+").map((part) => part.trim());

  talentParts.forEach((part: string) => {
    if (part.includes("*")) {
      //@ts-ignore: this is fine, it's just not understanding what's going on
      let [percentage, times] = part.split("*").map((str) => str.trim());
      let percentVal: number = parseFloat(percentage.replace("%", "")) / 100;
      let timesNum: number = parseInt(times);

      for (let i = 0; i < timesNum; i++) {
        talents.push(percentVal);
      }
    } else {
      let percentage = parseFloat(part.replace("%", "")) / 100;
      talents.push(percentage);
    }
  });
  return talents;
}

// Helper function to build the detailed calculation string
function buildDetailedCalculationString(
  talent: string,
  instanceDamage: any,
  critRate: number,
  critDamage: number,
  adjustDamage: string | null = null
): string {
  let talentParts = talent.split("+").map((part) => part.trim());

  let detailedParts = talentParts.map((part) => {
    if (part.includes("*")) {
      let [percentage, times] = part.split("*").map((str) => str.trim());
      let percentageValue = parseFloat(percentage.replace("%", ""));
      let percentageString = percentageValue.toFixed(2) + "%";
      let damage = instanceDamage[percentageString].toFixed(2);
      if (adjustDamage === "average") {
        damage = calcAvgDamage(Number(damage), critRate, critDamage);
      }
      if (adjustDamage === "crit") {
        damage = calcCritDamage(damage, critDamage);
      }
      return `<strong>${Math.ceil(damage)}</strong> * ${times}`;
    } else {
      let percentageValue = parseFloat(part.replace("%", ""));
      let percentageString = percentageValue.toFixed(2) + "%";
      let damage = instanceDamage[percentageString].toFixed(2);
      if (adjustDamage === "average") {
        damage = calcAvgDamage(Number(damage), critRate, critDamage);
      }
      if (adjustDamage === "crit") {
        damage = calcCritDamage(damage, critDamage);
      }
      return `<strong>${Math.ceil(damage)}</strong>`;
    }
  });

  return detailedParts.join(" + ");
}
