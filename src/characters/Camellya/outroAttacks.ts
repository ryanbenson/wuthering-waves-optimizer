export const outroAttacks = {
  name: "Outro Skill: Twining",
  description: `<div class="skilldescription">Attack the target, dealing <span class="Dark">Havoc DMG</span> equal to 329.24% of Camellya's ATK.<br>After activating Forte Circuit's <span class="Highlight">Ephemeral</span>, the next Outro Skill <span class="Highlight">Twining</span> deals additional <span class="Dark">Havoc DMG</span> equal to 459.02% of Camellya's ATK.</div>`,
  icon: "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconChun/SP_IconChunT.webp",
  attacks: [
    {
      key: "TwiningDMG",
      label: "Twining DMG",
      talent: "329.24%",
      type: "Outro",
    },
    {
      key: "TwiningEphemeralDMG",
      label: "Twining Ephemeral DMG",
      talent: "459.02%",
      type: "Outro",
    },
  ],
};
