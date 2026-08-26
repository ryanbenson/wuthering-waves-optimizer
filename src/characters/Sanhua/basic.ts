export function getCharacterBasicInfo(): CharacterBasicInfo {
  return {
    name: "Sanhua",
    rarity: 4,
    weapon: "Swords",
    avatarUrl: "Sanhua.jpg",
    gender: "female",
    element: "Glacio",
    image:
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconRolePile/T_IconRole_Pile_shanhua_UI.webp",
    inherentSkillIcons: [
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconSanhua/SP_IconSanhuaD1.webp",
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconSanhua/SP_IconSanhuaD2.webp",
    ],
    liveResultBarStats: ["totalAtk", "totalCritRate", "totalCritDMG", "energyRegen"],
  };
}
