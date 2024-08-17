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
    hp: 1129,
    attack: 27,
    defense: 92,
  },
  "20": {
    hp: 2936,
    attack: 70,
    defense: 236,
  },
  "20+": {
    hp: 3689,
    attack: 90,
    defense: 295,
  },
  "40": {
    hp: 5592,
    attack: 135,
    defense: 447,
  },
  "40+": {
    hp: 6344,
    attack: 156,
    defense: 236,
  },
  "50": {
    hp: 7296,
    attack: 178,
    defense: 582,
  },
  "50+": {
    hp: 8048,
    attack: 199,
    defense: 642,
  },
  "60": {
    hp: 9000,
    attack: 221,
    defense: 718,
  },
  "60+": {
    hp: 9752,
    attack: 242,
    defense: 777,
  },
  "70": {
    hp: 10704,
    attack: 264,
    defense: 853,
  },
  "70+": {
    hp: 11456,
    attack: 278,
    defense: 913,
  },
  "80": {
    hp: 12408,
    attack: 301,
    defense: 989,
  },
  "80+": {
    hp: 13161,
    attack: 314,
    defense: 1048,
  },
  "90": {
    hp: 14112,
    attack: 337,
    defense: 1124,
  },
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
