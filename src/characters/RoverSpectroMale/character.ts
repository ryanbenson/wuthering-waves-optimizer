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
    hp: 912,
    attack: 30,
    defense: 112,
  },
  "20": {
    hp: 2372,
    attack: 78,
    defense: 287,
  },
  "20+": {
    hp: 2980,
    attack: 100,
    defense: 359,
  },
  "40": {
    hp: 4517,
    attack: 151,
    defense: 544,
  },
  "40+": {
    hp: 5125,
    attack: 173,
    defense: 287,
  },
  "50": {
    hp: 5893,
    attack: 198,
    defense: 709,
  },
  "50+": {
    hp: 6501,
    attack: 221,
    defense: 781,
  },
  "60": {
    hp: 7270,
    attack: 246,
    defense: 874,
  },
  "60+": {
    hp: 7878,
    attack: 269,
    defense: 946,
  },
  "70": {
    hp: 8646,
    attack: 294,
    defense: 1039,
  },
  "70+": {
    hp: 9254,
    attack: 309,
    defense: 1111,
  },
  "80": {
    hp: 10023,
    attack: 334,
    defense: 1204,
  },
  "80+": {
    hp: 10631,
    attack: 349,
    defense: 1276,
  },
  "90": {
    hp: 11400,
    attack: 375,
    defense: 1368,
  },
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
