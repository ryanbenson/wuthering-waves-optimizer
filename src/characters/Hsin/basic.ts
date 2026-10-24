export function getCharacterBasicInfo(): CharacterBasicInfo {
  return {
    name: "Hsin",
    rarity: 5,
    weapon: "Rectifiers",
    avatarUrl: "Hsin.png",
    gender: "female",
    element: "Electro",
    image: "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconRolePile/T_IconRole_Pile_Xin_UI.webp",
    inherentSkillIcons: ["https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconXin/SP_IconXinD1.webp","https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconXin/SP_IconXinD2.webp"],
    signatureWeapon: "BloomingJadehaven",
    electroFlare: true,
    liveResultBarStats: ["totalAtk", "totalCritRate", "totalCritDMG", "energyRegen"],
    suggestedWeapons: [
      { key: "LetheanElegy", label: "Alternate" },
      { key: "Stringmaster", label: "Alternate" },
      { key: "CosmicRipples", label: "Standard" },
      { key: "Augment", label: "BP" },
      { key: "FusionAccretion", label: "4*" },
    ],
    stances: ["Unison", "Electro Flare"],
    suggestedEchoSets: ["HeartofSwornVigil"],
  };
}
