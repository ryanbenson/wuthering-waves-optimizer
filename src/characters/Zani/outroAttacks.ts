export const outroAttacks = {
  name: "Outro Skill: Beacon For the Future",
  description: `<div class="skilldescription">Attack the target, dealing <span class="Light">Spectro DMG</span> equal to 150% of Zani's ATK and removing all stacks of Heliacal Ember inflicted upon the target. Each stack increases the DMG dealt by 10%. This DMG is considered <span class="Highlight">Spectro Frazzle</span> DMG. The Spectro DMG dealt by other Resonators in the team to the target marked by <span class="Highlight">Heliacal Ember</span> is Amplified by 20% for 20s.</div>`,
  attacks: [
    {
      key: "OutroSkillBeaconFortheFutureDMG",
      label: "Beacon For the Future DMG",
      talent: "150%",
      type: "Outro",
      subType: "SpectroFrazzle",
    },
  ],
};
