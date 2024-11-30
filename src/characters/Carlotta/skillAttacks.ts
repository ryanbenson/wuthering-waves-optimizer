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
      key: "MistBulletDamage",
      label: "Mist Bullet DMG",
      talents: {
        "1": "30.00%",
        "2": "32.46%",
        "3": "34.92%",
        "4": "38.37%",
        "5": "40.83%",
        "6": "43.66%",
        "7": "47.59%",
        "8": "51.53%",
        "9": "55.47%",
        "10": "59.65%",
      },
      type: "Skill",
    },
  ],
};
