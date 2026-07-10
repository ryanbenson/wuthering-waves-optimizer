export const liberationAttacks = {
  name: "Resonance Liberation: Hush of a Thousand Voices",
  description: `<div><span class="Title">Hush of a Thousand Voices</span></span><br>Consume all <span style="color:#ffd12f;" class="font-bold">Melody</span> to deal <span style="color:#fcc4db;">Havoc DMG</span> and restore 1 <span style="color:#ffd12f;" class="font-bold">Azure Plume</span>. This DMG is considered <span style="color:#ffd12f;" class="font-bold">Heavy Attack DMG</span>.<br><size=10></span><br>Upon casting this skill, obtain <span style="color:#ffd12f;" class="font-bold">Voice upon Voice</span>. When casting <span style="color:#ffd12f;" class="font-bold">Resonance Skill - Sword Stance Flow: Azure</span> or <span style="color:#ffd12f;" class="font-bold">Resonance Skill - Sword Stance Flow: Feather</span>, summon <span style="color:#ffd12f;" class="font-bold">Shadow of Xuanling</span> to attack the target, dealing <span style="color:#fcc4db;">Havoc DMG</span>, considered <span style="color:#ffd12f;" class="font-bold">Heavy Attack DMG</span>.<br><span style="color:#ffd12f;" class="font-bold">Voice upon Voice</span> cannot stack. Once <span style="color:#ffd12f;" class="font-bold">Shadow of Xuanling</span> is summoned, the <span style="color:#ffd12f;" class="font-bold">Voice upon Voice</span> state is removed.</div>`,
  attacks: [
    {
      key: "HushOfAThousandVoicesDMG",
      label: "Hush of a Thousand Voices DMG",
      talents: {
        "1": "1000.00%",
        "2": "1082.00%",
        "3": "1164.00%",
        "4": "1278.80%",
        "5": "1360.80%",
        "6": "1455.10%",
        "7": "1586.30%",
        "8": "1717.50%",
        "9": "1848.70%",
        "10": "1988.10%",
      },
      type: "Heavy",
    },
    {
      key: "ShadowOfXuanlingDMG",
      label: "Shadow of Xuanling DMG",
      talents: {
        "1": "170.00%",
        "2": "183.94%",
        "3": "197.88%",
        "4": "217.40%",
        "5": "231.34%",
        "6": "247.37%",
        "7": "269.68%",
        "8": "291.98%",
        "9": "314.28%",
        "10": "337.98%",
      },
      type: "Heavy",
    }
  ],
};
