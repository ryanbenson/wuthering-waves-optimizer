export const introAttacks = {
  name: "Intro Skill: Vindication",
  description: `<div class="skilldescription">
      <p>
        With unwavering determination, Danjin unleashes a strike, dealing
        <span class="Dark">Havoc DMG</span>.
      </p>
    </div>`,
  attacks: [
    {
      key: "SkillDMG",
      label: "Vindication DMG",
      talents: {
        "1": "25.00%*4",
        "2": "27.05%*4",
        "3": "29.10%*4",
        "4": "31.87%*4",
        "5": "34.97%*4",
        "6": "36.38%*4",
        "7": "39.66%*4",
        "8": "42.94%*4",
        "9": "46.22%*4",
        "10": "49.71%*4",
      },
      type: "Intro",
    },
  ],
};
