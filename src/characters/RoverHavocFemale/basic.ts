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
    name: "RoverHavocFemale",
    rarity: 5,
    weapon: "Swords",
    avatarUrl: "RoverHavocFemale.jpg",
    gender: "female",
    element: "Havoc",
  };
}
