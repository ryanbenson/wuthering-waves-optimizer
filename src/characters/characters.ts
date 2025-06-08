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
      { key: "Brant", name: "Brant" },
      { key: "Calcharo", name: "Calcharo" },
      { key: "Camellya", name: "Camellya" },
      { key: "Cantarella", name: "Cantarella" },
      { key: "Carlotta", name: "Carlotta" },
      { key: "Cartethyia", name: "Cartethyia" },
      { key: "Changli", name: "Changli" },
      { key: "Ciaccona", name: "Ciaccona" },
      { key: "Encore", name: "Encore" },
      { key: "Jianxin", name: "Jianxin" },
      { key: "Jinhsi", name: "Jinhsi" },
      { key: "Jiyan", name: "Jiyan" },
      { key: "Lingyang", name: "Lingyang" },
      { key: "Phoebe", name: "Phoebe" },
      { key: "Roccia", name: "Roccia" },
      { key: "RoverAeroFemale", name: "Rover Aero (Female)" },
      { key: "RoverAeroMale", name: "Rover Aero (Male)" },
      { key: "RoverHavocFemale", name: "Rover Havoc (Female)" },
      { key: "RoverHavocMale", name: "Rover Havoc (Male)" },
      { key: "RoverSpectroFemale", name: "Rover Spectro (Female)" },
      { key: "RoverSpectroMale", name: "Rover Spectro (Male)" },
      { key: "Shorekeeper", name: "Shorekeeper" },
      { key: "Verina", name: "Verina" },
      { key: "XiangliYao", name: "Xiangli Yao" },
      { key: "Yinlin", name: "Yinlin" },
      { key: "Zani", name: "Zani" },
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
  {
    key: "Brant",
    name: "Brant",
    element: "Fusion",
    rarity: 5,
    weapon: "Sword",
  },
  {
    key: "Calcharo",
    name: "Calcharo",
    element: "Electro",
    rarity: 5,
    weapon: "Broadblade",
  },
  {
    key: "Camellya",
    name: "Camellya",
    element: "Havoc",
    rarity: 5,
    weapon: "Sword",
  },
  {
    key: "Cantarella",
    name: "Cantarella",
    element: "Havoc",
    rarity: 5,
    weapon: "Rectifier",
  },
  {
    key: "Carlotta",
    name: "Carlotta",
    element: "Glacio",
    rarity: 5,
    weapon: "Pistol",
  },
  {
    key: "Cartethyia",
    name: "Cartethyia",
    element: "Aero",
    rarity: 5,
    weapon: "Sword",
  },
  {
    key: "Changli",
    name: "Changli",
    element: "Fusion",
    rarity: 5,
    weapon: "Sword",
  },
  {
    key: "Ciaccona",
    name: "Ciaccona",
    element: "Aero",
    rarity: 5,
    weapon: "Pistol",
  },
  {
    key: "Encore",
    name: "Encore",
    element: "Fusion",
    rarity: 5,
    weapon: "Rectifier",
  },
  {
    key: "Jianxin",
    name: "Jianxin",
    element: "Aero",
    rarity: 5,
    weapon: "Gauntlet",
  },
  {
    key: "Jinhsi",
    name: "Jinhsi",
    element: "Spectro",
    rarity: 5,
    weapon: "Broadblade",
  },
  {
    key: "Jiyan",
    name: "Jiyan",
    element: "Aero",
    rarity: 5,
    weapon: "Broadblade",
  },
  {
    key: "Lingyang",
    name: "Lingyang",
    element: "Glacio",
    rarity: 5,
    weapon: "Gauntlet",
  },
  {
    key: "Phoebe",
    name: "Phoebe",
    element: "Spectro",
    rarity: 5,
    weapon: "Rectifier",
  },
  {
    key: "Roccia",
    name: "Roccia",
    element: "Havoc",
    rarity: 5,
    weapon: "Gauntlet",
  },
  {
    key: "RoverAeroFemale",
    name: "Rover Aero",
    element: "Aero",
    rarity: 5,
    weapon: "Sword",
  },
  {
    key: "RoverAeroMale",
    name: "Rover Aero",
    element: "Aero",
    rarity: 5,
    weapon: "Sword",
  },
  {
    key: "RoverHavocFemale",
    name: "Rover Havoc",
    element: "Havoc",
    rarity: 5,
    weapon: "Sword",
  },
  {
    key: "RoverHavocMale",
    name: "Rover Havoc",
    element: "Havoc",
    rarity: 5,
    weapon: "Sword",
  },
  {
    key: "RoverSpectroFemale",
    name: "Rover Spectro",
    element: "Spectro",
    rarity: 5,
    weapon: "Sword",
  },
  {
    key: "RoverSpectroMale",
    name: "Rover Spectro",
    element: "Spectro",
    rarity: 5,
    weapon: "Sword",
  },
  {
    key: "Shorekeeper",
    name: "Shorekeeper",
    element: "Spectro",
    rarity: 5,
    weapon: "Rectifier",
  },
  {
    key: "Verina",
    name: "Verina",
    element: "Spectro",
    rarity: 5,
    weapon: "Rectifier",
  },
  {
    key: "XiangliYao",
    name: "Xiangli Yao",
    element: "Electro",
    rarity: 5,
    weapon: "Gauntlet",
  },
  {
    key: "Yinlin",
    name: "Yinlin",
    element: "Electro",
    rarity: 5,
    weapon: "Rectifier",
  },
  {
    key: "Zani",
    name: "Zani",
    element: "Spectro",
    rarity: 5,
    weapon: "Gauntlet",
  },
  {
    key: "Zhezhi",
    name: "Zhezhi",
    element: "Glacio",
    rarity: 5,
    weapon: "Rectifier",
  },
  // rarity 4
  { key: "Aalto", name: "Aalto", element: "Aero", rarity: 4, weapon: "Pistol" },
  {
    key: "Baizhi",
    name: "Baizhi",
    element: "Glacio",
    rarity: 4,
    weapon: "Rectifier",
  },
  {
    key: "Chixia",
    name: "Chixia",
    element: "Fusion",
    rarity: 4,
    weapon: "Pistol",
  },
  {
    key: "Danjin",
    name: "Danjin",
    element: "Havoc",
    rarity: 4,
    weapon: "Sword",
  },
  {
    key: "Lumi",
    name: "Lumi",
    element: "Electro",
    rarity: 4,
    weapon: "Broadblade",
  },
  {
    key: "Mortefi",
    name: "Mortefi",
    element: "Fusion",
    rarity: 4,
    weapon: "Pistol",
  },
  {
    key: "Sanhua",
    name: "Sanhua",
    element: "Glacio",
    rarity: 4,
    weapon: "Sword",
  },
  {
    key: "Taoqi",
    name: "Taoqi",
    element: "Havoc",
    rarity: 4,
    weapon: "Broadblade",
  },
  {
    key: "Yangyang",
    name: "Yangyang",
    element: "Aero",
    rarity: 4,
    weapon: "Sword",
  },
  {
    key: "Youhu",
    name: "Youhu",
    element: "Glacio",
    rarity: 4,
    weapon: "Gauntlet",
  },
  {
    key: "Yuanwu",
    name: "Yuanwu",
    element: "Electro",
    rarity: 4,
    weapon: "Gauntlet",
  },
];

export const characterElementsSetImageMap: Record<string, string> = {
  Glacio:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/FreezingFrost.webp",
  Fusion:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/MoltenRift.webp",
  Electro:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/VoidThunder.webp",
  Aero: "https://ryanbenson.github.io/wuthering-waves-assets/images/SierraGale.webp",
  Spectro:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/CelestialLight.webp",
  Havoc:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/SunSinkingEclipse.webp",
};

export const weaponTypesImageMap: Record<string, string> = {
  Broadblade:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/broadblade.webp",
  Sword:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/sword.webp",
  Pistol:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/pistol.webp",
  Gauntlet:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/gauntlet.webp",
  Rectifier:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/rectifier.webp",
};

export const allCharacters: string[] = [
  "Aalto",
  "Baizhi",
  "Brant",
  "Calcharo",
  "Camellya",
  "Cantarella",
  "Carlotta",
  "Changli",
  "Chixia",
  "Ciaccona",
  "Danjin",
  "Encore",
  "Jianxin",
  "Jinhsi",
  "Jiyan",
  "Lingyang",
  "Lumi",
  "Mortefi",
  "Phoebe",
  "Roccia",
  "RoverAeroFemale",
  "RoverAeroMale",
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
  "Zani",
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
