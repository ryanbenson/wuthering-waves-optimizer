export const tuneBreakAttacks = {
  name: "Tune Break",
  description: `<div>When the target's <span class="Highlight">Off-Tune Level</span> is full, the Resonator may cast <span class="Highlight">Tune Break</span> on the target.</div>`,
  attacks: [
    {
      key: "TuneBreakDMG",
      label: "Tune Break DMG",
      talent: "100.00%*4 + 1200.00%",
      type: "TuneBreak",
    }
  ],
};
