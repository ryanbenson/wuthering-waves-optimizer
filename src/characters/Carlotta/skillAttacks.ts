export const skillAttacks = {
  name: "Resonance Skill: Aesthetics of Violence",
  description: `<div class="skilldescription">Deals Glacio damage and applies the Chroma effect to hit targets. After casting, pressing the Resonance Skill within a short time will trigger Brilliant Will.<br><br>

<span class="Title">Chroma</span><br>
During the effect's duration, no actions can be performed. The effect lasts for 1.5 seconds.<br><br>

<span class="Title">Brilliant Will</span><br>
Carlotta consumes all of her current <span class="Highlight">【Amorphous Prism】</span> to deal <span class="Ice">Glacio</span> damage to the target.
If the Resonance Skill Brilliant Will is not cast within a certain time or if the character is switched, the skill enters cooldown.</div>`,
  attacks: [
    {
      key: "ChromaSkillDMG",
      label: "Chroma Skill DMG",
      talents: {
        "1": "46.41% + 46.41%",
        "2": "50.21% + 50.21%",
        "3": "54.02% + 54.02%",
        "4": "59.35% + 59.35%",
        "5": "63.15% + 63.15%",
        "6": "67.53% + 67.53%",
        "7": "73.61% + 73.61%",
        "8": "79.70% + 79.70%",
        "9": "85.79% + 85.79%",
        "10": "92.26% + 92.26%",
      },
      type: "Skill",
    },
    {
      key: "BrilliantWillDMG",
      label: "Brilliant Will DMG",
      talents: {
        "1": "36.30% + 36.30% + 108.90%",
        "2": "39.28% + 39.28% + 117.83%",
        "3": "42.26% + 42.26% + 126.76%",
        "4": "46.43% + 46.43% + 139.27%",
        "5": "49.40% + 49.40% + 148.20%",
        "6": "52.83% + 52.83% + 158.47%",
        "7": "57.59% + 57.59% + 172.75%",
        "8": "62.35% + 62.35% + 187.04%",
        "9": "67.11% + 67.11% + 201.33%",
        "10": "72.17% + 72.17% + 216.51%",
      },
      type: "Skill",
    },
  ],
};
