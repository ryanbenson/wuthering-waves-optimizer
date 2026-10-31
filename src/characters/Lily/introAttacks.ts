export const introAttacks = {
  name: "Intro Skill: Blooming Dream",
  description: `<div><span class="Title">First Bloom</span></span><br><br>Attack the target, dealing <span style="color:#f8e56cff;">Spectro DMG</span>. Press <span style="color:#ffd12f;" class="font-bold">Normal Attack</span> shortly after casting this skill to cast Basic Attack Stage 3.<br></span><br><br><span class="Title">Eternal Bloom</span></span><br><br>After casting <span style="color:#ffd12f;" class="font-bold">Resonance Liberation - Into the Dream Cradle</span>, Lily's next Intro Skill <span style="color:#ffd12f;" class="font-bold">First Bloom</span> is replaced with <span style="color:#ffd12f;" class="font-bold">Eternal Bloom</span>. When cast, it attacks the target, dealing <span style="color:#f8e56cff;">Spectro DMG</span>.<br>For every 1% of Lily's Energy Regen exceeding 100%, this skill gains an additional 0.5% Crit. Rate, up to 80%, and an additional 1% Crit. DMG, up to 160%.<br>Casting the skill grants <span style="color:#ffd12f;" class="font-bold">Deep Dream Fragrance</span> for 8s. Casting <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Woven Fairytale</span> or <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Woven Phantasm</span> consumes <span style="color:#ffd12f;" class="font-bold">Deep Dream Fragrance</span> to additionally grant 100 points of <span style="color:#ffd12f;" class="font-bold">Dreambell Chime</span>.<br>Press <span style="color:#ffd12f;" class="font-bold">Normal Attack</span> shortly after casting this skill to cast Basic Attack Stage 3.</div>`,
  icon: "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconLili/SP_IconLiliQTE.webp",
  attacks: [
    {
      key: "IntroSkillFirstBloomDMG",
      label: "Intro Skill - First Bloom DMG",
      talents: {
        "1": "23.60%+23.60%*3",
        "2": "25.54%+25.54%*3",
        "3": "27.48%+27.48%*3",
        "4": "30.18%+30.18%*3",
        "5": "32.12%+32.12%*3",
        "6": "34.35%+34.35%*3",
        "7": "37.44%+37.44%*3",
        "8": "40.54%+40.54%*3",
        "9": "43.63%+43.63%*3",
        "10": "46.92%+46.92%*3",
      },
      type: "Intro",
    },
    {
      key: "IntroSkillEternalBloomDMG",
      label: "Intro Skill - Eternal Bloom DMG",
      talents: {
        "1": "18.15%",
        "2": "19.64%",
        "3": "21.13%",
        "4": "23.22%",
        "5": "24.70%",
        "6": "26.42%",
        "7": "28.80%",
        "8": "31.18%",
        "9": "33.56%",
        "10": "36.09%",
      },
      type: "Intro",
      attribute: "hp",
    }
  ],
};
