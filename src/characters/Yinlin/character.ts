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
    hp: 880,
    attack: 32,
    defense: 105,
  },
  "20": {
    hp: 2288,
    attack: 83,
    defense: 269,
  },
  "20+": {
    hp: 2875,
    attack: 107,
    defense: 337,
  },
  "40": {
    hp: 4358,
    attack: 161,
    defense: 510,
  },
  "40+": {
    hp: 4945,
    attack: 185,
    defense: 269,
  },
  "50": {
    hp: 5687,
    attack: 212,
    defense: 665,
  },
  "50+": {
    hp: 6273,
    attack: 236,
    defense: 733,
  },
  "60": {
    hp: 7015,
    attack: 263,
    defense: 819,
  },
  "60+": {
    hp: 7601,
    attack: 287,
    defense: 887,
  },
  "70": {
    hp: 8343,
    attack: 314,
    defense: 974,
  },
  "70+": {
    hp: 8930,
    attack: 330,
    defense: 1042,
  },
  "80": {
    hp: 9671,
    attack: 357,
    defense: 1128,
  },
  "80+": {
    hp: 10258,
    attack: 373,
    defense: 1196,
  },
  "90": {
    hp: 11000,
    attack: 400,
    defense: 1283,
  },
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
