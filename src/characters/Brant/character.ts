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
    hp: 934,
    attack: 30,
    defense: 107,
  },
  "20": {
    hp: 2429,
    attack: 78,
    defense: 274,
  },
  "20+": {
    hp: 3052,
    attack: 100,
    defense: 343,
  },
  "40": {
    hp: 4626,
    attack: 151,
    defense: 520,
  },
  "40+": {
    hp: 5248,
    attack: 173,
    defense: 274,
  },
  "50": {
    hp: 6035,
    attack: 198,
    defense: 677,
  },
  "50+": {
    hp: 6658,
    attack: 221,
    defense: 747,
  },
  "60": {
    hp: 7445,
    attack: 246,
    defense: 835,
  },
  "60+": {
    hp: 8068,
    attack: 269,
    defense: 870,
  },
  "70": {
    hp: 8855,
    attack: 294,
    defense: 992,
  },
  "70+": {
    hp: 9478,
    attack: 309,
    defense: 1062,
  },
  "80": {
    hp: 10265,
    attack: 334,
    defense: 1150,
  },
  "80+": {
    hp: 10887,
    attack: 349,
    defense: 1219,
  },
  "90": {
    hp: 11675,
    attack: 375,
    defense: 1307,
  },
};


export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
