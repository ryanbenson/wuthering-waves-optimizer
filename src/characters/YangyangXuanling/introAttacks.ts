export const introAttacks = {
  name: "Intro Skill: Skybound Feather",
  description: `<div>Deal <span style="color:#fcc4db;">Havoc DMG</span> and restore 1 points of <span style="color:#ffd12f;" class="font-bold">Azure Plume</span>.<br>When <span style="color:#ffd12f;" class="font-bold">Intro Skill - Skybound Feather</span> deals damage, it applies 1 stack of <span style="color:#ffd12f;" class="font-bold">Havoc Bane</span> on the target.</div>`,
  attacks: [
    {
      key: "SkyboundFeatherDMG",
      label: "Skybound Feather DMG",
      talents: {
        "1": "58.64%",
        "2": "63.45%",
        "3": "68.26%",
        "4": "74.99%",
        "5": "79.80%",
        "6": "85.33%",
        "7": "93.03%",
        "8": "100.72%",
        "9": "108.41%",
        "10": "116.59%",
      },
      type: "Intro",
    }
  ],
};
