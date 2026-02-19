export function getCharacterBasicInfo(): CharacterBasicInfo {
  return {
    name: "Luuk Herrsen",
    rarity: 5,
    weapon: "Gauntlets",
    avatarUrl: "LuukHerrsen.png",
    gender: "male",
    element: "Spectro",
    tuneBreakBoost: 0.1, // use decimal since this rolls into buff calc
  };
}
