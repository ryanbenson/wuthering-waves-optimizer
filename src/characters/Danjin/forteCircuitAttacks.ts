export const forteCircuitAttacks = {
  name: "Forte Circuit: Qingloong at War",
  description: `
    <div class="skilldescription">
      <span class="Title">Heavy Attack: Chasocleave</span>
      <p>
        After accumulating 60 "Ruby lossom", long press <span class="Highlight">Basic Attack</span>
        to consume all "Ruby Blossom", to cast <span class="Highlight">Chaoscleave</span>, dealing
        <span class="Dark">Havoc DMG</span> considered as Heavy Attack damage, and restore HP for
        Danjin. If current "Ruby Blossom" reaches over 120, this skill consumes 120 "Ruby Blossom"
        to increase the damage multiplier of <span class="Highlight">Chaoscleave</span> and
        <span class="Highlight">Scatterbloom</span> performed this time.
      </p>
      <span class="Title">Heavy Attack: Scatterbloom</span>
      <p>
        Use <span class="Highlight">Basic Attack</span> after Heavy Attack
        <span class="Highlight">Chaoscleave</span> to cast <span class="Highlight">Shatter</span>
        to attack the target, dealing <span class="Dark">Havoc DMG</span>, considered as Heavy
        Attack damage.
      </p>
      <span class="Title">Ruby Blossom</span>
      <p>
        Danjin can hold up to 120 stacks of Ruby Blossom.
        <br>Danjin obtains "Ruby Blossom" when using Resonance Skill
        <span class="Highlight">Crimson Fragment</span>
      </p>
    </div>
  `,
  attacks: [
    {
      key: "ChaoscleaveDamage",
      label: "Chaoscleave Damage",
      talents: {
        "1":  "30.00%*7",
        "2":  "32.46%*7",
        "3":  "34.92%*7",
        "4":  "38.37%*7",
        "5":  "40.83%*7",
        "6":  "43.66%*7",
        "7":  "47.59%*7",
        "8":  "51.53%*7",
        "9":  "55.47%*7",
        "10": "59.65%*7",
      },
      type: "Heavy",
    },
    {
      key: "ScatterbloomDamage",
      label: "Scatterbloom Damage",
      talents: {
        "1":  "90.00%",
        "2":  "97.38%",
        "3":  "104.76%",
        "4":  "115.10%",
        "5":  "122.48%",
        "6":  "130.96%",
        "7":  "142.77%",
        "8":  "154.58%",
        "9":  "166.39%",
        "10": "178.93%",
      },
      type: "Heavy",
    },
    {
      key: "FullScatterbloomDamage",
      label: "Full Energy Scatterbloom Damage",
      talents: {
        "1":  "72.00%*7",
        "2":  "77.91%*7",
        "3":  "83.81%*7",
        "4":  "92.08%*7",
        "5":  "97.98%*7",
        "6":  "104.77%*7",
        "7":  "114.22%*7",
        "8":  "123.66%*7",
        "9":  "133.11%*7",
        "10": "143.15%*7",
      },
      type: "Heavy",
    },
    {
      key: "FullChaoscleaveDamage",
      label: "Full Energy Chaoscleave Damage",
      talents: {
        "1":  "216.00%",
        "2":  "233.72%",
        "3":  "251.43%",
        "4":  "276.43%",
        "5":  "293.94%",
        "6":  "314.31%",
        "7":  "342.65%",
        "8":  "370.98%",
        "9":  "399.32%",
        "10": "429.43%",
      },
      type: "Heavy",
    },
  ],
};
