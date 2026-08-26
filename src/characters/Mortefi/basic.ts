export function getCharacterBasicInfo(): CharacterBasicInfo {
  return {
    name: "Mortefi",
    rarity: 4,
    weapon: "Pistols",
    avatarUrl: "Mortefi.jpg",
    gender: "male",
    element: "Fusion",
    image:
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconRolePile/T_IconRole_Pile_baer_UI.webp",
    inherentSkillIcons: [
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconMotefei/SP_IconMotefeiD1.webp",
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconMotefei/SP_IconMotefeiD2.webp",
    ],
    liveResultBarStats: ["totalAtk", "totalCritRate", "totalCritDMG", "energyRegen"],
  };
}
