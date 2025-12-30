export const tuneBreakAttacks = {
  name: "Tune Break: Spectral Analysis",
  description: `<div>Lynae can inflict <span class="Highlight"><strong>Tune Rupture - Shifting</strong></span> or <span class="Highlight"><strong>Tune Strain - Shifting</strong></span> on targets.<br>Lynae can respond to <span class="Highlight"><strong>Tune Rupture - Interfered</strong></span> and <span class="Highlight"><strong>Tune Strain - Interfered</strong></span>.<br>Responding to <span class="Highlight"><strong>Tune Rupture - Interfered</strong></span>: When any Resonator in the team deals <span class="Highlight"><strong>Tune Break</strong></span> DMG and inflicts the <span class="Highlight"><strong>Tune Rupture - Interfered</strong></span> state, Lynae casts <span class="Highlight"><strong>Tune Rupture Response - Spectral Analysis</strong></span>. Each target can be damaged by this skill up to once every 8s.<br>Responding to <span class="Highlight"><strong>Tune Strain - Interfered</strong></span>: For each stack of <span class="Highlight"><strong>Tune Strain - Interfered</strong></span> on the target, each point of Lynae's Tune Break Boost increases her total DMG against that target by 0.12%. When Lynae is in the team, the target's max stack limit of <span class="Highlight"><strong>Tune Strain - Interfered</strong></span> is increased by 1.<br>When the target's <span class="Highlight"><strong>Off-Tuning Level</strong></span> is full, Lynae can cast <span class="Highlight"><strong>Tune Break</strong></span> on the target.</div>`,
  attacks: [
    {
      key: "TuneBreakDMG",
      label: "Tune Break DMG",
      type: "TuneBreak",
      talent: "1440.00%",
    },
  ],
};
