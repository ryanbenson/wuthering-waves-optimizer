export function getCharacterBasicInfo(): CharacterBasicInfo {
  return {
    name: "Galbrena",
    rarity: 5,
    weapon: "Pistols",
    avatarUrl: "Galbrena.png",
    gender: "female",
    element: "Fusion",
    image:
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconRolePile/T_IconRole_Pile_jiabeilina_UI.webp",
    inherentSkillIcons: [
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconJiaBeiLiNa/SP_IconJiaBeiLiNa1D1.webp",
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconJiaBeiLiNa/SP_IconJiaBeiLiNa2D2.webp",
    ],
    signatureWeapon: "LuxUmbra",
    liveResultBarStats: ["totalAtk", "totalCritRate", "totalCritDMG", "energyRegen"],
    suggestedWeapons: [
      { key: "PhasicHomogenizer", label: "Standard" },
      { key: "TheLastDance", label: "Stat stick" },
      { key: "StaticMist", label: "Standard" },
      { key: "SolarFlame", label: "BP" },
      { key: "RelativisticJet", label: "4*" },
    ],
  };
}
