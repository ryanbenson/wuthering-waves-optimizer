import { describe, it, expect } from "vitest";
import {
  getBaseDamage,
  getTalentValue,
  getEnemyDefense,
  getDefenseModifier,
  getBonusDamageValue,
  getEnemyResistValue,
  getSpectroFrazzleDamage,
  calcDamage,
} from "../../src/calculator/calculator";

describe("#getBaseDamage", () => {
  it("when given zeroes for all values", () => {
    const expected = 0;
    const talent = 0;
    const attack = 0;
    const baseDamageValue = 0;
    const defModifier = 0;
    const resistValue = 0;
    const result = getBaseDamage(
      talent,
      attack,
      baseDamageValue,
      defModifier,
      resistValue,
    );
    expect(result).toEqual(expected);
  });
  it("when given the kitchen sink", () => {
    const expected = 6389425.228949999;
    const talent = 114.33;
    const attack = 12345;
    const baseDamageValue = 100;
    const defModifier = 0.0503;
    const resistValue = 0.9;
    const result = getBaseDamage(
      talent,
      attack,
      baseDamageValue,
      defModifier,
      resistValue,
    );
    expect(result).toEqual(expected);
  });
  it("when given known Calcharo BA1 damage, lvl 70", () => {
    const expected = 133.9574975960601; // shows 134 on calc, gets 134 in-game
    const talent = 0.2942;
    const attack = 930;
    const baseDamageValue = 1.12;
    const defModifier = 0.4857142857;
    const resistValue = 0.9;
    const result = getBaseDamage(
      talent,
      attack,
      baseDamageValue,
      defModifier,
      resistValue,
    );
    expect(result).toEqual(expected);
  });
  it("applies total damage as a separate multiplier after special multiplier", () => {
    const talent = 1;
    const attack = 1000;
    const baseDamageValue = 1;
    const defModifier = 1;
    const resistValue = 1;
    const specialMultiplier = 0.2;
    const totalDamage = 0.1;
    const result = getBaseDamage(
      talent,
      attack,
      baseDamageValue,
      defModifier,
      resistValue,
      specialMultiplier,
      totalDamage,
    );
    // 1000 * 1 * 1 * (1 + 0.2) * (1 + 0.1) * 1 * 1
    expect(result).toEqual(1320);
  });
});

describe("#getTalentValue", () => {
  it("when the talent has a decimal", () => {
    const talent = "187.31%";
    const expected = 1.8731;
    const result = getTalentValue(talent);
    expect(result).toEqual(expected);
  });
  it("when the talent has a decimal will have JS float issues", () => {
    const talent = "187.33%";
    const expected = 1.8733000000000002;
    const result = getTalentValue(talent);
    expect(result).toEqual(expected);
  });
  it("when the talent does not have a decimal", () => {
    const talent = "187%";
    const expected = 1.87;
    const result = getTalentValue(talent);
    expect(result).toEqual(expected);
  });
  it("when the talent is really large", () => {
    const talent = "187000%";
    const expected = 1870;
    const result = getTalentValue(talent);
    expect(result).toEqual(expected);
  });
  it("when the talent is really small", () => {
    const talent = "0.06%";
    const expected = 0.0006;
    const result = getTalentValue(talent);
    expect(result).toEqual(expected);
  });
});

describe("#getEnemyDefense", () => {
  it("when the enemy is lvl really low level", () => {
    const level = 1;
    const expected = 800;
    const result = getEnemyDefense(level);
    expect(result).toEqual(expected);
  });
  it("when the enemy is lvl really high level", () => {
    const level = 100;
    const expected = 1592;
    const result = getEnemyDefense(level);
    expect(result).toEqual(expected);
  });
});

