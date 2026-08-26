export function getCharacterBasicInfo(): CharacterBasicInfo {
  return {
    name: "Roccia",
    rarity: 5,
    weapon: "Gauntlets",
    signatureWeapon: "Tragicomedy",
    avatarUrl: "Roccia.jpg",
    gender: "female",
    element: "Havoc",
    image:
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconRolePile/T_IconRole_Pile_luokeke_UI.webp",
    inherentSkillIcons: [
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconLuokeke/SP_IconLuokekeD2.webp",
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconLuokeke/SP_IconLuokekeD1.webp",
    ],
    liveResultBarStats: ["totalAtk", "totalCritRate", "totalCritDMG", "energyRegen"],
  };
}
