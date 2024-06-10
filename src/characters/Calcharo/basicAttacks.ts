export const basicAttacks = {
  name: "Gnawing Fangs",
  description:
    '<div class="skilldescription"><span class="Title">Basic Attack</span><br>Calcharo performs up to 4 consecutive attacks, dealing <span class="Thunder">Electro DMG</span>.<br> <br><span class="Title">Heavy Attack</span><br>Consumes Stamina to attack the target, dealing <span class="Thunder">Electro DMG</span>.<br> <br><span class="Title">Mid-air Attack</span><br>Consumes Stamina to perform a Mid-Air Plunging Attack, dealing <span class="Thunder">Electro DMG</span>.<br> <br><span class="Title">Dodge Counter</span><br>Use <span class="Highlight">Basic Attack</span> after a successful <span class="Highlight">Dodge</span> to attack the target, dealing <span class="Thunder">Electro DMG</span>.</div>',
  attacks: [
    {
      key: "Part1Damage",
      label: "Part 1 Damage",
      talents: {
        "1": "23.00%*2",
        "2": "24.89%*2",
        "3": "26.78%*2",
        "4": "29.42%*2",
        "5": "31.30%*2",
        "6": "33.47%*2",
        "7": "36.49%*2",
        "8": "39.51%*2",
        "9": "42.53%*2",
        "10": "45.73%*2",
      },
    },
    {
      key: "Part2Damage",
      label: "Part 2 Damage",
      talents: {
        "1": "50.00%",
        "2": "54.10%",
        "3": "58.20%",
        "4": "63.94%",
        "5": "68.04%",
        "6": "72.76%",
        "7": "79.32%",
        "8": "85.88%",
        "9": "92.44%",
        "10": "99.41%",
      },
    },
  ],
};
