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
    name: "Danjin",
    rarity: 4,
    weapon: "Swords",
    avatarUrl: "test.jpg",
    gender: "female",
    element: "Havoc",
  };
}
