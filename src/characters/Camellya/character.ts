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
    hp: 826,
    attack: 36,
    defense: 95,
  },
  "20": {
    hp: 2148,
    attack: 93,
    defense: 243,
  },
  "20+": {
    hp: 2699,
    attack: 120,
    defense: 305,
  },
  "40": {
    hp: 4091,
    attack: 181,
    defense: 461,
  },
  "40+": {
    hp: 4641,
    attack: 208,
    defense: 243,
  },
  "50": {
    hp: 5338,
    attack: 238,
    defense: 601,
  },
  "50+": {
    hp: 5888,
    attack: 265,
    defense: 663,
  },
  "60": {
    hp: 6584,
    attack: 295,
    defense: 741,
  },
  "60+": {
    hp: 7135,
    attack: 322,
    defense: 803,
  },
  "70": {
    hp: 7831,
    attack: 353,
    defense: 881,
  },
  "70+": {
    hp: 8382,
    attack: 371,
    defense: 942,
  },
  "80": {
    hp: 9078,
    attack: 401,
    defense: 1021,
  },
  "80+": {
    hp: 9628,
    attack: 419,
    defense: 1082,
  },
  "90": {
    hp: 10325,
    attack: 450,
    defense: 1161,
  },
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
