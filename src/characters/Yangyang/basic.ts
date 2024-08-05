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
    name: "Yangyang",
    rarity: 4,
    weapon: "Swords",
    avatarUrl: "Yangyang.jpg",
    gender: "female",
    element: "Aero",
  };
}
