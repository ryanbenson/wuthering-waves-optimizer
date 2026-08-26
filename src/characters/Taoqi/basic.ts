export function getCharacterBasicInfo(): CharacterBasicInfo {
  return {
    name: "Taoqi",
    rarity: 4,
    weapon: "Broadblades",
    avatarUrl: "test.jpg",
    gender: "female",
    element: "Havoc",
    image:
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconRolePile/T_IconRole_Pile_taohua_UI.webp",
    inherentSkillIcons: [
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconTaohua/SP_IconTaoHuaD1.webp",
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconTaohua/SP_IconTaoHuaD2.webp",
    ],
    liveResultBarStats: ["totalDef", "totalCritRate", "totalCritDMG", "energyRegen"],
  };
}
