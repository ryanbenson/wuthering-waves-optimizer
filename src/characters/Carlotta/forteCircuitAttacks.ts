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
      key: "EndoftheRoadDMG",
      label: "End of the Road DMG",
      talents: {
        "1": "33.62% * 5 + 252.11%",
        "2": "36.38% * 5 + 272.78%",
        "3": "39.13% * 5 + 293.45%",
        "4": "42.99% * 5 + 322.39%",
        "5": "45.75% * 5 + 343.07%",
        "6": "48.92% * 5 + 366.84%",
        "7": "53.33% * 5 + 399.92%",
        "8": "57.74% * 5 + 432.99%",
        "9": "62.15% * 5 + 466.07%",
        "10": "66.83% * 5 + 501.21%",
      },
      type: "Heavy",
    },
  ],
};
