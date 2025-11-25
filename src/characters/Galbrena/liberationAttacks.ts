export const liberationAttacks = {
  name: "Resonance Liberation: Hellfire Absolution",
  description: `<div>Attack the target and deal <span class="ingame-Fire">Fusion DMG</span>, considered <span class="ingame-Highlight">Echo Skill DMG</span>. Gain 85% DMG Multiplier increase for <span class="ingame-Highlight">Basic Attack - Seraphic Execution</span>, <span class="ingame-Highlight">Heavy Attack - Flamewing Verdict</span>, <span class="ingame-Highlight">Mid-air Attack - Hellsent Barrage</span>, and <span class="ingame-Highlight">Dodge Counter - Purgatory Scourge</span> for 14s while in <span class="ingame-Highlight"><te href="120805">Demon Hypostasis</te></span>.<br>Press Normal Attack after casting Resonance Liberation to cast <span class="ingame-Highlight">Basic Atttack Stage 2</span>. While in <span class="ingame-Highlight"><te href="120805">Demon Hypostasis</te></span>, cast <span class="ingame-Highlight">Basic Attack - Seraphic Execution Stage 2</span> instead.<br>Can be cast in mid-air close to the ground.</div>`,
  attacks: [
    {
      key: "HellfireAbsolutionDMG",
      label: "Hellfire Absolution DMG",
      talents: {
        "1": "55.79%+45.64%*11",
        "2": "60.36%+49.39%*11",
        "3": "64.93%+53.13%*11",
        "4": "71.34%+58.37%*11",
        "5": "75.91%+62.11%*11",
        "6": "81.17%+66.41%*11",
        "7": "88.49%+72.40%*11",
        "8": "95.81%+78.39%*11",
        "9": "103.13%+84.38%*11",
        "10": "110.90%+90.74%*11",
      },
      type: "Echo",
    },
  ],
};
