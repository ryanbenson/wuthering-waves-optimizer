export function getCharacterBasicInfo(): CharacterBasicInfo {
  return {
    name: "Jiyan",
    rarity: 5,
    weapon: "Broadblades",
    signatureWeapon: "VerdantSummit",
    avatarUrl: "test.jpg",
    gender: "male",
    element: "Aero",
    image:
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconRolePile/T_IconRole_Pile_jiyan_UI.webp",
    inherentSkillIcons: [
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconJiyan/SP_IconJiyanD1.webp",
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconJiyan/SP_IconJiyanD2.webp",
    ],
    liveResultBarStats: ["totalAtk", "totalCritRate", "totalCritDMG", "energyRegen"],
    suggestedWeapons: [],
  };
}
