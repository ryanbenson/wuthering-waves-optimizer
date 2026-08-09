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
    hp: 1230,
    attack: 25,
    defense: 0,
  },
  "20": {
    hp: 3199.353,
    attack: 65.0275,
    defense: 0,
  },
  "20+": {
    hp: 4018,
    attack: 84,
    defense: 0,
  },
  "40": {
    hp: 6092.313,
    attack: 125.9125,
    defense: 0,
  },
  "40+": {
    hp: 6913,
    attack: 143,
    defense: 0,
  },
  "50": {
    hp: 7948.875,
    attack: 165.73,
    defense: 0,
  },
  "50+": {
    hp: 8768,
    attack: 183,
    defense: 0,
  },
  "60": {
    hp: 9805.437,
    attack: 205.5475,
    defense: 0,
  },
  "60+": {
    hp: 10625,
    attack: 224,
    defense: 0,
  },
  "70": {
    hp: 11661.876,
    attack: 245.365,
    defense: 0,
  },
  "70+": {
    hp: 12481,
    attack: 258,
    defense: 0,
  },
  "80": {
    hp: 13518.438,
    attack: 278.9325,
    defense: 0,
  },
  "80+": {
    hp: 14339,
    attack: 291,
    defense: 0,
  },
  "90": {
    hp: 15375,
    attack: 312.5,
    defense: 0,
  },
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
