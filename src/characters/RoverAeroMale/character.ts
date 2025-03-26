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
    hp: 862,
    attack: 35,
    defense: 93,
  },
  "20": {
    hp: 2242,
    attack: 91,
    defense: 238,
  },
  "20+": {
    hp: 2816,
    attack: 117,
    defense: 298,
  },
  "40": {
    hp: 4269,
    attack: 176,
    defense: 452,
  },
  "40+": {
    hp: 4844,
    attack: 202,
    defense: 238,
  },
  "50": {
    hp: 5570,
    attack: 232,
    defense: 589,
  },
  "50+": {
    hp: 6145,
    attack: 258,
    defense: 649,
  },
  "60": {
    hp: 6871,
    attack: 287,
    defense: 725,
  },
  "60+": {
    hp: 7446,
    attack: 314,
    defense: 786,
  },
  "70": {
    hp: 8172,
    attack: 343,
    defense: 862,
  },
  "70+": {
    hp: 8747,
    attack: 361,
    defense: 923,
  },
  "80": {
    hp: 9473,
    attack: 390,
    defense: 999,
  },
  "80+": {
    hp: 10048,
    attack: 408,
    defense: 1060,
  },
  "90": {
    hp: 10775,
    attack: 437,
    defense: 1136,
  },
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
