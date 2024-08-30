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
    name: "Youhu",
    rarity: 4,
    weapon: "Gauntlets",
    avatarUrl: "Youhu.jpg",
    gender: "female",
    element: "Glacio",
  };
}
