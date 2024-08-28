interface CharacterData {
  [level: string]: LevelData;
}

interface LevelData {
  hp: number;
  attack: number;
  defense: number;
}

// Updated character data based on the table provided
const characterData: CharacterData = {
  "1": {
    hp: 1337,
    attack: 23,
    defense: 90,
  },
  "20": {
    hp: 3477,
    attack: 59,
    defense: 230,
  },
  "20+": {
    hp: 4368,
    attack: 77,
    defense: 289,
  },
  "40": {
    hp: 6622,
    attack: 115,
    defense: 437,
  },
  "40+": {
    hp: 7513,
    attack: 133,
    defense: 230,
  },
  "50": {
    hp: 8640,
    attack: 152,
    defense: 570,
  },
  "50+": {
    hp: 9531,
    attack: 169,
    defense: 628,
  },
  "60": {
    hp: 10658,
    attack: 189,
    defense: 702,
  },
  "60+": {
    hp: 11549,
    attack: 206,
    defense: 760,
  },
  "70": {
    hp: 12676,
    attack: 225,
    defense: 835,
  },
  "70+": {
    hp: 13567,
    attack: 237,
    defense: 893,
  },
  "80": {
    hp: 14694,
    attack: 256,
    defense: 967,
  },
  "80+": {
    hp: 15585,
    attack: 268,
    defense: 1025,
  },
  "90": {
    hp: 16712,
    attack: 287,
    defense: 1099,
  },
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
