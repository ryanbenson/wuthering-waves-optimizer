export function getCharacterBasicInfo(): CharacterBasicInfo {
  return {
    name: "Lingyang",
    rarity: 5,
    weapon: "Gauntlets",
    avatarUrl: "Lingyang.jpg",
    gender: "male",
    element: "Glacio",
    image:
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconRolePile/T_IconRole_Pile_lingyang_UI.webp",
    inherentSkillIcons: [
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconLingyang/SP_IconLingyangD1.webp",
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconLingyang/SP_IconLingyangD2.webp",
    ],
    liveResultBarStats: ["totalAtk", "totalCritRate", "totalCritDMG", "energyRegen"],
    suggestedWeapons: [],
  };
}
