import { getCharacterBasicInfo } from "./basic.ts";
import { character, getCharacterStatsByLevel } from "./character.ts";
import { basicAttacks } from "./basicAttacks.ts";
import { skillAttacks } from "./skillAttacks.ts";

export function getData() {
  return {
    basic: getCharacterBasicInfo(),
    character,
    getCharacterStatsByLevel,
    basicAttacks,
    skillAttacks,
  };
}
