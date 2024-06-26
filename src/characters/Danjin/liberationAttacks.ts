export const liberationAttacks = {
  name: "Resonance Liberation: Crimson Bloom",
  description: `
    <div class="skilldescription">
      <p>
        Danjin's anger intensifies as she frantically swings her dual blades,
        performing multiple rapid consecutive attacks, and 1 Scarlet Burst attack(s),
        dealing <span class="Dark>Havoc DMG</span>.
      </p>
    </div>`,
  attacks: [
    {
      key: "CrimsonBloomContinuousATKDMG",
      label: "Continuous Attack",
      talents: {
        "1":  "24.69%*8",
        "2":  "26.72%*8",
        "3":  "28.74%*8",
        "4":  "31.58%*8",
        "5":  "33.60%*8",
        "6":  "35.93%*8",
        "7":  "39.17%*8",
        "8":  "42.41%*8",
        "9":  "45.64%*8",
        "10": "49.09%*8",
      },
      type: "Liberation",
    },
    {
      key: "CrimsonBloomScarletBurstDMG",
      label: "Scarlet Burst",
      talents: {
        "1":  "197.50%",
        "2":  "213.70%",
        "3":  "229.89%",
        "4":  "252.57%",
        "5":  "268.76%",
        "6":  "287.39%",
        "7":  "313.30%",
        "8":  "339.21%",
        "9":  "365.12%",
        "10": "392.65%",
      },
      type: "Liberation",
    }
  ],
};
