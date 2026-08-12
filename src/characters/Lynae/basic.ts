export function getCharacterBasicInfo(): CharacterBasicInfo {
  return {
    name: "Lynae",
    rarity: 5,
    weapon: "Pistols",
    avatarUrl: "Lynae.png",
    gender: "female",
    element: "Spectro",
    stances: ["Tune Rupture", "Tune Strain"],
    tuneBreakBoost: 0.1, // use decimal since this rolls into buff calc
    image:
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconRolePile/T_IconRole_Pile_Linnai_UI.webp",
    inherentSkillIcons: [
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconLinNai/SP_IconLinNai1D1.webp",
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconLinNai/SP_IconLinNai2D2.webp",
    ],
  };
}
