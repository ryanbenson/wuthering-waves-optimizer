export const outroAttacks = {
  name: "Outro Skill: Attentive Heart",
  description: `<div class="skilldescription">Deal <span class="Light">Spectro DMG</span> equal to 528.41% of Phoebe's ATK to nearby targets.<br>- <span class="Highlight">Absolution</span> Enhancement: Increase DMG Multiplier by 255%.<br>- <span class="Highlight">Confession</span> Enhancement: Grant <span class="Highlight">Silent Prayer</span> to the Resonator on the field, reducing the Spectro RES of nearby targets by 10% and granting 100% <span class="Highlight">Spectro Frazzle</span> DMG Amplification. When <span class="Highlight">Spectro Frazzle</span> inflicts DMG, extend <span class="Highlight">Spectro Frazzle's</span> damage interval by 50%. This effect lasts 30s or until Phoebe switches to <span class="Highlight">Absolution</span> status.</div>`,
  attacks: [
    {
      key: "AttentiveHeartDMG",
      label: "Attentive Heart DMG",
      talent: "528.41%",
      type: "Outro",
    },
  ],
};
