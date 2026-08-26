export function getCharacterBasicInfo(): CharacterBasicInfo {
  return {
    name: "Yinlin",
    rarity: 5,
    weapon: "Rectifiers",
    signatureWeapon: "Stringmaster",
    avatarUrl: "test.jpg",
    gender: "female",
    element: "Electro",
    image:
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconRolePile/T_IconRole_Pile_yinlin_UI.webp",
    inherentSkillIcons: [
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconYinlin/SP_IconYinlinD1.webp",
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconYinlin/SP_IconYinlinD2.webp",
    ],
    liveResultBarStats: ["totalAtk", "totalCritRate", "totalCritDMG", "energyRegen"],
  };
}
