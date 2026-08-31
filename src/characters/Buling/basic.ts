export function getCharacterBasicInfo(): CharacterBasicInfo {
  return {
    name: "Buling",
    rarity: 4,
    weapon: "Rectifiers",
    avatarUrl: "Buling.png",
    gender: "female",
    element: "Electro",
    electroFlare: true,
    image:
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconRolePile/T_IconRole_Pile_Buling_UI.webp",
    inherentSkillIcons: [
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconBuling/SP_IconBulingD1.webp",
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconBuling/SP_IconBulingD2.webp",
    ],
    liveResultBarStats: ["totalAtk", "totalCritRate", "totalCritDMG", "energyRegen"],
    suggestedWeapons: [],
  };
}
