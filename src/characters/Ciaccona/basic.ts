export function getCharacterBasicInfo(): CharacterBasicInfo {
  return {
    name: "Ciaccona",
    rarity: 5,
    weapon: "Pistols",
    avatarUrl: "Ciaccona.png",
    gender: "female",
    element: "Aero",
    spectroFrazzle: true,
    aeroErosion: true,
    image:
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconRolePile/T_IconRole_Pile_xiakong_UI.webp",
    inherentSkillIcons: [
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconXiakong/SP_IconXiakongD1.webp",
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconXiakong/SP_IconXiakongD2.webp",
    ],
    signatureWeapon: "WoodlandAria",
    liveResultBarStats: ["totalAtk", "totalCritRate", "totalCritDMG", "energyRegen"],
  };
}
