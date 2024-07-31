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
    hp: 727,
    attack: 24,
    defense: 78,
  },
  "20": {
    hp: 1890,
    attack: 62,
    defense: 200,
  },
  "20+": {
    hp: 2375,
    attack: 80,
    defense: 250,
  },
  "40": {
    hp: 3600,
    attack: 120,
    defense: 379,
  },
  "40+": {
    hp: 4085,
    attack: 138,
    defense: 200,
  },
  "50": {
    hp: 4698,
    attack: 159,
    defense: 494,
  },
  "50+": {
    hp: 5182,
    attack: 177,
    defense: 544,
  },
  "60": {
    hp: 5795,
    attack: 197,
    defense: 608,
  },
  "60+": {
    hp: 6280,
    attack: 215,
    defense: 659,
  },
  "70": {
    hp: 6892,
    attack: 235,
    defense: 723,
  },
  "70+": {
    hp: 7377,
    attack: 247,
    defense: 774,
  },
  "80": {
    hp: 7990,
    attack: 267,
    defense: 838,
  },
  "80+": {
    hp: 8474,
    attack: 279,
    defense: 889,
  },
  "90": {
    hp: 9087,
    attack: 300,
    defense: 953,
  },
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
