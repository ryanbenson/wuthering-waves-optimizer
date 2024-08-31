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
    name: "Shorekeeper",
    rarity: 5,
    weapon: "Rectifiers",
    avatarUrl: "Shorekeeper.jpg",
    gender: "female",
    element: "Spectro",
  };
}
