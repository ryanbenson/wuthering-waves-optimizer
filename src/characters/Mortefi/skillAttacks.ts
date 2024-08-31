export const skillAttacks = {
  name: "Resonance Skill: Passionate Variation",
  description:
    `<div class="skilldescription">Launch a flashing lightning of flames forward, dealing <span class="Fire">Fusion DMG</span>.</div>`,
  attacks: [
    {
      key: "PassionateVariation",
      label: "Passionate Variation",
      talents: {
        "1": "105.00%",
        "2": "113.61%",
        "3": "122.22%",
        "4": "134.28%",
        "5": "142.89%",
        "6": "152.79%",
        "7": "166.57%",
        "8": "180.34%",
        "9": "194.12%",
        "10": "208.76%",
      },
      type: "Skill",
    },
    {
      key: "SequenceNodeFuneraryQuartet",
      label: "Sequence Node 5: Funerary Quartet",
      talents: {
        "1": "8.00%",
        "2": "8.66%",
        "3": "9.32%",
        "4": "10.24%",
        "5": "10.89%",
        "6": "11.65%",
        "7": "12.70%",
        "8": "13.74%",
        "9": "14.79%",
        "10": "15.91%",
      },
      type: "Basic",
      subType: "Coordinated",
      requiresResonanceChain: "SequenceNodeFuneraryQuartet",
    },
  ],
};
