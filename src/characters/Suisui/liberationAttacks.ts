export const liberationAttacks = {
  name: "Resonance Liberation: Song of Thoroughfare",
  description: `Casting the skill deploys <span style="color:#ffd12f;" class="font-bold">Ceaseless Landscape</span> that lasts for 25s. When <span style="color:#ffd12f;" class="font-bold">Ceaseless Landscape</span> is active, Suisui enters the <span style="color:#ffd12f;" class="font-bold">Roaming Transcendent</span> state when casting <span style="color:#ffd12f;" class="font-bold">Outro Skill - Rippling Waters</span>.<br><span style="color:#ffd12f;" class="font-bold">Ceaseless Landscape</span> grants all nearby Resonators in the team the following enhancements:<br>- Inflicting a target with <span style="color:#ffd12f;" class="font-bold">Spectro Frazzle</span>, <span style="color:#ffd12f;" class="font-bold">Fusion Burst</span>, <span style="color:#ffd12f;" class="font-bold">Glacio Chafe</span>, and <span style="color:#ffd12f;" class="font-bold">Aero Erosion</span>, or dealing the corresponding Negative Status DMG increases the max stack limit of <span style="color:#ffd12f;" class="font-bold">Negative Status</span> the target can receive by 3 for 15s. This effect does not stack.<br>- Inflicting a target with <span style="color:#ffd12f;" class="font-bold">Electro Flare</span> or dealing the corresponding Negative Status DMG increases the max stack limits of <span style="color:#ffd12f;" class="font-bold">Electro Flare</span> and <span style="color:#ffd12f;" class="font-bold">Electro Rage</span> the target can receive by 3 for 15s. This effect does not stack.<br>- Consuming <span style="color:#ffd12f;" class="font-bold">Havoc Bane</span> stacks on the target by landing a skill allows the Resonator's Havoc DMG to ignore the target's DEF by 6% and Havoc RES by 12% for 30s. This effect does not stack.`,
  attacks: [
    {
      key: "HealingPerPlumeStep",
      label: "Healing per Plume Step",
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
