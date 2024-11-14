export const outroAttacks = {
  name: "Outro Skill: Twining",
  description: `<span class="skilldescription">Attacks the target, dealing 329% <span class="Dark">Havoc</span> damage of Camellya’s attack.
  After casting <span class="Highlight">Resonance Skill Dayflower</span>, the next <span class="Highlight">Outro Skill Entangle</span> additionally deals 459% <span class="Dark">Havoc</span> damage of Camellya’s attack. </span>`,
  attacks: [
    {
      key: "TwiningDMG",
      label: "Twining DMG",
      talent: "329%",
      type: "Outro",
    },
    {
      key: "TwiningEphemeralDMG",
      label: "Twining Dayflower DMG",
      talent: "459%",
      type: "Outro",
    },
  ],
};
