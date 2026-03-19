export const outroAttacks = {
  name: "Outro Skill: In This Very Moment",
  description: `<div class="skilldescription">Attack the target, deal <span class="Wind">Aero</span> DMG equal to 795% of Sigrika's ATK. Gain 2 stacks of <span class="Highlight">Encapsulated</span> for 30s.<br><br><span class="Title">Encapsulated</span><br>
When any nearby Resonators in the team cast Echo Skills, <span class="Highlight">Stagnate</span> the target and consume 1 stacks of <span class="Highlight">Encapsulated</span>. <span class="Highlight">Encapsulated</span> stacks up to 2 times.
All stacks of <span class="Highlight">Encapsulated</span> are removed when Sigrika is removed from the lineup.</div>`,
  attacks: [
    {
      key: "InThisVeryMomentDMG",
      label: "In This Very Moment DMG",
      talent: "795%",
      type: "Outro",
    },
  ],
};
