export const liberationAttacks = {
  name: "Resonance Liberation: Beneath the Sea",
  description: `<div class="skilldescription"><span class="Title">Flowing Suffocation</span><br>Attack the target, dealing <span class="Dark">Havoc DMG</span> (considered Basic Attack DMG). Inflict <span class="Highlight">Diffusion</span> on all Resonators in the team. Casting this skill is also considered as casting <span class="Highlight">Echo Skill</span>.<br>Can be cast in mid-air close to the ground.<br> <br><span class="Title">Diffusion</span><br>When the Resonator on the field deals damage to a target, summon <span class="Highlight">Dreamweavers</span> to perform Coordinated Attack, dealing <span class="Dark">Havoc DMG</span> (considered as Basic Attack DMG).<br>- Within 3s after the Resonator deals damage, summon 1 <span class="Highlight">Dreamweaver</span> per second. This effect can be triggered once per second. Damage dealt by <span class="Highlight">Dreamweavers</span> cannot trigger this effect.<br>- Up to 1 <span class="Highlight">Dreamweaver</span> can be summoned each second, max 21 <span class="Highlight">Dreamweavers</span> in total.<br>- This effect lasts for 30s or until reaching the maximum number of <span class="Highlight">Dreamweavers</span>.</div>`,
  attacks: [
    {
      key: "FlowingSuffocationDMG",
      label: "Flowing Suffocation DMG",
      talents: {
        "1": "189.13%",
        "2": "204.64%",
        "3": "220.15%",
        "4": "241.86%",
        "5": "257.37%",
        "6": "275.20%",
        "7": "300.01%",
        "8": "324.83%",
        "9": "349.64%",
        "10": "376.00%"
      },
      type: "Basic"
    },
    {
      key: "DiffusionDMG",
      label: "Diffusion DMG",
      talents: {
        "1": "7.31%*21",
        "2": "7.91%*21",
        "3": "8.51%*21",
        "4": "9.35%*21",
        "5": "9.95%*21",
        "6": "10.64%*21",
        "7": "11.60%*21",
        "8": "12.56%*21",
        "9": "13.52%*21",
        "10": "14.54%*21"
      },
      type: "Basic",
      subType: "Coordinated",
    }
  ],  
};
