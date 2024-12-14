export const forteCircuitAttacks = {
  name: "Forte Circuit: Art Odyssey",
  description: `<div class="skilldescription"><br>
<span class="Title">Leap Fantasy</span><br>
When Roccia is in the Leap Fantasy state and has at least 100 points of 【Imagination】, she can press <span class="Highlight">Basic Attack</span> to consume 100 points of 【Imagination】 and cast the Basic Attack Fantasy into reality.<br>
This state will be removed when Roccia is no longer in the air or when she exits the field.<br>
<br>
<span class="Title">Basic Attack · Fantasy Into Reality</span>
Performs up to 3 consecutive attacks, dealing <span class="Dark">Havoc damage</span>. This damage is considered <span class="Highlight">Resonance Skill</span> damage. After the 1st and 2nd attacks land, Roccia will be launched into the air, entering the Leap Fantasy state.<br>
When Roccia's critical rate is above <span class="Highlight">50%</span>, for every additional <span class="Highlight">0.1% critical rate</span>, the 3rd attack of the Basic Attack Fantasy into reality will increase the attack of all characters in the team by <span class="Highlight">1</span> point, lasting for <span class="Highlight">30</span> seconds. This can be increased up to <span class="Highlight">200</span> points.<br>
<br>
<span class="Title">【Imagination】 Acquisition Rules</span><br>
The maximum 【Imagination】 is 300 points.<br>
Normal Attack damage restores 【Imagination】.<br>
Hold down Basic Attack to charge and gain 【Imagination】.<br>
Casting the Resonance Skill High-Difficulty Design restores 100 points of 【Imagination】.<br>
Casting the Intro Skill Perlo, Lend a Hand! restores 100 points of 【Imagination】.
</div>`,
  attacks: [
    {
      key: "LeapFantasyFirstHit",
      label: "Leap Fantasy - First Hit DMG",
      talents: {
        "1": "162.00%",
        "2": "175.29%",
        "3": "188.57%",
        "4": "207.17%",
        "5": "220.45%",
        "6": "235.73%",
        "7": "256.99%",
        "8": "278.24%",
        "9": "299.49%",
        "10": "322.08%",
      },
      type: "Skill",
    },
    {
      key: "LeapFantasySecondHit",
      label: "Leap Fantasy - Second Hit DMG",
      talents: {
        "1": "171.00%",
        "2": "185.03%",
        "3": "199.05%",
        "4": "218.68%",
        "5": "232.70%",
        "6": "248.83%",
        "7": "271.26%",
        "8": "293.70%",
        "9": "316.13%",
        "10": "339.97%",
      },
      type: "Skill",
    },
    {
      key: "LeapFantasyThirdHit",
      label: "Leap Fantasy - Third Hit DMG",
      talents: {
        "1": "180.00%",
        "2": "194.76%",
        "3": "209.52%",
        "4": "230.19%",
        "5": "244.95%",
        "6": "261.92%",
        "7": "285.54%",
        "8": "309.15%",
        "9": "332.77%",
        "10": "357.86%",
      },
      type: "Skill",
    },
    {
      key: "SequenceNode6FlyonGoldenWingsRealityDMG",
      label: "S6: Fly, on Golden Wings DMG",
      talents: {
        "1": "180.00%",
        "2": "194.76%",
        "3": "209.52%",
        "4": "230.19%",
        "5": "244.95%",
        "6": "261.92%",
        "7": "285.54%",
        "8": "309.15%",
        "9": "332.77%",
        "10": "357.86%",
      },
      type: "Heavy",
      requiresResonanceChain: "SequenceNode6FlyonGoldenWingsRealityDMG",
    },
  ],
};
