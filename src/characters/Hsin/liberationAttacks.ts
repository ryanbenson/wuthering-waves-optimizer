export const liberationAttacks = {
  name: "Resonance Liberation: Nexus Alight",
  description: `<div><span class="Title">Formshift</span></span><br><br>Casting <span style="color:#ffd12f;" class="font-bold">Answering Form: Realm Wanderer</span> unlocks <span style="color:#ffd12f;" class="font-bold">Formshift</span>.<br>Cast <span style="color:#ffd12f;" class="font-bold">Formshift</span> to unfurl the Manifold Sanctum. Hsin turns into <span style="color:#ffd12f;" class="font-bold">Illumining Form</span>, unlocking a new set of combat abilities, and enters the <span style="color:#ffd12f;" class="font-bold">Heart Manifest</span> state.<br>Can be cast in mid-air close to the ground.<br>While in <span style="color:#ffd12f;" class="font-bold">Illumining Form</span>, engaging in <span style="color:#ffd12f;" class="font-bold">quest dialogue</span>, performing a <span style="color:#ffd12f;" class="font-bold">environmental interaction with an animation</span>, or using a <span style="color:#ffd12f;" class="font-bold">Utility</span> switches Hsin back to <span style="color:#ffd12f;" class="font-bold">Answering Form</span> to perform the corresponding action.<br>While in <span style="color:#ffd12f;" class="font-bold">Illumining Form</span>, Hsin can walk on the surface of water, and will continuously consume STA in the deep water areas. In Walking Mode, Hsin in <span style="color:#ffd12f;" class="font-bold">Illumining Form</span> can step off a cliff into the air and walk slowly in mid-air, continuously consuming STA in this state. Hsin cannot restore STA while in <span style="color:#ffd12f;" class="font-bold">Illumining Form</span> and air-borne.<br><br><span class="Title">Pillars Across Heaven</span></span><br><br>Casting <span style="color:#ffd12f;" class="font-bold">Illumining Form: Beholding All Horizons</span> unlocks <span style="color:#ffd12f;" class="font-bold">Pillars Across Heaven</span>.<br>Cast <span style="color:#ffd12f;" class="font-bold">Pillars Across Heaven</span> to bring the Manifold Sanctum crashing down, dealing <span style="color:#ebb0ff;">Electro DMG</span> to the target, considered <span style="color:#ffd12f;" class="font-bold">Resonance Skill DMG</span>.<br>Can be cast in mid-air close to the ground.<br>Hsin returns to <span style="color:#ffd12f;" class="font-bold">Answering Form</span> and exits the <span style="color:#ffd12f;" class="font-bold">Heart Manifest</span> state.<br><br><span class="Title">Edict</span></span><br><br>Casting <span style="color:#ffd12f;" class="font-bold">Formshift</span> grants Hsin 21 stacks of <span style="color:#ffd12f;" class="font-bold">Edict</span> for 45s. The effect cannot exceed 21 stacks and all stacks are removed when the duration ends.<br>After the active Resonator in the team deals DMG, Hsin automatically consumes <span style="color:#ffd12f;" class="font-bold">Edict</span> in the following 3s trigger the following effect up to once per second. Retriggering the effect resets the durtion:<br>- When <span style="color:#ffd12f;" class="font-bold">Edict</span> is consumed, summon a <span style="color:#ffd12f;" class="font-bold">Soaring Pillar</span> from the Manifold Sanctum as a Coordinated Attack to strike the target once, dealing <span style="color:#ebb0ff;">Electro DMG</span>. <br>- <span style="color:#ffd12f;" class="font-bold">Edict</span> can be automatically consumed up to 1 stack per second.<br>- Damage dealt by <span style="color:#ffd12f;" class="font-bold">Soaring Pillar</span> does not trigger this effect.<br>- When Hsin is knocked out, all <span style="color:#ffd12f;" class="font-bold">Edict</span> stacks are cleared.<br><br><span class="Title">Heart Manifest</span></span><br><br>Increases Hsin's resistance to interruption for 45s.<br>Entering the <span style="color:#ffd12f;" class="font-bold">Heart Manifest</span> state resets Hsin's <span style="color:#ffd12f;" class="font-bold">Illumining Heart</span>.<br>While in the <span style="color:#ffd12f;" class="font-bold">Heart Manifest</span> state and in <span style="color:#ffd12f;" class="font-bold">Illumining Form</span>, if <span style="color:#ffd12f;" class="font-bold">Pillars Across Heaven</span> has not been unlocked, press <span style="color:#ffd12f;" class="font-bold">Resonance Liberation</span> to have Hsin cast <span style="color:#ffd12f;" class="font-bold">Invoked Form: Answering</span>. While in <span style="color:#ffd12f;" class="font-bold">Answering Form</span>, press <span style="color:#ffd12f;" class="font-bold">Resonance Liberation</span> to have Hsin cast <span style="color:#ffd12f;" class="font-bold">Invoked Form: Illumining</span>.<br><br><span class="Title">Invoked Form: Answering</span></span><br><br>Hsin temporarily reverts to <span style="color:#ffd12f;" class="font-bold">Answering Form</span>, pausing the duration timer of the <span style="color:#ffd12f;" class="font-bold">Heart Manifest</span> state.<br>When this skill is cast, if Hsin is on the ground, She casts <span style="color:#ffd12f;" class="font-bold">Basic Attack - Answering Form Stage 3</span>; if She is in mid-air, She casts <span style="color:#ffd12f;" class="font-bold">Mid-air Attack - Answering Form</span>.<br><br><span class="Title">Invoked Form: Illumining</span></span><br><br>Hsin turns back into <span style="color:#ffd12f;" class="font-bold">Illumining Form</span>, resuming the duration timer of the <span style="color:#ffd12f;" class="font-bold">Heart Manifest</span> state.<br>When this skill is cast, if Hsin is on the ground, She casts <span style="color:#ffd12f;" class="font-bold">Upward Cut - Illumining Form</span>; if She is in mid-air, She casts <span style="color:#ffd12f;" class="font-bold">Mid-air Attack - Illumining Form</span>.</div>`,
  icon: "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconXin/SP_IconXinC1.webp",
  attacks: [
    {
      key: "PillarsAcrossHeavenDMG",
      label: "Pillars Across Heaven DMG",
      talents: {
        "1": "40.50%+45.56%+30.38%+50.62%+35.44%+809.88%",
        "2": "43.82%+49.30%+32.87%+54.77%+38.34%+876.29%",
        "3": "47.14%+53.03%+35.36%+58.92%+41.25%+942.70%",
        "4": "51.79%+58.26%+38.84%+64.73%+45.32%+1035.67%",
        "5": "55.11%+62.00%+41.33%+68.88%+48.22%+1102.08%",
        "6": "58.93%+66.29%+44.20%+73.66%+51.56%+1178.45%",
        "7": "64.24%+72.27%+48.18%+80.30%+56.21%+1284.71%",
        "8": "69.55%+78.25%+52.17%+86.94%+60.86%+1390.97%",
        "9": "74.87%+84.22%+56.15%+93.58%+65.51%+1497.22%",
        "10": "80.51%+90.57%+60.38%+100.64%+70.45%+1610.12%",
      },
      type: "Skill",
    },
    {
      key: "SoaringPillarDMG",
      label: "Soaring Pillar DMG",
      talents: {
        "1": "5.72%",
        "2": "6.19%",
        "3": "6.66%",
        "4": "7.31%",
        "5": "7.78%",
        "6": "8.32%",
        "7": "9.07%",
        "8": "9.82%",
        "9": "10.57%",
        "10": "11.37%",
      },
      type: "Liberation",
    }
  ],
};
