export function getCharacterBasicInfo(): CharacterBasicInfo {
  return {
    name: "Denia",
    rarity: 5,
    weapon: "Rectifiers",
    avatarUrl: "Denia.png",
    gender: "female",
    element: "Fusion",
    stances: ["Fusion Burst", "Tune Strain"],
    fusionBurst: true,
    tuneBreakBoost: 0.1,
    image:
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconRolePile/T_IconRole_Pile_daniya_UI.webp",
    inherentSkillIcons: [
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconDaniya/SP_IconDaniyaD1.webp",
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconDaniya/SP_IconDaniyaD2.webp",
    ],
    signatureWeapon: "ForgedDwarfStar",
    liveResultBarStats: ["totalAtk", "totalCritRate", "totalCritDMG", "energyRegen"],
    suggestedWeapons: [
      { key: "Stringmaster", label: "Alternate" },
      { key: "LetheanElegy", label: "Alternate" },
      { key: "LuminousHymn", label: "Stat stick" },
      { key: "CosmicRipples", label: "Standard" },
      { key: "Augment", label: "BP" },
      { key: "RadiantDawn", label: "BP" },
      { key: "WaltzinMasquerade", label: "4*" },
    ],
  };
}
