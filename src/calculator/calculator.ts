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
  charLevel: string,
  enemyLevel: number,
  enemyResist: number,
  talent: number,
  attack: number,
  defIgnore: number = 0,
  bonusTotalSkillDmg: number = 0,
  bonusSpecificSkillDmg: number = 0,
  bonusElementDmg: number = 0,
  totalDeepenEffect: number = 0,
  resistenceReduction: number = 0,
  // critRate: number,
  // critDamage: number,
): number {
  const baseDamageValue = getBonusDamageValue(
    bonusTotalSkillDmg,
    bonusSpecificSkillDmg,
    bonusElementDmg,
    totalDeepenEffect,
  );
  const defModifier = getDefenseModifier(charLevel, enemyLevel, defIgnore);
  const resistValue = getEnemyResistValue(enemyResist, resistenceReduction);
  const baseDamage = getBaseDamage(
    talent,
    attack,
    baseDamageValue,
    defModifier,
    resistValue,
  );
  return baseDamage;
}

export function getBaseDamage(
  talent: number,
  attack: number,
  baseDamageValue: number,
  defModifier: number,
  resistValue: number,
): number {
  return attack * talent * baseDamageValue * defModifier * resistValue;
}

export function getTalentValue(talentStringWithPercent: string): number {
  // Remove the '%' sign and convert the percentage part to a decimal
  const talentValue = parseFloat(talentStringWithPercent) / 100;
  return talentValue;
}

export function getDefenseModifier(
  charLevelSpec: string,
  enemyLevel: number,
  defIgnore: number,
): number {
  const charLevel = Number.parseInt(
    charLevelSpec.slice(-1) == "+" ? charLevelSpec.slice(0, -1) : charLevelSpec,
  );
  const enemyDef = getEnemyDefense(enemyLevel);
  return (
    (800 + 8 * charLevel) / (800 + 8 * charLevel + enemyDef * (1 - defIgnore))
  );
}

export function getEnemyDefense(enemyLevel: number): number {
  return 8 * enemyLevel + 792;
}

export function getBonusDamageValue(
  bonusTotalSkillDmg: number = 0,
  bonusSpecificSkillDmg: number = 0,
  bonusElementDmg: number = 0,
  totalDeepenEffect: number = 0,
): number {
  return (
    (1 + bonusTotalSkillDmg + bonusSpecificSkillDmg + bonusElementDmg) *
    (1 + totalDeepenEffect)
  );
}

// we need to half the reduction if the resist goes under 0
export function getEnemyResistValue(
  enemyResist: number,
  resistenceReduction: number,
): number {
  if (enemyResist < 0) {
    resistenceReduction /= 2;
  }

  let finalResist = 1 - enemyResist + resistenceReduction;

  if (finalResist < 0) {
    finalResist = finalResist / 2;
  }

  return finalResist;
}

