export function getCharacterBasicInfo(): CharacterBasicInfo {
  return {
    name: "RoverElectroMale",
    rarity: 5,
    weapon: "Swords",
    avatarUrl: "Roverelectromale.png",
    gender: "unknown",
    element: "Electro",
    electroFlare: true,
    image:
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconRolePile/T_IconRole_Pile_zhujuenan_UI.webp",
    inherentSkillIcons: [
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconThunderzhu/SP_IconThunderzhuD1.webp",
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconThunderzhu/SP_IconThunderzhuD2.webp",
    ],
    liveResultBarStats: ["totalAtk", "totalCritRate", "totalCritDMG", "energyRegen"],
  };
}
