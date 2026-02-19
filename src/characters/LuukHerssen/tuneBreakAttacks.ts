export const tuneBreakAttacks = {
  name: "Tune Break",
  description: `<div>Luuk Herssen can inflict Tune Strain - Shifting on targets.
Luuk Herssen can respond to Tune Strain - Interfered.<br>
When responding to Tune Strain - Interfered: For each stack of Tune Strain - Interfered on the target, each point of Luuk Herssen's Tune Break Boost increases his total DMG against the target by 0.12%. While Luuk Herssen is in the team, the max stack limit of Tune Strain - Interfered on a target is increased by 1.<br>
When the target's <span class="Highlight">Off-Tune Level</span> is full, Luuk Herssen can cast Tune Break on the target.</div>`,
  attacks: [
    {
      key: "TuneBreakDMG",
      label: "Tune Break DMG",
      type: "TuneBreak",
      talent: "1600.00%",
    },
  ],
};
