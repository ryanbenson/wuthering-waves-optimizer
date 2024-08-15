export const outroAttacks = {
  name: "Outro Skill: Carve and Draw",
  description: `<span class="skilldescription">Outro Skill <span class="Highlight">Blossom</span> grants the next character a continuous Healing effect, recovering HP by 20% of Verina's ATK every 5s for 30s.</span>`,
  attacks: [
    {
      key: "SequenceNode1MomentofEmergence",
      label: "S1: Proper Structuring HoT",
      talent: "20.00%",
      type: "Healing",
      requiresResonanceChain: "SequenceNode1MomentofEmergence",
    },
  ],
};
