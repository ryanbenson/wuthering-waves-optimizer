export const liberationAttacks = {
  name: "Resonance Liberation: Fervor Efflorescent",
  description: `<div class="skilldescription">Attack the target, dealing <span class="Dark">Havoc DMG</span>.<br>This attack can be performed in mid-air.</div>`,
  icon: "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconChun/SP_IconChunC1.webp",
  attacks: [
    {
      key: "FervorEfflorescentDMG",
      label: "Fervor Efflorescent DMG",
      talents: {
        "1": "605.00%",
        "2": "654.61%",
        "3": "704.22%",
        "4": "773.68%",
        "5": "823.29%",
        "6": "880.34%",
        "7": "959.72%",
        "8": "1039.09%",
        "9": "1118.47%",
        "10": "1202.81%",
      },
      type: "Liberation",
    },
  ],
};
