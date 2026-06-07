export const liberationAttacks = {
  name: "Resonance Liberation: Party 'til Dawn!",
  description: `<div class="mt-3 text-sm leading-relaxed text-slate-200">Switching to <span style="color:#f7ca2f"><strong>Mk. 31 HMG</strong></span> mode generates a field of Stagnation for 9.5s, in which:<br>Rebecca fires the <span style="color:#f7ca2f"><strong>Mk. 31 HMG</strong></span> automatically, dealing <span style="color:#b45bff"><strong>Electro DMG</strong></span>, considered Basic Attack DMG, while accumulating <span style="color:#f7ca2f"><strong><a href="#WwLink130803" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="130803">Overload</a></strong></span>. <span style="color:#f7ca2f"><strong>Press or hold Normal Attack</strong></span> or <span style="color:#f7ca2f"><strong>press Resonance Liberation</strong></span> at intervals after Rebecca starts firing to enhance her <span style="color:#f7ca2f"><strong>Mk. 31 HMG</strong></span>'s firepower and accumulate <span style="color:#f7ca2f"><strong><a href="#WwLink130803" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="130803">Overload</a></strong></span> faster. This effect can be triggered up to 2 times.<br>- The machine gun will only auto-lock onto the enemy closest to the crosshair in the aim down sight.<br>- Rebecca is immobile when firing the <span style="color:#f7ca2f"><strong>Mk. 31 HMG</strong></span> and gains 50% DMG Reduction and Immunity to Interrruption.<br><br><span style="color:#a89969"><strong>Overload</strong></span><br>Rebecca can hold up to 90 points of <span style="color:#f7ca2f"><strong><a href="#WwLink130803" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="130803">Overload</a></strong></span>.<br>Hitting targets with the standard firepower <span style="color:#f7ca2f"><strong>Mk. 31 HMG</strong></span> grants 2 points.<br>Hitting targets with the enhanced firepower <span style="color:#f7ca2f"><strong>Mk. 31 HMG</strong></span> grants 4 points.<br>Hitting targets with the twice-enhanced firepower <span style="color:#f7ca2f"><strong>Mk. 31 HMG</strong></span> grants 6 points.<br><br><span style="color:#a89969"><strong>BOOM! Fireworks!</strong></span><br>After <span style="color:#f7ca2f"><strong>Mk. 31 HMG</strong></span> mode ends or when <span style="color:#f7ca2f"><strong><a href="#WwLink130803" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="130803">Overload</a></strong></span> is maxed, <span style="color:#f7ca2f"><strong>BOOM! Fireworks!</strong></span> is automatically cast, dealing <span style="color:#b45bff"><strong>Electro DMG</strong></span>. Casting <span style="color:#f7ca2f"><strong>BOOM! Fireworks!</strong></span> ends  <span style="color:#f7ca2f"><strong>Mk. 31 HMG</strong></span>.<br>- <span style="color:#f7ca2f"><strong>Hold Resonance Liberation</strong></span> while in <span style="color:#f7ca2f"><strong>Mk. 31 HMG</strong></span> mode to immediatly cast <span style="color:#f7ca2f"><strong>BOOM! Fireworks!</strong></span>.<br>- Leaving the <span style="color:#f7ca2f"><strong>Mk. 31 HMG</strong></span> mode removes all <span style="color:#f7ca2f"><strong><a href="#WwLink130803" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="130803">Overload</a></strong></span>.</div>`,
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
