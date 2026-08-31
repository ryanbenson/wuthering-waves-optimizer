export function getCharacterBasicInfo(): CharacterBasicInfo {
  return {
    name: "Phoebe",
    rarity: 5,
    weapon: "Rectifiers",
    avatarUrl: "Phoebe.png",
    gender: "female",
    element: "Spectro",
    stances: ["Absolution", "Confession"],
    spectroFrazzle: true,
    image:
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconRolePile/T_IconRole_Pile_Feibi_UI.webp",
    inherentSkillIcons: [
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconFeibi/SP_IconFeibiD1.webp",
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconFeibi/SP_IconFeibiD2.webp",
    ],
    signatureWeapon: "LuminousHymn",
    liveResultBarStats: ["totalAtk", "totalCritRate", "totalCritDMG", "energyRegen"],
    suggestedWeapons: [],
  };
}
