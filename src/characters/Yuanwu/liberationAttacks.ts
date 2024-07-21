export const liberationAttacks = {
  name: "Resonance Liberation: Blazing Might",
  description: `<div class="skilldescription">Awaken the power of thunder and provide Forte Circuit <span class="Highlight">Lightning Infused</span> status to all characters on a nearby team for 10s, then perform a powerful blow that deals <span class="Thunder">Electro DMG</span>.<br> </div>`,
  attacks: [
    {
      key: "BlazingMightSkillDMG",
      label: "Skill DMG",
      talents: {
        "1": "88.00%*2",
        "2": "95.22%*2",
        "3": "102.44%*2",
        "4": "112.54%*2",
        "5": "119.76%*2",
        "6": "128.05%*2",
        "7": "139.60%*2",
        "8": "151.14%*2",
        "9": "162.69%*2",
        "10": "174.96%*2",
      },
      type: "Liberation",
      attribute: "defense",
    },
  ],
};
