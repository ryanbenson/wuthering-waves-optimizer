export const introAttacks = {
  name: "Intro Skill: Question the Tombs",
  description: `<div>Attack the target, dealing <span style="color:#fbcaad;">Fusion DMG</span> and gain 100 points of <span style="color:#ffd12f;" class="font-bold">Qi</span>. Consume and convert all <span style="color:#ffd12f;" class="font-bold">Ghost Shroud</span> to equal stacks of <span style="color:#ffd12f;" class="font-bold">Fortune in Disguise</span><br>While in the <span style="color:#ffd12f;" class="font-bold">Yin Vessel</span> state, press or hold <span style="color:#ffd12f;" class="font-bold">Normal Attack</span> shortly after casting this skill to cast <span style="color:#ffd12f;" class="font-bold">Basic Attack - Drink Soul Stage 2</span>.<br>While in the <span style="color:#ffd12f;" class="font-bold">Yang Font</span> state, press or hold <span style="color:#ffd12f;" class="font-bold">Normal Attack</span> shortly after casting this skill to cast <span style="color:#ffd12f;" class="font-bold">Basic Attack - Devil's Bane Stage 2</span>.<br><size=10></span><br><br><span class="Title">Fortune in Disguise</span></span><br><br>Max 50 stacks. Each stack of <span style="color:#ffd12f;" class="font-bold">Fortune in Disguise</span> grants additional Fusion DMG Bonus based on Jingran's Max HP: For every 1000 points of Max HP, Jingran gains 0.08% additional Fusion DMG Bonus for 15s, up to 2.8% for each stack of <span style="color:#ffd12f;" class="font-bold">Fortune in Disguise</span>.<br>Switching to another Resonator ends the effect.<br><size=10></span><br><br><span class="Title">Ghost Shroud</span></span><br><br>- Max 50 points.<br>- When nearby Resonators in the team gain a Shield, Jingran gains 1 points of <span style="color:#ffd12f;" class="font-bold">Ghost Shroud</span>. This effect can be triggered once every 0.5s.</div>`,
  attacks: [
    {
      key: "SkillDMG",
      label: "Skill DMG",
      talents: {
        "1": "100.00%",
        "2": "108.20%",
        "3": "116.40%",
        "4": "127.88%",
        "5": "136.08%",
        "6": "145.51%",
        "7": "158.63%",
        "8": "171.75%",
        "9": "184.87%",
        "10": "198.81%",
      },
      type: "Intro",
    }
  ],
};
