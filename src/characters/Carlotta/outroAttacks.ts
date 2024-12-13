export const outroAttacks = {
  name: "Outro Skill: Final Address",
  description: `<div class="skilldescription">Attack the target, dealing Glacio damage equal to 794.2% of Carlotta's Attack.</div>`,
  attacks: [
    {
      key: "FinalAddressDMG",
      label: "Final Address DMG",
      talent: "794.2%",
      type: "Outro",
    },
    {
      key: "S3StepForwardEleganceinProgressionDMG",
      label: "S3 Step Forward, Elegance in Progression DMG",
      talent: "1032.18%",
      type: "Outro",
      requiresResonanceChain: "SequenceNode3StepForwardEleganceinProgression",
    },
  ],
};
