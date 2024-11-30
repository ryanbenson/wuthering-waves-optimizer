export const forteCircuitAttacks = {
  name: "Forte Circuit: Art Odyssey",
  description: `<div class="skilldescription">
<span class="Title">Heavy Attack · End of the Road</span><br> 
Carlotta can activate 【Chroma Prism】 every 22 seconds. When 【Spiritual Extract】 is full and 【Chroma Prism】 is in its activated state, holding the Basic Attack will consume all 【Spiritual Extract】 and trigger the Heavy Attack End of the Road. After casting, 【Chroma Prism】 enters cooldown. This damage is considered <span class="Ice">Glacio</span> damage and reduces the cooldown of the Resonance Skill Violent Aesthetics by 6 seconds.<br> <br> 

<span class="Title">【Spiritual Extract】 Acquisition Rules</span><br> 
Maximum 120 points.<br> 
Casting the Intro Skill Winter’s Lament restores 30 points of 【Spiritual Extract】.<br> 
Casting the Resonance Skill Brilliant Will restores 10 points of 【Spiritual Extract】 for each 【Amorphous Prism】 consumed.<br> 
Basic Attack · Necessary Means hits restore 10 points of 【Spiritual Extract】.<br> 
Successful Dodge Counter hits restore 10 points of 【Spiritual Extract】.<br> 
<br> 
<span class="Title">【Amorphous Prism】 Acquisition Rules</span><br> 
Maximum 6 units.<br> 
Casting the second segment of Basic Attack restores 3 【Amorphous Prisms】.<br> 
Casting Heavy Attack restores 3 【Amorphous Prisms】.<br> 
Casting Aerial Attack · Courtesy Greeting restores 3 【Amorphous Prisms】.<br> 
Casting the Resonance Skill Violent Aesthetics restores 3 【Amorphous Prisms】.<br> 
Successful dodge restores 3 【Amorphous Prisms】.<br> 
</div>`,
  attacks: [
    {
      key: "GloriousPlungeDMG",
      label: "Glorious Plunge DMG",
      talents: {
        "1": "86.70%",
        "2": "93.81%",
        "3": "100.92%",
        "4": "110.88%",
        "5": "117.99%",
        "6": "126.16%",
        "7": "137.54%",
        "8": "148.91%",
        "9": "160.29%",
        "10": "172.37%",
      },
      type: "Heavy",
    },
    {
      key: "FeralGyrateStage1DMG",
      label: "Feral Gyrate Stage 1 DMG",
      talents: {
        "1": "43.80%*2 + 58.40%",
        "2": "47.40%*2 + 63.19%",
        "3": "50.99%*2 + 67.98%",
        "4": "56.02%*2 + 74.69%",
        "5": "59.61%*2 + 79.48%",
        "6": "63.74%*2 + 84.98%",
        "7": "69.48%*2 + 92.64%",
        "8": "75.23%*2 + 100.31%",
        "9": "80.98%*2 + 107.97%",
        "10": "87.08%*2 + 116.11%",
      },
      type: "Basic",
    },
    {
      key: "FeralGyrateStage2DMG",
      label: "Feral Gyrate Stage 2 DMG",
      talents: {
        "1": "15.98%*6",
        "2": "17.29%*6",
        "3": "18.60%*6",
        "4": "20.44%*6",
        "5": "21.75%*6",
        "6": "23.26%*6",
        "7": "25.35%*6",
        "8": "27.45%*6",
        "9": "29.55%*6",
        "10": "31.77%*6",
      },
      type: "Basic",
    },
    {
      key: "MountainRoamerDMG",
      label: "Mountain Roamer DMG",
      talents: {
        "1": "41.69%*2",
        "2": "45.11%*2",
        "3": "48.53%*2",
        "4": "53.31%*2",
        "5": "56.73%*2",
        "6": "60.66%*2",
        "7": "66.13%*2",
        "8": "71.60%*2",
        "9": "77.07%*2",
        "10": "82.88%*2",
      },
      type: "Skill",
    },
    {
      key: "StormyKicksDMG",
      label: "Stormy Kicks DMG",
      talents: {
        "1": "18.13%*8 + 96.65%",
        "2": "19.61%*8 + 104.58%",
        "3": "21.10%*8 + 112.51%",
        "4": "23.18%*8 + 123.60%",
        "5": "24.67%*8 + 131.53%",
        "6": "26.37%*8 + 140.64%",
        "7": "28.75%*8 + 153.32%",
        "8": "31.13%*8 + 166.00%",
        "9": "33.51%*8 + 178.68%",
        "10": "36.03%*8 + 192.15%",
      },
      type: "Basic",
    },
    {
      key: "TailStrikeDMG",
      label: "Tail Strike DMG",
      talents: {
        "1": "88.00%*2",
        "2": "95.22%*2",
        "3": "102.44%*2",
        "4": "112.54%*2",
        "5": "119.76%*2",
        "6": "128.05%*2",
        "7": "139.60%*2",
        "8": "151.14%*2",
        "9": "162.69%*2",
        "10": "174.96%*2",
      },
      type: "Basic",
    },
    {
      key: "InherentSkillDiligentPractice",
      label: "Inherent Skill: Diligent Practice DMG",
      talents: {
        "1": "125.07%",
        "2": "135.32%",
        "3": "145.58%",
        "4": "159.93%",
        "5": "170.19%",
        "6": "181.98%",
        "7": "198.39%",
        "8": "214.8%",
        "9": "231.21%",
        "10": "248.64%",
      },
      type: "Skill",
      requiresResonanceChain: "InherentSkillDiligentPractice",
    },
  ],
};
