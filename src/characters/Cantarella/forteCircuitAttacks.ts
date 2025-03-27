export const forteCircuitAttacks = {
  name: "Forte Circuit: Between Illusion and Reality",
  description: `<div class="skilldescription"><span class="Title">Mirage</span><br>- <span class="Highlight">Basic Attack</span> becomes Basic Attack <span class="Highlight">Phantom Sting</span>. Perform up to 3 consecutive attacks, dealing <span class="Dark">Havoc DMG</span>. Can be cast in mid-air. When cast mid-air, Basic Attack <span class="Highlight">Phantom Sting</span> consumes STA, and the combo does not reset when Cantarella is airborne.<br>- Hitting the target with Basic Attack <span class="Highlight">Phantom Sting</span> consumes 1 point of Trance to obtain 1 point of Shiver and heal all nearby Resonators in the team.<br>- The third stage of Basic Attack <span class="Highlight">Phantom Sting</span> triggers 3 Coordinated Attacks, dealing <span class="Dark">Havoc DMG</span>.<br>- <span class="Highlight">Mid-air Attack</span> becomes <span class="Highlight">Abysmal Vortex</span>. Press <span class="Highlight">Jump</span> to perform a Plunging Attack at the cost of STA, dealing <span class="Dark">Havoc DMG</span>.<br>- <span class="Highlight">Dodge Counter</span> becomes Dodge Counter <span class="Highlight">Shadowy Sweep</span>. Attack the target, dealing <span class="Dark">Havoc DMG</span>. Press <span class="Highlight">Normal Attack</span> right after casting the skill to cast Basic Attack <span class="Highlight">Phantom Sting Stage 2</span>.<br>- When Mid-air Attack <span class="Highlight">Abysmal Vortex</span> or Dodge Counter <span class="Highlight">Shadowy Sweep</span> hits a target, consume 1 point of Trance to obtain 1 point of Shiver and heal all nearby Resonators in the team.<br>- Mirage lasts for 8s.<br>- <span class="Highlight">Mirage</span> ends when Trance is depleted.<br> <br><span class="Title">Forte Circuit - Perception Drain</span><br>If Cantarella has 3 point of Shiver when in <span class="Highlight">Mirage</span>, <span class="Highlight">Resonance Skill</span> becomes <span class="Highlight">Perception Drain</span>.<br>Consume all Shiver to attack the target, dealing <span class="Dark">Havoc DMG</span>, considered Basic Attack DMG. Send the target into <span class="Highlight">Hazy Dream</span> and heal all Resonators in the team.<br>Casting this skill is also considered as casting <span class="Highlight">Echo Skill</span>.<br>Can be cast in mid-air.<br> <br><span class="Title">Abyssal Rebirth</span><br>After casting <span class="Highlight">Intro Skill</span>, Cantarella enters <span class="Highlight">Abyssal Rebirth</span>, which lasts for 25s and can be activated once every 25s. In the duration, for up to 6 times, when Resonators in the team cast <span class="Highlight">Echo Skill</span>, Cantarella recovers 6 point of Concerto Energy. Echoes with the same name can only trigger this effect once.<br>When in water, Cantarella's swimming speed increases and STA cost decreases.<br> <br><span class="Title">Trance</span><br>- Cantarella can hold up to 5 points of Trance.<br>- Casting <span class="Highlight">Intro Skill</span> recovers 1 point of Trance.<br>- Hitting a target with <span class="Highlight">Basic Attack Stage 3</span> recovers 1 point of Trance.<br>- Casting Resonance Skill <span class="Highlight">Graceful Step</span> recovers 1 point of Trance.<br>- Casting Resonance Liberation <span class="Highlight">Flowing Suffocation</span> recovers 3 point of Trance.<br>- When in the water, recover 1 point of Trance every 5s.<br> <br><span class="Title">Shiver</span><br>- Cantarella can hold up to 3 points of Shiver.<br>- Hitting the target with Basic Attack <span class="Highlight">Phantom Sting</span> recovers 1 point of Shiver.<br>- When Mid-air Attack <span class="Highlight">Abysmal Vortex</span> or Dodge Counter <span class="Highlight">Shadowy Sweep</span> hits a target, restore 1 point of Shiver.</div>`,
  attacks: [
    {
      key: "PhantomStingStage1DMG",
      label: "Phantom Sting Stage 1 DMG",
      talents: {
        "1": "17.77%*3",
        "2": "19.23%*3",
        "3": "20.69%*3",
        "4": "22.73%*3",
        "5": "24.18%*3",
        "6": "25.86%*3",
        "7": "28.19%*3",
        "8": "30.52%*3",
        "9": "32.85%*3",
        "10": "35.33%*3"
      },
      type: "Basic"
    },
    {
      key: "PhantomStingStage2DMG",
      label: "Phantom Sting Stage 2 DMG",
      talents: {
        "1": "31.65%*2",
        "2": "34.25%*2",
        "3": "36.85%*2",
        "4": "40.48%*2",
        "5": "43.07%*2",
        "6": "46.06%*2",
        "7": "50.21%*2",
        "8": "54.36%*2",
        "9": "58.52%*2",
        "10": "62.93%*2"
      },
      type: "Basic"
    },
    {
      key: "PhantomStingStage3DMG",
      label: "Phantom Sting Stage 3 DMG",
      talents: {
        "1": "32.50%*4",
        "2": "35.17%*4",
        "3": "37.83%*4",
        "4": "41.57%*4",
        "5": "44.23%*4",
        "6": "47.30%*4",
        "7": "51.56%*4",
        "8": "55.82%*4",
        "9": "60.09%*4",
        "10": "64.62%*4"
      },
      type: "Basic",
      subType: "Coordinated",
    },
    {
      key: "AbysmalVortexDMG",
      label: "Abysmal Vortex DMG",
      talents: {
        "1": "21.12% + 31.68%",
        "2": "22.86% + 34.28%",
        "3": "24.59% + 36.88%",
        "4": "27.01% + 40.52%",
        "5": "28.75% + 43.12%",
        "6": "30.74% + 46.10%",
        "7": "33.51% + 50.26%",
        "8": "36.28% + 54.42%",
        "9": "39.05% + 58.57%",
        "10": "41.99% + 62.99%"
      },
      type: "Basic"
    },
    {
      key: "PerceptionDrainDMG",
      label: "Perception Drain DMG",
      talents: {
        "1": "336.00%*2",
        "2": "363.55%*2",
        "3": "391.10%*2",
        "4": "429.67%*2",
        "5": "457.22%*2",
        "6": "488.91%*2",
        "7": "532.99%*2",
        "8": "577.07%*2",
        "9": "621.15%*2",
        "10": "667.99%*2"
      },
      type: "Basic"
    },
    {
      key: "ShadowySweepDMG",
      label: "Shadowy Sweep DMG",
      talents: {
        "1": "37.77%*3",
        "2": "40.87%*3",
        "3": "43.97%*3",
        "4": "48.30%*3",
        "5": "51.40%*3",
        "6": "54.96%*3",
        "7": "59.91%*3",
        "8": "64.87%*3",
        "9": "69.82%*3",
        "10": "75.09%*3"
      },
      type: "Basic"
    },
    {
      key: "HealingByConsumingTrance",
      label: "Healing by Consuming Trance",
      talents: {
        "1": "90 + 21.60%",
        "2": "100 + 22.46%",
        "3": "112 + 23.33%",
        "4": "126 + 24.62%",
        "5": "142 + 26.35%",
        "6": "157 + 28.08%",
        "7": "160 + 31.32%",
        "8": "163 + 34.99%",
        "9": "166 + 38.88%",
        "10": "171 + 45.36%"
      },
      type: "Healing"
    },
    {
      key: "PerceptionDrainHealing",
      label: "Perception Drain Healing",
      talents: {
        "1": "375 + 90.00%",
        "2": "420 + 93.60%",
        "3": "468 + 97.20%",
        "4": "525 + 102.60%",
        "5": "592 + 109.80%",
        "6": "656 + 117.00%",
        "7": "667 + 130.50%",
        "8": "682 + 145.80%",
        "9": "693 + 162.00%",
        "10": "712 + 189.00%"
      },
      type: "Healing"
    }
  ],
};
