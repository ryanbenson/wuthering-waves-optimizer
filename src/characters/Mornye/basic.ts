export function getCharacterBasicInfo(): CharacterBasicInfo {
  return {
    name: "Mornye",
    rarity: 5,
    weapon: "Broadblades",
    avatarUrl: "Mornye.png",
    gender: "female",
    element: "Fusion",
    tuneBreakBoost: 0.1, // use decimal since this rolls into buff calc
    image:
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconRolePile/T_IconRole_Pile_Moning_UI.webp",
    inherentSkillIcons: [
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconMoNing/SP_IconMoNing1D1.webp",
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconMoNing/SP_IconMoNing2D2.webp",
    ],
  };
}
