export const tuneBreakAttacks = {
  name: "Tune Break: Data Crash",
  description: `<div>When the target's <span style="color:#f7ca2f"><strong>Off-Tune Level</strong></span> is full, Lucy can cast <span style="color:#f7ca2f"><strong><a href="#WwLink100001" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="100001">Tune Break</a></strong></span> on the target.<br>Responding to <span style="color:#f7ca2f"><strong><a href="#WwLink151104" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="151104">Hack - Interfered</a></strong></span>: when Resonators in the team trigger <span style="color:#f7ca2f"><strong><a href="#WwLink100001" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="100001">Tune Break</a></strong></span> on the target and cause them to be affected by <span style="color:#f7ca2f"><strong><a href="#WwLink151104" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="151104">Hack - Interfered</a></strong></span>, Lucy applies <span style="color:#f7ca2f"><strong>Hack Response - Data Crash</strong></span> on the target. Each target can be inflicted with this effect up to 1 time every 8s.</div>`,
  attacks: [
    {
      key: "TuneBreakDMG",
      label: "Tune Break DMG",
      type: "TuneBreak",
      talent: "1600.00%",
    },
  ],
};
