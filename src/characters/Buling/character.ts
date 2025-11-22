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
    hp: 850,
    attack: 18,
    defense: 103,
  },
  "20": {
    hp: 2210,
    attack: 46,
    defense: 264,
  },
  "20+": {
    hp: 2777,
    attack: 60,
    defense: 331,
  },
  "40": {
    hp: 4210,
    attack: 90,
    defense: 500,
  },
  "40+": {
    hp: 4776,
    attack: 104,
    defense: 264,
  },
  "50": {
    hp: 5493,
    attack: 119,
    defense: 652,
  },
  "50+": {
    hp: 6059,
    attack: 132,
    defense: 719,
  },
  "60": {
    hp: 6776,
    attack: 147,
    defense: 803,
  },
  "60+": {
    hp: 7342,
    attack: 161,
    defense: 870,
  },
  "70": {
    hp: 8059,
    attack: 176,
    defense: 955,
  },
  "70+": {
    hp: 8625,
    attack: 185,
    defense: 1022,
  },
  "80": {
    hp: 9342,
    attack: 200,
    defense: 1107,
  },
  "80+": {
    hp: 9908,
    attack: 209,
    defense: 1174,
  },
  "90": {
    hp: 10625,
    attack: 225,
    defense: 1258,
  },
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
