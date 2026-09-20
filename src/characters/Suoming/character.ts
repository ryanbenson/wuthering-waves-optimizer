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
    defense: 91,
  },
  "20": {
    hp: 2143.3064,
    attack: 96.2407,
    defense: 233.4605,
  },
  "20+": {
    hp: 2692,
    attack: 123,
    defense: 292,
  },
  "40": {
    hp: 4081.3544,
    attack: 186.3505,
    defense: 442.4056,
  },
  "40+": {
    hp: 4631,
    attack: 213,
    defense: 502,
  },
  "50": {
    hp: 5325.1,
    attack: 245.2804,
    defense: 576.3667,
  },
  "50+": {
    hp: 5875,
    attack: 272,
    defense: 635,
  },
  "60": {
    hp: 6568.8456,
    attack: 304.2103,
    defense: 710.3278,
  },
  "60+": {
    hp: 7117,
    attack: 333,
    defense: 770,
  },
  "70": {
    hp: 7812.5088,
    attack: 363.1402,
    defense: 844.2889,
  },
  "70+": {
    hp: 8362,
    attack: 382,
    defense: 904,
  },
  "80": {
    hp: 9056.2544,
    attack: 412.8201,
    defense: 978.2591,
  },
  "80+": {
    hp: 9606,
    attack: 431,
    defense: 1038,
  },
  "90": {
    hp: 10300,
    attack: 462.5,
    defense: 1112.2202,
  },
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
