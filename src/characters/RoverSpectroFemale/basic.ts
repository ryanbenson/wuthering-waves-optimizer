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
    name: "RoverSpectroFemale",
    rarity: 5,
    weapon: "Swords",
    avatarUrl: "RoverSpectroFemale.jpg",
    gender: "female",
    element: "Spectro",
  };
}
