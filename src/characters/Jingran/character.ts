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
    hp: 932,
    attack: 33,
    defense: 0,
  },
  "20": {
    hp: 2424.2252,
    attack: 85.8363,
    defense: 0,
  },
  "20+": {
    hp: 3045,
    attack: 109,
    defense: 0,
  },
  "40": {
    hp: 4616.2892,
    attack: 166.2045,
    defense: 0,
  },
  "40+": {
    hp: 5238,
    attack: 191,
    defense: 0,
  },
  "50": {
    hp: 6023.05,
    attack: 218.7636,
    defense: 0,
  },
  "50+": {
    hp: 6645,
    attack: 242,
    defense: 0,
  },
  "60": {
    hp: 7429.8108,
    attack: 271.3227,
    defense: 0,
  },
  "60+": {
    hp: 8050,
    attack: 296,
    defense: 0,
  },
  "70": {
    hp: 8836.4784,
    attack: 323.8818,
    defense: 0,
  },
  "70+": {
    hp: 9458,
    attack: 340,
    defense: 0,
  },
  "80": {
    hp: 10243.2392,
    attack: 368.1909,
    defense: 0,
  },
  "80+": {
    hp: 10865,
    attack: 385,
    defense: 0,
  },
  "90": {
    hp: 11650,
    attack: 412.5,
    defense: 0,
  },
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
