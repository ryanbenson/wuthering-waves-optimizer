interface CharacterBasicInfo {
  name: string;
  rarity: number;
  weapon: string;
  avatarUrl: string;
  gender: string;
  element: string;
}

export function getCharacterBasicInfo(): CharacterBasicInfo {
  return {
    name: "Xiangli Yao",
    rarity: 5,
    weapon: "Gauntlets",
    avatarUrl: "XiangliYao.jpg",
    gender: "male",
    element: "Electro",
  };
}
