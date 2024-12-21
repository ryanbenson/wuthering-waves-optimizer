export const liberationAttacks = {
  name: "Resonance Liberation: New Wave Era",
  description: `<div class="skilldescription">
Deals <span class="Ice">Glacio</span> damage to targets within range and applies the Dissociation effect to hit targets. Enters the Gunflower Waltz state. This damage is considered Resonance Skill damage.<br>
Can be cast while airborne.<br>
<br>
<span class="Title">Dissociation</span><br>
Carlotta ignores 18% of the target's defense when dealing damage to a target affected by Dissociation.<br>
<br>
<span class="Title">Gunflower Waltz</span><br>
While in the Gunflower Waltz state, pressing Basic Attack or Resonance Liberation casts Death Omen.<br>
Each time Death Omen is cast, gain 1 【Kaleido Prism】.<br>
When 【Kaleido Prism】 reaches 4 points, pressing Basic Attack or Resonance Liberation will cast Death's End.<br>
Entering or exiting the Gunflower Waltz state clears 【Spiritual Extract】. During the Gunflower Waltz state, the Basic Attack Essential Means, the Heavy Attack Restrictive Strategy, and the Heavy Attack End of the Road cannot be cast.<br>
<br>
<span class="Title">Death Omen</span><br>
Carlotta fires her gunlance and summons crystals to attack enemies, dealing <span class="Ice">Glacio</span> damage. This damage is considered Resonance Skill damage.<br>
Each time Death Omen is cast, Carlotta can move a short distance in the direction of the arrow keys.<br>
<br>
<span class="Title">Death's End</span><br>
Deals <span class="Ice">Glacio</span> damage to targets within range. This damage is considered Resonance Skill damage.<br>
Casting Death's End ends the Gunflower Waltz state.
</div>`,
  attacks: [
    {
      key: "NewWaveEraDMG",
      label: "New Wave Era DMG",
      talents: {
        "1": "202.56%",
        "2": "219.17%",
        "3": "235.78%",
        "4": "259.03%",
        "5": "275.64%",
        "6": "294.74%",
        "7": "321.32%",
        "8": "347.89%",
        "9": "374.47%",
        "10": "402.71%",
      },
      type: "Skill",
    },
    {
      key: "DeathOmenDMG",
      label: "Death Omen DMG",
      talents: {
        "1": "92.37%+7.30%*4",
        "2": "99.94%+7.89%*4",
        "3": "107.52%+8.49%*4",
        "4": "118.12%+9.33%*4",
        "5": "125.70%+9.93%*4",
        "6": "134.41%+10.62%*4",
        "7": "146.52%+11.57%*4",
        "8": "158.64%+12.53%*4",
        "9": "170.76%+13.49%*4",
        "10": "183.64%+14.50%*4",
      },
      type: "Skill",
    },
    {
      key: "DeathsEndDMG",
      label: "Death's End DMG",
      talents: {
        "1": "324.09%",
        "2": "350.67%",
        "3": "377.24%",
        "4": "414.45%",
        "5": "441.03%",
        "6": "471.59%",
        "7": "514.11%",
        "8": "556.63%",
        "9": "599.15%",
        "10": "644.33%",
      },
      type: "Skill",
    },
  ],
};
