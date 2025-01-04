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
      { key: "Camellya", name: "Camellya" },
      { key: "Carlotta", name: "Carlotta" },
      { key: "Changli", name: "Changli" },
      { key: "Encore", name: "Encore" },
      { key: "Jianxin", name: "Jianxin" },
      { key: "Jinhsi", name: "Jinhsi" },
      { key: "Jiyan", name: "Jiyan" },
      { key: "Lingyang", name: "Lingyang" },
      { key: "Roccia", name: "Roccia" },
      { key: "RoverHavocFemale", name: "Rover Havoc (Female)" },
      { key: "RoverHavocMale", name: "Rover Havoc (Male)" },
      { key: "RoverSpectroFemale", name: "Rover Spectro (Female)" },
      { key: "RoverSpectroMale", name: "Rover Spectro (Male)" },
      { key: "Shorekeeper", name: "Shorekeeper" },
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
      { key: "Lumi", name: "Lumi" },
      { key: "Mortefi", name: "Mortefi" },
      { key: "Sanhua", name: "Sanhua" },
      { key: "Taoqi", name: "Taoqi" },
      { key: "Yangyang", name: "Yangyang" },
      { key: "Youhu", name: "Youhu" },
      { key: "Yuanwu", name: "Yuanwu" },
    ],
  };
}

export const allCharacters: string[] = [
  "Aalto",
  "Baizhi",
  "Calcharo",
  "Camellya",
  "Carlotta",
  "Changli",
  "Chixia",
  "Danjin",
  "Encore",
  "Jianxin",
  "Jinhsi",
  "Jiyan",
  "Lingyang",
  "Lumi",
  "Mortefi",
  "Roccia",
  "RoverHavocFemale",
  "RoverHavocMale",
  "Rover-Spectro",
  "Sanhua",
  "Shorekeeper",
  "Taoqi",
  "Verina",
  "XiangliYao",
  "Yangyang",
  "Yinlin",
  "Youhu",
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
