export const outroAttacks = {
  name: "Outro Skill: As the Wind Wills",
  description: `Attacks the target, dealing <span style="color:#fcc4db;">Havoc DMG</span> equal to 300% of Yangyang: Xuanling's ATK.<br>When a Resonator in the team other than Yangyang: Xuanling inflicts <span style="color:#ffd12f;" class="font-bold">Havoc Bane</span> within 20s of this skill, that Resonator's Havoc DMG is Amplified by 20% for 20s.`,
  attacks: [
    {
      key: "AsTheWindWillsDMG",
      label: "As the Wind Wills DMG",
      talent: "20%*20",
      type: "Outro",
    }
  ],
};
