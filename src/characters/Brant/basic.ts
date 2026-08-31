export function getCharacterBasicInfo(): CharacterBasicInfo {
  return {
    name: "Brant",
    rarity: 5,
    weapon: "Swords",
    avatarUrl: "Brant.png",
    gender: "male",
    element: "Fusion",
    image:
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconRolePile/T_IconRole_Pile_Bulante_UI.webp",
    inherentSkillIcons: [
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconBulante/SP_IconBulanteD1.webp",
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconBulante/SP_IconBulanteD2.webp",
    ],
    signatureWeapon: "UnflickeringValor",
    // Example config for the Labs-flagged Live Result Bar (see
    // src/calculator/liveResultBar.ts). Prefers a saved rotation's total;
    // falls back to the generic cross-character default until one exists.
    liveResultBarDefaultTarget: { type: "rotation" },
    liveResultBarStats: ["totalAtk", "totalCritRate", "totalCritDMG", "energyRegen"],
    suggestedWeapons: [],
  };
}
