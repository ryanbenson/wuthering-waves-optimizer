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
    hp: 831,
    attack: 37,
    defense: 90,
  },
  "20": {
    hp: 2161,
    attack: 96,
    defense: 230,
  },
  "20+": {
    hp: 2715,
    attack: 123,
    defense: 289,
  },
  "40": {
    hp: 4116,
    attack: 186,
    defense: 437,
  },
  "40+": {
    hp: 4670,
    attack: 214,
    defense: 230,
  },
  "50": {
    hp: 5370,
    attack: 245,
    defense: 570,
  },
  "50+": {
    hp: 5924,
    attack: 273,
    defense: 628,
  },
  "60": {
    hp: 6624,
    attack: 304,
    defense: 702,
  },
  "60+": {
    hp: 7178,
    attack: 331,
    defense: 760,
  },
  "70": {
    hp: 7878,
    attack: 363,
    defense: 835,
  },
  "70+": {
    hp: 8432,
    attack: 381,
    defense: 893,
  },
  "80": {
    hp: 9133,
    attack: 412,
    defense: 967,
  },
  "80+": {
    hp: 9133,
    attack: 431,
    defense: 1025,
  },
  "90": {
    hp: 10387,
    attack: 462,
    defense: 1099,
  },
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
