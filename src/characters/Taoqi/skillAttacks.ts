export const skillAttacks = {
  name: "Resonance Skill: Fortified Defense",
  description: `<div class="skilldescription">Taoqi deals <span class="Dark">Havoc DMG</span> to surrounding targets, generating 3 Rocksteady Shield and restoring HP to Taoqi.<br>If attacked when casting <span class="Highlight">Fortified Defense</span>, <span class="Highlight">Strategic Parry</span> will be automatically cast.<br> <br><span class="Title">Rocksteady Shield</span><br>When the active character is attacked, 1 <span class="Highlight">Rocksteady Shield</span> is consumed to reduce the damage taken.</div>`,
  attacks: [
    {
      key: "SkillDMG",
      label: "Fortified Defense DMG",
      talents: {
        "1": "67.86%",
        "2": "73.43%",
        "3": "78.99%",
        "4": "86.78%",
        "5": "92.35%",
        "6": "98.75%",
        "7": "107.65%",
        "8": "116.55%",
        "9": "125.46%",
        "10": "134.92%",
      },
      type: "Skill",
      attribute: "defense",
    },
  ],
};
