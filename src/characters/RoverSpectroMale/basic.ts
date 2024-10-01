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
    name: "Rover Spectro",
    rarity: 5,
    weapon: "Swords",
    avatarUrl: "RoverSpectroMale.jpg",
    gender: "male",
    element: "Spectro",
  };
}
