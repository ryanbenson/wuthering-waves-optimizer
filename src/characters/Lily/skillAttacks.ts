export const skillAttacks = {
  name: "Resonance Skill: Dream Blend",
  description: `<div><span class="Title">Resonance Skill - Nightmare Blend</span></span><br><br>Lily starts with <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Woven Fairytale</span> by default. When <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Woven Fairytale</span> is active, press Resonance Skill to deal <span style="color:#f8e56cff;">Spectro DMG</span> to nearby targets, then switch to <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Woven Phantasm</span>.<br>This skill shares a Cooldown with <span style="color:#ffd12f;" class="font-bold">Resonance Skill - Reverie Blend</span>.<br></span><br><br><span class="Title">Resonance Skill - Reverie Blend</span></span><br><br>When <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Woven Phantasm</span> is active, press Resonance Skill to deal <span style="color:#f8e56cff;">Spectro DMG</span> to nearby targets, then switch to <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Woven Fairytale</span>.<br>This skill shares a Cooldown with <span style="color:#ffd12f;" class="font-bold">Resonance Skill - Nightmare Blend</span>.</div>`,
  icon: "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconLili/SP_IconLiliB1.webp",
  attacks: [
    {
      key: "ResonanceSkillReverieBlendDMG",
      label: "Resonance Skill - Reverie Blend DMG",
      talents: {
        "1": "80.00%",
        "2": "86.56%",
        "3": "93.12%",
        "4": "102.31%",
        "5": "108.87%",
        "6": "116.41%",
        "7": "126.91%",
        "8": "137.40%",
        "9": "147.90%",
        "10": "159.05%",
      },
      type: "Skill",
    },
    {
      key: "ResonanceSkillNightmareBlendDMG",
      label: "Resonance Skill - Nightmare Blend DMG",
      talents: {
        "1": "80.00%",
        "2": "86.56%",
        "3": "93.12%",
        "4": "102.31%",
        "5": "108.87%",
        "6": "116.41%",
        "7": "126.91%",
        "8": "137.40%",
        "9": "147.90%",
        "10": "159.05%",
      },
      type: "Skill",
    }
  ],
};
