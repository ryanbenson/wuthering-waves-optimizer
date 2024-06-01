interface CharacterData {
  [level: string]: LevelData;
}

interface LevelData {
  hp: number;
  attack: number;
  defense: number;
}

const characterData: CharacterData = {
  "1": {
    hp: 840,
    attack: 35,
    defense: 97,
  },
  "20": {
    hp: 2184,
    attack: 91,
    defense: 248,
  },
  "20+": {
    hp: 2744,
    attack: 117,
    defense: 311,
  },
  "40": {
    hp: 4160,
    attack: 176,
    defense: 471,
  },
  "40+": {
    hp: 4720,
    attack: 202,
    defense: 248,
  },
  "50": {
    hp: 5428,
    attack: 232,
    defense: 614,
  },
  "50+": {
    hp: 5988,
    attack: 258,
    defense: 677,
  },
  "60": {
    hp: 6696,
    attack: 287,
    defense: 757,
  },
  "60+": {
    hp: 7256,
    attack: 314,
    defense: 820,
  },
  "70": {
    hp: 7964,
    attack: 343,
    defense: 899,
  },
  "70+": {
    hp: 8524,
    attack: 361,
    defense: 962,
  },
  "80": {
    hp: 9232,
    attack: 390,
    defense: 1042,
  },
  "80+": {
    hp: 9792,
    attack: 408,
    defense: 1105,
  },
  "90": {
    hp: 10500,
    attack: 437,
    defense: 1185,
  },
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
