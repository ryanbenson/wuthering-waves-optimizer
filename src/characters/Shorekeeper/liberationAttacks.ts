export const liberationAttacks = {
  name: "Resonance Liberation: End Loop",
  description: `<div class="skilldescription"><span class="Title">Outer Stellarealm</span><br>Generate the <span class="Highlight">Outer Stellarealm</span> to restore HP for all party members within its effective range continuously. This effect can be triggered once every 3s.<br> <br><span class="Title">Inner Stellarealm</span><br>When a party member uses <span class="Highlight">Intro Skill</span> within the <span class="Highlight">Outer Stellarealm</span>, it evolves into the <span class="Highlight">Inner Stellarealm</span>. Within the effective range of the <span class="Highlight">Inner Stellarealm</span>, for every 0.2% of Shorekeeper's Energy Regen, all party members gain a 0.01% increase of Crit. Rate, up to 12.5%. <br><span class="Highlight">Inner Stellarealm</span> has all the effects of the <span class="Highlight">Outer Stellarealm</span>.<br> <br><span class="Title">Supernal Stellarealm</span><br>When a party member uses <span class="Highlight">Intro Skill</span> within the <span class="Highlight">Inner Stellarealm</span>, it evolves into the <span class="Highlight">Supernal Stellarealm</span>. Within the effective range of the <span class="Highlight">Supernal Stellarealm</span>, for every 0.1% of Shorekeeper's Energy Regen, all party members gain a 0.01% increase of Crit. DMG, up to 25%. <br><span class="Highlight">Supernal Stellarealm</span> has all the effects of the <span class="Highlight">Inner Stellarealm</span>.</div>`,
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
