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
    hp: 1097,
    attack: 28,
    defense: 0,
  },
  "20": {
    hp: 2853.4067,
    attack: 72.8308,
    defense: 0,
  },
  "20+": {
    hp: 3583,
    attack: 93,
    defense: 0,
  },
  "40": {
    hp: 5433.5507,
    attack: 141.022,
    defense: 0,
  },
  "40+": {
    hp: 6165,
    attack: 162,
    defense: 0,
  },
  "50": {
    hp: 7089.3625,
    attack: 185.6176,
    defense: 0,
  },
  "50+": {
    hp: 7821,
    attack: 206,
    defense: 0,
  },
  "60": {
    hp: 8745.1743,
    attack: 230.2132,
    defense: 0,
  },
  "60+": {
    hp: 9476,
    attack: 252,
    defense: 0,
  },
  "70": {
    hp: 10400.8764,
    attack: 274.8088,
    defense: 0,
  },
  "70+": {
    hp: 11132,
    attack: 288,
    defense: 0,
  },
  "80": {
    hp: 12056.6882,
    attack: 312.4044,
    defense: 0,
  },
  "80+": {
    hp: 12788,
    attack: 326,
    defense: 0,
  },
  "90": {
    hp: 13712.5,
    attack: 350,
    defense: 0,
  },
};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
