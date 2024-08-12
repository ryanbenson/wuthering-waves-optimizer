export const forteCircuitAttacks = {
  name: "Forte Circuit: Misty Cover",
  description:
    `<div class="skilldescription">When Aalto passes through "Mist" or "Gate of Quandary", he enters the <span class="Highlight">Mistcloak Dash</span>.<br> <br><span class="Title">Mistcloak Dash</span><br>-Movement speed increased;<br>-During this period, "Mist Drops" are continuously consumed, and for each 1 "Mist Drop" consumed, 1 Mist Bullet(s) is generated.<br> <br><span class="Title">Mist Drops</span><br>Aalto can hold up to 6 "Mist Drops".<br>When <span class="Highlight">Basic Attack</span> or <span class="Highlight">Mid-air Attack</span> passes through "Mist" and hits the target, 1 "Mist Drop" is recovered.</div>`,
  attacks: [
    {
      key: "MistBulletDMG",
      label: "Mist Bullet DMG",
      talents: {
        "1": "30.00%",
        "2": "32.46%",
        "3": "34.92%",
        "4": "38.37%",
        "5": "40.83%",
        "6": "43.66%",
        "7": "47.59%",
        "8": "51.53%",
        "9": "55.47%",
        "10": "59.65%",
      },
      type: "Skill",
    },
  ],
};
