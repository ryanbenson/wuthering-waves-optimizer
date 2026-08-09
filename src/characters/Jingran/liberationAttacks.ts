export const liberationAttacks = {
  name: "Resonance Liberation: Burial of Thousand Souls",
  description: `<div><span style="color:#ffd12f;" class="font-bold">Resonance Liberation - Burial of Thousand Souls</span> can be cast in mid-air close to the ground.<br>Attack the target, dealing <span style="color:#fbcaad;">Fusion DMG</span>, considered Heavy Attack DMG, and granting 100 points of <span style="color:#ffd12f;" class="font-bold"><a href=命火></a></span>:<br>Gain the following effects after casting this skill:<br>- If Jingran's current HP is above 50% of the Max HP, reduce HP to 50% of the Max HP.<br>- Gain 200 points of <span style="color:#ffd12f;" class="font-bold">Qi</span>.<br>- Gain 3 stacks of <span style="color:#ffd12f;" class="font-bold">Wayfarer's Mark</span>.<br>- Enter the <span style="color:#ffd12f;" class="font-bold">Yinghuo</span> state for 15s.<br><size=10></span><br><br><span class="Title">Wayfarer's Mark</span></span><br><br>Max 3 stacks.<br>Casting <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Soul Raid</span> or <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Stardome Meander</span> restores 200 points of <span style="color:#ffd12f;" class="font-bold">Qi</span> and reduces 1 stacks of <span style="color:#ffd12f;" class="font-bold">Wayfarer's Mark</span>. This effect lasts for 15s.<br><size=10></span><br><br><span class="Title">Yinghuo</span></span><br><br>- Casting <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Soul Raid</span> and <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Stardome Meander</span> summons <span style="color:#ffd12f;" class="font-bold">Chimei Wangliang</span> on hit to attack the targets, dealing <span style="color:#fbcaad;">Fusion DMG</span>, considered Heavy Attack DMG. This effect can be triggered once per <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Soul Raid</span> and <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Stardome Meander</span><br>- All <span style="color:#ffd12f;" class="font-bold"><span style="color:#ffd12f;" class="font-bold"><a href=命火></a></span></span> will be removed as <span style="color:#ffd12f;" class="font-bold">Yinghuo</span> ends.</div>`,
  attacks: [
    {
      key: "BurialOfThousandSoulsDMG",
      label: "Burial of Thousand Souls DMG",
      talents: {
        "1": "31.24%*8",
        "2": "33.80%*8",
        "3": "36.36%*8",
        "4": "39.95%*8",
        "5": "42.51%*8",
        "6": "45.46%*8",
        "7": "49.55%*8",
        "8": "53.65%*8",
        "9": "57.75%*8",
        "10": "62.10%*8",
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
