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
    hp: 824,
    attack: 37,
    defense: 94,
  },
  "20": {
    hp: 2143.3064,
    attack: 96.2407,
    defense: 241.157,
  },
  "20+": {
    hp: 2692,
    attack: 123,
    defense: 302,
  },
  "40": {
    hp: 4081.3544,
    attack: 186.3505,
    defense: 456.9904,
  },
  "40+": {
    hp: 4631,
    attack: 213,
    defense: 517,
  },
  "50": {
    hp: 5325.1,
    attack: 245.2804,
    defense: 595.3678,
  },
  "50+": {
    hp: 5875,
    attack: 272,
    defense: 656,
  },
  "60": {
    hp: 6568.8456,
    attack: 304.2103,
    defense: 733.7452,
  },
  "60+": {
    hp: 7117,
    attack: 333,
    defense: 795,
  },
  "70": {
    hp: 7812.5088,
    attack: 363.1402,
    defense: 872.1226,
  },
  "70+": {
    hp: 8362,
    attack: 382,
    defense: 934,
  },
  "80": {
    hp: 9056.2544,
    attack: 412.8201,
    defense: 1010.5094,
  },
  "80+": {
    hp: 9606,
    attack: 431,
    defense: 1072,
  },
  "90": {
    hp: 10300,
    attack: 462.5,
    defense: 1148.8868,
  },
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
