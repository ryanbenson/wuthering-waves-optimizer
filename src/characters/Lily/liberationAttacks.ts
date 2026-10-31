export const liberationAttacks = {
  name: "Resonance Liberation: Into the Dream Cradle",
  description: `<div>Casting this skill sends Lily into <span style="color:#ffd12f;" class="font-bold">Slumberland</span> and grants <span style="color:#ffd12f;" class="font-bold">Cradle Lullaby</span> to Resonators in the team.<br>Casting this skill also grants Lily a Shield equal to 100% of her Max HP for 4s. This Shield does not carry over to the incoming Resonator.<br>Can be cast in mid-air close to the ground.<br></span><br><br><span class="Title">Slumber</span></span><br><br>Lasts for 50s. When Lily is in <span style="color:#ffd12f;" class="font-bold">Slumberland</span>, she heals the nearby active Resonator every 3s. During <span style="color:#ffd12f;" class="font-bold">Slumberland</span>, use directional input to command <span style="color:#ffd12f;" class="font-bold">Dreambind</span> to deal <span style="color:#f8e56cff;">Spectro DMG</span> to nearby targets. <span style="color:#ffd12f;" class="font-bold">Dreambind</span> pulls in targets within a certain range every 5s, and stops attacking 10s after movement stops. Press Resonance Liberation again during <span style="color:#ffd12f;" class="font-bold">Slumberland</span> to end it early.<br>When Lily is in <span style="color:#ffd12f;" class="font-bold">Slumberland</span>, when a Resonator in the team casts <span style="color:#ffd12f;" class="font-bold">Intro Skill</span>, targets within a certain range are pulled in, triggered once every 10s. Lily is immune to interruption during <span style="color:#ffd12f;" class="font-bold">Slumberland</span> and takes 50% less DMG.<br>Switching to another Resonator during <span style="color:#ffd12f;" class="font-bold">Slumberland</span> keeps Lily on the field. Lily leaves the field when <span style="color:#ffd12f;" class="font-bold">Slumberland</span> ends, or earlier if she gets too far from the active Resonator.<br></span><br><br><span class="Title">Cradle Lullaby</span></span><br><br>Lasts for 25s. While this effect is active, each <span style="color:#ffd12f;" class="font-bold">Intro Skill</span> cast by a Resonator in the team grants 1 stack of <span style="color:#ffd12f;" class="font-bold">Dream Aroma</span>. This effect is removed when Lily is the incoming Resonator.<br></span><br><br><span class="Title">Dream Aroma</span></span><br><br>Stacks up to 4 times. Each stack increases the ATK of all Resonators on the team by 0.1% for every 1% of Lily's Energy Regen above 190%, up to 7%. This effect is removed when Lily is the incoming Resonator or when <span style="color:#ffd12f;" class="font-bold">Cradle Lullaby</span> ends.</div>`,
  icon: "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconLili/SP_IconLiliC1.webp",
  attacks: [
    {
      key: "SlumberlandHealing",
      label: "Slumberland Healing",
      talents: {
        "1": "287+0.52%",
        "2": "321+0.54%",
        "3": "359+0.56%",
        "4": "402+0.59%",
        "5": "454+0.63%",
        "6": "503+0.68%",
        "7": "511+0.75%",
        "8": "523+0.84%",
        "9": "531+0.94%",
        "10": "546+1.09%",
      },
      type: "Healing",
      attribute: "hp",
    },
    {
      key: "DreambindContinuousDMG",
      label: "Dreambind Continuous DMG",
      talents: {
        "1": "10.00%",
        "2": "10.82%",
        "3": "11.64%",
        "4": "12.79%",
        "5": "13.61%",
        "6": "14.56%",
        "7": "15.87%",
        "8": "17.18%",
        "9": "18.49%",
        "10": "19.89%",
      },
      type: "Liberation",
    }
  ],
};
