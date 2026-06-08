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
    hp: 928,
    attack: 32,
    defense: 96,
  },
  "20": {
    hp: 2413,
    attack: 83,
    defense: 182,
  },
  "20+": {
    hp: 3032,
    attack: 107,
    defense: 246,
  },
  "40": {
    hp: 4596,
    attack: 161,
    defense: 402,
  },
  "40+": {
    hp: 5215,
    attack: 185,
    defense: 466,
  },
  "50": {
    hp: 5997,
    attack: 212,
    defense: 544,
  },
  "50+": {
    hp: 6615,
    attack: 236,
    defense: 608,
  },
  "60": {
    hp: 7397,
    attack: 263,
    defense: 685,
  },
  "60+": {
    hp: 8016,
    attack: 287,
    defense: 749,
  },
  "70": {
    hp: 8798,
    attack: 314,
    defense: 826,
  },
  "70+": {
    hp: 9417,
    attack: 330,
    defense: 890,
  },
  "80": {
    hp: 10199,
    attack: 357,
    defense: 968,
  },
  "80+": {
    hp: 10817,
    attack: 373,
    defense: 1032,
  },
  "90": {
    hp: 11600,
    attack: 400,
    defense: 1173,
  },
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
