export function getCharactersAvailable(): string[] {
  return ["Jinhsi", "Changli", "Jiyan", "Calcharo", "Taoqi"];
}

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
