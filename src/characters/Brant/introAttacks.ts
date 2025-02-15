export const introAttacks = {
  name: "Intro Skill: Applaud for Me!",
  description: `<div class="skilldescription">Attack the target, dealing <span class="Fire">Fusion DMG</span> and gain <span class="Highlight">Interlude Applause</span> effect.<br> <br><span class="Title">Interlude Applause</span><br>The next Mid-air Attack begins at <span class="Highlight">Stage 2</span>. This effect ends when Brant lands early or is switched out.</div>`,
  attacks: [
    {
      key: "ApplaudforMeDMG",
      label: "Applaud for Me DMG",
      talents: {
        "1": "102.00% + 25.50%",
        "2": "110.37% + 27.60%",
        "3": "118.73% + 29.69%",
        "4": "130.44% + 32.61%",
        "5": "138.81% + 34.71%",
        "6": "148.43% + 37.11%",
        "7": "161.81% + 40.46%",
        "8": "175.19% + 43.80%",
        "9": "188.57% + 47.15%",
        "10": "202.79% + 50.70%",
      },
      type: "Intro",
    },
  ],
};
