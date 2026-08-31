export function getCharacterBasicInfo(): CharacterBasicInfo {
  return {
    name: "Baizhi",
    rarity: 4,
    weapon: "Rectifiers",
    avatarUrl: "Baizhi.jpg",
    gender: "female",
    element: "Glacio",
    image:
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconRolePile/T_IconRole_Pile_bailian_UI.webp",
    inherentSkillIcons: [
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconBailian/SP_IconBailianD2.webp",
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconBailian/SP_IconBailianD1.webp",
    ],
    liveResultBarStats: ["totalAtk", "totalCritRate", "totalCritDMG", "energyRegen"],
    suggestedWeapons: [],
  };
}
