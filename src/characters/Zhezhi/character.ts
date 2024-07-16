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
    hp: 980,
    attack: 30,
    defense: 98,
  },
  "20": {
    hp: 2549,
    attack: 78,
    defense: 251,
  },
  "20+": {
    hp: 3202,
    attack: 100,
    defense: 314,
  },
  "40": {
    hp: 4854,
    attack: 151,
    defense: 476,
  },
  "40+": {
    hp: 5507,
    attack: 173,
    defense: 251,
  },
  "50": {
    hp: 6333,
    attack: 198,
    defense: 620,
  },
  "50+": {
    hp: 6986,
    attack: 221,
    defense: 684,
  },
  "60": {
    hp: 7812,
    attack: 246,
    defense: 764,
  },
  "60+": {
    hp: 8465,
    attack: 269,
    defense: 828,
  },
  "70": {
    hp: 9291,
    attack: 294,
    defense: 909,
  },
  "70+": {
    hp: 9944,
    attack: 309,
    defense: 972,
  },
  "80": {
    hp: 10770,
    attack: 334,
    defense: 1053,
  },
  "80+": {
    hp: 11424,
    attack: 349,
    defense: 1117,
  },
  "90": {
    hp: 12250,
    attack: 375,
    defense: 1197,
  },
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
