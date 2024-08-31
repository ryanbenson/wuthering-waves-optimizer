export const skillAttacks = {
  name: "Resonance Skill: Shift Trick",
  description: `<div class="skilldescription"><span class="Title">Mist Avatar</span><br>Casts "Mist" and 1 "Mist Avatar(s)" to taunt the surrounding targets. The avatars inherit a portion of Aalto's HP and generate 6 Mist Bullets around them, dealing <span class="Wind">Aero DMG</span>.<br> <br><span class="Title">Mist Bullets</span><br>Deals <span class="Wind">Aero DMG</span>, considered as Resonance Skill DMG.</div>`,
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
