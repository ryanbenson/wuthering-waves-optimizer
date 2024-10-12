export const skillAttacks = {
  name: "Resonance Skill: Light Searchlight",
  description: `<div class="skilldescription">
  <span class="Highlight">Lunge</span><br>
During <span class="Highlight">Yellow Light mode</span>, <span class="Highlight">Resonance Skill</span> is replaced with <span class="Highlight">Lunge</span>, consuming Stamina, Lumi lunges towards the target’s direction to perform a claw attack, then switches to <span class="Highlight">Red Light mode</span>.
<br><br>
<span class="Highlight">Backstep</span><br>
During <span class="Highlight">Red Light mode</span>, <span class="Highlight">Resonance Skill</span> is replaced with <span class="Highlight">Backstep</span>, consuming Stamina, Lumi steps backwards, attacking the target, then switches to <span class="Highlight">Yellow Light mode</span>.
<br><br>
<span class="Highlight">Yellow Light mode</span><br>
During <span class="Highlight">Yellow Light mode</span>, performs ranged attacks, unable to cast <span class="Highlight">Dodge Counter</span> and <span class="Highlight">Resonance Liberation</span>.
<br><br>
<span class="Highlight">Red Light mode</span><br>
During <span class="Highlight">Red Light mode</span>, performs melee attacks, able to cast <span class="Highlight">Dodge Counter</span> and <span class="Highlight">Resonance Liberation</span>.</div>`,
  attacks: [
    {
      key: "LungeDamage",
      label: "Lunge DMG",
      talents: {
        "1": "91.20%",
        "2": "98.68%",
        "3": "106.16%",
        "4": "116.63%",
        "5": "124.11%",
        "6": "132.71%",
        "7": "144.68%",
        "8": "156.64%",
        "9": "168.61%",
        "10": "181.32%",
      },
      type: "Skill",
    },
    {
      key: "BackstepDamage",
      label: "Backstep DMG",
      talents: {
        "1": "87.40%",
        "2": "94.57%",
        "3": "101.74%",
        "4": "111.77%",
        "5": "118.94%",
        "6": "127.18%",
        "7": "138.65%",
        "8": "150.11%",
        "9": "161.58%",
        "10": "173.76%",
      },
      type: "Skill",
    },
  ],
};
