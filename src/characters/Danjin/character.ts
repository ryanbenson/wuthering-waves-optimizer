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
    hp: 755,
    attack: 21,
    defense: 94,
  },
  "20": {
    hp: 1963,
    attack: 54,
    defense: 241,
  },
  "20+": {
    hp: 2467,
    attack: 70,
    defense: 302,
  },
  "40": {
    hp: 3739,
    attack: 105,
    defense: 456,
  },
  "40+": {
    hp: 4242,
    attack: 121,
    defense: 241,
  },
  "50": {
    hp: 4879,
    attack: 139,
    defense: 595,
  },
  "50+": {
    hp: 5382,
    attack: 154,
    defense: 656,
  },
  "60": {
    hp: 6018,
    attack: 172,
    defense: 733,
  },
  "60+": {
    hp: 6522,
    attack: 188,
    defense: 794,
  },
  "70": {
    hp: 7158,
    attack: 206,
    defense: 872,
  },
  "70+": {
    hp: 7661,
    attack: 216,
    defense: 933,
  },
  "80": {
    hp: 8297,
    attack: 234,
    defense: 1010,
  },
  "80+": {
    hp: 8801,
    attack: 244,
    defense: 1071,
  },
  "90": {
    hp: 9437,
    attack: 262,
    defense: 1148,
  },
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
