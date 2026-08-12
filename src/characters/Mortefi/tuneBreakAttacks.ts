export const tuneBreakAttacks = {
  name: "Tune Break",
  description: `<div>When the target's <span class="Highlight">Off-Tune Level</span> is full, the Resonator may cast <span class="Highlight">Tune Break</span> on the target.</div>`,
  icon: "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconNor/SP_IconWeakPointBreakGun.webp",
  attacks: [
    {
      key: "TuneBreakDMG",
      label: "Tune Break DMG",
      type: "TuneBreak",
      talent: "1600.00%",
    },
  ],
};
