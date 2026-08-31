export function getCharacterBasicInfo(): CharacterBasicInfo {
  return {
    name: "Luuk Herrsen",
    rarity: 5,
    weapon: "Gauntlets",
    avatarUrl: "LuukHerrsen.png",
    gender: "male",
    element: "Spectro",
    tuneBreakBoost: 0.1, // use decimal since this rolls into buff calc
    image:
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconRolePile/T_IconRole_Pile_Luhesi_UI.webp",
    inherentSkillIcons: [
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconLuhesi/SP_IconLuhesiD1.webp",
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconLuhesi/SP_IconLuhesiD2.webp",
    ],
    signatureWeapon: "DaybreakersSpine",
    liveResultBarStats: ["totalAtk", "totalCritRate", "totalCritDMG", "energyRegen"],
    suggestedWeapons: [],
  };
}
