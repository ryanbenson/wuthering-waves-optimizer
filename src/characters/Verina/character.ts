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
    hp: 1139,
    attack: 27,
    defense: 90,
  },
  "20": {
    hp: 2962,
    attack: 70,
    defense: 230,
  },
  "20+": {
    hp: 3721,
    attack: 90,
    defense: 289,
  },
  "40": {
    hp: 5641,
    attack: 135,
    defense: 437,
  },
  "40+": {
    hp: 6400,
    attack: 156,
    defense: 230,
  },
  "50": {
    hp: 7360,
    attack: 178,
    defense: 570,
  },
  "50+": {
    hp: 8120,
    attack: 199,
    defense: 628,
  },
  "60": {
    hp: 9079,
    attack: 221,
    defense: 702,
  },
  "60+": {
    hp: 9839,
    attack: 242,
    defense: 760,
  },
  "70": {
    hp: 10799,
    attack: 264,
    defense: 835,
  },
  "70+": {
    hp: 11558,
    attack: 278,
    defense: 893,
  },
  "80": {
    hp: 12518,
    attack: 301,
    defense: 967,
  },
  "80+": {
    hp: 13277,
    attack: 314,
    defense: 1025,
  },
  "90": {
    hp: 14237,
    attack: 337,
    defense: 1099,
  },
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
