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
    hp: 996,
    attack: 37,
    defense: 98,
  },
  "20": {
    hp: 2590,
    attack: 96,
    defense: 251,
  },
  "20+": {
    hp: 3254,
    attack: 123,
    defense: 314,
  },
  "40": {
    hp: 4933,
    attack: 186,
    defense: 476,
  },
  "40+": {
    hp: 5597,
    attack: 214,
    defense: 251,
  },
  "50": {
    hp: 6436,
    attack: 245,
    defense: 620,
  },
  "50+": {
    hp: 7100,
    attack: 273,
    defense: 684,
  },
  "60": {
    hp: 7940,
    attack: 304,
    defense: 764,
  },
  "60+": {
    hp: 8603,
    attack: 331,
    defense: 828,
  },
  "70": {
    hp: 9443,
    attack: 363,
    defense: 909,
  },
  "70+": {
    hp: 10107,
    attack: 381,
    defense: 972,
  },
  "80": {
    hp: 10946,
    attack: 412,
    defense: 1053,
  },
  "80+": {
    hp: 11610,
    attack: 431,
    defense: 1117,
  },
  "90": {
    hp: 12450,
    attack: 462,
    defense: 1197,
  },
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
