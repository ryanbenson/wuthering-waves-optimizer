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
    hp: 716,
    attack: 18,
    defense: 128,
  },
  "20": {
    hp: 1862,
    attack: 46,
    defense: 328,
  },
  "20+": {
    hp: 2339,
    attack: 60,
    defense: 411,
  },
  "40": {
    hp: 3546,
    attack: 90,
    defense: 622,
  },
  "40+": {
    hp: 4023,
    attack: 104,
    defense: 728,
  },
  "50": {
    hp: 4627,
    attack: 119,
    defense: 810,
  },
  "50+": {
    hp: 5104,
    attack: 132,
    defense: 893,
  },
  "60": {
    hp: 5707,
    attack: 147,
    defense: 999,
  },
  "60+": {
    hp: 6185,
    attack: 161,
    defense: 1082,
  },
  "70": {
    hp: 6788,
    attack: 176,
    defense: 1187,
  },
  "70+": {
    hp: 7265,
    attack: 185,
    defense: 1270,
  },
  "80": {
    hp: 7869,
    attack: 200,
    defense: 1376,
  },
  "80+": {
    hp: 8346,
    attack: 209,
    defense: 1458,
  },
  "90": {
    hp: 8950,
    attack: 225,
    defense: 1564,
  },
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
