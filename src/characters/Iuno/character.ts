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
    hp: 842,
    attack: 36,
    defense: 92,
  },
  "20": {
    hp: 2190,
    attack: 93,
    defense: 236,
  },
  "20+": {
    hp: 2751,
    attack: 120,
    defense: 295,
  },
  "40": {
    hp: 4170,
    attack: 181,
    defense: 447,
  },
  "40+": {
    hp: 4731,
    attack: 208,
    defense: 236,
  },
  "50": {
    hp: 5441,
    attack: 238,
    defense: 582,
  },
  "50+": {
    hp: 6002,
    attack: 265,
    defense: 642,
  },
  "60": {
    hp: 6712,
    attack: 295,
    defense: 718,
  },
  "60+": {
    hp: 7273,
    attack: 322,
    defense: 777,
  },
  "70": {
    hp: 7983,
    attack: 353,
    defense: 853,
  },
  "70+": {
    hp: 8544,
    attack: 371,
    defense: 913,
  },
  "80": {
    hp: 9254,
    attack: 401,
    defense: 989,
  },
  "80+": {
    hp: 9815,
    attack: 419,
    defense: 1048,
  },
  "90": {
    hp: 10525,
    attack: 450,
    defense: 1124,
  },
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
