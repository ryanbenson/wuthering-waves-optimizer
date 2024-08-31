export const forteCircuitAttacks = {
  name: "Forte Circuit: Fury Fugue",
  description: `<div class="skilldescription"><span class="Title">Resonance Skill: Fury Fugue</span><br>When Mortefi's Annoyance reaches 100, his <span class="Highlight">Resonance Skill</span> is replaced with <span class="Highlight">Fury Fudge</span>.<br>When casting Fury Fudge, Mortefi consumes all Annoyance to unleash high-speed flame lightning, dealing <span class="Fire">Fusion DMG</span>, considered as Resonance Skill damage.<br> <br><span class="Title">Annoyance</span><br>Mortefi can hold up to 100 Annoyance and can restore Annoyance in the following ways:<br>- When Normal Attack <span class="Highlight">Impromptu Show</span> hits the target<br>- When Intro Skill <span class="Highlight">Dissonance</span> hits the target<br>- When Resonance Skill <span class="Highlight">Passionate Variation</span> hits the target<br>- Within 5s after casting <span class="Highlight">Passionate Variation</span>, Normal Attack <span class="Highlight">Impromptu Show</span> that hits the target restores Annoyance additionally.</div>`,
  attacks: [
    {
      key: "FuryFugueDamage",
      label: "Fury Fugue DMG",
      talents: {
        "1": "164.00%",
        "2": "177.45%",
        "3": "190.90%",
        "4": "209.73%",
        "5": "223.18%",
        "6": "238.64%",
        "7": "260.16%",
        "8": "281.67%",
        "9": "303.19%",
        "10": "326.05%",
      },
      type: "Skill",
    },
  ],
};
