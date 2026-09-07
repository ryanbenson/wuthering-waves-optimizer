export const outroAttacks = {
  name: "Outro Skill: Herself a Thousand Lanterns",
  description: `<div>Attack the target, dealing <span style="color:#ebb0ff;">Electro DMG</span> equal to 100% of Hsin's ATK.<br>Hsin gains <span style="color:#ffd12f;" class="font-bold">Nightglow</span> after casting <span style="color:#ffd12f;" class="font-bold">Resonance Liberation - Pillars Across Heaven</span>. When Hsin casts <span style="color:#ffd12f;" class="font-bold">Outro Skill</span>, <span style="color:#ffd12f;" class="font-bold">Nightglow</span> is consumed to trigger various effects depending on the <span style="color:#ffd12f;" class="font-bold">Resonance Mode</span> She is in:<br>- While in <span style="color:#ffd12f;" class="font-bold">Resonance Mode - Unison</span>, Resonators in the team other than Hsin gain <span style="color:#ffd12f;" class="font-bold">Shared Light</span> when they gain <span style="color:#ffd12f;" class="font-bold">Unison</span>. After Hsin casts <span style="color:#ffd12f;" class="font-bold">Outro Skill</span>, Resonators with <span style="color:#ffd12f;" class="font-bold">Shared Light</span> gain 20% All DMG Amplification for 30s.<br>- While in <span style="color:#ffd12f;" class="font-bold">Resonance Mode - Electro Flare</span>, Electro DMG dealt by Resonators in the team other than Hsin is Amplified by 20% for 20s.<br>The above effects end early when Hsin switches Resonance Mode.</div>`,
  icon: "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconXin/SP_IconXinT.webp",
  attacks: [
    {
      key: "HerselfAThousandLanternsDMG",
      label: "Herself a Thousand Lanterns DMG",
      talent: "100%",
      type: "Outro",
    }
  ],
};
