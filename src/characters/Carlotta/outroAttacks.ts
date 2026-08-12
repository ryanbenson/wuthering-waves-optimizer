export const outroAttacks = {
  name: "Outro Skill: Closing Remark",
  description: `<div class="skilldescription">Attack the target, dealing <span class="Ice">Glacio DMG</span> equal to 794.2% of Carlotta's ATK</div>`,
  icon: "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconKelaita/SP_IconKelaitaT.webp",
  attacks: [
    {
      key: "ClosingRemarkDMG",
      label: "Closing Remark DMG",
      talent: "794.2%",
      type: "Outro",
    },
    {
      key: "S3StepForwardEleganceinProgressionDMG",
      label: "S3 Step Forward, Elegance in Progression DMG",
      talent: "1032.18%",
      type: "Outro",
      requiresResonanceChain: "SequenceNode3StepForwardEleganceinProgression",
    },
  ],
};
