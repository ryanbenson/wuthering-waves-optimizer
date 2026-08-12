export const outroAttacks = {
  name: "Outro Skill: Discipline",
  description: `<div class="skilldescription">When the incoming Resonator's Heavy Attack hits a target, Jiyan will summon a lance to launch a coordinated attack, dealing <span class="Wind">Aero DMG</span> equal to 313.40% of Jiyan's ATK. This attack lasts for 8s and can be triggered once every 1s, up to 2 times.</div>`,
  icon: "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconJiyan/SP_IconJiyanT.webp",
  attacks: [
    {
      key: "OutroSkillDMG",
      label: "Coordinated Outro Skill DMG",
      talent: "313.40%",
      type: "Outro",
      subType: "Coordinated",
    },
  ],
};
