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
    hp: 1184,
    attack: 25,
    defense: 50,
  },
  "20": {
    hp: 3079,
    attack: 65,
    defense: 128,
  },
  "20+": {
    hp: 3868,
    attack: 83,
    defense: 160,
  },
  "40": {
    hp: 5864,
    attack: 125,
    defense: 243,
  },
  "40+": {
    hp: 6653,
    attack: 144,
    defense: 128,
  },
  "50": {
    hp: 7651,
    attack: 165,
    defense: 316,
  },
  "50+": {
    hp: 8440,
    attack: 184,
    defense: 349,
  },
  "60": {
    hp: 9438,
    attack: 205,
    defense: 390,
  },
  "60+": {
    hp: 10227,
    attack: 224,
    defense: 422,
  },
  "70": {
    hp: 11225,
    attack: 245,
    defense: 463,
  },
  "70+": {
    hp: 12015,
    attack: 257,
    defense: 496,
  },
  "80": {
    hp: 13012,
    attack: 278,
    defense: 537,
  },
  "80+": {
    hp: 13802,
    attack: 291,
    defense: 569,
  },
  "90": {
    hp: 14800,
    attack: 312,
    defense: 611,
  },
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
