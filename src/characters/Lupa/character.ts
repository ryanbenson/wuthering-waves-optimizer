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
    hp: 953,
    attack: 31,
    defense: 97,
  },
  "20": {
    hp: 2478,
    attack: 80,
    defense: 248,
  },
  "20+": {
    hp: 3114,
    attack: 103,
    defense: 311,
  },
  "40": {
    hp: 4720,
    attack: 156,
    defense: 471,
  },
  "40+": {
    hp: 5355,
    attack: 179,
    defense: 248,
  },
  "50": {
    hp: 6158,
    attack: 205,
    defense: 614,
  },
  "50+": {
    hp: 6794,
    attack: 228,
    defense: 677,
  },
  "60": {
    hp: 7597,
    attack: 254,
    defense: 757,
  },
  "60+": {
    hp: 8232,
    attack: 278,
    defense: 820,
  },
  "70": {
    hp: 9035,
    attack: 304,
    defense: 899,
  },
  "70+": {
    hp: 9670,
    attack: 319,
    defense: 962,
  },
  "80": {
    hp: 10474,
    attack: 345,
    defense: 1042,
  },
  "80+": {
    hp: 11109,
    attack: 361,
    defense: 1105,
  },
  "90": {
    hp: 11912,
    attack: 387,
    defense: 1185,
  },
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
