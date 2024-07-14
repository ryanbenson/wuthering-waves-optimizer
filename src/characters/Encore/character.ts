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
    hp: 841,
    attack: 34,
    defense: 102,
  },
  "20": {
    hp: 2187,
    attack: 88,
    defense: 261,
  },
  "20+": {
    hp: 2748,
    attack: 113,
    defense: 327,
  },
  "40": {
    hp: 4165,
    attack: 171,
    defense: 495,
  },
  "40+": {
    hp: 4726,
    attack: 196,
    defense: 261,
  },
  "50": {
    hp: 5434,
    attack: 225,
    defense: 646,
  },
  "50+": {
    hp: 5995,
    attack: 250,
    defense: 712,
  },
  "60": {
    hp: 6704,
    attack: 279,
    defense: 796,
  },
  "60+": {
    hp: 7264,
    attack: 305,
    defense: 862,
  },
  "70": {
    hp: 7973,
    attack: 333,
    defense: 946,
  },
  "70+": {
    hp: 8534,
    attack: 350,
    defense: 1012,
  },
  "80": {
    hp: 9243,
    attack: 379,
    defense: 1096,
  },
  "80+": {
    hp: 9803,
    attack: 396,
    defense: 1162,
  },
  "90": {
    hp: 10512,
    attack: 425,
    defense: 1246,
  },
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
