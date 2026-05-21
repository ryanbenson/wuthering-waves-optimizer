export const tuneBreakAttacks = {
  name: "Tune Break: Shattered Hours",
  description: `<div>When the target's <span style="color:#f7ca2f"><strong>Off-Tune Level</strong></span> is full, Denia can cast <span style="color:#f7ca2f"><strong><span class="Highlight">Tune Break</span></strong></span> on the target.<br><br>When in <span style="color:#f7ca2f"><strong>Resonance Mode - Tune Strain</strong></span>, Denia gains the following effects:<br>- Denia can inflict <span style="color:#f7ca2f"><strong><span class="Highlight">Tune Strain - Shifting</span></strong></span> on the target.<br>- Denia can respond to <span style="color:#f7ca2f"><strong><span class="Highlight">Tune Strain - Interfered</span></strong></span>.<br>When responding to <span style="color:#f7ca2f"><strong><span class="Highlight">Tune Strain - Interfered</span></strong></span>: For each stack of <span style="color:#f7ca2f"><strong><span class="Highlight">Tune Strain - Interfered</span></strong></span> on the target, each point of Denia's Tune Break Boost increases her total DMG against the target by 0.12%. While Denia is in the team, the max stack limit of <span style="color:#f7ca2f"><strong><span class="Highlight">Tune Strain - Interfered</span></strong></span> on a target is increased by 1.</div>`,
  attacks: [
    {
      key: "TuneBreakDMG",
      label: "Tune Break DMG",
      type: "TuneBreak",
      talent: "1600.00%",
    },
  ],
};
