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
    hp: 979,
    attack: 30,
    defense: 98,
  },
  "20": {
    hp: 2546,
    attack: 78,
    defense: 251,
  },
  "20+": {
    hp: 3199,
    attack: 100,
    defense: 314,
  },
  "40": {
    hp: 4849,
    attack: 151,
    defense: 476,
  },
  "40+": {
    hp: 5501,
    attack: 173,
    defense: 251,
  },
  "50": {
    hp: 6326,
    attack: 198,
    defense: 620,
  },
  "50+": {
    hp: 6979,
    attack: 221,
    defense: 684,
  },
  "60": {
    hp: 7804,
    attack: 246,
    defense: 764,
  },
  "60+": {
    hp: 8457,
    attack: 269,
    defense: 828,
  },
  "70": {
    hp: 9282,
    attack: 294,
    defense: 909,
  },
  "70+": {
    hp: 9934,
    attack: 309,
    defense: 972,
  },
  "80": {
    hp: 10759,
    attack: 334,
    defense: 1053,
  },
  "80+": {
    hp: 11412,
    attack: 349,
    defense: 1117,
  },
  "90": {
    hp: 12237,
    attack: 375,
    defense: 1197,
  },
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
