export const introAttacks = {
  name: "Intro Skill: Blooming Dream",
  description: `<div><span class="Title">First Bloom</span></span><br>Attack the target, dealing <span style="color:#f8e56cff;">Spectro DMG</span>. Press <span style="color:#ffd12f;" class="font-bold">Normal Attack</span> shortly after casting this skill to cast Basic Attack Stage 3.</span><br><br><span class="Title">Eternal Bloom</span></span><br>After casting <span style="color:#ffd12f;" class="font-bold">Resonance Liberation - Into the Dream Cradle</span>, Lily's next Intro Skill <span style="color:#ffd12f;" class="font-bold">First Bloom</span> is replaced with <span style="color:#ffd12f;" class="font-bold">Eternal Bloom</span>. When cast, it attacks the target, dealing <span style="color:#f8e56cff;">Spectro DMG</span>.<br>For every 1% of Lily's Energy Regen exceeding 100%, this skill gains 0.5% Crit. Rate, up to 80%, and 1% Crit. DMG, up to 160%.<br>Casting the skill grants <span style="color:#ffd12f;" class="font-bold">Deep Dream Fragrance</span> for 8s. Casting <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Woven Fairytale</span> or <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Woven Phantasm</span> consumes <span style="color:#ffd12f;" class="font-bold">Deep Dream Fragrance</span> to additionally grant 100 points of <span style="color:#ffd12f;" class="font-bold">Dreambell Chime</span>.<br>Press <span style="color:#ffd12f;" class="font-bold">Normal Attack</span> shortly after casting this skill to cast Basic Attack Stage 3.</div>`,
  icon: "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconLili/SP_IconLiliQTE.webp",
  attacks: [
    {
      key: "IntroSkillFirstBloomDMG",
      label: "Intro Skill - First Bloom DMG",
      talents: {
        "1": "27.34%+27.34%*3",
        "2": "29.59%+29.59%*3",
        "3": "31.83%+31.83%*3",
        "4": "34.97%+34.97%*3",
        "5": "37.21%+37.21%*3",
        "6": "39.79%+39.79%*3",
        "7": "43.37%+43.37%*3",
        "8": "46.96%+46.96%*3",
        "9": "50.55%+50.55%*3",
        "10": "54.36%+54.36%*3",
      },
      type: "Intro",
    },
    {
      key: "IntroSkillEternalBloomDMG",
      label: "Intro Skill - Eternal Bloom DMG",
      talents: {
        "1": "18.16%",
        "2": "19.65%",
        "3": "21.14%",
        "4": "23.22%",
        "5": "24.71%",
        "6": "26.42%",
        "7": "28.80%",
        "8": "31.18%",
        "9": "33.57%",
        "10": "36.10%",
      },
      type: "Intro",
      attribute: "hp",
    }
  ],
};
