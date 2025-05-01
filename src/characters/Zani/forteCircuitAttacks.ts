export const forteCircuitAttacks = {
  name: "Forte Circuit: There Will Be A Light",
  description: `<div class="skilldescription"><span class="Title">Heliacal Ember</span>
    <br>When Zani is in the team and a nearby Resonator inflicts <span class="Highlight">Spectro Frazzle</span> upon a target, immediately consume all Spectro Frazzle stacks and trigger the corresponding DMG, then convert Spectro Frazzle into an equal number
    of Heliacal Embers. Every time the conversion happens, Zani obtains Blaze based on the stacks of Heliacal Ember inflicted. Heliacal Ember is capped at 60 stacks, with each stack lasting for 6s. Heliacal Ember stacks are counted toward the Spectro
    Frazzle stacks for the Eternal Radiance Sonata Effect.
    <br><span class="Title">Scorching Light</span>
    <br>When Zani is in <span class="Highlight">Inferno Mode</span>, <span class="Highlight">Heavy Slash - Daybreak</span>, <span class="Highlight">Heavy Slash - Dawning</span>, <span class="Highlight">Heavy Slash - Nightfall</span>, and <span class="Highlight">Heavy Slash - Lightsmash</span>    become available, which deal <span class="Light">Spectro DMG</span> that is considered both Heavy Attack DMG and <span class="Highlight">Spectro Frazzle</span> DMG.
    <br>When Blaze is no less than 30, Resonance Skill <span class="Highlight">Standard Defense Protocol</span> is replaced with Resonance Skill <span class="Highlight">Scorching Light</span>.
    <br>Hold <span class="Highlight">Resonance Skill</span> to enter <span class="Highlight">Ready Stance</span>, during which Zani is immune to interruption. This state ends early when Zani is switched off the field. Release <span class="Highlight">Resonance Skill</span> button  within a certain time to consume Blaze and perform <span class="Highlight">Heavy Slash - Daybreak</span>.
    <br>When attacked in a certain time after entering <span class="Highlight">Ready Stance</span>, reduce this instance of damage by 100% and Stagnate nearby targets, then perform <span class="Highlight">Heavy Slash - Lightsmash</span>, consuming Blazes
    and further reducing their Vibration Strength by 10%. The DMG taken within the next 2s is reduced by 30%.
    <br>After casting <span class="Highlight">Heavy Slash - Lightsmash</span>, <span class="Highlight">Basic Attack</span> is replaced with <span class="Highlight">Heavy Slash - Nightfall</span>, consuming up to 40 Blazes on hit, with each Blaze increasing
    the DMG Multiplier of <span class="Highlight">Heavy Slash - Nightfall</span>. If <span class="Highlight">Heavy Slash - Nightfall</span> Stage 1 is interrupted, press Basic Attack again to cast <span class="Highlight">Heavy Slash - Nightfall</span> Stage 2.<br>
    <br>When Blaze is no less than 30, <span class="Highlight">Basic Attack</span> is replaced with <span class="Highlight">Heavy Slash - Daybreak</span>. After entering <span class="Highlight">Inferno Mode</span>, casting <span class="Highlight">Basic Attack</span>    immediately replaces the current <span class="Highlight">Basic Attack</span> with Resonance Skill <span class="Highlight">Scorching Light</span>. Hold <span class="Highlight">Basic Attack</span> to enter <span class="Highlight">Ready Stance</span>.
    <br>After performing <span class="Highlight">Heavy Slash - Daybreak</span>, press <span class="Highlight">Basic Attack</span> to perform <span class="Highlight">Heavy Slash - Dawning</span> at the cost of Blaze.
    <br>After performing <span class="Highlight">Heavy Slash - Dawning</span>, <span class="Highlight">Basic Attack</span> is replaced with <span class="Highlight">Heavy Slash - Nightfall</span>.
    <br>If <span class="Highlight">Basic Attack</span> is not replaced with <span class="Highlight">Heavy Slash - Nightfall</span> after a successful Dodge and Zani has no less than 30 Blazes, press <span class="Highlight">Normal Attack</span> within a certain time to perform <span class="Highlight">Heavy Slash - Lightsmash</span>    at the cost of Blazes.
    <br><span class="Title">Redundant Energy</span>
    <br>Zani can hold up to 100 Redundant Energy.
    <br>Obtain Redundant Energy when Normal Attacks hit a target.
    <br>Obtain Redundant Energy when Intro Skill <span class="Highlight">Immediate Execution</span> hits a target.
    <br>Obtain Redundant Energy when casting Resonance Skill <span class="Highlight">Standard Defense Protocol</span>.
    <br>Obtain Redundant Energy when casting <span class="Highlight">Pinpoint Strike</span>.
    <br>Cannot obtain Redundant Energy while in <span class="Highlight">Inferno Mode</span>.
    <br><span class="Title">Blaze</span>
    <br>Blaze is capped at 100 when not in <span class="Highlight">Inferno Mode</span>.
    <br>Blaze is capped at 150 in <span class="Highlight">Inferno Mode</span>.
    <br>Casting <span class="Highlight">Targeted Action</span> or <span class="Highlight">Forcible Riposte</span> grants 10 Blazes.
    <br>Every stack of Heliacal Ember converted from <span class="Highlight">Spectro Frazzle</span> grants 5 Blazes.
    <br>Casting Resonance Liberation <span class="Highlight">Rekindle</span> grants 50 Blazes.</div>`,
  attacks: [
    {
      key: "HeavySlashDaybreakDMG",
      label: "Heavy Slash - Daybreak DMG",
      type: "Heavy",
      subType: "SpectroFrazzle",
      talents: {
        "1": "25.00% + 60.00% + 15.00%",
        "2": "27.75% + 66.59% + 16.65%",
        "3": "30.49% + 73.18% + 18.30%",
        "4": "33.24% + 79.76% + 19.94%",
        "5": "35.98% + 86.35% + 21.59%",
        "6": "38.73% + 92.94% + 23.24%",
        "7": "41.47% + 99.53% + 24.89%",
        "8": "44.22% + 106.11% + 26.53%",
        "9": "46.96% + 112.70% + 28.18%",
        "10": "49.71% + 119.29% + 29.83%"
      },
    },
    {
      key: "HeavySlashDawningDMG",
      label: "Heavy Slash - Dawning DMG",
      type: "Heavy",
      subType: "SpectroFrazzle",
      talents: {
        "1": "74.66%*2 + 17.07% + 23.47%*2",
        "2": "82.86%*2 + 18.94% + 26.05%*2",
        "3": "91.05%*2 + 20.82% + 28.62%*2",
        "4": "99.25%*2 + 22.69% + 31.20%*2",
        "5": "107.45%*2 + 24.56% + 33.77%*2",
        "6": "115.64%*2 + 26.44% + 36.35%*2",
        "7": "123.84%*2 + 28.31% + 38.92%*2",
        "8": "132.04%*2 + 30.18% + 41.50%*2",
        "9": "140.23%*2 + 32.06% + 44.07%*2",
        "10": "148.43%*2 + 33.93% + 46.65%*2"
      },
    },
    {
      key: "HeavySlashNightfallDMG",
      label: "Heavy Slash - Nightfall DMG",
      type: "Heavy",
      subType: "SpectroFrazzle",
      talents: {
        "1": "26.0% + 26.0% + 8.0%*2 + 40.0% + 4.0%*2 + 14.0% + 70.0%",
        "2": "28.87% + 28.87% + 9.32%*2 + 45.5% + 4.44%*2 + 15.54% + 77.13%",
        "3": "31.74% + 31.74% + 10.63%*2 + 51.0% + 4.89%*2 + 17.08% + 84.25%",
        "4": "34.61% + 34.61% + 11.94%*2 + 56.5% + 5.33%*2 + 18.62% + 91.38%",
        "5": "37.48% + 37.48% + 13.26%*2 + 62.01% + 5.78%*2 + 20.16% + 98.50%",
        "6": "40.35% + 40.35% + 14.57%*2 + 67.51% + 6.22%*2 + 21.70% + 105.63%",
        "7": "43.22% + 43.22% + 15.88%*2 + 73.01% + 6.67%*2 + 23.24% + 112.75%",
        "8": "46.09% + 46.09% + 17.20%*2 + 78.51% + 7.11%*2 + 24.78% + 119.88%",
        "9": "48.96% + 48.96% + 18.51%*2 + 84.01% + 7.56%*2 + 26.32% + 127.00%",
        "10": "51.7% + 51.7% + 15.91%*2 + 79.53% + 7.96%*2 + 27.84% + 139.17%"
      },
    },
    {
      key: "HeavySlashLightsmashDMG",
      label: "Heavy Slash - Lightsmash DMG",
      type: "Heavy",
      subType: "SpectroFrazzle",
      talents: {
        "1": "74.66%*2 + 17.07% + 23.47%*2",
        "2": "82.86%*2 + 18.94% + 26.05%*2",
        "3": "91.05%*2 + 20.82% + 28.62%*2",
        "4": "99.25%*2 + 22.69% + 31.20%*2",
        "5": "107.45%*2 + 24.56% + 33.77%*2",
        "6": "115.64%*2 + 26.44% + 36.35%*2",
        "7": "123.84%*2 + 28.31% + 38.92%*2",
        "8": "132.04%*2 + 30.18% + 41.50%*2",
        "9": "140.23%*2 + 32.06% + 44.07%*2",
        "10": "148.43%*2 + 33.93% + 46.65%*2"
      },
    },
  ],
};
