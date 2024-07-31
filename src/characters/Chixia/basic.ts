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
    name: "Chixia",
    rarity: 4,
    weapon: "Pistols",
    avatarUrl: "Chixia.jpg",
    gender: "female",
    element: "Fusion",
  };
}
