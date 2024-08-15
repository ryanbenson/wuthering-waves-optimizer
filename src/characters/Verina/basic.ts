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
    name: "Verina",
    rarity: 5,
    weapon: "Rectifiers",
    avatarUrl: "Verina.jpg",
    gender: "female",
    element: "Spectro",
  };
}
