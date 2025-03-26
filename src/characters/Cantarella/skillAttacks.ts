export const skillAttacks = {
  name: "Resonance Skill: Dance with Shadows",
  description: `<div class="skilldescription"><span class="Title">Graceful Step</span><br>Attack the target, dealing <span class="Dark">Havoc DMG</span>.<br> <br><span class="Title">Flickering Reverie</span><br>When in <span class="Highlight">Mirage</span>, <span class="Highlight">Resonance Skill</span> becomes <span class="Highlight">Flickering Reverie</span>, which is considered an <span class="Highlight">Echo Skill</span> when being cast. Attack the target, dealing <span class="Dark">Havoc DMG</span>, and send them into <span class="Highlight">Hazy Dream</span>.<br>Can be cast in mid-air.<br> <br><span class="Title">Hazy Dream</span><br>Reduce the target's movement speed for 6.5s. When the target takes damage, <span class="Highlight">Jolt</span> is triggered once, removing <span class="Highlight">Hazy Dream</span> to deal <span class="Dark">Havoc DMG</span>, considered Basic Attack DMG.<br>Attacks by other Resonators in the team will not <span class="Highlight">Jolt</span> a target influenced by <span class="Highlight">Hazy Dream</span> and will remove the <span class="Highlight">Hazy Dream</span>. <br>Coordinated Attacks and damage from Utilities will not <span class="Highlight">Jolt</span> a target.</div>`,
  attacks: [
    {
      "key": "GracefulStepDMG",
      "label": "Graceful Step DMG",
      "talents": {
        "1": "37.02%*2",
        "2": "40.06%*2",
        "3": "43.10%*2",
        "4": "47.35%*2",
        "5": "50.38%*2",
        "6": "53.87%*2",
        "7": "58.73%*2",
        "8": "63.59%*2",
        "9": "68.44%*2",
        "10": "73.60%*2"
      },
      "type": "Skill"
    },
    {
      "key": "FlickeringReverieDMG",
      "label": "Flickering Reverie DMG",
      "talents": {
        "1": "98.70%",
        "2": "106.80%",
        "3": "114.89%",
        "4": "126.22%",
        "5": "134.32%",
        "6": "143.62%",
        "7": "156.57%",
        "8": "169.52%",
        "9": "182.47%",
        "10": "196.23%"
      },
      "type": "Skill"
    },
    {
      "key": "JoltDMG",
      "label": "Jolt DMG",
      "talents": {
        "1": "100.00%",
        "2": "108.20%",
        "3": "116.40%",
        "4": "127.88%",
        "5": "136.08%",
        "6": "145.51%",
        "7": "158.63%",
        "8": "171.75%",
        "9": "184.87%",
        "10": "198.81%"
      },
      "type": "Basic"
    }
  ],
};
