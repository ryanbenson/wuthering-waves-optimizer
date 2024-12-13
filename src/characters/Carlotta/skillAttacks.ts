export const skillAttacks = {
  name: "Resonance Skill: Aesthetics of Violence",
  description: `<div class="skilldescription">
Deals <span class="Ice">Glacio</span> damage and applies the Chroma effect to hit targets. After casting, pressing the Resonance Skill within a short time will trigger Brilliant Will.zv
zv
<span class="Title">Chroma</span><br>
During the effect's duration, no actions can be performed. The effect lasts for 1.5 seconds.<br>
<br>
<span class="Title">Brilliant Will</span><br>
Carlotta consumes all of her current 【Amorphous Prism】 to deal <span class="Ice">Glacio</span> damage to the target.
If the Resonance Skill Brilliant Will is not cast within a certain time or if the character is switched, the skill enters cooldown.</div>`,
  attacks: [
    {
      key: "AestheticsofViolenceDMG",
      label: "Aesthetics of Violence DMG",
      talents: {
        "1": "72.49%+72.49%",
        "2": "78.43%+78.43%",
        "3": "84.37%+84.37%",
        "4": "92.69%+92.69%",
        "5": "98.64%+98.64%",
        "6": "105.47%+105.47%",
        "7": "114.98%+114.98%",
        "8": "124.49%+124.49%",
        "9": "134.00%+134.00%",
        "10": "144.11%+144.11%",
      },
      type: "Skill",
    },
    {
      key: "BrilliantWillDMG",
      label: "Brilliant Will DMG",
      talents: {
        "1": "56.70%+56.70%+170.10%",
        "2": "61.35%+61.35%+184.05%",
        "3": "66.00%+66.00%+198.00%",
        "4": "72.51%+72.51%+217.53%",
        "5": "77.16%+77.16%+231.48%",
        "6": "82.51%+82.51%+247.52%",
        "7": "89.95%+89.95%+269.83%",
        "8": "97.39%+97.39%+292.15%",
        "9": "104.83%+104.83%+314.47%",
        "10": "112.73%+112.73%+338.18%",
      },
      type: "Skill",
    },
  ],
};
