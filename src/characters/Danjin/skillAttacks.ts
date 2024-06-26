export const skillAttacks = {
  name: "Resonance Skill: Crimson Fragment",
  description: `
    <div class="skilldescription">
      <p>
        When casting <span class="Highlight">Crimson Fragment</span>, each attack
        consumes 3% of Danjin's max HP. When Danjin's HP is less than 1%, this no
        longer consumes HP.
      </p>
      <span class="Title">Carmine Gleam</span>
      <p>
        Danjin attacks the target, dealing <span class="Dark">Havoc DMG</span>
      </p>
      <span class="Title">Crimson Erosion</span>
      <p>
        After <span class="Highlight">Basic Attack 2</span>,
        <span class="Highlight">Dodge Counter</span> or Intro Skill
        <span class="Highlight">Vindication</span>, use
        <span class="Highlight">Resonance Skill</span> to perform up to 2
        consecutive strikes, dealing <span class="Dark">Havoc DMG</span>. When
        <span class="Highlight">Crimson Erosion II</span> hits a target, apply
        <span class="Highlight">Incinerating Will</span> to it.
      </p>
      <span class="Title">Incinerating Will</span>
      <p>
        Danjin's damage dealt to targets marked with
        <span class="Highlight">Incinerating Will</span> is increased by 20%.
      </p>
      <span class="Title">Sanguine Pulse</span>
      <p>
        Use <span class="Highlight">Resonance Skill</span> after
        <span class="Highlight">Basic Attack 3</span> to perform up to 3
        consecutive attacks, dealing <span class="Dark">Havoc DMG</span>.
      </p>
    </div>
  `,
  attacks: [
    {
      key: "CarmineGleam",
      label: "Carmine Gleam",
      talents: {
        "1":  "19.20%*2",
        "2":  "20.78%*2",
        "3":  "22.35%*2",
        "4":  "24.56%*2",
        "5":  "26.13%*2",
        "6":  "27.94%*2",
        "7":  "30.46%*2",
        "8":  "32.98%*2",
        "9":  "35.50%*2",
        "10": "38.18%*2",
      },
      type: "Skill",
    },
    {
      key: "CrimsonErosion1",
      label: "Crimson Erosion Part 1",
      talents: {
        "1":  "32.40%*2",
        "2":  "35.06%*2",
        "3":  "37.72%*2",
        "4":  "41.44%*2",
        "5":  "44.09%*2",
        "6":  "47.15%*2",
        "7":  "51.40%*2",
        "8":  "55.65%*2",
        "9":  "59.90%*2",
        "10": "64.12%*2",
      },
      type: "Skill",
    },
    {
      key: "CrimsonErosion2",
      label: "Crimson Erosion Part 2",
      talents: {
        "1":  "30.00%*2",
        "2":  "32.46%*2",
        "3":  "34.92%*2",
        "4":  "38.37%*2",
        "5":  "40.83%*2",
        "6":  "43.66%*2",
        "7":  "47.59%*2",
        "8":  "51.53%*2",
        "9":  "55.47%*2",
        "10": "59.65%*2",
      },
      type: "Skill",
    },
    {
      key: "DCCrimsonErosion2",
      label: "Crimson Erosion Part 2 (after dodge counter)",
      talents: {
        "1":  "30.00%*2",
        "2":  "32.46%*2",
        "3":  "34.92%*2",
        "4":  "38.37%*2",
        "5":  "40.83%*2",
        "6":  "43.66%*2",
        "7":  "47.59%*2",
        "8":  "51.53%*2",
        "9":  "55.47%*2",
        "10": "59.65%*2",
      },
      type: "Skill",
    },
    {
      key: "SanguinePulse1",
      label: "Sanguine Pulse Part 1",
      talents: {
        "1":  "28.20%*2",
        "2":  "30.52%*2",
        "3":  "32.83%*2",
        "4":  "36.07%*2",
        "5":  "38.38%*2",
        "6":  "41.04%*2",
        "7":  "44.74%*2",
        "8":  "48.44%*2",
        "9":  "52.14%*2",
        "10": "56.07%*2",
      },
      type: "Skill",
    },
    {
      key: "SanguinePulse2",
      label: "Sanguine Pulse Part 2",
      talents: {
        "1":  "21.60%*3",
        "2":  "23.38%*3",
        "3":  "25.15%*3",
        "4":  "27.63%*3",
        "5":  "29.40%*3",
        "6":  "31.44%*3",
        "7":  "34.27%*3",
        "8":  "37.10%*3",
        "9":  "39.94%*3",
        "10": "42.95%*3",
      },
      type: "Skill",
    },
    {
      key: "SanguinePulse3",
      label: "Sanguine Pulse Part 3",
      talents: {
        "1":  "32.40%*3",
        "2":  "35.06%*3",
        "3":  "37.72%*3",
        "4":  "41.44%*3",
        "5":  "44.09%*3",
        "6":  "47.15%*3",
        "7":  "51.40%*3",
        "8":  "55.65%*3",
        "9":  "59.90%*3",
        "10": "64.42%*3",
      },
      type: "Skill",
    },
  ],
};
