export const tuneBreakAttacks = {
  name: "Tune Break: Decoupling",
  description: `<div>Mornye can respond to <span class="Highlight"><strong>Tune Rupture - Interfered</strong></span> and <span class="Highlight"><strong>Tune Strain - Interfered</strong></span>.<br>- Responding to <span class="Highlight"><strong>Tune Rupture - Interfered</strong></span>: When any Resonator in the team deals <span class="Highlight"><strong>Tune Break</strong></span> DMG and inflicts <span class="Highlight"><strong>Tune Rupture - Interfered</strong></span>, Mornye casts <span class="Highlight"><strong>Tune Rupture Response - Particle Jet</strong></span>. Each target can be damaged by this skill up to once every 8s.<br>- Responding to <span class="Highlight"><strong>Tune Strain - Interfered</strong></span>: Each stack of <span class="Highlight"><strong>Tune Strain - Interfered</strong></span> on the target increases Mornye's total DMG against them. Each point of Mornye's <span class="Highlight"><strong>Tune Break Boost</strong></span> increases the total DMG by 0.12%. While Mornye is in the team, the max stack limit of <span class="Highlight"><strong>Tune Strain - Interfered</strong></span> on a target is increased by 1.<br>Mornye can perform <span class="Highlight"><strong>Tune Break</strong></span> against the targets with full <span class="Highlight"><strong>Off-Tune Level</strong></span>.</div>`,
  attacks: [
    {
      key: "TuneBreakDMG",
      label: "Tune Break DMG",
      type: "TuneBreak",
      talent: "204.048% + 156.096% + 1080.00%",
    },
  ],
};
