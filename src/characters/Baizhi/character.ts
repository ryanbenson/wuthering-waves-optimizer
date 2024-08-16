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
    hp: 1025,
    attack: 17,
    defense: 82,
  },
  "20": {
    hp: 2666,
    attack: 44,
    defense: 210,
  },
  "20+": {
    hp: 3349,
    attack: 56,
    defense: 263,
  },
  "40": {
    hp: 5076,
    attack: 85,
    defense: 398,
  },
  "40+": {
    hp: 5760,
    attack: 98,
    defense: 210,
  },
  "50": {
    hp: 6624,
    attack: 112,
    defense: 519,
  },
  "50+": {
    hp: 7307,
    attack: 125,
    defense: 572,
  },
  "60": {
    hp: 8171,
    attack: 139,
    defense: 640,
  },
  "60+": {
    hp: 8854,
    attack: 152,
    defense: 693,
  },
  "70": {
    hp: 9718,
    attack: 166,
    defense: 760,
  },
  "70+": {
    hp: 10401,
    attack: 175,
    defense: 813,
  },
  "80": {
    hp: 11265,
    attack: 189,
    defense: 881,
  },
  "80+": {
    hp: 11948,
    attack: 198,
    defense: 934,
  },
  "90": {
    hp: 12812,
    attack: 212,
    defense: 1002,
  },
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
