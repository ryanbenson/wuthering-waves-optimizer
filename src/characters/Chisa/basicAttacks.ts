export const basicAttacks = {
  name: "Normal Attack: Reign of Silence",
  description: `<div><size=40><span class="Title"><strong>Basic Attack</strong></span><br>Perform up to 2 consecutive attacks, dealing <span class="Dark"><strong>Havoc DMG</strong></span>.<br>Press <span class="Highlight"><strong>Normal Attack</strong></span> shortly after casting <span class="Highlight"><strong>Basic Attack Stage 2</strong></span> to cast <span class="Highlight"><strong>Rending Lunge</strong></span>. <br><size=10><br><size=40><span class="Title"><strong>Rending Lunge</strong></span><br>Deal <span class="Dark"><strong>Havoc DMG</strong></span>.<br>Press <span class="Highlight"><strong>Normal Attack</strong></span> shortly after casting this skill on the ground to cast <span class="Highlight"><strong>Death Snip</strong></span>.<br>Use <span class="Highlight"><strong>Normal Attack</strong></span> shortly after casting this skill in mid-air to cast <span class="Highlight"><strong>Hanging Finality</strong></span>.<br><size=10><br><size=40><span class="Title"><strong>Death Snip</strong></span><br>Open the scissors, dealing <span class="Dark"><strong>Havoc DMG</strong></span>. After a while, the scissors snip, dealing <span class="Dark"><strong>Havoc DMG</strong></span> and restoring HP for all nearby Resonators in the team.<br>Use <span class="Highlight"><strong>Normal Attack</strong></span> during this skill to deal additional <span class="Dark"><strong>Havoc DMG</strong></span>. Use <span class="Highlight"><strong>Normal Attack</strong></span> again to immediately snip the target.<br>The skill DMG is considered <span class="Highlight"><strong>Resonance Liberation DMG</strong></span>.<br>Press <span class="Highlight"><strong>Normal Attack</strong></span> shortly after casting <span class="Highlight"><strong>Death Snip</strong></span> to cast <span class="Highlight"><strong>Thread Withdrawn</strong></span>.<br><size=10><br><size=40><span class="Title"><strong>Thread Withdrawn</strong></span><br>Deal <span class="Dark"><strong>Havoc DMG</strong></span>. <br>Can trigger successful Dodges within a certain time after being cast.<br><size=10><br><size=40><span class="Title"><strong>Heavy Attack</strong></span><br>Leap into the air and consume STA to attack the target, dealing <span class="Dark"><strong>Havoc DMG</strong></span>.<br>This skill cannot be cast while in <span class="Highlight"><strong>Chainsaw Mode</strong></span>.<br>Perform the following actions within a certain time after casting this skill to cast <span class="Highlight"><strong>Hanging Finality</strong></span>:<br>- Press <span class="Highlight"><strong>Normal Attack</strong></span>;<br>- Cast <span class="Highlight"><strong>Lifethread - Glide</strong></span> and press <span class="Highlight"><strong>Normal Attack</strong></span> before landing.<br>Hold <span class="Highlight"><strong>Normal Attack</strong></span> before landing after casting <span class="Highlight"><strong>Heavy Attack</strong></span> to cast <span class="Highlight"><strong>Heavy Attack - Severed Facet</strong></span>.<br><size=10><br><size=40><span class="Title"><strong>Mid-air Attack</strong></span><br>Consume STA to perform Plunging Attack, dealing <span class="Dark"><strong>Havoc DMG</strong></span>. <br>While not in <span class="Highlight"><strong>Chainsaw Mode</strong></span>, press <span class="Highlight"><strong>Normal Attack</strong></span> within a certain time after casting Mid-air Attack to cast <span class="Highlight"><strong>Basic Attack Stage 2</strong></span>.<br><size=10><br><size=40><span class="Title"><strong>Heavy Attack - Severed Facet</strong></span><br>Deal <span class="Dark"><strong>Havoc DMG</strong></span>. <br>Use <span class="Highlight"><strong>Normal Attack</strong></span> within a certain time after casting <span class="Highlight"><strong>Heavy Attack - Severed Facet</strong></span> to cast <span class="Highlight"><strong>Hanging Finality</strong></span>.<br>If interrupted, <span class="Highlight"><strong>Heavy Attack - Severed Facet</strong></span> can be cast again by holding <span class="Highlight"><strong>Normal Attack</strong></span> before landing. This effect can be triggered once only before landing.<br><size=10><br><size=40><span class="Title"><strong>Hanging Finality</strong></span><br>Consume STA to perform Plunging Attack, dealing <span class="Dark"><strong>Havoc DMG</strong></span>. <br>Press <span class="Highlight"><strong>Normal Attack</strong></span> shortly after casting this skill on the ground to cast <span class="Highlight"><strong>Death Snip</strong></span>.<br><size=10><br><size=40><span class="Title"><strong>Dodge Counter</strong></span><br>Press <span class="Highlight"><strong>Normal Attack</strong></span> right after a successful <span class="Highlight"><strong>Dodge</strong></span> to attack the target, dealing <span class="Dark"><strong>Havoc DMG</strong></span>.<br>Press <span class="Highlight"><strong>Normal Attack</strong></span> shortly after casting this skill to cast <span class="Highlight"><strong>Rending Lunge</strong></span>.<br><size=10><br><size=40><span class="Title"><strong>Dodge Counter - Eye of Unraveling: Retraction</strong></span><br>Hold <span class="Highlight"><strong>Dodge</strong></span> after a successful <span class="Highlight"><strong>Dodge</strong></span> on the ground to cast <span class="Highlight"><strong>Dodge Counter - Eye of Unraveling: Retraction</strong></span> to attack and Stagnate the target, dealing <span class="Dark"><strong>Havoc DMG</strong></span>.<br>- While not in <span class="Highlight"><strong>Chainsaw Mode</strong></span>, after casting this skill, Press <span class="Highlight"><strong>Normal Attack</strong></span> on the ground or use <span class="Highlight"><strong>Normal Attack</strong></span> in mid-air to cast <span class="Highlight"><strong>Rending Lunge</strong></span>. This effect is removed when Chisa enters <span class="Highlight"><strong>Chainsaw Mode</strong></span>.<br>- While in <span class="Highlight"><strong>Chainsaw Mode</strong></span>, press <span class="Highlight"><strong>Normal Attack</strong></span> shortly after casting this skill to cast <span class="Highlight"><strong>Sawring - Blitz Stage 3</strong></span>.</size=40></size=10></size=40></size=10></size=40></size=10></size=40></size=10></size=40></size=10></size=40></size=10></size=40></size=10></size=40></size=10></size=40></size=10></size=40></div>`,
  attacks: [
  {
    key: "Stage1DMG",
    label: "Stage 1 DMG",
    type: "Basic",
    talents: {
      "1": "8.40%*2",
      "2": "9.09%*2",
      "3": "9.78%*2",
      "4": "10.75%*2",
      "5": "11.44%*2",
      "6": "12.23%*2",
      "7": "13.33%*2",
      "8": "14.43%*2",
      "9": "15.53%*2",
      "10": "16.71%*2"
    }
  },
  {
    key: "Stage2DMG",
    label: "Stage 2 DMG",
    type: "Basic",
    talents: {
      "1": "4.80%+9.60%+33.60%",
      "2": "5.20%+10.39%+36.36%",
      "3": "5.59%+11.18%+39.12%",
      "4": "6.14%+12.28%+42.97%",
      "5": "6.54%+13.07%+45.73%",
      "6": "6.99%+13.97%+48.90%",
      "7": "7.62%+15.23%+53.30%",
      "8": "8.25%+16.49%+57.71%",
      "9": "8.88%+17.75%+62.12%",
      "10": "9.55%+19.09%+66.81%"
    }
  },
  {
    key: "DeathSnipDMG",
    label: "Death Snip DMG",
    type: "Basic",
    talents: {
      "1": "15.00%+7.50%+52.48%",
      "2": "16.23%+8.12%+56.79%",
      "3": "17.46%+8.73%+61.09%",
      "4": "19.18%+9.59%+67.12%",
      "5": "20.41%+10.21%+71.42%",
      "6": "21.82%+10.91%+76.37%",
      "7": "23.79%+11.90%+83.25%",
      "8": "25.76%+12.88%+90.14%",
      "9": "27.72%+13.86%+97.02%",
      "10": "29.81%+14.91%+104.34%"
    }
  },
  {
    key: "DeathSnipAdditionalDMG",
    label: "Death Snip Additional DMG",
    type: "Basic",
    talents: {
      "1": "24.03%",
      "2": "26.01%",
      "3": "27.98%",
      "4": "30.73%",
      "5": "32.71%",
      "6": "34.97%",
      "7": "38.12%",
      "8": "41.28%",
      "9": "44.43%",
      "10": "47.78%"
    }
  },
  {
    key: "DeathSnipHealing",
    label: "Death Snip Healing",
    type: "Basic",
    talents: {
      "1": "600+24.00% ATK",
      "2": "672+24.96% ATK",
      "3": "750+25.92% ATK",
      "4": "840+27.36% ATK",
      "5": "948+29.28% ATK",
      "6": "1050+31.20% ATK",
      "7": "1068+34.80% ATK",
      "8": "1092+38.88% ATK",
      "9": "1110+43.20% ATK",
      "10": "1140+50.40% ATK"
    }
  },
  {
    key: "ThreadWithdrawnDMG",
    label: "Thread Withdrawn DMG",
    type: "Basic",
    talents: {
      "1": "5.11%*2+23.82%",
      "2": "5.53%*2+25.77%",
      "3": "5.94%*2+27.72%",
      "4": "6.53%*2+30.46%",
      "5": "6.95%*2+32.41%",
      "6": "7.43%*2+34.66%",
      "7": "8.10%*2+37.78%",
      "8": "8.77%*2+40.91%",
      "9": "9.44%*2+44.03%",
      "10": "10.15%*2+47.35%"
    }
  },
  {
    key: "RendingLungeDMG",
    label: "Rending Lunge DMG",
    type: "Basic",
    talents: {
      "1": "7.61%*4+45.61%",
      "2": "8.23%*4+49.35%",
      "3": "8.85%*4+53.08%",
      "4": "9.72%*4+58.32%",
      "5": "10.35%*4+62.06%",
      "6": "11.06%*4+66.36%",
      "7": "12.06%*4+72.34%",
      "8": "13.06%*4+78.33%",
      "9": "14.06%*4+84.31%",
      "10": "15.11%*4+90.66%"
    }
  },
  {
    key: "HeavyAttackDMG",
    label: "Heavy Attack DMG",
    type: "Basic",
    talents: {
      "1": "18.00%*2",
      "2": "19.48%*2",
      "3": "20.96%*2",
      "4": "23.02%*2",
      "5": "24.50%*2",
      "6": "26.20%*2",
      "7": "28.56%*2",
      "8": "30.92%*2",
      "9": "33.28%*2",
      "10": "35.79%*2"
    }
  },
  {
    key: "MidairAttackDMG",
    label: "Mid-air Attack DMG",
    type: "Basic",
    talents: {
      "1": "37.20%",
      "2": "40.26%",
      "3": "43.31%",
      "4": "47.58%",
      "5": "50.63%",
      "6": "54.13%",
      "7": "59.02%",
      "8": "63.90%",
      "9": "68.78%",
      "10": "73.96%"
    }
  },
  {
    key: "SeveredFacetDMG",
    label: "Severed Facet DMG",
    type: "Basic",
    talents: {
      "1": "22.50%*2",
      "2": "24.35%*2",
      "3": "26.19%*2",
      "4": "28.78%*2",
      "5": "30.62%*2",
      "6": "32.74%*2",
      "7": "35.70%*2",
      "8": "38.65%*2",
      "9": "41.60%*2",
      "10": "44.74%*2"
    }
  },
  {
    key: "HangingFinalityDMG",
    label: "Hanging Finality DMG",
    type: "Basic",
    talents: {
      "1": "6.00%+12.00%*2+30.00%",
      "2": "6.50%+12.99%*2+32.46%",
      "3": "6.99%+13.97%*2+34.92%",
      "4": "7.68%+15.35%*2+38.37%",
      "5": "8.17%+16.33%*2+40.83%",
      "6": "8.74%+17.47%*2+43.66%",
      "7": "9.52%+19.04%*2+47.59%",
      "8": "10.31%+20.61%*2+51.53%",
      "9": "11.10%+22.19%*2+55.47%",
      "10": "11.93%+23.86%*2+59.65%"
    }
  },
  {
    key: "DodgeCounterDMG",
    label: "Dodge Counter DMG",
    type: "Basic",
    talents: {
      "1": "12.00%+24.00%+84.00%",
      "2": "12.99%+25.97%+90.89%",
      "3": "13.97%+27.94%+97.78%",
      "4": "15.35%+30.70%+107.42%",
      "5": "16.33%+32.66%+114.31%",
      "6": "17.47%+34.93%+122.23%",
      "7": "19.04%+38.08%+133.25%",
      "8": "20.61%+41.22%+144.27%",
      "9": "22.19%+44.37%+155.30%",
      "10": "23.86%+47.72%+167.01%"
    }
  },
  {
    key: "EyeOfUnravelingRetractionDMG",
    label: "Eye of Unraveling - Retraction DMG",
    type: "Basic",
    talents: {
      "1": "90.00%",
      "2": "97.38%",
      "3": "104.76%",
      "4": "115.10%",
      "5": "122.48%",
      "6": "130.96%",
      "7": "142.77%",
      "8": "154.58%",
      "9": "166.39%",
      "10": "178.93%"
    }
  }
],
};
