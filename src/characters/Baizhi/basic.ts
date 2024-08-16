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
    name: "Baizhi",
    rarity: 4,
    weapon: "Rectifiers",
    avatarUrl: "Baizhi.jpg",
    gender: "female",
    element: "Glacio",
  };
}
