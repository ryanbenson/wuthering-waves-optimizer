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
        "1": "364.60%",
        "2": "394.50%",
        "3": "424.40%",
        "4": "466.26%",
        "5": "496.15%",
        "6": "530.53%",
        "7": "578.37%",
        "8": "626.21%",
        "9": "674.04%",
        "10": "724.87%",
      },
      type: "Skill",
    },
    {
      key: "DeathOmenDMG",
      label: "Death Omen DMG",
      talents: {
        "1": "166.26%+13.13%*4",
        "2": "179.90%+14.21%*4",
        "3": "193.53%+15.28%*4",
        "4": "212.62%+16.79%*4",
        "5": "226.25%+17.87%*4",
        "6": "241.93%+19.10%*4",
        "7": "263.74%+20.83%*4",
        "8": "285.55%+22.55%*4",
        "9": "307.37%+24.27%*4",
        "10": "330.54%+26.10%*4",
      },
      type: "Skill",
    },
    {
      key: "DeathsEndDMG",
      label: "Death's End DMG",
      talents: {
        "1": "583.36%",
        "2": "631.20%",
        "3": "679.04%",
        "4": "746.01%",
        "5": "793.84%",
        "6": "848.85%",
        "7": "925.39%",
        "8": "1001.93%",
        "9": "1078.46%",
        "10": "1159.78%",
      },
      type: "Skill",
    },
  ],
};
