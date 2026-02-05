export const tuneBreakAttacks = {
  name: "Tune Break: Unlanded Melody",
  description: `<div>When the target's <span class="Highlight"><strong>Off-Tune Level</strong></span> is full, Aemeath can cast <span class="Highlight"><strong>Tune Break</strong></span> on the target.<br>Press <span class="Highlight"><strong>Normal Attack</strong></span> shortly after casting <span class="Highlight"><strong>Tune Break</strong></span> to cast <span class="Highlight"><strong>Basic Attack Stage 3</strong></span>.<br><br>Responding to <span class="Highlight"><strong>Tune Rupture - Interfered</strong></span>: when Resonators in the team trigger <span class="Highlight"><strong>Tune Break</strong></span> on the target and cause them to be affected by <span class="Highlight"><strong>Tune Rupture - Interfered</strong></span>, Aemeath triggers <span class="Highlight"><strong>Tune Rupture Response - Starburst</strong></span>. Each target can be damaged by this skill up to once every 8s.</div>`,
  attacks: [
    {
      key: "TuneBreakDMG",
      label: "Tune Break DMG",
      type: "TuneBreak",
      talent: "100.00%*4 + 1200.00%",
    },
  ],
};
