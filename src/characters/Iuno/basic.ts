export function getCharacterBasicInfo(): CharacterBasicInfo {
  return {
    name: "Iuno",
    rarity: 5,
    weapon: "Gauntlets",
    avatarUrl: "Iuno.png",
    gender: "female",
    element: "Aero",
    image:
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconRolePile/T_IconRole_Pile_younuo_UI.webp",
    inherentSkillIcons: [
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconYounuo/SP_IconYounuoD1.webp",
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconYounuo/SP_IconYounuoD2.webp",
    ],
    signatureWeapon: "MoongazersSigil",
    liveResultBarStats: ["totalAtk", "totalCritRate", "totalCritDMG", "energyRegen"],
  };
}
