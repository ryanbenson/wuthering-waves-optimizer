interface CharacterList {
  [rating: string]: CharacterListItem[];
}
interface CharacterListItem {
  key: string;
  name: string;
}
export function getCharactersAvailable(): CharacterList {
  return {
    five: [
      { key: "Calcharo", name: "Calcharo" },
      { key: "Changli", name: "Changli" },
      { key: "Encore", name: "Encore" },
      { key: "Jinhsi", name: "Jinhsi" },
      { key: "Jiyan", name: "Jiyan" },
      { key: "Yinlin", name: "Yinlin" },
      { key: "Zhezhi", name: "Zhezhi" },
    ],
    four: [
      { key: "Danjin", name: "Danjin" },
      { key: "Mortefi", name: "Mortefi" },
      { key: "Sanhua", name: "Sanhua" },
      { key: "Taoqi", name: "Taoqi" },
      { key: "Yuanwu", name: "Yuanwu" },
    ],
  };
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
  "Zhezhi",
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