describe("#getDefenseModifier", () => {
  it("when the character level matches enemy level without def ignore", () => {
    const charLevel = "100";
    const enemyLevel = 100;
    const defIgnore = 0;
    const expected = 0.5012531328320802;
    const result = getDefenseModifier(charLevel, enemyLevel, defIgnore);
    expect(result).toEqual(expected);
  });
  it("when a low level character level matches enemy level without def ignore", () => {
    const charLevel = "20";
    const enemyLevel = 20;
    const defIgnore = 0;
    const expected = 0.502092050209205;
    const result = getDefenseModifier(charLevel, enemyLevel, defIgnore);
    expect(result).toEqual(expected);
  });
  it("when the character level includes a + sign, and matches enemy level without def ignore", () => {
    const charLevel = "80+";
    const enemyLevel = 80;
    const defIgnore = 0;
    const expected = 0.5013927576601671;
    const result = getDefenseModifier(charLevel, enemyLevel, defIgnore);
    expect(result).toEqual(expected);
  });
  it("when the character level is higher than the enemy level without def ignore", () => {
    const charLevel = "90";
    const enemyLevel = 81;
    const defIgnore = 0;
    const expected = 0.5135135135135135;
    const result = getDefenseModifier(charLevel, enemyLevel, defIgnore);
    expect(result).toEqual(expected);
  });
  it("when the character level is lower than the enemy level without def ignore", () => {
    const charLevel = "80";
    const enemyLevel = 100;
    const defIgnore = 0;
    const expected = 0.47493403693931396;
    const result = getDefenseModifier(charLevel, enemyLevel, defIgnore);
    expect(result).toEqual(expected);
  });
  it("when the character level is lower than the enemy level and has def ignore", () => {
    const charLevel = "80";
    const enemyLevel = 100;
    const defIgnore = 0.15;
    const expected = 0.5155377344980667;
    const result = getDefenseModifier(charLevel, enemyLevel, defIgnore);
    expect(result).toEqual(expected);
  });
});

describe("#getBonusDamageValue", () => {
  it("when no bonuses are given", () => {
    const bonusTotalSkillDmg = 0;
    const bonusSpecificSkillDmg = 0;
    const bonusElementDmg = 0;
    const totalDeepenEffect = 0;
    const expected = 1;
    const result = getBonusDamageValue(
      bonusTotalSkillDmg,
      bonusSpecificSkillDmg,
      bonusElementDmg,
      totalDeepenEffect,
    );
    expect(result).toEqual(expected);
  });
  it("when just skill dmg is given", () => {
    const bonusTotalSkillDmg = 0.5;
    const bonusSpecificSkillDmg = 0;
    const bonusElementDmg = 0;
    const totalDeepenEffect = 0;
    const expected = 1.5;
    const result = getBonusDamageValue(
      bonusTotalSkillDmg,
      bonusSpecificSkillDmg,
      bonusElementDmg,
      totalDeepenEffect,
    );
    expect(result).toEqual(expected);
  });
  it("when skill dmg is given", () => {
    const bonusTotalSkillDmg = 0.5;
    const bonusSpecificSkillDmg = 1.2;
    const bonusElementDmg = 0;
    const totalDeepenEffect = 0;
    const expected = 2.7;
    const result = getBonusDamageValue(
      bonusTotalSkillDmg,
      bonusSpecificSkillDmg,
      bonusElementDmg,
      totalDeepenEffect,
    );
    expect(result).toEqual(expected);
  });
  it("when skill dmg is given with elemental dmg bonus", () => {
    const bonusTotalSkillDmg = 0.5;
    const bonusSpecificSkillDmg = 1.2;
    const bonusElementDmg = 1.5;
    const totalDeepenEffect = 0;
    const expected = 4.2;
    const result = getBonusDamageValue(
      bonusTotalSkillDmg,
      bonusSpecificSkillDmg,
      bonusElementDmg,
      totalDeepenEffect,
    );
    expect(result).toEqual(expected);
  });
  it("when skill dmg is given with elemental dmg bonus with amplify", () => {
    const bonusTotalSkillDmg = 0.5;
    const bonusSpecificSkillDmg = 1.2;
    const bonusElementDmg = 1.5;
    const totalDeepenEffect = 0.38;
    const expected = 5.795999999999999;
    const result = getBonusDamageValue(
      bonusTotalSkillDmg,
      bonusSpecificSkillDmg,
      bonusElementDmg,
      totalDeepenEffect,
    );
    expect(result).toEqual(expected);
  });
});

