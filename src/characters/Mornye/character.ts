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
    hp: 1230,
    attack: 23,
    defense: 111,
  },
  "20": {
    hp: 3189,
    attack: 59,
    defense: 284,
  },
  "20+": {
    hp: 4019,
    attack: 77,
    defense: 357,
  },
  "40": {
    hp: 6082,
    attack: 115,
    defense: 539,
  },
  "40+": {
    hp: 6912,
    attack: 133,
    defense: 612,
  },
  "50": {
    hp: 7939,
    attack: 152,
    defense: 702,
  },
  "50+": {
    hp: 8769,
    attack: 169,
    defense: 775,
  },
  "60": {
    hp: 9795,
    attack: 189,
    defense: 865,
  },
  "60+": {
    hp: 10625,
    attack: 206,
    defense: 938,
  },
  "70": {
    hp: 11652,
    attack: 225,
    defense: 1029,
  },
  "70+": {
    hp: 12482,
    attack: 237,
    defense: 1102,
  },
  "80": {
    hp: 13508,
    attack: 256,
    defense: 1192,
  },
  "80+": {
    hp: 14338,
    attack: 268,
    defense: 1265,
  },
  "90": {
    hp: 15375,
    attack: 288,
    defense: 1357,
  },
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
