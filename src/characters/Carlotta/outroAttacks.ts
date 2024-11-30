export const outroAttacks = {
  name: "Outro Skill: Final Address",
  description: `<div class="skilldescription">Attack the target, dealing Glacio damage equal to 772.01% of Carlotta's Attack.</div>`,
  attacks: [
    {
      key: "FinalAddressDMG",
      label: "Final Address DMG",
      talent: "772.01%",
      type: "Outro",
    },
    {
      key: "S3StepForwardEleganceinProgressionDMG",
      label: "S3 Step Forward, Elegance in Progression DMG",
      talent: "779.67%",
      type: "Outro",
      requiresResonanceChain: "SequenceNode3StepForwardEleganceinProgression",
    },
  ],
};
