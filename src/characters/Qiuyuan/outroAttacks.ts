export const outroAttacks = {
  name: "Outro Skill: Strike Before Ready",
  description: `<div>Attack the target, dealing <span class="ingame-Wind">Aero DMG</span> equal to 100% of Qiuyuan's ATK, considered as Echo Skill DMG.<br>Grant 50% Echo Skill DMG Amplification to the incoming Resonator, lasting for 14s or until the Resonator is switched out.</div>`,
  attacks: [
    {
      key: "StrikeBeforeReadyDMG",
      label: "Strike Before Ready DMG",
      talent: "100.00%",
      type: "Echo",
    },
  ],
};
