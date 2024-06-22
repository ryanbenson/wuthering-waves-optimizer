export const forteCircuitAttacks = {
  name: "Forte Circuit: Power Shift",
  description: `<div class="skilldescription"><span class="Title">Timed Counters</span>
  <br>When carrying "Resolving Caliber", use <span class="Highlight">Basic Attack</span> after <span class="Highlight">Heavy Attack: Strategic Parry</span> or <span class="Highlight">Intro Skill: Defense Formation</span> to cast <span class="Highlight">Timed Counters</span>, performing up to 3 consecutive attacks, dealing <span class="Dark">Havoc DMG</span>, considered as Basic Attack damage.
  <br><span class="Highlight">Timed Counters</span> consume 1 "Resolving Caliber" upon hitting an enemy to grant a shield.
  <br>After casting the Intro Skill <span class="Highlight">Defense Formation</span>, using <span class="Highlight">Basic Attack</span> can directly cast <span class="Highlight">Timed Counters</span>.
  <br> 
  <br><span class="Title">Resolving Caliber</span>
  <br>Taoqi can hold up to 3 Resolving Caliber.
  <br><span class="Highlight">Basic Attack 4</span> will consume all of Taoqi's <span class="Highlight">Rocksteady Shields</span> to obtain that many "Resolving Caliber".
  <br>While <span class="Highlight">Rocksteady Shield</span> exists, when the on-field character is attacked, 1 <span class="Highlight">Rocksteady Shield</span> will be consumed, and "Resolving Caliber" is recovered.
  <br>After <span class="Highlight">Rocksteady Shield</span> ends, all remaining <span class="Highlight">Rocksteady Shield</span> will be consumed to grant that many "Resolving Caliber".</div>`,
  attacks: [
    {
      key: "TimedCountersPart1DMG",
      label: "Timed Counters Part 1 Damage",
      talents: {
        "1": "43.36%",
        "2": "46.92%",
        "3": "50.47%",
        "4": "55.45%",
        "5": "59.00%",
        "6": "63.09%",
        "7": "68.78%",
        "8": "74.47%",
        "9": "80.16%",
        "10": "86.20%",
      },
      type: "Basic",
      attribute: "defense",
    },
    {
      key: "TimedCountersPart2DMG",
      label: "Timed Counters Part 2 Damage",
      talents: {
        "1": "55.80%",
        "2": "60.38%",
        "3": "64.95%",
        "4": "71.36%",
        "5": "75.93%",
        "6": "81.19%",
        "7": "88.51%",
        "8": "95.83%",
        "9": "103.16%",
        "10": "110.93%",
      },
      type: "Basic",
      attribute: "defense",
    },
    {
      key: "TimedCountersPart3DMG",
      label: "Timed Counters Part 3 Damage",
      talents: {
        "1": "73.14%",
        "2": "79.14%",
        "3": "85.14%",
        "4": "93.53%",
        "5": "99.53%",
        "6": "106.43%",
        "7": "116.02%",
        "8": "125.62%",
        "9": "135.22%",
        "10": "145.41%",
      },
      type: "Basic",
      attribute: "defense",
    },
  ],
};
