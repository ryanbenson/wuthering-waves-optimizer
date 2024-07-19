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
    hp: 802,
    attack: 20,
    defense: 93,
  },
  "20": {
    hp: 2086,
    attack: 52,
    defense: 238,
  },
  "20+": {
    hp: 2620,
    attack: 67,
    defense: 298,
  },
  "40": {
    hp: 3972,
    attack: 100,
    defense: 452,
  },
  "40+": {
    hp: 4507,
    attack: 115,
    defense: 238,
  },
  "50": {
    hp: 5182,
    attack: 132,
    defense: 589,
  },
  "50+": {
    hp: 5717,
    attack: 147,
    defense: 649,
  },
  "60": {
    hp: 6393,
    attack: 164,
    defense: 725,
  },
  "60+": {
    hp: 6928,
    attack: 179,
    defense: 786,
  },
  "70": {
    hp: 7603,
    attack: 196,
    defense: 862,
  },
  "70+": {
    hp: 8138,
    attack: 206,
    defense: 923,
  },
  "80": {
    hp: 8814,
    attack: 223,
    defense: 999,
  },
  "80+": {
    hp: 9349,
    attack: 233,
    defense: 1060,
  },
  "90": {
    hp: 10025,
    attack: 250,
    defense: 1136,
  },
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
