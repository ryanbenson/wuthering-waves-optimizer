export const tuneBreakAttacks = {
  name: "Tune Break: Draw and Sunder",
  description: `<div>Qingxiao applies <span style="color:#ffd12f;" class="font-bold">Tune Strain - Shifting</span> to the target when dealing damage. Each skill can only trigger this once per target.<br>Qingxiao has the ability to respond to <span style="color:#ffd12f;" class="font-bold">Tune Strain - Interfered</span>.<br>Responding to <span style="color:#ffd12f;" class="font-bold">Tune Strain - Interfered</span>: For each stack of <span style="color:#ffd12f;" class="font-bold">Tune Strain - Interfered</span> on the target, every point of Qingxiao's Tune Break Boost increases the total DMG she deals to that target by 0.12%. While Qingxiao is in the team, the max stack limit of the target's <span style="color:#ffd12f;" class="font-bold">Tune Strain - Interfered</span> is increased by 1.<br>Additionally, when the target's <span style="color:#ffd12f;" class="font-bold">Off-Tune Level</span> is full, Qingxiao can cast <span style="color:#ffd12f;" class="font-bold">Tune Break</span> on it. While not in <span style="color:#ffd12f;" class="font-bold">Ephemeral Transcendence</span>, press <span style="color:#ffd12f;" class="font-bold">Normal Attack</span> within a certain time after casting <span style="color:#ffd12f;" class="font-bold">Tune Break</span> to cast <span style="color:#ffd12f;" class="font-bold">Basic Attack - Stringbalde Stage 3</span>.</div>`,
  attacks: [
    {
      key: "TuneBreakDMG",
      label: "Tune Break DMG",
      talent: "100.00%*4 + 1200.00%",
      type: "TuneBreak",
    }
  ],
};
