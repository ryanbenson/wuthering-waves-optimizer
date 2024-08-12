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
    name: "Aalto",
    rarity: 4,
    weapon: "Pistols",
    avatarUrl: "Aalto.jpg",
    gender: "male",
    element: "Aero",
  };
}
