export const basicAttacks = {
  name: "Basic Attack: Concealed Edge",
  description: `<div class="skilldescription"><span class="Title">Basic Attack</span>
    <br>Taoqi performs up to 4 continuous attacks, dealing <span class="Dark">Havoc DMG</span>.
    <br> 
    <br><span class="Title">Heavy Attack</span>
    <br>Taoqi consumes Stamina and enters <span class="Highlight">Rocksteady Defense</span> state.
    <br> 
    <br><span class="Title">Rocksteady Defense</span>
    <br>Taoqi's damage taken is reduced by 35%;
    <br>-When Taoqi is attacked during <span class="Highlight">Rocksteady Defense</span>, she will cat <span class="Highlight">Strategic Parry</span>;
    <br>-<span class="Highlight">Strategic Parry</span> is automatically cast after <span class="Highlight">Rocksteady Defense</span> lasts for 3s;
    <br>-If Taoqi is attacked when casting Resonance Skill <span class="Highlight">Rocksteady Shield</span>, <span class="Highlight">Strategic Parry</span> is automatically cast.
    <br> 
    <br><span class="Title">Strategic Parry</span>
    <br>Taoqi attacks the target, dealing <span class="Dark">Havoc DMG</span>.
    <br> 
    <br><span class="Title">Mid-air Attack</span>
    <br>Taoqi consumes Stamina to perform a Mid-Air Plunging Attack, dealing <span class="Dark">Havoc DMG</span>.
    <br> 
    <br><span class="Title">Dodge Counter</span>
    <br>Use <span class="Highlight">Basic Attack</span> after a successful <span class="Highlight">Dodge</span> to attack the target, dealing <span class="Dark">Havoc DMG</span>.</div>`,
  attacks: [
    {
      key: "Part1DMG",
      label: "Part 1 DMG",
      talents: {
        "1": "45.34%",
        "2": "49.06%",
        "3": "52.78%",
        "4": "57.99%",
        "5": "61.70%",
        "6": "65.98%",
        "7": "71.93%",
        "8": "77.88%",
        "9": "83.83%",
        "10": "90.15%",
      },
      type: "Basic",
    },
    {
      key: "Part2DMG",
      label: "Part 2 DMG",
      talents: {
        "1": "42.67%",
        "2": "46.17%",
        "3": "49.67%",
        "4": "54.57%",
        "5": "58.07%",
        "6": "62.09%",
        "7": "67.69%",
        "8": "73.29%",
        "9": "78.89%",
        "10": "84.84%",
      },
      type: "Basic",
    },
    {
      key: "Part3DMG",
      label: "Part 3 DMG",
      // NOTE: I've modified this
      // https://wuthering.wiki/character_1601.html
      // has a single hit, but in-game has 2 hits
      talents: {
        "1": "28.00%*2",
        "2": "30.30%*2",
        "3": "32.60%*2",
        "4": "35.81%*2",
        "5": "38.11%*2",
        "6": "40.75%*2",
        "7": "44.42%*2",
        "8": "48.09%*2",
        "9": "51.77%*2",
        "10": "55.67%*2",
      },
      type: "Basic",
    },
    {
      key: "Part4DMG",
      label: "Part 4 DMG",
      talents: {
        "1": "136.00%",
        "2": "147.16%",
        "3": "158.31%",
        "4": "173.92%",
        "5": "185.07%",
        "6": "197.90%",
        "7": "215.74%",
        "8": "233.58%",
        "9": "251.43%",
        "10": "270.39%",
      },
      type: "Basic",
    },
    {
      key: "HeavyAttackDMG",
      label: "Heavy Attack DMG",
      talents: {
        "1": "110.84%",
        "2": "119.93%",
        "3": "129.02%",
        "4": "141.75%",
        "5": "150.84%",
        "6": "161.29%",
        "7": "175.83%",
        "8": "190.37%",
        "9": "204.91%",
        "10": "220.37%",
      },
      type: "Heavy",
    },
    {
      key: "StrategicParryDMG",
      label: "Strategic Parry DMG",
      talents: {
        "1": "39.59%",
        "2": "42.84%",
        "3": "46.08%",
        "4": "50.63%",
        "5": "53.87%",
        "6": "57.61%",
        "7": "62.80%",
        "8": "67.99%",
        "9": "73.19%",
        "10": "78.70%",
      },
      type: "Basic",
      attribute: "defense",
    },
    {
      key: "MidAirAttackDMG",
      label: "Mid-air Attack DMG",
      talents: {
        "1": "62.00%",
        "2": "67.09%",
        "3": "72.17%",
        "4": "79.29%",
        "5": "84.37%",
        "6": "90.22%",
        "7": "98.36%",
        "8": "106.49%",
        "9": "114.62%",
        "10": "123.27%",
      },
      type: "Basic",
    },
    {
      key: "DodgeCounterDMG",
      label: "Dodge Counter DMG",
      talents: {
        "1": "125.00%",
        "2": "135.25%",
        "3": "145.50%",
        "4": "159.85%",
        "5": "170.10%",
        "6": "181.89%",
        "7": "198.29%",
        "8": "214.69%",
        "9": "231.09%",
        "10": "248.52%",
      },
      type: "Basic",
    },
  ],
};
