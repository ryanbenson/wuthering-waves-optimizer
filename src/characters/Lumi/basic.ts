export function getCharacterBasicInfo(): CharacterBasicInfo {
  return {
    name: "Lumi",
    rarity: 4,
    weapon: "Broadblades",
    avatarUrl: "Lumi.jpg",
    gender: "female",
    element: "Electro",
    image:
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconRolePile/T_IconRole_Pile_dengdeng_UI.webp",
    inherentSkillIcons: [
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconDengdeng/SP_IconDengdengD1.webp",
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconDengdeng/SP_IconDengdengD2.webp",
    ],
    liveResultBarStats: ["totalAtk", "totalCritRate", "totalCritDMG", "energyRegen"],
    suggestedWeapons: [],
  };
}
