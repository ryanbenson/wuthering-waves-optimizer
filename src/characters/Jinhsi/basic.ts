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
    name: "Jinhsi",
    rarity: 5,
    weapon: "Broadblades",
    avatarUrl: "test.jpg",
    gender: "female",
    element: "Spectro",
  };
}
