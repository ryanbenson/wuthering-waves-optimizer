export const skillAttacks = {
  name: "Resonance Skill: Dance of Blooming and Withering",
  description: `<div class="skilldescription">
  <span class="Highlight">Full Bloom</span><br>
Attacks the target, dealing <span class="Dark">Havoc</span> damage, then enters the Bloom state, this damage counts as <span class="Highlight">Basic Attack</span> damage.
Can be casted in the air.
<br><br>
<span class="Highlight">Bloom state</span><br>
-Can’t move during the Bloom state, and Vine Dance.<br>
-<span class="Highlight">Basic Attack</span> and <span class="Highlight">Heavy Attack</span> will be replaced with <span class="Highlight">Basic Attack Vine Dance</span>, performing up to 4 consecutive attacks, dealing <span class="Dark">Havoc</span> damage, this damage counts as <span class="Highlight">Basic Attack</span> damage.
-When casting <span class="Highlight">Basic Attack Stage 3 Vine Dance</span>, holding the <span class="Highlight">Normal Attack</span> will cast <span class="Highlight">Basic Attack Ashen Blossom Vine Dance</span>, dealing <span class="Dark">Havoc</span> damage, then immediately cast <span class="Highlight">Basic Attack Stage 4 Vine Dance</span><br>
-<span class="Highlight">Dodge Counter</span> replaced with <span class="Highlight">Dodge Counter Atonement</span>. When pressing the <span class="Highlight">Normal Attack</span> after successfully dodging, Camellya attacks the target, dealing <span class="Dark">Havoc</span> damage; this damage counts as <span class="Highlight">Basic Attack</span> damage.<br>
-<span class="Highlight">Resonance Skill</span> replaced with <span class="Highlight">Resonance Skill Dark Pistil Seeker</span>. Casting <span class="Highlight">Dark Pistil Seeker</span> deals damage to the target, dealing <span class="Dark">Havoc</span> damage, this damage counts as <span class="Highlight">Basic Attack</span> damage.<br>
-After casting <span class="Highlight">Resonance Skill Dark Pistil Seeker</span>, Camellya exits the Bloom state.<br>
-Unable to restore stamina when casting <span class="Highlight">Resonance Skill Dark Pistil Seeker</span> mid-air.<br>
-Continuously consumes stamina when under the state of Vine Dance during mid-air.<br>
-When manipulating objects, Camellya exits the Bloom state.<br>
-Jumping replaced with <span class="Highlight">Basic Attack Whirling Dance</span>. Tap jump to attack the target, dealing <span class="Dark">Havoc</span> damage, this damage counts as <span class="Highlight">Basic Attack</span> damage, Camellya then exits the Bloom state.
</div>`,
  attacks: [
    {
      key: "FullBloomDMG",
      label: "Full Bloom DMG",
      talents: {
        "1": "57.15%*2",
        "2": "61.84%*2",
        "3": "66.53%*2",
        "4": "73.09%*2",
        "5": "77.77%*2",
        "6": "83.16%*2",
        "7": "90.66%*2",
        "8": "98.16%*2",
        "9": "105.66%*2",
        "10": "113.62%*2",
      },
      type: "Basic",
    },
    {
      key: "VineDanceStage1DMG",
      label: "Vine Dance 1st Hit DMG",
      talents: {
        "1": "48.45%",
        "2": "52.43%",
        "3": "56.40%",
        "4": "61.96%",
        "5": "65.94%",
        "6": "70.50%",
        "7": "76.86%",
        "8": "83.22%",
        "9": "89.57%",
        "10": "96.33%",
      },
      type: "Basic",
    },
    {
      key: "VineDanceStage2DMG",
      label: "Vine Dance 2nd Hit DMG",
      talents: {
        "1": "22.95%*2",
        "2": "24.84%*2",
        "3": "26.72%*2",
        "4": "29.35%*2",
        "5": "31.24%*2",
        "6": "33.40%*2",
        "7": "36.41%*2",
        "8": "39.42%*2",
        "9": "42.43%*2",
        "10": "45.63%*2",
      },
      type: "Basic",
    },
    {
      key: "VineDanceStage3DMG",
      label: "Vine Dance 3rd Hit DMG",
      talents: {
        "1": "11.04%*6",
        "2": "11.95%*6",
        "3": "12.86%*6",
        "4": "14.12%*6",
        "5": "15.03%*6",
        "6": "16.07%*6",
        "7": "17.52%*6",
        "8": "18.97%*6",
        "9": "20.41%*6",
        "10": "21.95%*6",
      },
      type: "Basic",
    },
    {
      key: "VineDanceStage4DMG",
      label: "Vine Dance 4th Hit DMG",
      talents: {
        "1": "34.00%*3",
        "2": "36.79%*3",
        "3": "39.58%*3",
        "4": "43.48%*3",
        "5": "46.27%*3",
        "6": "49.47%*3",
        "7": "53.93%*3",
        "8": "58.39%*3",
        "9": "62.85%*3",
        "10": "67.59%*3",
      },
      type: "Basic",
    },
    {
      key: "AshenBlossomVineDanceDMG",
      label: "Ashen Blossom Vine Dance DMG",
      talents: {
        "1": "11.04%*19",
        "2": "11.95%*19",
        "3": "12.86%*19",
        "4": "14.12%*19",
        "5": "15.03%*19",
        "6": "16.07%*19",
        "7": "17.52%*19",
        "8": "18.97%*19",
        "9": "20.41%*19",
        "10": "21.95%*19",
      },
      type: "Basic",
    },
    {
      key: "DarkPistilSeekerDMG",
      label: "Dark Pistil Seeker DMG",
      talents: {
        "1": "26.46%*5",
        "2": "28.63%*5",
        "3": "30.80%*5",
        "4": "33.84%*5",
        "5": "36.01%*5",
        "6": "38.51%*5",
        "7": "41.98%*5",
        "8": "45.45%*5",
        "9": "48.92%*5",
        "10": "52.61%*5",
      },
      type: "Basic",
    },
    {
      key: "WhirlingDanceDMG",
      label: "Whirling Dance DMG",
      talents: {
        "1": "26.64%*3",
        "2": "28.82%*3",
        "3": "31.00%*3",
        "4": "34.06%*3",
        "5": "36.24%*3",
        "6": "38.76%*3",
        "7": "42.25%*3",
        "8": "45.74%*3",
        "9": "49.24%*3",
        "10": "52.95%*3",
      },
      type: "Basic",
    },
    {
      key: "AtonementDMG",
      label: "Atonement DMG",
      talents: {
        "1": "57.00%*2",
        "2": "61.68%*2",
        "3": "66.35%*2",
        "4": "72.90%*2",
        "5": "77.57%*2",
        "6": "82.95%*2",
        "7": "90.42%*2",
        "8": "97.90%*2",
        "9": "105.38%*2",
        "10": "113.33%*2",
      },
      type: "Basic",
    },
  ],
};
