export const forteCircuitAttacks = {
  name: "Forte Circuit: Misty Cover",
  description:
    `<div class="skilldescription">
    <span class="Highlight">Enhanced Lunge</span><br>
When <span class="Highlight">【Yellow Light Energy】</span> is full, <span class="Highlight">Resonance Skill</span> is replaced with <span class="Highlight">Enhanced Lunge</span>, dealing <span class="Thunder">Electro</span> damage, then enters <span class="Highlight">Red Light Focus mode</span>, this damage counts as <span class="Highlight">Basic Attack</span> damage.
During <span class="Highlight">Red Light Focus mode</span>, <span class="Highlight">Red Light Normal Attack</span> and <span class="Highlight">Red Light Heavy Attack</span> damage multipliers increases, increases <span class="Highlight">【Light Energy】</span> restoration
After casting <span class="Highlight">Basic Attack Stage 4</span> or <span class="Highlight">Heavy Attack</span>, exits the <span class="Highlight">Red Light Focus mode</span>.
<br><br>
<span class="Highlight">Enhanced Backstep</span><br>
When <span class="Highlight">【Red Light Energy】</span> is full, <span class="Highlight">Resonance Skill</span> is replaced with <span class="Highlight">Enhanced Backstep</span>, dealing <span class="Thunder">Electro</span> damage, then enters <span class="Highlight">Yellow Light Focus mode</span>, this damage counts as <span class="Highlight">Basic Attack damage.</span>
During <span class="Highlight">Yellow Light Focus mode</span>, <span class="Highlight">Flying Stars</span> is replaced with <span class="Highlight">Bright Light</span>, increasing the damage multiplier, increases <span class="Highlight">【Light Energy】</span> restoration
After casting <span class="Highlight">6</span> times of <span class="Highlight">Bright Light</span>, exits the <span class="Highlight">Yellow Light Focus mode</span>.
<br><br>
<span class="Highlight">Piercing Bright Light</span><br>
When Lumi casts <span class="Highlight">Outro Skill</span>, it consumes all <span class="Highlight">【Light Energy】</span> of the previous mode.
If the <span class="Highlight">【Light Energy】</span> consumed exceeds <span class="Highlight">25</span> points, <span class="Highlight">Piercing Bright Light</span> will be casted, dealing <span class="Thunder">Electro</span> damage, this damage counts as <span class="Highlight">Basic Attack</span> damage.
Every <span class="Highlight">25</span> points of <span class="Highlight">【Light Energy】</span> increases the number of <span class="Highlight">Piercing Bright Light</span> by <span class="Highlight">1</span>, up to <span class="Highlight">4</span> times.
<br><br>
<span class="Highlight">Yellow Light Energy</span><br>
Up to <span class="Highlight">100</span> points.<br>
When <span class="Highlight">Normal Attack Yellow Light Mode</span> hits a target, gains <span class="Highlight">【Yellow Light Energy】</span><br>
When <span class="Highlight">Flying Stars</span> hits a target, gains <span class="Highlight">【Yellow Light Energy】</span><br>
When <span class="Highlight">Bright Light</span> hits a target, gains <span class="Highlight">【Yellow Light Energy】</span><br>
When <span class="Highlight">Resonance Skill Enhanced Backstep</span> hits a target, gains <span class="Highlight">【Yellow Light Energy】</span><br>
<br><br>
<span class="Highlight">Red Light Energy</span><br>
Up to <span class="Highlight">100</span> points.<br>
During <span class="Highlight">Red Light</span> or <span class="Highlight">Red Light Focus mode</span>, when <span class="Highlight">Normal Attack</span> hits a target, gains <span class="Highlight">【Red Light Energy】</span></div>`,
  attacks: [
    {
      key: "PiercingBrightLightDMG",
      label: "Piercing Bright Light DMG",
      talents: {
        "1": "41.00%",
        "2": "44.37%",
        "3": "47.73%",
        "4": "52.44%",
        "5": "55.80%",
        "6": "59.66%",
        "7": "65.04%",
        "8": "70.42%",
        "9": "75.80%",
        "10": "81.52%",
      },
      type: "Basic",
    },
    {
      key: "RedLightFocusNormalAttackStage1DMG",
      label: "Red Light Focus Normal Attack Stage 1 DMG",
      talents: {
        "1": "60.48%",
        "2": "65.44%",
        "3": "70.40%",
        "4": "77.35%",
        "5": "82.31%",
        "6": "88.01%",
        "7": "95.94%",
        "8": "103.88%",
        "9": "111.81%",
        "10": "120.25%",
      },
      type: "Basic",
    },
    {
      key: "RedLightFocusNormalAttackStage2DMG",
      label: "Red Light Focus Normal Attack Stage 2 DMG",
      talents: {
        "1": "69.57% + 13.92%*5",
        "2": "75.28% + 15.06%*5",
        "3": "80.98% + 16.20%*5",
        "4": "88.97% + 17.80%*5",
        "5": "94.68% + 18.94%*5",
        "6": "101.24% + 20.25%*5",
        "7": "110.36% + 22.08%*5",
        "8": "119.49% + 23.90%*5",
        "9": "128.62% + 25.73%*5",
        "10": "138.32% + 27.67%*5",
      },
      type: "Basic",
    },
    {
      key: "RedLightFocusNormalAttackStage3DMG",
      label: "Red Light Focus Normal Attack Stage 3 DMG",
      talents: {
        "1": "47.15% + 110.00%",
        "2": "51.01% + 119.02%",
        "3": "54.88% + 128.04%",
        "4": "60.29% + 140.67%",
        "5": "64.16% + 149.69%",
        "6": "68.60% + 160.06%",
        "7": "74.79% + 174.49%",
        "8": "80.97% + 188.93%",
        "9": "87.16% + 203.36%",
        "10": "93.73% + 218.69%",
      },
      type: "Basic",
    },
    {
      key: "RedLightFocusHeavyAttackDMG",
      label: "Red Light Focus Heavy Attack DMG",
      talents: {
        "1": "44.35%*2",
        "2": "47.99%*2",
        "3": "51.63%*2",
        "4": "56.72%*2",
        "5": "60.36%*2",
        "6": "64.54%*2",
        "7": "70.36%*2",
        "8": "76.18%*2",
        "9": "81.99%*2",
        "10": "88.18%*2",
      },
      type: "Basic",
    },
    {
      key: "EnhancedLungeDMG",
      label: "Enhanced Lunge DMG",
      talents: {
        "1": "92.20%*2",
        "2": "99.77%*2",
        "3": "107.33%*2",
        "4": "117.91%*2",
        "5": "125.47%*2",
        "6": "134.17%*2",
        "7": "146.26%*2",
        "8": "158.36%*2",
        "9": "170.46%*2",
        "10": "183.31%*2",
      },
      type: "Skill",
    },
    {
      key: "EnhancedBackstepDMG",
      label: "Enhanced Backstep DMG",
      talents: {
        "1": "126.60%",
        "2": "136.99%",
        "3": "147.37%",
        "4": "161.90%",
        "5": "172.28%",
        "6": "184.22%",
        "7": "200.83%",
        "8": "217.43%",
        "9": "234.03%",
        "10": "251.79%",
      },
      type: "Skill",
    },
  ],
};
