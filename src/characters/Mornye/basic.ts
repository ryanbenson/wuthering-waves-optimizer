export function getCharacterBasicInfo(): CharacterBasicInfo {
  return {
    name: "Mornye",
    rarity: 5,
    weapon: "Broadblades",
    avatarUrl: "Mornye.png",
    gender: "female",
    element: "Fusion",
    tuneBreakBoost: 0.1, // use decimal since this rolls into buff calc
  };
}
