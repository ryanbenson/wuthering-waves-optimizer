export const tuneBreakAttacks = {
  name: "Tune Break",
  description: `<div>When the target's <span class="Highlight">Off-Tune Level</span> is full, Sigrika can cast <span class="Highlight">Tune Break</span> on the target.<br>
Press <span class="Highlight">Normal Attack</span> shortly after casting <span class="Highlight">Tune Break</span> to cast <span class="Highlight">Basic Attack Stage 3</span>.</div>`,
  attacks: [
    {
      key: "TuneBreakDMG",
      label: "Tune Break DMG",
      type: "TuneBreak",
      talent: "1600.00%",
    },
  ],
};
