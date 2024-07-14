export function getCharactersAvailable(): string[] {
  return [
    "Jinhsi",
    "Changli",
    "Yinlin",
    "Jiyan",
    "Encore",
    "Calcharo",
    "Taoqi",
    "Danjin",
  ];
}

export const allCharacters: string[] = [
  "Aalto",
  "Baizhi",
  "Calcharo",
  "Changli",
  "Chixia",
  "Danjin",
  "Encore",
  "Jianxin",
  "Jinhsi",
  "Jiyan",
  "Lingyang",
  "Mortefi",
  "Rover-Havoc",
  "Rover-Spectro",
  "Sanhua",
  "Taoqi",
  "Verina",
  "Yangyang",
  "Yinlin",
  "Yuanwu",
];

async function loadModule(charName: string) {
  try {
    const module = await import(`@/characters/${charName}/index.ts`);
    return module;
  } catch (error) {
    console.error("Error loading module:", error);
  }
}

export async function getCharByName(charName: string) {
  const charModule = await loadModule(charName);
  const data = charModule.getData();
  return data;
}
