export function getCharacterBasicInfo(): CharacterBasicInfo {
  return {
    name: "Aalto",
    rarity: 4,
    weapon: "Pistols",
    avatarUrl: "Aalto.jpg",
    gender: "male",
    element: "Aero",
    image:
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconRolePile/T_IconRole_Pile_qiushui_UI.webp",
    inherentSkillIcons: [
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconQiushui/SP_IconQiushuiD1.webp",
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconQiushui/SP_IconQiushuiD2.webp",
    ],
    liveResultBarStats: ["totalAtk", "totalCritRate", "totalCritDMG", "energyRegen"],
  };
}
