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
    hp: 2242.1482,
    attack: 91.0385,
    defense: 238.5915,
  },
  "20+": {
    hp: 2816,
    attack: 117,
    defense: 298,
  },
  "40": {
    hp: 4269.5722,
    attack: 176.2775,
    defense: 452.1288,
  },
  "40+": {
    hp: 4844,
    attack: 202,
    defense: 513,
  },
  "50": {
    hp: 5570.675,
    attack: 232.022,
    defense: 589.0341,
  },
  "50+": {
    hp: 6145,
    attack: 258,
    defense: 649,
  },
  "60": {
    hp: 6871.7778,
    attack: 287.7665,
    defense: 725.9394,
  },
  "60+": {
    hp: 7446,
    attack: 314,
    defense: 786,
  },
  "70": {
    hp: 8172.7944,
    attack: 343.511,
    defense: 862.8447,
  },
  "70+": {
    hp: 8747,
    attack: 361,
    defense: 923,
  },
  "80": {
    hp: 9473.8972,
    attack: 390.5055,
    defense: 999.7593,
  },
  "80+": {
    hp: 10048,
    attack: 408,
    defense: 1060,
  },
  "90": {
    hp: 10775,
    attack: 437.5,
    defense: 1136.6646,
  },
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
