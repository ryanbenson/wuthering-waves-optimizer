export const forteCircuitAttacks = {
  name: "Forte Circuit: Lethal Repertoire",
  description: `<div class="skilldescription"><span class="Title">Heavy Attack - Imminent Oblivion</span><br>Carlotta activates <span class="Highlight">Tinted Crystal</span> every 22s.<br>When Substance is full and <span class="Highlight">Tinted Crystal</span> is activated, hold <span class="Highlight">Normal Attack</span> to consume all Substance and cast Heavy Attack <span class="Highlight">Imminent Oblivion</span>, after which <span class="Highlight">Tinted Crystal</span> enters cooldown. <br>Deal <span class="Ice">Glacio DMG</span> (considered Resonance Skill DMG), reduce the cooldown of Resonance Skill <span class="Highlight">Art of Violence</span> by 6s, and enter <span class="Highlight">Grand Unveiling</span> state.<br> <br><span class="Title">Grand Unveiling</span><br>Increase the DMG Multiplier of Resonance Liberation <span class="Highlight">Era of New Wave </span>, Resonance Liberation <span class="Highlight">Death Knell</span>, Resonance Liberation <span class="Highlight">Fatal Finale</span> by 80%. Switching to other Resonators ends this effect.<br><span class="Title">Substance</span><br>Carlotta can hold up to 120 points of Substance.<br>Cannot gain Substance while in <span class="Highlight">Twilight Tango</span> triggered by Resonance Liberation.<br>Restore <saptag=3>30 point of Substance upon casting Intro Skill <span class="Highlight">Wintertime Aria</span>.<br>Restore <saptag=5>10 point of Substance for every <saptag=4>1 Moldable Crystal consumed upon casting Resonance Skill <span class="Highlight">Chromatic Splendor</span>.<br>Restore <saptag=5>10 point of Substance for every <saptag=4>1 Moldable Crystal consumed upon casting Basic Attack <span class="Highlight">Necessary Measures</span>.<br>Consume <saptag=4>1 Moldable Crystal and restore <saptag=12>10 point of Substance upon casting <span class="Highlight">Dodge Counter</span>.<br> <br><span class="Title">Moldable Crystal</span><br>Carlotta can hold up to 6 Moldable Crystals.<br>Cannot gain Moldable Crystal while in <span class="Highlight">Twilight Tango</span> triggered by Resonance Liberation.<br>Restore <saptag=7>3 Moldable Crystal upon casting <span class="Highlight">Basic Attack Stage 2</span>.<br>Restore <saptag=11>3 Moldable Crystal upon casting <span class="Highlight">Heavy Attack</span>.<br>Restore <saptag=8>3 Moldable Crystal upon casting Mid-air Attack <span class="Highlight">Customary Greetings</span>.<br>Restore <saptag=13>3 Moldable Crystal upon casting Intro Skill <span class="Highlight">Wintertime Aria</span>.<br>Restore <saptag=9>3 Moldable Crystal upon casting Resonance Skill <span class="Highlight">Art of Violence</span>.<br>Restore <saptag=10>3 Moldable Crystal upon a successful <span class="Highlight">Dodge</span>.</saptag=10></saptag=9></saptag=13></saptag=8></saptag=11></saptag=7></saptag=12></saptag=4></saptag=4></saptag=5></saptag=4></saptag=5></saptag=3></div>`,
  attacks: [
    {
      key: "ImminentOblivionDMG",
      label: "Imminent Oblivion DMG",
      talents: {
        "1": "33.62% * 5 + 252.11%",
        "2": "36.38% * 5 + 272.78%",
        "3": "39.13% * 5 + 293.45%",
        "4": "42.99% * 5 + 322.39%",
        "5": "45.75% * 5 + 343.07%",
        "6": "48.92% * 5 + 366.84%",
        "7": "53.33% * 5 + 399.92%",
        "8": "57.74% * 5 + 432.99%",
        "9": "62.15% * 5 + 466.07%",
        "10": "66.83% * 5 + 501.21%",
      },
      type: "Skill",
    },
  ],
};
