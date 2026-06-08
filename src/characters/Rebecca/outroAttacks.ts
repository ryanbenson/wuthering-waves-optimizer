export const outroAttacks = {
  name: "Outro Skill: Preem Choom",
  description: `<div>Summon a turret that continuously attacks enemies for 14s, dealing 2.5% <span style="color:#b45bff"><strong>Electro DMG</strong></span> each hit.<br>The incoming Resonator gains <span style="color:#f7ca2f"><strong>Edgerunner Bonds</strong></span>, granting 15% All DMG Amplification for 14s. Resonators with <span style="color:#f7ca2f"><strong>Edgerunner Bonds</strong></span> gain 1 stack of <span style="color:#f7ca2f"><strong>Overlimit</strong></span> every 0.2s, each stack granting 0.5% Heavy Attack DMG Amplification, up to 35% (Lucy automatically receives max stacks when her <span style="color:#f7ca2f"><strong>Edgerunner Bonds</strong></span> is active). Switching to another Resonator ends <span style="color:#f7ca2f"><strong>Edgerunner Bonds</strong></span> and <span style="color:#f7ca2f"><strong>Overlimit</strong></span> early.<br>Lucy can enhance the turret, increasing its DMG Multiplier by 250%, but its on-field duration will be lowered to 4s.</div>`,
  attacks: [
    {
      key: "PreemChoomDMG",
      label: "Preem Choom DMG",
      talent: "2.5%",
      type: "Outro",
    },
  ],
};
