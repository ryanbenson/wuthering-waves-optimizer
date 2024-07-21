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
    hp: 805,
    attack: 22,
    defense: 77,
  },
  "20": {
    hp: 2093,
    attack: 57,
    defense: 197,
  },
  "20+": {
    hp: 2630,
    attack: 73,
    defense: 247,
  },
  "40": {
    hp: 3987,
    attack: 110,
    defense: 374,
  },
  "40+": {
    hp: 4523,
    attack: 127,
    defense: 197,
  },
  "50": {
    hp: 5202,
    attack: 145,
    defense: 487,
  },
  "50+": {
    hp: 5739,
    attack: 162,
    defense: 537,
  },
  "60": {
    hp: 6417,
    attack: 180,
    defense: 601,
  },
  "60+": {
    hp: 6953,
    attack: 197,
    defense: 650,
  },
  "70": {
    hp: 7632,
    attack: 215,
    defense: 714,
  },
  "70+": {
    hp: 8169,
    attack: 226,
    defense: 764,
  },
  "80": {
    hp: 8847,
    attack: 245,
    defense: 827,
  },
  "80+": {
    hp: 9384,
    attack: 256,
    defense: 877,
  },
  "90": {
    hp: 10062,
    attack: 275,
    defense: 941,
  },
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
