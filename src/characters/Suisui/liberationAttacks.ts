export const liberationAttacks = {
  name: "Resonance Liberation: Song of Thoroughfare",
  description: `While casting this skill, Suisui deploys <span style="color:#ffd12f;" class="font-bold">Ceaseless Landscape</span> that lasts for 25s. During <span style="color:#ffd12f;" class="font-bold">Ceaseless Landscape</span>, Suisui enters <span style="color:#ffd12f;" class="font-bold">Heaven's Roam</span> when casting <span style="color:#ffd12f;" class="font-bold">Outro Skill - Rippling Waters</span>.<br><span style="color:#ffd12f;" class="font-bold">Ceaseless Landscape</span> grants all nearby Resonators in the team the following enhancements:<br>- Inflicting a target with <span style="color:#ffd12f;" class="font-bold">Spectro Frazzle</span>, <span style="color:#ffd12f;" class="font-bold">Fusion Burst</span>, <span style="color:#ffd12f;" class="font-bold">Glacio Chafe</span>, and <span style="color:#ffd12f;" class="font-bold">Aero Erosion</span> increases the max stack limit of <span style="color:#ffd12f;" class="font-bold">Negative Status</span> the target can receive by 3 for 15s. This effect does not stack.<br>- Inflicting a target with <span style="color:#ffd12f;" class="font-bold">Electro Flare</span> increases the max stack limits of <span style="color:#ffd12f;" class="font-bold">Electro Flare</span> and <span style="color:#ffd12f;" class="font-bold">Electro Rage</span> the target can receive by 3 for 15s. This effect does not stack.<br>- Inflicting a target with <span style="color:#ffd12f;" class="font-bold">Havoc Bane</span> allows the Resonator's Havoc DMG to ignore the target's DEF and Havoc RES by 6% and 12% respectively for 15s. This effect does not stack.`,
  attacks: [
    {
      key: "ConcertoRegen",
      label: "Concerto  Regen",
      talents: {
        "1": "20",
        "2": "20",
        "3": "20",
        "4": "20",
        "5": "20",
        "6": "20",
        "7": "20",
        "8": "20",
        "9": "20",
        "10": "20",
      },
      type: "Liberation",
    },
    {
      key: "HealingPerInteraction",
      label: "Healing per Interaction",
      talents: {
        "1": "550+2.71%",
        "2": "616+2.82%",
        "3": "687+2.93%",
        "4": "770+3.09%",
        "5": "869+3.31%",
        "6": "962+3.53%",
        "7": "979+3.93%",
        "8": "1001+4.39%",
        "9": "1017+4.88%",
        "10": "1045+5.70%",
      },
      type: "Healing",
      attribute: "hp",
    }
  ],
};
