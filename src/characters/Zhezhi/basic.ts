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
    name: "Zhezhi",
    rarity: 5,
    weapon: "Rectifiers",
    avatarUrl: "Zhezhi.jpg",
    gender: "female",
    element: "Glacio",
  };
}
