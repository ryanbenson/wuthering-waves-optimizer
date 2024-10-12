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
    hp: 680,
    attack: 27,
    defense: 72,
  },
  "20": {
    hp: 1768,
    attack: 70,
    defense: 184,
  },
  "20+": {
    hp: 2222,
    attack: 90,
    defense: 231,
  },
  "40": {
    hp: 3368,
    attack: 135,
    defense: 350,
  },
  "40+": {
    hp: 3821,
    attack: 156,
    defense: 184,
  },
  "50": {
    hp: 4394,
    attack: 178,
    defense: 456,
  },
  "50+": {
    hp: 4847,
    attack: 199,
    defense: 502,
  },
  "60": {
    hp: 5420,
    attack: 221,
    defense: 562,
  },
  "60+": {
    hp: 5874,
    attack: 242,
    defense: 608,
  },
  "70": {
    hp: 6447,
    attack: 264,
    defense: 668,
  },
  "70+": {
    hp: 6900,
    attack: 278,
    defense: 714,
  },
  "80": {
    hp: 7473,
    attack: 301,
    defense: 774,
  },
  "80+": {
    hp: 7926,
    attack: 314,
    defense: 820,
  },
  "90": {
    hp: 8500,
    attack: 337,
    defense: 879,
  },
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
