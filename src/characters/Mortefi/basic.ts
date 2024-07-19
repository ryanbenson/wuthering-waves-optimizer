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
    name: "Mortefi",
    rarity: 5,
    weapon: "Pistols",
    avatarUrl: "Mortefi.jpg",
    gender: "male",
    element: "Fusion",
  };
}
