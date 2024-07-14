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
    name: "Encore",
    rarity: 5,
    weapon: "Rectifiers",
    avatarUrl: "Encore.jpg",
    gender: "female",
    element: "Fusion",
  };
}
