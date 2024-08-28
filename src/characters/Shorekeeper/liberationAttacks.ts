export const liberationAttacks = {
  name: "Resonance Liberation: End Loop",
  description: `<div class="skilldescription"><span class="Title">Elementary Stellarealm</span><br>Expand <span class="Highlight">Elementary Stellarealm</span> to continuously restore HP for all team members within the <span class="Highlight">Stellarealm</span>. This effect can be triggered once every 3 seconds.<br> <br><span class="Title">Sophisticated Stellarealm</span><br>When nearby team members use <span class="Highlight">Intro Skill</span> within <span class="Highlight">Elementary Stellarealm</span>, it evolves into <span class="Highlight">Sophisticated Stellarealm</span>. In <span class="Highlight">Sophisticated Stellarealm</span>, for every 20% in the Shorekeeper's Energy Regen, all nearby team members in the domain gain a 1% increase in Crit. Rate, up to a maximum of 10%. <br><span class="Highlight">Sophisticated Stellarealm</span> involves all the effects of <span class="Highlight">Elementary Stellarealm</span>.<br> <br><span class="Title">Released Stellarealm</span><br>When nearby team members use <span class="Highlight">Intro Skill</span> within <span class="Highlight">Sophisticated Stellarealm</span>, it evolves into <span class="Highlight">Released Stellarealm</span>. In <span class="Highlight">Released Stellarealm</span>, for every 10% in Shorekeeper's Energy Regen, all nearby team members in the domain gain a 1% increase in ATK%, up to a maximum of 20%. <br><span class="Highlight">Released Stellarealm</span> involves all the effects of <span class="Highlight">Sophisticated Stellarealm</span>.<br>When <span class="Highlight">Released Stellarealm</span> exists, the Shorekeeper's Intro Skill <span class="Highlight">Enlightenment</span> will be replaced by Intro Skill <span class="Highlight">Discernment</span>.</div>`,
  attacks: [
    {
      key: "EndLoopDMG",
      label: "End Loop Healing",
      talents: {
        "1": "220 + 1.20%",
        "2": "239 + 1.30%",
        "3": "257 + 1.40%",
        "4": "282 + 1.54%",
        "5": "300 + 1.64%",
        "6": "321 + 1.75%",
        "7": "349 + 1.91%",
        "8": "378 + 2.07%",
        "9": "407 + 2.22%",
        "10": "438 + 2.39%",
      },
      type: "Healing",
      attribute: "hp",
    },
  ],
};
