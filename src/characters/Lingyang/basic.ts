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
    name: "Lingyang",
    rarity: 5,
    weapon: "Gauntlets",
    avatarUrl: "Lingyang.jpg",
    gender: "male",
    element: "Glacio",
  };
}
