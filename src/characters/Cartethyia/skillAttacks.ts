export const skillAttacks = {
  name: "Resonance Skill: Sword to Bear Their Names",
  description: `<div class="skilldescription"><span class="Title">Resonance Skill - Cartethyia</span><br>Attack the target, launch nearby enemies, and then plunge them to the ground, dealing <span class="Wind">Aero DMG</span> and inflicting 2 stacks of <span class="Wind">Aero Erosion</span> on the targets hit. This instance of DMG is considered <span class="Highlight">Basic Attack DMG</span>. Can be performed in mid-air.<br>Following <span class="Highlight">Cartethyia - Resonance Skill</span>, summon <span class="Highlight">Sword of Virtue's Shadow</span>.<br>Up to 1 <span class="Highlight">Sword of Virtue's Shadow</span> may exist at the same time, lasting for 20s.</div>`,
  attacks: [
    {
      key: "SwordtoBearTheirNamesDMG",
      label: "Sword to Bear Their Names DMG",
      talents: {
        "1": "3.47%*3 + 4.46%",
        "2": "3.75%*3 + 4.83%",
        "3": "4.04%*3 + 5.19%",
        "4": "4.44%*3 + 5.70%",
        "5": "4.72%*3 + 6.07%",
        "6": "5.05%*3 + 6.49%",
        "7": "5.50%*3 + 7.07%",
        "8": "5.96%*3 + 7.66%",
        "9": "6.41%*3 + 8.24%",
        "10": "6.89%*3 + 8.86%",
      },
      type: "Basic",
      attribute: "hp",
    },
  ],
};
