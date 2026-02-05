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
    hp: 882,
    attack: 34,
    defense: 94,
  },
  "20": {
    hp: 2139,
    attack: 88,
    defense: 241,
  },
  "20+": {
    hp: 2882,
    attack: 113,
    defense: 302,
  },
  "40": {
    hp: 4214,
    attack: 171,
    defense: 456,
  },
  "40+": {
    hp: 4957,
    attack: 196,
    defense: 518,
  },
  "50": {
    hp: 5545,
    attack: 225,
    defense: 595,
  },
  "50+": {
    hp: 6288,
    attack: 250,
    defense: 656,
  },
  "60": {
    hp: 6876,
    attack: 279,
    defense: 733,
  },
  "60+": {
    hp: 7619,
    attack: 305,
    defense: 794,
  },
  "70": {
    hp: 8207,
    attack: 333,
    defense: 872,
  },
  "70+": {
    hp: 8950,
    attack: 350,
    defense: 933,
  },
  "80": {
    hp: 9539,
    attack: 379,
    defense: 1010,
  },
  "80+": {
    hp: 10282,
    attack: 396,
    defense: 1071,
  },
  "90": {
    hp: 11025,
    attack: 425,
    defense: 1148,
  },
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
