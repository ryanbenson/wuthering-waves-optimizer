export const skillAttacks = {
  name: "Resonance Skill: Restless Watch",
  description: `<div class="skilldescription">
  <span class="Title">Standard Defense Protocol</span><br />
  Attack the target to deal <span class="Light">Spectro DMG</span> and enter a block stance. This state ends early if Zani is switched off the field. Press <span class="Highlight">Normal Attack</span> within a certain time to perform
  <span class="Highlight">Basic Attack Stage 3</span>, recovering 10 points of Redundant Energy and Stagnating the target on hit.<br />
  When attacked by the enemy in the block stance, reduce this instance of damage by 100% and Stagnate nearby targets, then cast Resonance Skill <span class="Highlight">Pinpoint Strike</span>, dealing
  <span class="Light">Spectro DMG</span> and additionally reducing their Vibration Strength by 5%. The DMG taken by Zani is reduced by 30% within the next 2s.<br />
  <span class="Title">Crisis Response Protocol</span><br />
  When Zani is not in <span class="Highlight">Inferno Mode</span> and has full Redundant Energy, her <span class="Highlight">Resonance Skill</span> is replaced with Resonance Skill <span class="Highlight">Crisis Response Protocol</span>.
  <br />
  Hold <span class="Highlight">Resonance Skill</span> to enter <span class="Highlight">Ready Stance</span>. While in <span class="Highlight">Ready Stance</span>, Zani is immune to interruption. This state ends early if Zani is switched off
  the field. After releasing <span class="Highlight">Resonance Skill</span> button or when the stance duration ends, consume all Redundant Energy to cast <span class="Highlight">Targeted Action</span>, dealing
  <span class="Light">Spectro DMG</span>, which is also considered <span class="Highlight">Spectro Frazzle</span> DMG. <br />
  When attacked by the enemy in <span class="Highlight">Ready Stance</span>, reduce this instance of damage by 100% and consume all Redundant Energy to cast <span class="Highlight">Forcible Riposte</span>, dealing
  <span class="Light">Spectro DMG</span> (also considered <span class="Highlight">Spectro Frazzle</span> DMG), Stagnating the target, and further reducing their Vibration Strength by 5%. The DMG taken by Zani is reduced by 30% within the next 2s.<br />
  Casting <span class="Highlight">Targeted Action</span> or <span class="Highlight">Forcible Riposte</span> sends Zani into <span class="Highlight">Sunburst</span> mode and inflicts a stack of Heliacal Ember upon the target on hit. The last stage of the attack recovers Blaze.<br />
  <span class="Title">Sunburst</span><br />
  The <span class="Highlight">Spectro Frazzle</span> DMG dealt by Zani to the target is Amplified by 20%.
</div>
`,
  attacks: [
    {
      key: "StandardDefenseProtocolDMG",
      label: "Standard Defense Protocol DMG",
      type: "Skill",
      talents: {
        "1": "32.16%",
        "2": "34.80%",
        "3": "37.44%",
        "4": "41.13%",
        "5": "43.77%",
        "6": "46.80%",
        "7": "51.02%",
        "8": "55.24%",
        "9": "59.46%",
        "10": "63.94%",
      },
    },
    {
      key: "PinpointStrikeDMG",
      label: "Pinpoint Strike DMG",
      type: "Skill",
      talents: {
        "1": "30.68% + 61.36%",
        "2": "33.20% + 66.40%",
        "3": "35.72% + 71.43%",
        "4": "39.24% + 78.47%",
        "5": "41.75% + 83.50%",
        "6": "44.65% + 89.29%",
        "7": "48.67% + 97.34%",
        "8": "52.70% + 105.39%",
        "9": "56.72% + 113.44%",
        "10": "61.00% + 121.99%",
      },
    },
    {
      key: "TargetedActionDMG",
      label: "Targeted Action DMG",
      type: "Skill",
      subType: "SpectroFrazzle",
      talents: {
        "1": "43.35% + 14.45% + 86.70%",
        "2": "46.91% + 15.64% + 93.81%",
        "3": "50.46% + 16.82% + 100.92%",
        "4": "55.44% + 18.48% + 110.88%",
        "5": "59.00% + 19.67% + 117.99%",
        "6": "63.08% + 21.03% + 126.16%",
        "7": "68.77% + 22.93% + 137.54%",
        "8": "74.46% + 24.82% + 148.91%",
        "9": "80.15% + 26.72% + 160.29%",
        "10": "86.19% + 28.73% + 172.37%",
      },
    },
    {
      key: "ForcibleRiposteDMG",
      label: "Forcible Riposte DMG",
      type: "Skill",
      subType: "SpectroFrazzle",
      talents: {
        "1": "43.35% + 14.45% + 86.70%",
        "2": "46.91% + 15.64% + 93.81%",
        "3": "50.46% + 16.82% + 100.92%",
        "4": "55.44% + 18.48% + 110.88%",
        "5": "59.00% + 19.67% + 117.99%",
        "6": "63.08% + 21.03% + 126.16%",
        "7": "68.77% + 22.93% + 137.54%",
        "8": "74.46% + 24.82% + 148.91%",
        "9": "80.15% + 26.72% + 160.29%",
        "10": "86.19% + 28.73% + 172.37%",
      },
    },
  ],
};
