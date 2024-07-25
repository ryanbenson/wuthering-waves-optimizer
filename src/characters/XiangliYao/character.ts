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
    attack: 34,
    defense: 100,
  },
  "20": {
    hp: 2210,
    attack: 88,
    defense: 256,
  },
  "20+": {
    hp: 2777,
    attack: 113,
    defense: 321,
  },
  "40": {
    hp: 4210,
    attack: 171,
    defense: 486,
  },
  "40+": {
    hp: 4776,
    attack: 196,
    defense: 256,
  },
  "50": {
    hp: 5493,
    attack: 225,
    defense: 633,
  },
  "50+": {
    hp: 6059,
    attack: 250,
    defense: 698,
  },
  "60": {
    hp: 6776,
    attack: 279,
    defense: 780,
  },
  "60+": {
    hp: 7342,
    attack: 305,
    defense: 845,
  },
  "70": {
    hp: 8059,
    attack: 333,
    defense: 927,
  },
  "70+": {
    hp: 8625,
    attack: 350,
    defense: 992,
  },
  "80": {
    hp: 9342,
    attack: 379,
    defense: 1075,
  },
  "80+": {
    hp: 9908,
    attack: 396,
    defense: 1139,
  },
  "90": {
    hp: 10625,
    attack: 425,
    defense: 1222,
  },
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
