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
    name: "Yinlin",
    rarity: 5,
    weapon: "Rectifiers",
    avatarUrl: "test.jpg",
    gender: "female",
    element: "Electro",
  };
}
