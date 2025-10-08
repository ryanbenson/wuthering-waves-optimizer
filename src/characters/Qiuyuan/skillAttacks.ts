export const skillAttacks = {
  name: "Resonance Skill: Through the Groves",
  description: `<div>Press <span class="ingame-Highlight">Resonance Skill</span> to dash forward for a distance, dealing <span class="ingame-Wind">Aero DMG</span>, considered as Echo Skill DMG. If Resonance Skill is cast upon being attacked by an enemy target, Qiuyuan slows down nearby enemies and takes 100% less DMG while gaining immunity to interruptions during the action.<br>Switching to other Resonators removes the slowdown effect from enemies.<br><span class="ww-wiki-font-bold"></span><br><span class="ww-wiki-font-bold"><span class="ingame-Title">Undaunted Wayfarer</span></span><br>Hold <span class="ingame-Highlight">Resonance Skill</span> to dash forward for a distance at the cost of STA, dealing <span class="ingame-Wind">Aero DMG</span> to the target, considered as Echo Skill DMG.<br>If there are no targets nearby, Qiuyuan will leap up and dash through the air by continuously consuming STA until it runs out. Release <span class="ingame-Highlight">Resonance Skill</span> to immediately end the dash and land. If there are targets nearby when Qiuyuan lands, deal <span class="ingame-Wind">Aero DMG</span> to nearby targets, considered as Echo Skill DMG. This skill can be cast in mid-air.</div>`,
  attacks: [
    {
      key: "HarmonicAllegroDMG",
      label: "Harmonic Allegro DMG",
      type: "Skill",
      talents: {
        "1": "20.32%*4",
        "2": "21.98%*4",
        "3": "23.65%*4",
        "4": "25.98%*4",
        "5": "27.65%*4",
        "6": "29.56%*4",
        "7": "32.23%*4",
        "8": "34.89%*4",
        "9": "37.56%*4",
        "10": "40.39%*4",
      },
    },
  ],
};
