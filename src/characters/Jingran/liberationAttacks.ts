export const liberationAttacks = {
  name: "Resonance Liberation: Burial of Thousand Souls",
  description: `<div><span style="color:#ffd12f;" class="font-bold">Resonance Liberation - Burial of Thousand Souls</span> can be cast in mid-air close to the ground.<br>Attack the target, dealing <span style="color:#fbcaad;">Fusion DMG</span>, considered Heavy Attack DMG, and granting 100 points of <span style="color:#ffd12f;" class="font-bold">Fire of Life</span>.<br>Gain the following effects after casting this skill:<br>- If Jingran's current HP is above 50% of the Max HP, reduce his current HP to 50% of the Max HP.<br>- Gain 200 points of <span style="color:#ffd12f;" class="font-bold">Qi</span>.<br>- Gain 3 stacks of <span style="color:#ffd12f;" class="font-bold">Wayfarer's Mark</span>.<br>- Enter the <span style="color:#ffd12f;" class="font-bold">Yinghuo</span> state for 15s.</span><br><br><span class="Title">Wayfarer's Mark</span></span><br><br>Max 3 stacks.<br>Casting <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Soul Raid</span> or <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Stardome Meander</span> restores 200 points of <span style="color:#ffd12f;" class="font-bold">Qi</span> and reduces 1 stacks of <span style="color:#ffd12f;" class="font-bold">Wayfarer's Mark</span>. This effect lasts for 15s.</span><br><br><span class="Title">Yinghuo</span></span><br><br>- Casting <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Soul Raid</span> or <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Stardome Meander</span> summons <span style="color:#ffd12f;" class="font-bold">Chimei Wangliang</span> on hit to attack the targets, dealing <span style="color:#fbcaad;">Fusion DMG</span>, considered Heavy Attack DMG. This effect can be triggered once per <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Soul Raid</span> and <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Stardome Meander</span>.<br>- All <span style="color:#ffd12f;" class="font-bold">Fire of Life</span> will be removed as <span style="color:#ffd12f;" class="font-bold">Yinghuo</span> ends.<br></span><br></div>`,
  icon: "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconJingran/SP_IconJingranC1.webp",
  attacks: [
    {
      key: "BurialOfThousandSoulsDMG",
      label: "Burial of Thousand Souls DMG",
      talents: {
        "1": "46.86%*8",
        "2": "50.70%*8",
        "3": "54.54%*8",
        "4": "59.92%*8",
        "5": "63.76%*8",
        "6": "68.18%*8",
        "7": "74.33%*8",
        "8": "80.47%*8",
        "9": "86.62%*8",
        "10": "93.15%*8",
      },
      type: "Heavy",
    },
    {
      key: "ChimeiWangliangDMG",
      label: "Chimei Wangliang DMG",
      talents: {
        "1": "42.00%",
        "2": "45.45%",
        "3": "48.89%",
        "4": "53.71%",
        "5": "57.16%",
        "6": "61.12%",
        "7": "66.63%",
        "8": "72.14%",
        "9": "77.65%",
        "10": "83.51%",
      },
      type: "Heavy",
    }
  ],
};
