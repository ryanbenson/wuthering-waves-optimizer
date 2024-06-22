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
    hp: 839,
    attack: 35,
    defense: 97,
  },
  "20": {
    hp: 2182,
    attack: 91,
    defense: 248,
  },
  "20+": {
    hp: 2741,
    attack: 117,
    defense: 311,
  },
  "40": {
    hp: 4155,
    attack: 176,
    defense: 471,
  },
  "40+": {
    hp: 4715,
    attack: 202,
    defense: 248,
  },
  "50": {
    hp: 5422,
    attack: 232,
    defense: 614,
  },
  "50+": {
    hp: 5981,
    attack: 258,
    defense: 677,
  },
  "60": {
    hp: 6688,
    attack: 287,
    defense: 757,
  },
  "60+": {
    hp: 7247,
    attack: 314,
    defense: 820,
  },
  "70": {
    hp: 7954,
    attack: 343,
    defense: 899,
  },
  "70+": {
    hp: 8514,
    attack: 361,
    defense: 962,
  },
  "80": {
    hp: 9221,
    attack: 390,
    defense: 1042,
  },
  "80+": {
    hp: 9780,
    attack: 408,
    defense: 1105,
  },
  "90": {
    hp: 10487,
    attack: 437,
    defense: 1185,
  },
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
