export const skillAttacks = {
  name: "Resonance Skill: Severing Note",
  description: `<div><span class="Title">Severing Note: Judgement</span></span><br><br>Deal <span style="color:#c7ffed";>Aero DMG</span>. During this skill, gain 45 points of <span style="color:#ffd12f;" class="font-bold">Qin Heart</span>.<br>While not in the <span style="color:#ffd12f;" class="font-bold">Ephemeral Transcendence</span> state, press or hold <span style="color:#ffd12f;" class="font-bold">Normal Attack</span> within a certain time after casting this skill to cast <span style="color:#ffd12f;" class="font-bold">Basic Attack - Stringblade Stage 4</span>.</span><br><br><span class="Title">Severing Note: Ascendant</span></span><br><br>While casting <span style="color:#ffd12f;" class="font-bold">Basic Attack - Stringblade Stage 2</span>, <span style="color:#ffd12f;" class="font-bold">Basic Attack - Stringblade Stage 3</span>, or  <span style="color:#ffd12f;" class="font-bold">Dodge Counter - Stringblade</span>, <span style="color:#ffd12f;" class="font-bold">Resonance Skill</span> is replaced by <span style="color:#ffd12f;" class="font-bold">Severing Note: Ascendant</span>.<br>Deal <span style="color:#c7ffed";>Aero DMG</span>.<br>This skill is in <span style="color:#ffd12f;" class="font-bold">Drawn Stance</span>.</div>`,
  icon: "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconQingxiao/SP_IconQingxiaoB1.webp",
  attacks: [
    {
      key: "SeveringNoteJudgementDMG",
      label: "Severing Note: Judgement DMG",
      talents: {
        "1": "10.50%*2+49.00%",
        "2": "11.37%*2+53.02%",
        "3": "12.23%*2+57.04%",
        "4": "13.43%*2+62.67%",
        "5": "14.29%*2+66.68%",
        "6": "15.28%*2+71.30%",
        "7": "16.66%*2+77.73%",
        "8": "18.04%*2+84.16%",
        "9": "19.42%*2+90.59%",
        "10": "20.88%*2+97.42%",
      },
      type: "Skill",
    },
    {
      key: "SeveringNoteAscendantDMG",
      label: "Severing Note: Ascendant DMG",
      talents: {
        "1": "14.28%+16.66%*2",
        "2": "15.46%+18.03%*2",
        "3": "16.63%+19.40%*2",
        "4": "18.27%+21.31%*2",
        "5": "19.44%+22.68%*2",
        "6": "20.78%+24.25%*2",
        "7": "22.66%+26.43%*2",
        "8": "24.53%+28.62%*2",
        "9": "26.40%+30.80%*2",
        "10": "28.40%+33.13%*2",
      },
      type: "Skill",
    }
  ],
};
