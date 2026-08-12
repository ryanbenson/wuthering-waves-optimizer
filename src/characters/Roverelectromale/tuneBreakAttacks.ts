export const tuneBreakAttacks = {
  name: "Tune Break: Tune Break - Sword",
  description: `<div>When the target's Off-Tune Level is full, the Resonator may cast Tune Break on the target.</div>`,
  icon: "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconNor/SP_IconWeakPointBreakKnife.webp",
  attacks: [
    {
      key: "TuneBreakDMG",
      label: "Tune Break DMG",
      talent: "100.00%*4 + 1200.00%",
      type: "TuneBreak",
    }
  ],
};