interface InstanceDamage {
  [instanceDamage: string]: number;
}
export function calcDamage(
  charLevel: string,
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
  talentModifierAdd: number = 0,
  talentModifierMultiply: number = 0,
  totalTalentModifierSpecialMultiply: number = 0,
  count: number = 1,
) {
  // Parse the talent string to get individual percentage values
  let talents = parseTalentString(talent);

  // Calculate the base damage for each talent value
  let totalTalentValue = 0;

  // Calculate individual instance damages
  let instanceDamage: InstanceDamage = {};
  talents.forEach((t) => {
    // we may modify this, but we need the original values for instanceDamage struct
    let originalTalent = t;
    // add any flat talent modifiers (e.g. Jinshi Incandescence)
    if (talentModifierAdd) {
      t += talentModifierAdd;
    }
    // if we have a talent multiplier, do it first before adding it to the total
    // make sure to add 1 to it (e.g. 100% * (1 + 1.2)
    if (talentModifierMultiply) {
      let updatedTalentAfterMultiply = t * (1 + talentModifierMultiply);
      t = updatedTalentAfterMultiply;
    }
    // if we have a special multplier, multiply this against the first set of multipliers
    if (totalTalentModifierSpecialMultiply) {
      let updatedTalentAfterSpecialMultiply =
        t * (1 + totalTalentModifierSpecialMultiply);
      t = updatedTalentAfterSpecialMultiply;
    }
    // update total talent value after any talent modifier adjustments
    totalTalentValue += t;
    // use the original talent as that's what is in the struct
    let percentageString = (originalTalent * 100).toFixed(2).toString() + "%";
    if (!instanceDamage[percentageString]) {
      instanceDamage[percentageString] = calcHitDamage(
        charLevel,
        enemyLevel,
        enemyResist,
        t, // the talent value that's been modified
        attack,
        defIgnore,
        bonusTotalSkillDmg,
        bonusSpecificSkillDmg,
        bonusElementDmg,
        totalDeepenEffect,
        resistenceReduction,
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
    resistenceReduction,
  );
  // multiply the final damage by the number of hits, usually 1,
  // but can be > 1 in rotations
  finalDamage = finalDamage * count;
  // Build the detailed damage calculation string
  let detailedCalculation = buildDetailedCalculationString(
    talent,
    instanceDamage,
    critRate,
    critDamage,
    null,
    count,
  );
  let detailedCalculationCrit = buildDetailedCalculationString(
    talent,
    instanceDamage,
    critRate,
    critDamage,
    "crit",
    count,
  );
  let detailedCalculationAvg = buildDetailedCalculationString(
    talent,
    instanceDamage,
    critRate,
    critDamage,
    "average",
    count,
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
  critDamage: number,
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
  adjustDamage: string | null = null,
  count: number = 1,
): string {
  let talentParts = talent.split("+").map((part) => part.trim());
  let countPrefix = "";
  if (count > 1) {
    countPrefix = `${count} x `;
  }
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

  const calcString = detailedParts.join(" + ");
  const finalCalcString = `${countPrefix}${calcString}`;
  return finalCalcString;
}

export function calcHeal(
  talent: string,
  finalAtkDefHpVal: number = 0,
  totalSkillDmgBonus: number = 0, // char stat of healing bonus
  specificSkillDmg: number = 0, // any buffs for the skill
  talentModifierAdd: number = 0,
  talentModifierMultiply: number = 0,
  count: number = 1,
): any {
  // Parse the talent string to get individual percentage values
  let { flatBase, talentVal } = parseHealTalentString(talent);

  // add any flat talent modifiers (e.g. Jinshi Incandescence)
  if (talentModifierAdd) {
    talentVal += talentModifierAdd;
  }
  // if we have a talent multiplier, do it first before adding it to the total
  // make sure to add 1 to it (e.g. 100% * (1 + 1.2)
  if (talentModifierMultiply) {
    let updatedTalentAfterMultiply = talentVal * (1 + talentModifierMultiply);
    talentVal = updatedTalentAfterMultiply;
  }

  const totalHealBonus = totalSkillDmgBonus + specificSkillDmg;
  // Apply defense shred and any other multipliers
  let healAmount = calcHitHeal(
    talentVal,
    flatBase,
    finalAtkDefHpVal,
    totalHealBonus,
  );

  // multiply the heal by the number of count, usually 1
  const finalHealAmount = count * healAmount;

  // make the detailed calc for the tooltip
  let countPrefix = "";
  if (count > 1) {
    countPrefix = `${count} x `;
  }
  let detailedCalculation = `${countPrefix}<strong>${Math.ceil(
    healAmount,
  )}</strong>`;

  // Return detailed damage information
  return {
    healAmount: finalHealAmount,
    detailedCalculation,
  };
}

function calcHitHeal(
  talent: number, // percent value of healing against hp/def/atk
  flatBase: number = 0, // flat healing amount
  finalAtkDefHpVal: number = 0,
  totalHealBonus: number = 0, // total healing bonus
): number {
  return (talent * finalAtkDefHpVal + flatBase) * (1 + totalHealBonus);
}

function parseHealTalentString(talent: string): any {
  let flatBase;
  let talentVal;
  // all heal talents are either: 100 + 20.00% or just 20%
  const hasFlatBase = talent.includes("+");
  if (hasFlatBase) {
    const [flatBaseString, talentPercentString] = talent.split("+");
    flatBase = Number(flatBaseString.trim());
    talentVal = parseFloat(talentPercentString.replace("%", "")) / 100;
  } else {
    talentVal = parseFloat(talent.replace("%", "")) / 100;
  }
  return {
    flatBase,
    talentVal,
  };
}

export function calcShield(
  talent: string,
  finalAtkDefHpVal: number = 0,
  totalSkillDmgBonus: number = 0, // char stat of healing bonus
  specificSkillDmg: number = 0, // any buffs for the skill
  talentModifierAdd: number = 0,
  talentModifierMultiply: number = 0,
  count: number = 1,
): any {
  // Parse the talent string to get individual percentage values
  let { flatBase, talentVal } = parseShieldTalentString(talent);

  // add any flat talent modifiers (e.g. Jinshi Incandescence)
  if (talentModifierAdd) {
    talentVal += talentModifierAdd;
  }
  // if we have a talent multiplier, do it first before adding it to the total
  // make sure to add 1 to it (e.g. 100% * (1 + 1.2)
  if (talentModifierMultiply) {
    let updatedTalentAfterMultiply = talentVal * (1 + talentModifierMultiply);
    talentVal = updatedTalentAfterMultiply;
  }

  const totalShieldBonus = totalSkillDmgBonus + specificSkillDmg;
  // Apply defense shred and any other multipliers
  let shieldAmount = calcHitShield(
    talentVal,
    flatBase,
    finalAtkDefHpVal,
    totalShieldBonus,
  );

  // multiply the heal by the number of count, usually 1
  const finalShieldAmount = count * shieldAmount;

  // make the detailed calc for the tooltip
  let countPrefix = "";
  if (count > 1) {
    countPrefix = `${count} x `;
  }
  let detailedCalculation = `${countPrefix}<strong>${Math.ceil(
    shieldAmount,
  )}</strong>`;
  // Return detailed damage information
  return {
    shieldAmount: finalShieldAmount,
    detailedCalculation,
  };
}

function calcHitShield(
  talent: number, // percent value of healing against hp/def/atk
  flatBase: number = 0, // flat healing amount
  finalAtkDefHpVal: number = 0,
  totalShieldBonus: number = 0, // total healing bonus
): number {
  return (talent * finalAtkDefHpVal + flatBase) * (1 + totalShieldBonus);
}

function parseShieldTalentString(talent: string): any {
  let flatBase;
  let talentVal;
  // all shield talents are either: 100 + 20.00% or just 20%
  const hasFlatBase = talent.includes("+");
  if (hasFlatBase) {
    const [flatBaseString, talentPercentString] = talent.split("+");
    flatBase = Number(flatBaseString.trim());
    talentVal = parseFloat(talentPercentString.replace("%", "")) / 100;
  } else {
    talentVal = parseFloat(talent.replace("%", "")) / 100;
  }
  return {
    flatBase,
    talentVal,
  };
}

export function getSpectroFrazzleModifierByLevelByStacks(
  charLevel: string,
  stacks: number,
): number | null {
  const levelScalingFactors: Record<string, Record<number, number>> = {
    // TODO: Add the reset of the levels, and support ascension (e.g. 60+)
    "60": {
      10: 10.43,
      9: 10.46,
      8: 10.49,
      7: 10.54,
      6: 10.6,
      5: 10.68,
      4: 10.8,
      3: 11.0,
      2: 11.41,
      1: 12.63,
    },
    "80": {
      10: 52.04,
      9: 52.17,
      8: 52.33,
      7: 52.54,
      6: 52.82,
      5: 53.21,
      4: 53.8,
      3: 54.78,
      2: 56.74,
      1: 62.63,
    },
    "90": {
      10: 94.09,
      9: 94.33,
      8: 94.61,
      7: 94.99,
      6: 95.5,
      5: 96.23,
      4: 97.25,
      3: 99.04,
      2: 102.62,
      1: 113.12,
    },
  };
  const modifier = levelScalingFactors?.[charLevel]?.[stacks] ?? null;
  if (!modifier) {
    return null;
  }
  return modifier / 100;
}

export function getSpectroFrazzleDamage(
  motionValue: number,
  stacks: number,
  charLevel: string,
  enemyLevel: number,
  enemyResist: number,
  resistenceReduction: number,
  defIgnore: number = 0,
): number {
  const defModifier = getDefenseModifier(charLevel, enemyLevel, defIgnore);
  const resistModifier = getEnemyResistValue(enemyResist, resistenceReduction);
  // 1000*res*def*stack number*MV%
  const baseModifier = 1000;
  // const modifierByLevelAndStacks = getSpectroFrazzleModifierByLevelByStacks(
  //   charLevel,
  //   stacks,
  // );
  return baseModifier * resistModifier * defModifier * stacks * motionValue;
}
