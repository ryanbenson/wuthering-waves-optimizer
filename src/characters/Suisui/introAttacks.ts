export const introAttacks = {
  name: "Intro Skill: Tinkling Jade",
  description: `Attack the target, dealing <span style="color:#a2fbfc;">Glacio DMG</span>, and inflict 1 stack of <span style="color:#ffd12f;" class="font-bold">Glacio Chafe</span>.<br>While casting this skill, consume all color=Highlight>Stillness</span>, pull in nearby targets, and enter color=Highlight>Cleansing Rain</span>, granting all nearby Resonators in the team <span style="color:#ffd12f;" class="font-bold">Enrichment</span>.`,
  attacks: [
    {
      key: "DMG",
      label: "DMG",
      talents: {
        "1": "14.40%",
        "2": "15.59%",
        "3": "16.77%",
        "4": "18.42%",
        "5": "19.60%",
        "6": "20.96%",
        "7": "22.85%",
        "8": "24.74%",
        "9": "26.63%",
        "10": "28.63%",
      },
      type: "Intro",
      attribute: "hp",
    }
  ],
};
