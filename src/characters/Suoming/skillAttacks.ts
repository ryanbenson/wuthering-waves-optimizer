export const skillAttacks = {
  name: "Resonance Skill: Furled Canopy: Rift Cleaver",
  description: `<div>Attack targets within range, dealing <span style="color:#ebb0ff;">Electro DMG</span>.<br>- Upon being attacked by an enemy target, cast <span style="color:#ffd12f;" class="font-bold">Resonance Skill</span> to become immune to this damage and stagnate nearby targets. This <span style="color:#ffd12f;" class="font-bold">Resonance Skill</span> is immune to interruption and triggers <span style="color:#ffd12f;" class="font-bold">Resonance Skill - Unfurled Canopy: Crimson Gleam</span>.<br>- Entering the <span style="color:#ffd12f;" class="font-bold">Deep Mind</span> state resets the Cooldown of <span style="color:#ffd12f;" class="font-bold">Resonance Skill</span>.<br>- While in the <span style="color:#ffd12f;" class="font-bold">Awakened Mind</span> state, press <span style="color:#ffd12f;" class="font-bold">Normal Attack</span> shortly after casting this skill to cast <span style="color:#ffd12f;" class="font-bold">Basic Attack Stage 2</span>.<br>- While in the <span style="color:#ffd12f;" class="font-bold">Deep Mind</span> state, press <span style="color:#ffd12f;" class="font-bold">Normal Attack</span> shortly after casting this skill to chain into <span style="color:#ffd12f;" class="font-bold">Basic Attack - Unfurled Canopy Stage 3</span>.<br><br><span class="Title">Resonance Skill - Unfurled Canopy: Crimson Gleam</span></span><br><br>Attack targets within range, dealing <span style="color:#ebb0ff;">Electro DMG</span>.<br>- While in the <span style="color:#ffd12f;" class="font-bold">Awakened Mind</span> state, press <span style="color:#ffd12f;" class="font-bold">Normal Attack</span> shortly after casting this skill to cast <span style="color:#ffd12f;" class="font-bold">Basic Attack Stage 3</span>.<br>- While in the <span style="color:#ffd12f;" class="font-bold">Deep Mind</span> state, press <span style="color:#ffd12f;" class="font-bold">Normal Attack</span> shortly after casting this skill to chain into <span style="color:#ffd12f;" class="font-bold">Basic Attack - Unfurled Canopy Stage 4</span>.</div>`,
  icon: "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconSuoming/SP_IconSuomingB1.webp",
  attacks: [
    {
      key: "ResonanceSkillFurledCanopyRiftCleaverDMG",
      label: "Resonance Skill - Furled Canopy: Rift Cleaver DMG",
      talents: {
        "1": "53.62%",
        "2": "58.02%",
        "3": "62.42%",
        "4": "68.57%",
        "5": "72.97%",
        "6": "78.03%",
        "7": "85.06%",
        "8": "92.10%",
        "9": "99.13%",
        "10": "106.61%",
      },
      type: "Skill",
    },
    {
      key: "ResonanceSkillUnfurledCanopyCrimsonGleamDMG",
      label: "Resonance Skill - Unfurled Canopy: Crimson Gleam DMG",
      talents: {
        "1": "23.77%+11.89%*2+31.69%",
        "2": "25.72%+12.86%*2+34.29%",
        "3": "27.67%+13.84%*2+36.89%",
        "4": "30.40%+15.20%*2+40.53%",
        "5": "32.34%+16.17%*2+43.12%",
        "6": "34.59%+17.30%*2+46.11%",
        "7": "37.70%+18.85%*2+50.27%",
        "8": "40.82%+20.41%*2+54.43%",
        "9": "43.94%+21.97%*2+58.58%",
        "10": "47.25%+23.63%*2+63.00%",
      },
      type: "Skill",
    }
  ],
};
