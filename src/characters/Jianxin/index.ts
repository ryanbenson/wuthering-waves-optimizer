import { getCharacterBasicInfo } from "./basic.ts";
import { character, getCharacterStatsByLevel } from "./character.ts";
import { basicAttacks } from "./basicAttacks.ts";
import { skillAttacks } from "./skillAttacks.ts";
import { liberationAttacks } from "./liberationAttacks.ts";
import { forteCircuitAttacks } from "./forteCircuitAttacks.ts";
import { introAttacks } from "./introAttacks.ts";
import { buffs } from "./buffs.ts";
import { resonanceChains } from "./resonanceChains.ts";
import { outroAttacks } from "./outroAttacks.ts";
import { tuneBreakAttacks } from "./tuneBreakAttacks.ts";

export function getData() {
  return {
    basic: getCharacterBasicInfo(),
    character,
    getCharacterStatsByLevel,
    basicAttacks,
    skillAttacks,
    liberationAttacks,
    forteCircuitAttacks,
    introAttacks,
    buffs,
    resonanceChains,
    outroAttacks,
    tuneBreakAttacks,
  };
}
