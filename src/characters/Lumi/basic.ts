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
    name: "Lumi",
    rarity: 4,
    weapon: "Broadblades",
    avatarUrl: "Lumi.jpg",
    gender: "female",
    element: "Electro",
  };
}
