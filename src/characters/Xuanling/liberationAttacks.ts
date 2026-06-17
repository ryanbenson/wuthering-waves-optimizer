export const liberationAttacks = {
  name: "Resonance Liberation: Hush of a Thousand Voices",
  description: `<span class="Title">Hush of a Thousand Voices</span></span><br><br>Consume all <span style="color:#ffd12f;" class="font-bold">Melody</span> to deal <span style="color:#fcc4db;">Havoc DMG</span> and restore 1 <span style="color:#ffd12f;" class="font-bold">Azure Plume</span>. This DMG is considered <span style="color:#ffd12f;" class="font-bold">Heavy Attack DMG</span>.<br><size=10></span><br><br>Upon casting this skill, gain the <span style="color:#ffd12f;" class="font-bold">Voice upon Voice</span> state. While <span style="color:#ffd12f;" class="font-bold">Voice upon Voice</span> is active, casting <span style="color:#ffd12f;" class="font-bold">Sword Stance Flow - Azure</span> or <span style="color:#ffd12f;" class="font-bold">Sword Stance Flow - Feather</span> summons <span style="color:#ffd12f;" class="font-bold">Shadow of Xuanling</span> to attack the target, dealing <span style="color:#fcc4db;">Havoc DMG</span>. This DMG is considered <span style="color:#ffd12f;" class="font-bold">Heavy Attack DMG</span>.<br><span style="color:#ffd12f;" class="font-bold">Voice upon Voice</span> cannot stack. Once <span style="color:#ffd12f;" class="font-bold">Shadow of Xuanling</span> is successfully summoned, the <span style="color:#ffd12f;" class="font-bold">Voice upon Voice</span> state is removed.`,
  attacks: [
    {
      key: "HushOfAThousandVoices",
      label: "Hush of a Thousand Voices",
      talents: {
        "1": "875.00%",
        "2": "946.75%",
        "3": "1018.50%",
        "4": "1118.95%",
        "5": "1190.70%",
        "6": "1273.22%",
        "7": "1388.02%",
        "8": "1502.82%",
        "9": "1617.62%",
        "10": "1739.59%",
      },
      type: "Heavy",
    },
    {
      key: "ShadowOfXuanling",
      label: "Shadow of Xuanling",
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
