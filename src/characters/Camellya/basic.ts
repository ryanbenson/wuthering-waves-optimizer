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
    name: "Camellya",
    rarity: 5,
    weapon: "Swords",
    avatarUrl: "Camellya.jpg",
    gender: "female",
    element: "Havoc",
  };
}
