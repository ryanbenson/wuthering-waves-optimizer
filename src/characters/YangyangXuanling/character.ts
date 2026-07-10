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
    hp: 2294.1702,
    attack: 88.4374,
    defense: 241.157,
  },
  "20+": {
    hp: 2881,
    attack: 113,
    defense: 302,
  },
  "40": {
    hp: 4368.6342,
    attack: 171.241,
    defense: 456.9904,
  },
  "40+": {
    hp: 4956,
    attack: 196,
    defense: 517,
  },
  "50": {
    hp: 5699.925,
    attack: 225.3928,
    defense: 595.3678,
  },
  "50+": {
    hp: 6287,
    attack: 250,
    defense: 656,
  },
  "60": {
    hp: 7031.2158,
    attack: 279.5446,
    defense: 733.7452,
  },
  "60+": {
    hp: 7619,
    attack: 305,
    defense: 795,
  },
  "70": {
    hp: 8362.4184,
    attack: 333.6964,
    defense: 872.1226,
  },
  "70+": {
    hp: 8950,
    attack: 350,
    defense: 934,
  },
  "80": {
    hp: 9693.7092,
    attack: 379.3482,
    defense: 1010.5094,
  },
  "80+": {
    hp: 10282,
    attack: 396,
    defense: 1072,
  },
  "90": {
    hp: 11025,
    attack: 425,
    defense: 1148.8868,
  },
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
