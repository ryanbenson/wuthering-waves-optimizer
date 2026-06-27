export const tuneBreakAttacks = {
  name: "Tune Break: Tune Break - Sword",
  description: `<div>When the target's <span style="color:#ffd12f;" class="font-bold">Off-Tune Level</span> is full, the Resonator may cast <span style="color:#ffd12f;" class="font-bold">Tune Break</span> on the target.</div>`,
  attacks: [
    {
      key: "TuneBreakDMG",
      label: "Tune Break DMG",
      talent: "100.00%*4 + 1200.00%",
      type: "TuneBreak",
    }
  ],
};
