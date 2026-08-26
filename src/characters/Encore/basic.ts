export function getCharacterBasicInfo(): CharacterBasicInfo {
  return {
    name: "Encore",
    rarity: 5,
    weapon: "Rectifiers",
    avatarUrl: "Encore.jpg",
    gender: "female",
    element: "Fusion",
    image:
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconRolePile/T_IconRole_Pile_anke_UI.webp",
    inherentSkillIcons: [
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconAnke/SP_IconAnkeD1.webp",
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconAnke/SP_IconAnkeD2.webp",
    ],
    liveResultBarStats: ["totalAtk", "totalCritRate", "totalCritDMG", "energyRegen"],
  };
}
