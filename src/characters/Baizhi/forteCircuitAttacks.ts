export const forteCircuitAttacks = {
  name: "Forte Circuit: Cycle of Life",
  description: `<div class="skilldescription"><span class="Title">You'tan</span><br>A Remnant Creature that answers to Baizhi’s mind and desires while sharing all her stats. You’tan goes back to Baizhi when Baizhi dodges.<br> <br><span class="Title">Concentration</span><br>Baizhi consumes all "Concentration" when casting <span class="Highlight">Heavy Attack</span> or Resonance Skill <span class="Highlight">Emergency Plan</span> to continuously heal all Resonators on nearby teams. Each 1 "Concentration" consumed provides 1 healing. The healing happen every 2s.<br>When Baizhi consumes "Concentration" to cast <span class="Highlight">Heavy Attack</span>, Baizhi additionally restores Concerto Energy and Resonance Energy.<br>When Baizhi consumes "Concentration" to cast Resonance Skill <span class="Highlight">Emergency Plan</span>, Baizhi additionally restores Concerto Energy.<br> <br><span class="Title">Forte Gauge: Concentration</span><br>Baizhi can hold up to 4 "Concentration".<br>Baizhi obtains 1 "Concentration" for every <span class="Highlight">Basic Attack</span> on hit.</div>`,
  attacks: [
    {
      key: "ConcentrationHealing",
      label: "Concentration Healing",
      talents: {
        "1": "32 + 0.16%",
        "2": "34 + 0.17%",
        "3": "37 + 0.18%",
        "4": "40 + 0.20%",
        "5": "43 + 0.21%",
        "6": "46 + 0.23%",
        "7": "50 + 0.25%",
        "8": "54 + 0.27%",
        "9": "58 + 0.29%",
        "10": "63 + 0.31%",
      },
      type: "Healing",
      attribute: "hp",
    },
  ],
};
