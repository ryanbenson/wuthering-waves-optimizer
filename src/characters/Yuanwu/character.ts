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
    hp: 682,
    attack: 18,
    defense: 134,
  },
  "20": {
    hp: 1773,
    attack: 46,
    defense: 343,
  },
  "20+": {
    hp: 2228,
    attack: 60,
    defense: 430,
  },
  "40": {
    hp: 3378,
    attack: 90,
    defense: 651,
  },
  "40+": {
    hp: 3832,
    attack: 104,
    defense: 343,
  },
  "50": {
    hp: 4407,
    attack: 119,
    defense: 848,
  },
  "50+": {
    hp: 4862,
    attack: 132,
    defense: 935,
  },
  "60": {
    hp: 5436,
    attack: 147,
    defense: 1045,
  },
  "60+": {
    hp: 5891,
    attack: 161,
    defense: 1132,
  },
  "70": {
    hp: 6466,
    attack: 176,
    defense: 1243,
  },
  "70+": {
    hp: 6920,
    attack: 185,
    defense: 1330,
  },
  "80": {
    hp: 7495,
    attack: 200,
    defense: 1440,
  },
  "80+": {
    hp: 7950,
    attack: 209,
    defense: 1527,
  },
  "90": {
    hp: 8525,
    attack: 225,
    defense: 1637,
  },
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
