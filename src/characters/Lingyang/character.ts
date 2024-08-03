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
    hp: 831,
    attack: 35,
    defense: 99,
  },
  "20": {
    hp: 2161,
    attack: 91,
    defense: 253,
  },
  "20+": {
    hp: 2715,
    attack: 117,
    defense: 318,
  },
  "40": {
    hp: 4116,
    attack: 176,
    defense: 481,
  },
  "40+": {
    hp: 4670,
    attack: 202,
    defense: 253,
  },
  "50": {
    hp: 5370,
    attack: 232,
    defense: 627,
  },
  "50+": {
    hp: 5924,
    attack: 258,
    defense: 691,
  },
  "60": {
    hp: 6624,
    attack: 287,
    defense: 772,
  },
  "60+": {
    hp: 7178,
    attack: 314,
    defense: 836,
  },
  "70": {
    hp: 7878,
    attack: 343,
    defense: 918,
  },
  "70+": {
    hp: 8432,
    attack: 361,
    defense: 982,
  },
  "80": {
    hp: 9133,
    attack: 390,
    defense: 1064,
  },
  "80+": {
    hp: 9687,
    attack: 408,
    defense: 1128,
  },
  "90": {
    hp: 10387,
    attack: 437,
    defense: 1209,
  },
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
