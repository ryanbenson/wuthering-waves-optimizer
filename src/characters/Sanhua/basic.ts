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
    name: "Sanhua",
    rarity: 4,
    weapon: "Swords",
    avatarUrl: "Sanhua.jpg",
    gender: "female",
    element: "Glacio",
  };
}
