export const basicAttacks = {
  name: "Blazing Enlightment",
  description:
    '<div class="skilldescription"><span class="Title">Basic Attack</span><br>Perform up to 4 consecutive attacks, dealing <span class="Fire">Fusion DMG</span>.<br>After releasing <span class="Highlight">Ground Basic Attack Stage 4</span>, Changli enters <span class="Highlight">True Sight</span>, lasting for 12s.<br><span class="Title">Mid-air Attack</span><br>Consume Stamina to perform up to 4 consecutive attacks in mid-air, dealing <span class="Fire">Fusion DMG</span>.<br>After releasing <span class="Highlight">Mid-air Attack Stage 4</span>, Changli enters <span class="Highlight">True Sight</span>, lasting for 12s.<br><span class="Title">Heavy Attack</span><br>Hold <span class="Highlight">Basic Attack</span> on the ground to consume Stamina to perform an upward strike, dealing <span class="Fire">Fusion DMG</span>. Use <span class="Highlight">Basic Attack</span> within a certain time to release <span class="Highlight">Mid-air Attack Stage 3</span>.<br><span class="Title">Mid-air Heavy Attack</span><br>Shortly after holding <span class="Highlight">Basic Attack</span> in mid-air or using Basic Attack <span class="Highlight">True Sight: Charge</span>, use <span class="Highlight">Basic Attack</span> to consume Stamina to perform a Plunging Attack, dealing <span class="Fire">Fusion DMG</span>. Use <span class="Highlight">Basic Attack</span> within a certain time to release <span class="Highlight">Basic Attack Stage 3</span>.<br><span class="Title">Dodge Counter</span><br>Use <span class="Highlight">Basic Attack</span> after a successful <span class="Highlight">Dodge</span> to attack the target, dealing <span class="Fire">Fusion DMG</span>.</div>',
  attacks: [
    {
      key: "BasicAttack1DMG",
      label: "Basic Attack 1 DMG",
      talents: {
        "1": "14.84%*2",
        "2": "16.05%*2",
        "3": "17.27%*2",
        "4": "18.97%*2",
        "5": "20.19%*2",
        "6": "21.59%*2",
        "7": "23.53%*2",
        "8": "25.48%*2",
        "9": "27.43%*2",
        "10": "29.49%*2",
      },
      type: "Basic",
    },
    {
      key: "BasicAttack2DMG",
      label: "Basic Attack 2 DMG",
      talents: {
        "1": "17.85%*2",
        "2": "19.32%*2",
        "3": "20.78%*2",
        "4": "22.83%*2",
        "5": "24.30%*2",
        "6": "25.98%*2",
        "7": "28.32%*2",
        "8": "30.66%*2",
        "9": "33.00%*2",
        "10": "35.49%*2",
      },
      type: "Basic",
    },
  ],
};
