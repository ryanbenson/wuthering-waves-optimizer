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
    hp: 1337,
    attack: 23,
    defense: 90,
  },
  "20": {
    hp: 3477.6707,
    attack: 59.8253,
    defense: 230.895,
  },
  "20+": {
    hp: 4367,
    attack: 76,
    defense: 288,
  },
  "40": {
    hp: 6622.2947,
    attack: 115.8395,
    defense: 437.544,
  },
  "40+": {
    hp: 7514,
    attack: 132,
    defense: 496,
  },
  "50": {
    hp: 8640.3625,
    attack: 152.4716,
    defense: 570.033,
  },
  "50+": {
    hp: 9532,
    attack: 169,
    defense: 628,
  },
  "60": {
    hp: 10658.4303,
    attack: 189.1037,
    defense: 702.522,
  },
  "60+": {
    hp: 11549,
    attack: 207,
    defense: 761,
  },
  "70": {
    hp: 12676.3644,
    attack: 225.7358,
    defense: 835.011,
  },
  "70+": {
    hp: 13568,
    attack: 237,
    defense: 894,
  },
  "80": {
    hp: 14694.4322,
    attack: 256.6179,
    defense: 967.509,
  },
  "80+": {
    hp: 15586,
    attack: 268,
    defense: 1026,
  },
  "90": {
    hp: 16712.5,
    attack: 287.5,
    defense: 1099.998,
  },
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
