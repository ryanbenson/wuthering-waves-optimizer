import { describe, it, expect } from "vitest";
import {
  getBaseDamage,
  getTalentValue,
  getEnemyDefense,
  getDefenseModifier,
  getBonusDamageValue,
  getEnemyResistValue,
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
    const resistenceReduction = 0;
    const expected = 0.8;
    const result = getEnemyResistValue(enemyResist, resistenceReduction);
    expect(result).toEqual(expected);
  });
  it("when the enemy resist is normal and shred that stays above 0", () => {
    const enemyResist = 0.2;
    const resistenceReduction = 0.15;
    const expected = 0.95;
    const result = getEnemyResistValue(enemyResist, resistenceReduction);
    expect(result).toEqual(expected);
  });
  it("when the enemy resist is normal and shred that dips below 0", () => {
    const enemyResist = 0.2;
    const resistenceReduction = 0.3;
    const expected = 1.05;
    const result = getEnemyResistValue(enemyResist, resistenceReduction);
    expect(result).toEqual(expected);
  });
  it("when the enemy resist is starts below 0 with shred", () => {
    const enemyResist = -0.2;
    const resistenceReduction = 0.3;
    const expected = 1.35;
    const result = getEnemyResistValue(enemyResist, resistenceReduction);
    expect(result).toEqual(expected);
  });
  it("when the enemy resist is maxed", () => {
    const enemyResist = 1;
    const resistenceReduction = 0;
    const expected = 0;
    const result = getEnemyResistValue(enemyResist, resistenceReduction);
    expect(result).toEqual(expected);
  });
});
