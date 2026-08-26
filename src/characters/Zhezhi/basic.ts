export function getCharacterBasicInfo(): CharacterBasicInfo {
  return {
    name: "Zhezhi",
    rarity: 5,
    weapon: "Rectifiers",
    avatarUrl: "Zhezhi.jpg",
    gender: "female",
    element: "Glacio",
    image:
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconRolePile/T_IconRole_Pile_zhezhi_UI.webp",
    inherentSkillIcons: [
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconZhezhi/SP_IconZhezhiD1.webp",
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconZhezhi/SP_IconZhezhiD2.webp",
    ],
    signatureWeapon: "RimeDrapedSprouts",
    liveResultBarStats: ["totalAtk", "totalCritRate", "totalCritDMG", "energyRegen"],
  };
}
