export function getCharacterBasicInfo(): CharacterBasicInfo {
  return {
    name: "Cartethyia",
    rarity: 5,
    weapon: "Swords",
    avatarUrl: "Cartethyia.png",
    gender: "female",
    element: "Aero",
    aeroErosion: true,
    image:
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconRolePile/T_IconRole_Pile_katixiya_UI.webp",
    inherentSkillIcons: [
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconKatixiya/SP_IconKatixiyaD1.webp",
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconKatixiya/SP_IconKatixiyaD2.webp",
    ],
    signatureWeapon: "DefiersThorn",
    liveResultBarStats: ["totalHp", "totalCritRate", "totalCritDMG", "energyRegen"],
  };
}
