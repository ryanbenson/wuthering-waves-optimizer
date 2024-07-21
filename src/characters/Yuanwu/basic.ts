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
    name: "Yaunwu",
    rarity: 4,
    weapon: "Gauntlets",
    avatarUrl: "Yaunwu.jpg",
    gender: "male",
    element: "Electro",
  };
}
