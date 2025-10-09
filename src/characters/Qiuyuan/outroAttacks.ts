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
    {
      key: "SequenceNode3OBladeIWhoSaveNoMore2",
      label: "S3 Sheath Fallen, New Shoots Revealed DMG",
      talent: "500.00%",
      type: "Echo",
      requiresResonanceChain: "SequenceNode3OBladeIWhoSaveNoMore2",
    },
  ],
};