describe("#getEnemyResistValue", () => {
  it("when the enemy resist is normal and no shred", () => {
    const enemyResist = 0.2;
    const resistanceReduction = 0;
    const expected = 0.8;
    const result = getEnemyResistValue(enemyResist, resistanceReduction);
    expect(result).toEqual(expected);
  });
  it("when the enemy resist is normal and shred that stays above 0", () => {
    const enemyResist = 0.2;
    const resistanceReduction = 0.15;
    const expected = 0.95;
    const result = getEnemyResistValue(enemyResist, resistanceReduction);
    expect(result).toEqual(expected);
  });
  it("when the enemy resist is normal and shred that dips below 0", () => {
    const enemyResist = 0.2;
    const resistanceReduction = 0.3;
    const expected = 1.05;
    const result = getEnemyResistValue(enemyResist, resistanceReduction);
    expect(result).toEqual(expected);
  });
  it("when the enemy resist is starts below 0 with shred", () => {
    const enemyResist = -0.2;
    const resistanceReduction = 0.3;
    const expected = 1.35;
    const result = getEnemyResistValue(enemyResist, resistanceReduction);
    expect(result).toEqual(expected);
  });
  it("when the enemy resist is maxed", () => {
    const enemyResist = 1;
    const resistanceReduction = 0;
    const expected = 0;
    const result = getEnemyResistValue(enemyResist, resistanceReduction);
    expect(result).toEqual(expected);
  });
  it("when resist reduction and resist ignore are combined", () => {
    const enemyResist = 0.2;
    const resistanceReduction = 0.05;
    const resistanceIgnore = 0.1;
    const expected = 0.95;
    const result = getEnemyResistValue(
      enemyResist,
      resistanceReduction,
      resistanceIgnore,
    );
    expect(result).toEqual(expected);
  });
  it("when resist reduction and ignore together exceed base resist", () => {
    // 10% base, 5% reduction + 10% ignore => 5% excess, halved => 1.025
    const enemyResist = 0.1;
    const resistanceReduction = 0.05;
    const resistanceIgnore = 0.1;
    const expected = 1.025;
    const result = getEnemyResistValue(
      enemyResist,
      resistanceReduction,
      resistanceIgnore,
    );
    expect(result).toEqual(expected);
  });
  it("treats resist ignore the same as reduction when both are applied", () => {
    const enemyResist = 0.2;
    const withReductionOnly = getEnemyResistValue(enemyResist, 0.15, 0);
    const withIgnoreOnly = getEnemyResistValue(enemyResist, 0, 0.15);
    const split = getEnemyResistValue(enemyResist, 0.05, 0.1);
    expect(withReductionOnly).toEqual(withIgnoreOnly);
    expect(withReductionOnly).toEqual(split);
  });
});

describe("#getSpectroFrazzleDamage resist ignore", () => {
  it("does not apply resist ignore to negative status damage", () => {
    const charLevel = "90";
    const enemyLevel = 100;
    const enemyResist = 0.2;
    const resistanceReduction = 0.1;
    const withReduction = getSpectroFrazzleDamage(
      charLevel,
      enemyLevel,
      enemyResist,
      resistanceReduction,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
    );
    // Passing ignore is not part of the API — context always stores 0.
    // Reduction-only path must match getEnemyResistValue without ignore.
    expect(withReduction.totalDamageContext.resistanceIgnore).toEqual(0);
    expect(withReduction.totalDamageContext.resistModifier).toEqual(
      getEnemyResistValue(enemyResist, resistanceReduction, 0),
    );
    expect(withReduction.totalDamageContext.resistModifier).not.toEqual(
      getEnemyResistValue(enemyResist, resistanceReduction, 0.1),
    );
  });
});

describe("#calcDamage talentModifierAdd multi-hit distribution", () => {
  // damage is linear in the per-hit talent value for a fixed set of other
  // params, so (damage with the bonus - damage without it) isolates each
  // hit's share of talentModifierAdd without needing to know the rest of
  // the damage formula
  function perHitShares(talent: string, skillKey: string) {
    const args = [
      "90",
      90,
      0.1,
      talent,
      1000,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ] as const;
    const without = calcDamage(...args, 0, 0, 0, 1, skillKey);
    const with_ = calcDamage(...args, 1, 0, 0, 1, skillKey);
    const deltas = without.instanceDamageEntries.map(
      (entry: any, i: number) =>
        with_.instanceDamageEntries[i].damage - entry.damage,
    );
    const total = deltas.reduce((a: number, b: number) => a + b, 0);
    return deltas.map((d: number) => d / total);
  }

  it("splits Heavy Attack - Soul Raid's bonus 7/7/9/9/9/59 instead of dumping it all on the last hit", () => {
    const shares = perHitShares(
      "8.25%*2+10.61%*3+69.53%",
      "HeavyAttackSoulRaidDMG",
    );
    expect(shares).toHaveLength(6);
    [0.07, 0.07, 0.09, 0.09, 0.09, 0.59].forEach((expected, i) => {
      expect(shares[i]).toBeCloseTo(expected, 5);
    });
  });

  it("splits Heavy Attack - Stardome Meander's bonus 10/10/20/60 instead of dumping it all on the last hit", () => {
    const shares = perHitShares(
      "12.09%+12.09%+24.18%+72.54%",
      "HeavyAttackStardomeMeanderDMG",
    );
    expect(shares).toHaveLength(4);
    [0.1, 0.1, 0.2, 0.6].forEach((expected, i) => {
      expect(shares[i]).toBeCloseTo(expected, 5);
    });
  });

  it("still dumps the bonus entirely on the last hit for skills without a special split", () => {
    const shares = perHitShares("50.00%+50.00%", "SomeOtherMultiHitDMG");
    expect(shares).toEqual([0, 1]);
  });
});
