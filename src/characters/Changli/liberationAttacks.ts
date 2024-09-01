export const liberationAttacks = {
  name: "Resonance Liberation: Radiance of Fealty",
  description:
    '<div class="skilldescription">Deal <span class="Fire">Fusion DMG</span> to nearby targets, obtaining 4 stacks of [Enflamement], and entering <span class="Highlight">Fiery Feather</span>.<br><span class="Title">Fiery Feather</span><br>When Changli releases Heavy Attack <span class="Highlight">Flaming Sacrifice</span> within 10s, her ATK is increased by 25%, after which <span class="Highlight">Fiery Feather</span> ends.</div>',
  attacks: [
    {
      key: "RadianceofFealty",
      label: "Radiance of Fealty DMG",
      talents: {
        "1": "610.00%",
        "2": "660.02%",
        "3": "710.04%",
        "4": "780.07%",
        "5": "830.09%",
        "6": "887.62%",
        "7": "967.65%",
        "8": "1047.68%",
        "9": "1127.71%",
        "10": "1212.75%",
      },
      type: "Liberation",
    },
  ],
};
