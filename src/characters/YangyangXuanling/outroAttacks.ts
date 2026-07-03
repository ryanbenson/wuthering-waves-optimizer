export const outroAttacks = {
  name: "Outro Skill: As the Wind Wills",
  description: `Attacks the target, dealing <span style="color:#fcc4db;">Havoc DMG</span> equal to 300% of Yangyang: Xuanling's ATK.<br>All Resonators in the team other than Yangyang: Xuanling gains <span style="color:#ffd12f;" class="font-bold">Tonal Switch</span> for 20s. When a Resonator with <span style="color:#ffd12f;" class="font-bold">Tonal Switch</span> inflicts <span style="color:#ffd12f;" class="font-bold">Havoc Bane</span>, that Resonator's Havoc DMG is Amplified by 20%.<br>This effect is reset upon casting this skill again.`,
  attacks: [
    {
      key: "AsTheWindWillsDMG",
      label: "As the Wind Wills DMG",
      talent: "300%",
      type: "Outro",
    }
  ],
};
