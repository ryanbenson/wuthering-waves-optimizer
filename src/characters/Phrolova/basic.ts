export function getCharacterBasicInfo(): CharacterBasicInfo {
  return {
    name: "Phrolova",
    rarity: 5,
    weapon: "Rectifiers",
    avatarUrl: "Phrolova.png",
    gender: "female",
    element: "Havoc",
    image:
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconRolePile/T_IconRole_Pile_fuluoluo_UI.webp",
    inherentSkillIcons: [
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconFuluoluo/SP_IconFuluoluoD1.webp",
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconFuluoluo/SP_IconFuluoluoD2.webp",
    ],
    signatureWeapon: "LetheanElegy",
    liveResultBarStats: ["totalAtk", "totalCritRate", "totalCritDMG", "energyRegen"],
    suggestedWeapons: [
      { key: "Stringmaster", label: "Alternate" },
      { key: "WhispersofSirens", label: "Alternate" },
      { key: "RimeDrapedSprouts", label: "Stat stick" },
      { key: "CosmicRipples", label: "Standard" },
      { key: "RadiantDawn", label: "BP" },
      { key: "Augment", label: "BP" },
      { key: "FusionAccretion", label: "4*" },
    ],
  };
}
