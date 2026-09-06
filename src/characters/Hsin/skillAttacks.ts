export const skillAttacks = {
  name: "Resonance Skill: Heartward by Moon",
  description: `<div><span class="Title">Resonance Skill - Answering Form</span></span><br><br>While in <span style="color:#ffd12f;" class="font-bold">Answering Form</span>, if Hsin is on the ground, press <span style="color:#ffd12f;" class="font-bold">Resonance Skill</span> to deal <span style="color:#ebb0ff;">Electro DMG</span>.<br>After casting this skill, press <span style="color:#ffd12f;" class="font-bold">Normal Attack</span> within a short time to cast <span style="color:#ffd12f;" class="font-bold">Basic Attack - Answering Form Stage 4</span>.<br><br>If Hsin moves while on the ground within a short time after casting this skill, She turns into the <span style="color:#ffd12f;" class="font-bold">Moon Fox</span>. <br>- While turned into the <span style="color:#ffd12f;" class="font-bold">Moon Fox</span> and out of combat, Hsin gains <span style="color:#ffd12f;" class="font-bold">Dustless Tread</span>. With <span style="color:#ffd12f;" class="font-bold">Dustless Tread</span>, Hsin can enter the target's aggro range without triggering combat. <span style="color:#ffd12f;" class="font-bold">Dustless Tread</span> is removed when Hsin enters combat, is switched out, or ends the <span style="color:#ffd12f;" class="font-bold">Moon Fox</span> form by having environmental, gameplay, or feature interactions.<br>- While turned into the <span style="color:#ffd12f;" class="font-bold">Moon Fox</span> and out of combat, Hsin restores 2% of Max HP each second.<br>- Casting <span style="color:#ffd12f;" class="font-bold">Dodge</span> or taking damage ends the <span style="color:#ffd12f;" class="font-bold">Moon Fox</span> form and makes Hsin immune to DMG and interruption for a short time. Switching to another Resonator or {Cus:Ipt,Touch=tapping PC=pressing Gamepad=pessing} <span style="color:#ffd12f;" class="font-bold">Normal Attack</span> also ends the <span style="color:#ffd12f;" class="font-bold">Moon Fox</span> form and casts <span style="color:#ffd12f;" class="font-bold">Basic Attack - Answering Form Stage 4</span>.<br><br><span class="Title">Resonance Skill - Illumining Form</span></span><br><br>While in <span style="color:#ffd12f;" class="font-bold">Illumining Form</span> and Hsin is on the ground, press <span style="color:#ffd12f;" class="font-bold">Resonance Skill</span> to have Hsin command a Colossal Xuanfang Mechanism, dealing <span style="color:#ebb0ff;">Electro DMG</span>.</div>`,
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
        "1": "2.80%*4+100.80%",
        "2": "3.03%*4+109.07%",
        "3": "3.26%*4+117.34%",
        "4": "3.59%*4+128.91%",
        "5": "3.82%*4+137.17%",
        "6": "4.08%*4+146.68%",
        "7": "4.45%*4+159.90%",
        "8": "4.81%*4+173.13%",
        "9": "5.18%*4+186.35%",
        "10": "5.57%*4+200.41%",
      },
      type: "Skill",
    }
  ],
};
