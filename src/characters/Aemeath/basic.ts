export function getCharacterBasicInfo(): CharacterBasicInfo {
  return {
    name: "Aemeath",
    rarity: 5,
    weapon: "Swords",
    avatarUrl: "Aemeath.png",
    gender: "female",
    element: "Fusion",
    stances: ["Fusion Burst", "Tune Rupture"],
    tuneBreakBoost: 0.1, // use decimal since this rolls into buff calc
    fusionBurst: true,
    image:
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconRolePile/T_IconRole_Pile_Aimisi_UI.webp",
    inherentSkillIcons: [
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconAimisi/SP_IconAimisiD1.webp",
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconAimisi/SP_IconAimisiD2.webp",
    ],
  };
}
