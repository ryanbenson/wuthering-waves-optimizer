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
    hp: 798,
    attack: 21,
    defense: 86,
  },
  "20": {
    hp: 2075,
    attack: 54,
    defense: 220,
  },
  "20+": {
    hp: 2607,
    attack: 70,
    defense: 276,
  },
  "40": {
    hp: 3952,
    attack: 105,
    defense: 418,
  },
  "40+": {
    hp: 4484,
    attack: 121,
    defense: 220,
  },
  "50": {
    hp: 5157,
    attack: 139,
    defense: 544,
  },
  "50+": {
    hp: 5689,
    attack: 154,
    defense: 600,
  },
  "60": {
    hp: 6361,
    attack: 172,
    defense: 671,
  },
  "60+": {
    hp: 6893,
    attack: 188,
    defense: 727,
  },
  "70": {
    hp: 7565,
    attack: 206,
    defense: 797,
  },
  "70+": {
    hp: 8098,
    attack: 216,
    defense: 853,
  },
  "80": {
    hp: 8770,
    attack: 234,
    defense: 924,
  },
  "80+": {
    hp: 9302,
    attack: 244,
    defense: 980,
  },
  "90": {
    hp: 9975,
    attack: 262,
    defense: 1051,
  },
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
