export const skillAttacks = {
  name: "Resonance Skill: Heartward by Moon",
  description: `<div><span class="Title">Resonance Skill - Answering Form</span></span><br><br>While in <span style="color:#ffd12f;" class="font-bold">Answering Form</span>, press <span style="color:#ffd12f;" class="font-bold">Resonance Skill</span> to deal <span style="color:#ebb0ff;">Electro DMG</span>.<br>After casting this skill, press <span style="color:#ffd12f;" class="font-bold">Normal Attack</span> within a short time to cast <span style="color:#ffd12f;" class="font-bold">Basic Attack - Answering Form Stage 4</span>.<br>Can be cast in mid-air.<br><br>If Hsin moves while on the ground within a short time after casting this skill, She turns into the <span style="color:#ffd12f;" class="font-bold">Moon Fox</span>. <br>- While turned into the <span style="color:#ffd12f;" class="font-bold">Moon Fox</span> and out of combat, Hsin gains <span style="color:#ffd12f;" class="font-bold">Dustless Tread</span>. With <span style="color:#ffd12f;" class="font-bold">Dustless Tread</span>, Hsin can enter the target's aggro range without triggering combat. <span style="color:#ffd12f;" class="font-bold">Dustless Tread</span> is removed when Hsin enters combat, is switched out, or ends the <span style="color:#ffd12f;" class="font-bold">Moon Fox</span> form by having environmental, gameplay, or feature interactions.<br>- While turned into the <span style="color:#ffd12f;" class="font-bold">Moon Fox</span> and out of combat, Hsin restores 6% of Max HP every 3s.<br>- Taking damage, failing to peform a <span style="color:#ffd12f;" class="font-bold">Dodge</span> with directional input while on the ground, or <span style="color:#ffd12f;" class="font-bold">Dodging</span> in mid-air will end the <span style="color:#ffd12f;" class="font-bold">Moon Fox</span> form. Switching to another Resonator or {Cus:Ipt,Touch=tapping PC=pressing Gamepad=pessing} <span style="color:#ffd12f;" class="font-bold">Resonance Skill</span> also ends the <span style="color:#ffd12f;" class="font-bold">Moon Fox</span> form. Press <span style="color:#ffd12f;" class="font-bold">Normal Attack</span> to cast <span style="color:#ffd12f;" class="font-bold">Basic Attack - Answering Form Stage 4</span>, which also ends the <span style="color:#ffd12f;" class="font-bold">Moon Fox</span> form.<br>- The Dash state continuously consumes STA when Hsin is in the <span style="color:#ffd12f;" class="font-bold">Moon Fox</span> form.<br>- <span style="color:#ffd12f;" class="font-bold">Resonance Liberation</span> is disabled when Hsin is in the <span style="color:#ffd12f;" class="font-bold">Moon Fox</span> form.<br><br><span class="Title">Resonance Skill - Illumining Form</span></span><br><br>While in <span style="color:#ffd12f;" class="font-bold">Illumining Form</span> and Hsin is on the ground, press <span style="color:#ffd12f;" class="font-bold">Resonance Skill</span> to have Hsin command a Colossal Xuanfang Mechanism, dealing <span style="color:#ebb0ff;">Electro DMG</span>.</div>`,
  icon: "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconXin/SP_IconXinB1.webp",
  attacks: [
    {
      key: "ResonanceSkillAnsweringFormDMG",
      label: "Resonance Skill - Answering Form DMG",
      talents: {
        "1": "12.60%+12.60%+12.60%+8.40%*2+29.40%",
        "2": "13.64%+13.64%+13.64%+9.09%*2+31.82%",
        "3": "14.67%+14.67%+14.67%+9.78%*2+34.23%",
        "4": "16.12%+16.12%+16.12%+10.75%*2+37.60%",
        "5": "17.15%+17.15%+17.15%+11.44%*2+40.01%",
        "6": "18.34%+18.34%+18.34%+12.23%*2+42.78%",
        "7": "19.99%+19.99%+19.99%+13.33%*2+46.64%",
        "8": "21.65%+21.65%+21.65%+14.43%*2+50.50%",
        "9": "23.30%+23.30%+23.30%+15.53%*2+54.36%",
        "10": "25.06%+25.06%+25.06%+16.71%*2+58.46%",
      },
      type: "Skill",
    },
    {
      key: "ResonanceSkillIlluminingFormDMG",
      label: "Resonance Skill - Illumining Form DMG",
      talents: {
        "1": "5.60%*4+89.60%",
        "2": "6.06%*4+96.95%",
        "3": "6.52%*4+104.30%",
        "4": "7.17%*4+114.59%",
        "5": "7.63%*4+121.93%",
        "6": "8.15%*4+130.38%",
        "7": "8.89%*4+142.14%",
        "8": "9.62%*4+153.89%",
        "9": "10.36%*4+165.65%",
        "10": "11.14%*4+178.14%",
      },
      type: "Skill",
    }
  ],
};
