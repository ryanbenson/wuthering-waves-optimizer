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
    name: "Changli",
    rarity: 5,
    weapon: "Swords",
    avatarUrl: "test.jpg",
    gender: "female",
    element: "Fusion",
  };
}
