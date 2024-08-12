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
    hp: 788,
    attack: 21,
    defense: 88,
  },
  "20": {
    hp: 2049,
    attack: 54,
    defense: 225,
  },
  "20+": {
    hp: 2574,
    attack: 70,
    defense: 282,
  },
  "40": {
    hp: 3903,
    attack: 105,
    defense: 427,
  },
  "40+": {
    hp: 4428,
    attack: 121,
    defense: 225,
  },
  "50": {
    hp: 5092,
    attack: 139,
    defense: 557,
  },
  "50+": {
    hp: 5617,
    attack: 154,
    defense: 614,
  },
  "60": {
    hp: 6281,
    attack: 172,
    defense: 686,
  },
  "60+": {
    hp: 6807,
    attack: 188,
    defense: 743,
  },
  "70": {
    hp: 7471,
    attack: 206,
    defense: 816,
  },
  "70+": {
    hp: 7996,
    attack: 216,
    defense: 873,
  },
  "80": {
    hp: 8660,
    attack: 234,
    defense: 946,
  },
  "80+": {
    hp: 9185,
    attack: 244,
    defense: 1003,
  },
  "90": {
    hp: 9850,
    attack: 262,
    defense: 1075,
  },
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
