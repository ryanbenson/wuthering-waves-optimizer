export const outroAttacks = {
  name: "Outro Skill: As the Wind Wills",
  description: `Attacks the target, dealing <span style="color:#fcc4db;">Havoc DMG</span>.<br>When a Resonator in the team other than Yangyang: Xuanling applies <span style="color:#ffd12f;" class="font-bold">Havoc Bane</span> to a target, that Resonator's Havoc DMG is Amplified by 20% for 20s.`,
  attacks: [
    {
      key: "AsTheWindWillsDMG",
      label: "As the Wind Wills DMG",
      talent: "20%*20",
      type: "Outro",
    }
  ],
};
