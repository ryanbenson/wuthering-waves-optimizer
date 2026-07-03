export const skillAttacks = {
  name: "Resonance Skill: Feather's Edge",
  description: `<div><span class="Title">Sword Stance Switch</span></span><br><br>While in <span style="color:#ffd12f;" class="font-bold">Azure Sword Stance</span>, press <span style="color:#ffd12f;" class="font-bold">Resonance Skill</span> to switch to <span style="color:#ffd12f;" class="font-bold">Feather Sword Stance</span> and perform <span style="color:#ffd12f;" class="font-bold">Basic Attack - Feather Sword Stance Stage 1</span>, dealing <span style="color:#fcc4db;">Havoc DMG</span>.<br><size=10></span><br><br>While in <span style="color:#ffd12f;" class="font-bold">Feather Sword Stance</span>, press <span style="color:#ffd12f;" class="font-bold">Resonance Skill</span> to switch to <span style="color:#ffd12f;" class="font-bold">Azure Sword Stance</span> and perform <span style="color:#ffd12f;" class="font-bold">Basic Attack - Azure Sword Stance Stage 1</span>, dealing <span style="color:#fcc4db;">Havoc DMG</span>.<br><size=10></span><br><br><span class="Title">Sword Stance Switch: Azure</span></span><br><br>{Cus:Ipt,Touch=Tapping PC=Pressing Gamepad=Pressing} <span style="color:#ffd12f;" class="font-bold">Resonance Skill</span> within a short time after casting <span style="color:#ffd12f;" class="font-bold">Basic Attack - Feather Sword Stance</span> to switch to <span style="color:#ffd12f;" class="font-bold">Azure Sword Stance</span> and cast <span style="color:#ffd12f;" class="font-bold">Sword Stance Switch: Azure</span>, dealing <span style="color:#fcc4db;">Havoc DMG</span>, considered <span style="color:#ffd12f;" class="font-bold">Heavy Attack DMG</span>.<br>A successful Dodge can be triggered within a short time into the action of this skill, which consumes 50 <span style="color:#ffd12f;" class="font-bold">Melody</span>.<br>After casting this skill, the Basic Attack cycle will not reset for a short time.<br><size=10></span><br><br><span class="Title">Sword Stance Switch: Feather</span></span><br><br>{Cus:Ipt,Touch=Tapping PC=Pressing Gamepad=Pressing} <span style="color:#ffd12f;" class="font-bold">Resonance Skill</span> within a short time after casting <span style="color:#ffd12f;" class="font-bold">Basic Attack - Azure Sword Stance</span> to swtich to <span style="color:#ffd12f;" class="font-bold">Feather Sword Stance</span> and cast <span style="color:#ffd12f;" class="font-bold">Sword Stance Switch: Feather</span>, dealing <span style="color:#fcc4db;">Havoc DMG</span>, considered <span style="color:#ffd12f;" class="font-bold">Heavy Attack DMG</span>.<br>A successful Dodge can be triggered within a short time into the action of this skill, which consumes 50 <span style="color:#ffd12f;" class="font-bold">Melody</span>.<br>After casting this skill, the Basic Attack cycle will not reset for a short time.</div>`,
  attacks: [
    {
      key: "SwordStanceSwitchFeatherDMG",
      label: "Sword Stance Switch: Feather DMG",
      talents: {
        "1": "16.88%*3",
        "2": "18.27%*3",
        "3": "19.65%*3",
        "4": "21.59%*3",
        "5": "22.98%*3",
        "6": "24.57%*3",
        "7": "26.78%*3",
        "8": "29.00%*3",
        "9": "31.21%*3",
        "10": "33.56%*3",
      },
      type: "Heavy",
    },
    {
      key: "SwordStanceSwitchAzureDMG",
      label: "Sword Stance Switch: Azure DMG",
      talents: {
        "1": "35.19%+7.82%*3",
        "2": "38.07%+8.46%*3",
        "3": "40.96%+9.11%*3",
        "4": "45.00%+10.00%*3",
        "5": "47.88%+10.64%*3",
        "6": "51.20%+11.38%*3",
        "7": "55.82%+12.41%*3",
        "8": "60.43%+13.43%*3",
        "9": "65.05%+14.46%*3",
        "10": "69.95%+15.55%*3",
      },
      type: "Heavy",
    }
  ],
};
