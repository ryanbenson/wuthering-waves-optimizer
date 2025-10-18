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
    hp: 2143,
    attack: 96,
    defense: 233,
  },
  "20+": {
    hp: 2692,
    attack: 123,
    defense: 292,
  },
  "40": {
    hp: 4081,
    attack: 186,
    defense: 442,
  },
  "40+": {
    hp: 4630,
    attack: 214,
    defense: 233,
  },
  "50": {
    hp: 5325,
    attack: 245,
    defense: 576,
  },
  "50+": {
    hp: 5874,
    attack: 273,
    defense: 635,
  },
  "60": {
    hp: 6568,
    attack: 304,
    defense: 710,
  },
  "60+": {
    hp: 7118,
    attack: 331,
    defense: 769,
  },
  "70": {
    hp: 7812,
    attack: 363,
    defense: 844,
  },
  "70+": {
    hp: 8361,
    attack: 381,
    defense: 903,
  },
  "80": {
    hp: 9056,
    attack: 412,
    defense: 978,
  },
  "80+": {
    hp: 9605,
    attack: 431,
    defense: 1037,
  },
  "90": {
    hp: 10300,
    attack: 462,
    defense: 1112,
  },
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
