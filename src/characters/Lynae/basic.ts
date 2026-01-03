export function getCharacterBasicInfo(): CharacterBasicInfo {
  return {
    name: "Lynae",
    rarity: 5,
    weapon: "Pistols",
    avatarUrl: "Lynae.png",
    gender: "female",
    element: "Spectro",
    tuneBreakBoost: 0.1, // use decimal since this rolls into buff calc
  };
}
