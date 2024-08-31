export const outroAttacks = {
  name: "Outro Skill: Thermal Field",
  description: `<div class="skilldescription">Encore generates a Thermal Field centered around skill target, with a radius of 3m. Targets inside the Thermal Field are continuously burned, suffering <span class="Fire">Fusion DMG</span> equal to 176.76% of Encore's ATK every 1.5s for 6s.</div>`,
  attacks: [
    {
      key: "OutroSkillDMG",
      label: "Thermal Field DoT",
      talent: "176.76%",
      type: "Outro",
    },
  ],
};
