export const liberationAttacks = {
  name: "Resonance Liberation: New Wave Era",
  description: `<div class="skilldescription">
Deals <span class="Ice">Glacio</span> damage to targets within range and applies the Dissociation effect to hit targets. Enters the Gunflower Waltz state. This damage is considered Resonance Skill damage.<br>
<br>
Can be cast while airborne.<br>
<br>
<span class="Title">Dissociation</span><br>
Carlotta ignores 18% of the target's defense when dealing damage to a target affected by Dissociation.
Gunflower Waltz<br>
While in the Gunflower Waltz state, pressing Basic Attack or Resonance Liberation casts Death Omen.<br>
Each time Death Omen is cast, gain 1 【Kaleido Prism】.<br>
When 【Kaleido Prism】 reaches 4 points, pressing Basic Attack or Resonance Liberation will cast Death's End.<br>
Upon entering and exiting the Gunflower Waltz state, Spiritual Extract is cleared. While in the Gunflower Waltz state, Heavy Strike: Restrictive Strategy and Heavy Strike: Final March cannot be cast.<br>
<br>
<span class="Title">Death Omen</span><br>
Death Omen includes Death Omen: Funeral and Death Omen: Rest.<br>
Each time Death Omen is cast, Carlotta can move a short distance in the direction of the arrow keys.<br>
<br>
<span class="Title">Death Omen: Funeral</span><br>
Carlotta uses her blunderbuss to attack, dealing <span class="Ice">Glacio</span> damage. This damage is considered Resonance Skill damage.<br>
<br>
<span class="Title">Death Omen: Rest</span><br>
Carlotta’s blunderbuss behind her shatters, transforming into crystals to attack, dealing <span class="Ice">Glacio</span> damage. This damage is considered Resonance Skill damage.<br>
<br>
<span class="Title">Death's End</span><br>
Deals Glacio damage to targets within range. This damage is considered Resonance Skill damage.
</div>`,
  attacks: [
    {
      key: "FlowerintheMistDamage",
      label: "Flower in the Mist DMG",
      talents: {
        "1": "200.00%",
        "2": "216.4%",
        "3": "232.8%",
        "4": "255.76%",
        "5": "272.16%",
        "6": "291.02%",
        "7": "317.26%",
        "8": "343.5%",
        "9": "369.74%",
        "10": "397.62%",
      },
      type: "Liberation",
    },
  ],
};
