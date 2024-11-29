import { describe, it, expect } from 'vitest'
import { getBaseDamage } from '../../src/calculator/calculator'

describe('#getBaseDamage', () => {
  it('when given zeroes for all values', () => {
    const expected = 0;
    const talent = 0;
    const attack = 0;
    const baseDamageValue = 0;
    const defModifier = 0;
    const resistValue = 0;
    const result = getBaseDamage(talent, attack, baseDamageValue, defModifier, resistValue);
    expect(result).toEqual(expected);
  });
  it('when given the kitchen sink', () => {
    const expected = 6389425.228949999;
    const talent = 114.33;
    const attack = 12345;
    const baseDamageValue = 100;
    const defModifier = .0503;
    const resistValue = 0.9;
    const result = getBaseDamage(talent, attack, baseDamageValue, defModifier, resistValue);
    expect(result).toEqual(expected);
  });
  it('when given known Calcharo BA1 damage, lvl 70', () => {
    const expected = 133.9574975960601; // shows 134 on calc, gets 134 in-game
    const talent = .2942;
    const attack = 930;
    const baseDamageValue = 1.12;
    const defModifier = .4857142857;
    const resistValue = 0.9;
    const result = getBaseDamage(talent, attack, baseDamageValue, defModifier, resistValue);
    expect(result).toEqual(expected);
  });
})