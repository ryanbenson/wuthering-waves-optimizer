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
    name: "Jianxin",
    rarity: 5,
    weapon: "Gauntlets",
    avatarUrl: "Jianxin.jpg",
    gender: "female",
    element: "Aero",
  };
}
