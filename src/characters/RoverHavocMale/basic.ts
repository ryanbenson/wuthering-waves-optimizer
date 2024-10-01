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
    name: "Rover Havoc",
    rarity: 5,
    weapon: "Swords",
    avatarUrl: "RoverHavocMale.jpg",
    gender: "male",
    element: "Havoc",
  };
}
