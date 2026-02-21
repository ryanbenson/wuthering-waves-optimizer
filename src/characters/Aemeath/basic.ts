export function getCharacterBasicInfo(): CharacterBasicInfo {
  return {
    name: "Aemeath",
    rarity: 5,
    weapon: "Swords",
    avatarUrl: "Aemeath.png",
    gender: "female",
    element: "Fusion",
    tuneBreakBoost: 0.1, // use decimal since this rolls into buff calc
    fusionBurst: true,
  };
}
