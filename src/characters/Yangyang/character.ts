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
    hp: 816,
    attack: 20,
    defense: 90,
  },
  "20": {
    hp: 2122,
    attack: 52,
    defense: 230,
  },
  "20+": {
    hp: 2666,
    attack: 67,
    defense: 289,
  },
  "40": {
    hp: 4041,
    attack: 100,
    defense: 437,
  },
  "40+": {
    hp: 4585,
    attack: 115,
    defense: 230,
  },
  "50": {
    hp: 5273,
    attack: 132,
    defense: 570,
  },
  "50+": {
    hp: 5817,
    attack: 147,
    defense: 628,
  },
  "60": {
    hp: 6505,
    attack: 164,
    defense: 702,
  },
  "60+": {
    hp: 7049,
    attack: 179,
    defense: 760,
  },
  "70": {
    hp: 7736,
    attack: 196,
    defense: 835,
  },
  "70+": {
    hp: 8280,
    attack: 206,
    defense: 893,
  },
  "80": {
    hp: 8968,
    attack: 223,
    defense: 967,
  },
  "80+": {
    hp: 9512,
    attack: 233,
    defense: 1025,
  },
  "90": {
    hp: 10200,
    attack: 250,
    defense: 1099,
  },
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
