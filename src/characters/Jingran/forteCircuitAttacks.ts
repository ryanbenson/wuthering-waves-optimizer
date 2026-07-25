export const forteCircuitAttacks = {
  name: "Forte Circuit: Upstream Along Santu",
  description: `<div><span class="Title">Qi Modulation</span></span><br><br>Jingran switches between the <span style="color:#ffd12f;" class="font-bold">Yin Vessel</span> and <span style="color:#ffd12f;" class="font-bold">Yang Font</span> states by casting <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Soul Raid</span> or <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Stardome Meander</span>. Jingran is in the <span style="color:#ffd12f;" class="font-bold">Yang Font</span> state by default.<br><size=10></span><br><br><span class="Title">Heavy Attack - Soul Raid</span></span><br><br>When Jingran holds 300 points of <span style="color:#ffd12f;" class="font-bold">Qi</span> while in the <span style="color:#ffd12f;" class="font-bold">Yin Vessel</span> state, <span style="color:#ffd12f;" class="font-bold">hold Resonance Skill</span> to consume 300 points of <span style="color:#ffd12f;" class="font-bold">Qi</span> to cast <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Soul Raid</span>, which deals <span style="color:#fbcaad;">Fusion DMG</span>.<br>After casting <span class="Title">Heavy Attack - Soul Raid</span></span><br>, Jingran switches to the <span style="color:#ffd12f;" class="font-bold">Yang Font</span> state.<br>Press <span style="color:#ffd12f;" class="font-bold">Normal Attack</span> shortly after casting this skill to cast <span style="color:#ffd12f;" class="font-bold">Basic Attack - Devil’s Bane Stage 2</span>, <br><size=10></span><br><br><span class="Title">Heavy Attack - Stardome Meander</span></span><br><br>When Jingran holds 300 points of <span style="color:#ffd12f;" class="font-bold">Qi</span> while in the <span style="color:#ffd12f;" class="font-bold">Yang Font</span> state, <span style="color:#ffd12f;" class="font-bold">hold Resonance Skill</span> to consume 300 points of <span style="color:#ffd12f;" class="font-bold">Qi</span> to cast <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Stardome Meander</span>, which deals <span style="color:#fbcaad;">Fusion DMG</span>.<br>After casting <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Stardome Meander</span>, Jingran switches to the <span style="color:#ffd12f;" class="font-bold">Yin Vessel</span> state.<br>Press <span style="color:#ffd12f;" class="font-bold">Normal Attack</span> shortly after casting this skill to cast <span style="color:#ffd12f;" class="font-bold">Basic Attack - Drink Soul Stage 2</span>.<br><span style="color:#ffd12f;" class="font-bold">Heavy Attack - Stardome Meander</span> can be cast in mid-air.<br><size=10></span><br><br><span class="Title">Qi</span></span><br><br>Max 300 points.<br>- Casting <span style="color:#ffd12f;" class="font-bold">Basic Attack - Drink Soul Stage 3</span>, <span style="color:#ffd12f;" class="font-bold">Basic Attack - Drink Soul Stage 4</span>, <span style="color:#ffd12f;" class="font-bold">Basic Attack - Devil’s Bane Stage 3</span> or<span style="color:#ffd12f;" class="font-bold">Basic Attack - Devil’s Bane Stage 4</span> restores 50 points of <span style="color:#ffd12f;" class="font-bold">Qi</span>.<br>- Casting <span style="color:#ffd12f;" class="font-bold">Intro Skill - Question the Tombs</span> restores 100 points of <span style="color:#ffd12f;" class="font-bold">Qi</span>.<br>- Casting <span style="color:#ffd12f;" class="font-bold">Resonance Liberation - Burial of Thousand Souls</span> or casting <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Soul Raid</span> or <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Stardome Meander</span> with <span style="color:#ffd12f;" class="font-bold">Wayfarer's Mark</span> restores 200 points of <span style="color:#ffd12f;" class="font-bold">Qi</span>.<br><size=10></span><br><br><span class="Title">Nether to Light</span></span><br><br>- Jingran's DEF remains 0 at all times.<br>- Jingran gains bonus Healing based on Max HP: For every 1000 of Max HP, Jingran receives 6% bonus Healing, up to 210%.<br><size=10></span><br><br><span class="Title">Yang Changes, Yin Unites</span></span><br><br>Gain additional ATK based on Max HP: For every 1000 of Max HP, Jingran gains 52 additional ATK, up to 1820.</div>`,
  attacks: [
    {
      key: "HeavyAttackSoulRaidDMG",
      label: "Heavy Attack - Soul Raid DMG",
      talents: {
        "1": "11.09%*2+14.26%*3+93.45%",
        "2": "12.00%*2+15.43%*3+101.11%",
        "3": "12.91%*2+16.60%*3+108.77%",
        "4": "14.18%*2+18.23%*3+119.50%",
        "5": "15.09%*2+19.40%*3+127.16%",
        "6": "16.14%*2+20.75%*3+135.97%",
        "7": "17.59%*2+22.62%*3+148.23%",
        "8": "19.05%*2+24.49%*3+160.49%",
        "9": "20.50%*2+26.36%*3+172.75%",
        "10": "22.05%*2+28.34%*3+185.78%",
      },
      type: "Heavy",
    },
    {
      key: "HeavyAttackStardomeMeanderDMG",
      label: "Heavy Attack - Stardome Meander DMG",
      talents: {
        "1": "16.25%+16.25%+32.50%+97.50%",
        "2": "17.59%+17.59%+35.17%+105.50%",
        "3": "18.92%+18.92%+37.83%+113.49%",
        "4": "20.79%+20.79%+41.57%+124.69%",
        "5": "22.12%+22.12%+44.23%+132.68%",
        "6": "23.65%+23.65%+47.30%+141.88%",
        "7": "25.78%+25.78%+51.56%+154.67%",
        "8": "27.91%+27.91%+55.82%+167.46%",
        "9": "30.05%+30.05%+60.09%+180.25%",
        "10": "32.31%+32.31%+64.62%+193.84%",
      },
      type: "Heavy",
    }
  ],
};
