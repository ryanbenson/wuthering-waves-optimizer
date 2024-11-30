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
      key: "NewWaveEraDMG",
      label: "New Wave Era DMG",
      talents: {
        "1": "383.20%",
        "2": "414.63%",
        "3": "446.05%",
        "4": "490.04%",
        "5": "521.46%",
        "6": "557.60%",
        "7": "607.88%",
        "8": "658.15%",
        "9": "708.43%",
        "10": "761.84%",
      },
      type: "Skill",
    },
    {
      key: "DeathOmenFuneralDMG",
      label: "Death Omen: Funeral DMG",
      talents: {
        "1": "174.74%",
        "2": "189.07%",
        "3": "203.40%",
        "4": "223.46%",
        "5": "237.79%",
        "6": "254.27%",
        "7": "277.19%",
        "8": "300.12%",
        "9": "323.05%",
        "10": "347.40%",
      },
      type: "Skill",
    },
    {
      key: "DeathOmenRestDMG",
      label: "Death Omen: Rest DMG",
      talents: {
        "1": "13.80% * 4",
        "2": "14.93% * 4",
        "3": "16.06% * 4",
        "4": "17.65% * 4",
        "5": "18.78% * 4",
        "6": "20.08% * 4",
        "7": "21.89% * 4",
        "8": "23.70% * 4",
        "9": "25.51% * 4",
        "10": "27.43% * 4",
      },
      type: "Skill",
    },
    {
      key: "DeathsEndDMG",
      label: "Death's End DMG",
      talents: {
        "1": "613.12%",
        "2": "663.40%",
        "3": "713.68%",
        "4": "784.06%",
        "5": "834.34%",
        "6": "892.16%",
        "7": "972.60%",
        "8": "1053.04%",
        "9": "1133.48%",
        "10": "1218.95%",
      },
      type: "Skill",
    },
  ],
};
