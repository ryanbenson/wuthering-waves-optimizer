export const introAttacks = {
  name: "Intro Skill: Before Injection of Dawn",
  description: `<div>Deal <span class="Light">Spectro DMG</span>. Hurl out an <span class="Highlight" class="font-bold">Ichor Blade</span> and inflict <span class="Highlight" class="font-bold">Tune Strain - Shifting</span> on the target.<br><span class="Highlight" class="font-bold">Press Normal Attack</span> after this skill to cast <span class="Highlight" class="font-bold">Mid-air Attack Stage 2 - Scythe: Dissection</span> or <span class="Highlight" class="font-bold">Jump</span> to cast <span class="Highlight" class="font-bold">Mid-air Attack Stage 2 - Scythe: Resection</span>.</div>`,
  attacks: [
    {
      key: "BeforeInjectionofDawnDMG",
      label: "Before Injection of Dawn DMG",
      talents: {
        "1": "36.55%*3",
        "2": "39.55%*3",
        "3": "42.55%*3",
        "4": "46.75%*3",
        "5": "49.74%*3",
        "6": "53.19%*3",
        "7": "57.98%*3",
        "8": "62.78%*3",
        "9": "67.57%*3",
        "10": "72.67%*3",
      },
      type: "Intro",
    },
  ],
};
