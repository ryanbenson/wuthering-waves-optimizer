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
  specialMultiplier: number = 0,
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
    specialMultiplier,
  );
  return baseDamage;
}

export function getBaseDamage(
  talent: number,
  attack: number,
  baseDamageValue: number,
  defModifier: number,
  resistValue: number,
  specialMultiplier: number = 0,
): number {
  return (
    attack *
    talent *
    baseDamageValue *
    (1 + specialMultiplier) *
    defModifier *
    resistValue
  );
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
  baseResist: number,
  reduction: number,
): number {
  if (reduction === 0) {
    return 1 - baseResist;
  }

  if (baseResist <= 0) {
    // If base resist is negative, reduction is halved
    const effectiveResist = baseResist - reduction / 2;
    return 1 - effectiveResist;
  } else {
    const reductionExceedsBase = reduction - baseResist;
    if (reductionExceedsBase <= 0) {
      // Reduction doesn't fully overcome base resist
      return 1 - (baseResist - reduction);
    } else {
      // Resistance dips below 0, the excess is halved
      const remainder = reductionExceedsBase / 2;
      return 1 + remainder;
    }
  }
}

function getNightfallStacksPerHit(stacks: number): number[] {
  const caps = [5, 5, 10, 20];
  const result = [];

  for (let cap of caps) {
    const value = Math.min(stacks, cap);
    result.push(value);
    stacks -= value;
  }

  return result;
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
  skillKey: string = "",
  additiveMultiplierStacks: number = 0,
  additiveMultiplierPercent: number = 0,
  specialMultiplier: number = 0,
) {
  // Parse the talent string to get individual percentage values
  let talents = parseTalentString(talent);

  // Calculate the base damage for each talent value
  let totalTalentValue = 0;

  // Calculate individual instance damages
  let instanceDamage: InstanceDamage = {};
  const talentsLen = talents.length;
  talents.forEach((t, index) => {
    // we may modify this, but we need the original values for instanceDamage struct
    let originalTalent = t;
    // add any flat talent modifiers (e.g. Jinshi Incandescence)
    // only add it to the LAST instance
    // TODO: Change this if this is altered later. Jinhsi only hits once
    // But Zani has multi-hit, and it seems it applies to the last hit only
    // However, this does not apply to HeavySlashNightfallDMG, which is far more complicated
    if (talentModifierAdd) {
      if (
        skillKey !== "HeavySlashNightfallDMG" &&
        skillKey !== "ScarletCodaDMG"
      ) {
        if (index === talentsLen - 1) {
          t += talentModifierAdd;
        }
      } else if (skillKey === "ScarletCodaDMG") {
        /**
         * Scarlet coda does 11 hits. The talentModifierAdd needs to be split according to these rules:
         * 1st and 2nd hit get 5% each of talentModifierAdd
         * The next 8 hits get 1.875% each of talentModifierAdd
         * The last hit gets 75% of talentModifierAdd
         */
        if (index === 0 || index === 1) {
          t += talentModifierAdd * 0.05; // 5% for first two hits
        } else if (index >= 2 && index <= 9) {
          t += talentModifierAdd * 0.01875; // 1.875% for next 8 hits
        } else if (index === 10) {
          t += talentModifierAdd * 0.75; // 75% for the last hit
        }
      } else {
        /**
         * Specific handler for: HeavySlashNightfallDMG
         * It has two major chunks, and 4 major attacks
         * It also has 5 instances of damages that are not direct hits, but "side hits"
         * The additive multiplier has very specific rules. Example: If you have 40 stacks, then it's parsed into:
         * 5+5+15+15. So, assuming talent level 10:
         * Full talent string: 51.7%*2 + 15.91%*2 + 79.53% + 7.96%*2 + 27.84% + 139.17%
         * 51.7 = gets 5 stacks appliedzzs
         * 51.7 = gets 5 stacks applied (this hits twice)
         * 79.53 = gets 10 stacks
         * 139.17 = gets 20 stacks
         * However, you may not have 40 stacks. If you have less, then it starts to subtract at the end
         * so it uses the full quota in each step. Say if you have 30:
         * 51.7 = gets 5 stacks applied
         * 51.7 = gets 5 stacks applied (this hits twice)
         * 79.53 = gets 10 stacks
         * 139.17 = gets 10 stacks
         * But since the talent number changes, we will have to make it index based, assuming max stacks
         * 0 = 5 stacks
         * 1 = 5 stacks
         * 4 = 10 stacks
         * 8 = 20 stacks
         *
         * The stacks is multiplied by a percent, which is based on the talent
         * So it needs to be calculated on-demand
         */
        const nightfallStacksPerHit = getNightfallStacksPerHit(
          additiveMultiplierStacks,
        );
        if (index === 0) {
          const stacks = nightfallStacksPerHit[0] ?? 0;
          const talentModifierAdd = stacks * additiveMultiplierPercent;
          t += talentModifierAdd;
        }
        if (index === 1) {
          const stacks = nightfallStacksPerHit[1] ?? 0;
          const talentModifierAdd = stacks * additiveMultiplierPercent;
          t += talentModifierAdd;
        }
        if (index === 4) {
          const stacks = nightfallStacksPerHit[2] ?? 0;
          const talentModifierAdd = stacks * additiveMultiplierPercent;
          t += talentModifierAdd;
        }
        if (index === 8) {
          const stacks = nightfallStacksPerHit[3] ?? 0;
          const talentModifierAdd = stacks * additiveMultiplierPercent;
          t += talentModifierAdd;
        }
      }
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
        specialMultiplier,
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
    specialMultiplier,
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

export function calcFixedDamage(talent: string, count: number = 1): any {
  const finalDamage = Number(talent) * count;
  const instanceDamage = { talent: Number(talent) };
  let detailedCalculation = buildDetailedCalculationStringFixedDamage(
    talent,
    count,
  );
  return {
    instanceDamage,
    totalDamage: finalDamage,
    critDamage: finalDamage,
    avgDamage: finalDamage,
    detailedCalculation,
    detailedCalculationCrit: detailedCalculation,
    detailedCalculationAvg: detailedCalculation,
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

function buildDetailedCalculationStringFixedDamage(
  talent: string,
  count: number = 1,
): string {
  let countPrefix = "";
  if (count > 1) {
    countPrefix = `${count} x `;
  }
  const calcString = `<strong>${Number(talent)}</strong>`;
  const finalCalcString = `${countPrefix}${calcString}`;
  return finalCalcString;
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
  // remove any + since ascension doesn't affect the data
  const characterLevel = charLevel.replace("+", "");
  const levelScalingFactors: Record<string, Record<number, number>> = {
    // TODO: Add the reset of the levels
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
    "70": {
      10: 26.81,
      9: 26.86,
      8: 26.95,
      7: 27.06,
      6: 27.22,
      5: 27.43,
      4: 27.7,
      3: 28.21,
      2: 29.25,
      1: 32.35,
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
      10: 91.67,
      9: 91.91,
      8: 92.17,
      7: 92.58,
      6: 93.05,
      5: 93.75,
      4: 94.81,
      3: 96.49,
      2: 99.96,
      1: 110.38,
    },
  };
  const modifier = levelScalingFactors?.[characterLevel]?.[stacks] ?? null;
  if (!modifier) {
    return null;
  }
  return modifier / 100;
}

export function getAeroErosionModifierByLevelByStacks(
  charLevel: string,
  stacks: number,
): number | null {
  // remove any + since ascension doesn't affect the data
  const characterLevel = charLevel.replace("+", "");
  const levelScalingFactors: Record<string, Record<number, number>> = {
    "1": {
      6: 0.0103,
      5: 0.00987,
      4: 0.0093,
      3: 0.00823,
      2: 0.00625,
      1: 0.00509,
    },
    "20": {
      6: 0.0225,
      5: 0.0218,
      4: 0.02022,
      3: 0.0182,
      2: 0.0135,
      1: 0.0109,
    },
    "40": {
      6: 0.07971,
      5: 0.07653,
      4: 0.07175,
      3: 0.0635,
      2: 0.0477,
      1: 0.0382,
    },
    "50": {
      6: 0.21475,
      5: 0.2061,
      4: 0.19318,
      3: 0.1718,
      2: 0.1288,
      1: 0.10355,
    },
    "60": {
      6: 0.3562,
      5: 0.3422,
      4: 0.3207,
      3: 0.2855,
      2: 0.214,
      1: 0.171,
    },
    "70": {
      6: 0.9422,
      5: 0.90454,
      4: 0.8479,
      3: 0.7537,
      2: 0.5651,
      1: 0.4531,
    },
    "80": {
      9: 2.005,
      8: 1.97375,
      7: 1.93345,
      6: 1.8799,
      5: 1.8045,
      4: 1.691875,
      3: 1.5038,
      2: 1.1279,
      1: 0.903,
    },
    "90": {
      6: 3.4444,
      5: 3.30675,
      4: 3.1,
      3: 2.7556,
      2: 2.06695,
      1: 1.6535,
    },
  };
  const modifier = levelScalingFactors?.[characterLevel]?.[stacks] ?? null;
  if (!modifier) {
    return null;
  }
  return modifier;
}

export function getSpectroFrazzleDamage(
  motionValue: number,
  stacks: number,
  charLevel: string,
  enemyLevel: number,
  enemyResist: number,
  resistenceReduction: number,
  defIgnore: number = 0,
  DMGDeepen: number = 0,
): number {
  const defModifier = getDefenseModifier(charLevel, enemyLevel, defIgnore);
  const resistModifier = getEnemyResistValue(enemyResist, resistenceReduction);
  // 1000*res*def*stack number*MV%
  const baseModifier = 1000;
  // const modifierByLevelAndStacks = getSpectroFrazzleModifierByLevelByStacks(
  //   charLevel,
  //   stacks,
  // );
  return (
    baseModifier *
    resistModifier *
    defModifier *
    stacks *
    motionValue *
    (1 + DMGDeepen)
  );
}

export function getAeroErosionDamage(
  motionValue: number,
  stacks: number,
  charLevel: string,
  enemyLevel: number,
  enemyResist: number,
  resistenceReduction: number,
  defIgnore: number = 0,
  DMGDeepen: number = 0,
): number {
  const defModifier = getDefenseModifier(charLevel, enemyLevel, defIgnore);
  const resistModifier = getEnemyResistValue(enemyResist, resistenceReduction);
  // 1000*res*def*stack number*MV%
  const baseModifier = 1000;
  return (
    baseModifier *
    resistModifier *
    defModifier *
    stacks *
    motionValue *
    (1 + DMGDeepen)
  );
}

/**
 * Calculate the damage for MidnightVeilDMG
 * It's a special utility attack that only does 5 damage
 */
export function calcMidnightVeilDMG() {
  return {
    instanceDamage: 100,
    totalDamage: 100,
    critDamage: 100,
    avgDamage: 100,
    detailedCalculation: "<strong>5</strong> * 20",
    detailedCalculationCrit: "<strong>5</strong> * 20",
    detailedCalculationAvg: "<strong>5</strong> * 20",
  };
}
