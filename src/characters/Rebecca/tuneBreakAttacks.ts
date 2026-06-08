export const tuneBreakAttacks = {
  name: "Tune Break: Hack - Meltdown",
  description: `<div>When the target's <span style="color:#f7ca2f"><strong>Off-Tune Level</strong></span> is full, Rebecca can cast <span style="color:#f7ca2f"><strong><a href="#WwLink100001" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="100001">Tune Break</a></strong></span> on the target.<br><br>Rebecca can inflict <span style="color:#f7ca2f"><strong><a href="#WwLink151101" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="151101">Hack - Shifting</a></strong></span> and respond to <span style="color:#f7ca2f"><strong><a href="#WwLink151104" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="151104">Hack - Interfered</a></strong></span> on targets.<br>Responding to <span style="color:#f7ca2f"><strong><a href="#WwLink151104" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="151104">Hack - Interfered</a></strong></span>:  When any Resonator in the team deals <span style="color:#f7ca2f"><strong><a href="#WwLink100001" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="100001">Tune Break</a></strong></span> DMG and inflicts the <span style="color:#f7ca2f"><strong><a href="#WwLink151104" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="151104">Hack - Interfered</a></strong></span>, Rebecca triggers <span style="color:#f7ca2f"><strong>Hack - Meltdown</strong></span> on the target.  Each target can be damaged by this skill up to once every 8s.</div>`,
  attacks: [
    {
      key: "TuneBreakDMG",
      label: "Tune Break DMG",
      type: "TuneBreak",
      talent: "1600.00%",
    },
  ],
};
