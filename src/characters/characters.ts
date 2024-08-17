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
      { key: "Jianxin", name: "Jianxin" },
      { key: "Jinhsi", name: "Jinhsi" },
      { key: "Jiyan", name: "Jiyan" },
      { key: "Lingyang", name: "Lingyang" },
      { key: "RoverHavocFemale", name: "Rover Havoc (Female)" },
      { key: "RoverHavocMale", name: "Rover Havoc (Male)" },
      { key: "RoverSpectroFemale", name: "Rover Spectro (Female)" },
      { key: "RoverSpectroMale", name: "Rover Spectro (Male)" },
      { key: "Verina", name: "Verina" },
      { key: "XiangliYao", name: "Xiangli Yao" },
      { key: "Yinlin", name: "Yinlin" },
      { key: "Zhezhi", name: "Zhezhi" },
    ],
    four: [
      { key: "Aalto", name: "Aalto" },
      { key: "Baizhi", name: "Baizhi" },
      { key: "Chixia", name: "Chixia" },
      { key: "Danjin", name: "Danjin" },
      { key: "Mortefi", name: "Mortefi" },
      { key: "Sanhua", name: "Sanhua" },
      { key: "Taoqi", name: "Taoqi" },
      { key: "Yangyang", name: "Yangyang" },
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
  "RoverHavocFemale",
  "RoverHavocMale",
  "Rover-Spectro",
  "Sanhua",
  "Taoqi",
  "Verina",
  "XiangliYao",
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
