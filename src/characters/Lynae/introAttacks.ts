export const introAttacks = {
  name: "Intro Skill: Time to Show Some Colors!",
  description: `<div>Deal <span class="Light"><strong>Spectro DMG</strong></span>, inflicting <span class="Highlight"><strong>Photochromic Flux</strong></span> on targets hit.<br>While in <span class="Highlight"><strong>Optical Sampling Stage</strong></span>, casting this skill recovers 100 points of <span class="Highlight"><strong>Overflow</strong></span>.</div>`,
  attacks: [
    {
      key: "TimetoShowSomeColorsDMG",
      label: "Time to Show Some Colors! DMG",
      talents: {
        "1": "11.31%*10",
        "2": "12.24%*10",
        "3": "13.16%*10",
        "4": "14.46%*10",
        "5": "15.39%*10",
        "6": "16.45%*10",
        "7": "17.94%*10",
        "8": "19.42%*10",
        "9": "20.90%*10",
        "10": "22.48%*10",
      },
      type: "Intro",
    },
  ],
};
