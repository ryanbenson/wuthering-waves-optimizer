export function getCharacterBasicInfo(): CharacterBasicInfo {
  return {
    name: "Youhu",
    rarity: 4,
    weapon: "Gauntlets",
    avatarUrl: "Youhu.jpg",
    gender: "female",
    element: "Glacio",
    image:
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconRolePile/T_IconRole_Pile_Youhu_UI.webp",
    inherentSkillIcons: [
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconYouhu/SP_IconYouhuD1.webp",
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconYouhu/SP_IconYouhuD2.webp",
    ],
    liveResultBarStats: ["totalAtk", "totalCritRate", "totalCritDMG", "energyRegen"],
    suggestedWeapons: [],
  };
}
