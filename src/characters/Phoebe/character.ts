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
    hp: 866,
    attack: 33,
    defense: 103,
  },
  "20": {
    hp: 2252,
    attack: 85,
    defense: 264,
  },
  "20+": {
    hp: 2829,
    attack: 110,
    defense: 331,
  },
  "40": {
    hp: 4289,
    attack: 166,
    defense: 500,
  },
  "40+": {
    hp: 4866,
    attack: 190,
    defense: 264,
  },
  "50": {
    hp: 5596,
    attack: 218,
    defense: 652,
  },
  "50+": {
    hp: 6173,
    attack: 243,
    defense: 719,
  },
  "60": {
    hp: 6903,
    attack: 271,
    defense: 803,
  },
  "60+": {
    hp: 7480,
    attack: 296,
    defense: 870,
  },
  "70": {
    hp: 8210,
    attack: 323,
    defense: 955,
  },
  "70+": {
    hp: 8788,
    attack: 340,
    defense: 1022,
  },
  "80": {
    hp: 9517,
    attack: 368,
    defense: 1107,
  },
  "80+": {
    hp: 10095,
    attack: 384,
    defense: 1174,
  },
  "90": {
    hp: 10825,
    attack: 412,
    defense: 1258,
  },
};


export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
