export function getCharactersAvailable(): string[] {
  return ["Jinhsi", "Changli", "Jiyan", "Calcharo", "Taoqi"];
}

export const allCharacters: string[] = [
  "Sanhua",
  "Baizhi",
  "Lingyang",
  "Chixia",
  "Encore",
  "Mortefi",
  "Changli",
  "Calcharo",
  "Yinlin",
  "Yuanwu",
  "Jinhsi",
  "Yangyang",
  "Aalto",
  "Jiyan",
  "Jianxin",
  "Rover-Spectro",
  "Rover-Havoc",
  "Verina",
  "Taoqi",
  "Danjin",
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
