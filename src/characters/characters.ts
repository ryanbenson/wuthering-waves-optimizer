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

export const allCharactersList = [
  // rarity 5
  { key: "Calcharo", name: "Calcharo", element: "Electro", rarity: 5 },
  { key: "Camellya", name: "Camellya", element: "Havoc", rarity: 5 },
  { key: "Carlotta", name: "Carlotta", element: "Glacio", rarity: 5 },
  { key: "Changli", name: "Changli", element: "Fusion", rarity: 5 },
  { key: "Encore", name: "Encore", element: "Fusion", rarity: 5 },
  { key: "Jianxin", name: "Jianxin", element: "Aero", rarity: 5 },
  { key: "Jinhsi", name: "Jinhsi", element: "Spectro", rarity: 5 },
  { key: "Jiyan", name: "Jiyan", element: "Aero", rarity: 5 },
  { key: "Lingyang", name: "Lingyang", element: "Glacio", rarity: 5 },
  { key: "Roccia", name: "Roccia", element: "Havoc", rarity: 5 },
  { key: "RoverHavocFemale", name: "Rover Havoc (Female)", element: "Havoc", rarity: 5 },
  { key: "RoverHavocMale", name: "Rover Havoc (Male)", element: "Havoc", rarity: 5 },
  { key: "RoverSpectroFemale", name: "Rover Spectro (Female)", element: "Spectro", rarity: 5 },
  { key: "RoverSpectroMale", name: "Rover Spectro (Male)", element: "Spectro", rarity: 5 },
  { key: "Shorekeeper", name: "Shorekeeper", element: "Spectro", rarity: 5 },
  { key: "Verina", name: "Verina", element: "Spectro", rarity: 5 },
  { key: "XiangliYao", name: "Xiangli Yao", element: "Electro", rarity: 5 },
  { key: "Yinlin", name: "Yinlin", element: "Electro", rarity: 5 },
  { key: "Zhezhi", name: "Zhezhi", element: "Glacio", rarity: 5 },
  // rarity 4
  { key: "Aalto", name: "Aalto", element: "Aero", rarity: 4 },
  { key: "Baizhi", name: "Baizhi", element: "Glacio", rarity: 4 },
  { key: "Chixia", name: "Chixia", element: "Fusion", rarity: 4 },
  { key: "Danjin", name: "Danjin", element: "Havoc", rarity: 4 },
  { key: "Lumi", name: "Lumi", element: "Electro", rarity: 4 },
  { key: "Mortefi", name: "Mortefi", element: "Fusion", rarity: 4 },
  { key: "Sanhua", name: "Sanhua", element: "Glacio", rarity: 4 },
  { key: "Taoqi", name: "Taoqi", element: "Havoc", rarity: 4 },
  { key: "Yangyang", name: "Yangyang", element: "Aero", rarity: 4 },
  { key: "Youhu", name: "Youhu", element: "Glacio", rarity: 4 },
  { key: "Yuanwu", name: "Yuanwu", element: "Electro", rarity: 4 },
];

export const characterElementsSetImageMap: Record<string, string> = {
  Glacio:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/FreezingFrost.webp",
  Fusion:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/MoltenRift.webp",
  Electro:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/VoidThunder.webp",
  Aero:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/SierraGale.webp",
  Spectro:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/CelestialLight.webp",
  Havoc:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/SunSinkingEclipse.webp",
};

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
