export const forteCircuitAttacks = {
  name: "Forte Circuit: Verdant Edge",
  description: `<div><span class="ww-wiki-font-bold"><span class="ingame-Title">Basic Attack - Thus Spoke the Blade: Inkwash</span></span><br>When Qiuyuan reaches 200 points of <te href="141101">Swordster's Soliloquy</te>, his <span class="ingame-Highlight">Basic Attack</span> is replaced with Basic Attack <span class="ingame-Highlight">Thus Spoke the Blade: Inkwash</span>, which chains together up to 4 consecutive strikes, dealing <span class="ingame-Wind">Aero DMG</span>, considered as Heavy Attack DMG.<br><span class="ww-wiki-font-bold"></span><br><span class="ww-wiki-font-bold"><span class="ingame-Title">Bamboo's Shade</span></span><br>When Qiuyuan reaches 400 points of <te href="141101">Swordster's Soliloquy</te>, he gains the <span class="ingame-Highlight">Bamboo's Shade</span> effect, granting all nearby active Resonators in the team 30% Echo Skill DMG Bonus for 30s.<br><span class="ww-wiki-font-bold"></span><br><span class="ww-wiki-font-bold"><span class="ingame-Title">Inksplash of Mind</span></span><br>When <te href="141101">Swordster's Soliloquy</te> is full, Qiuyuan enters the <span class="ingame-Highlight">Inksplash of Mind</span> state for 8s, during which <span class="ingame-Highlight">Heavy Attack</span> is replaced with Heavy Attack <span class="ingame-Highlight">Thus Spoke the Blade: To Save</span>.<br>In this state, hold <span class="ingame-Highlight">Normal Attack</span> to consume Swordster's Soliloquy to perform Heavy Attack <span class="ingame-Highlight">Thus Spoke the Blade: To Teach</span>, <span class="ingame-Highlight">Thus Spoke the Blade: To Save</span>, and <span class="ingame-Highlight">Thus Spoke the Blade: To Sacrifice</span> in order, dealing <span class="ingame-Wind">Aero DMG</span>, considered as Heavy Attack DMG.<br>- Performing <span class="ingame-Highlight">Thus Spoke the Blade: To Teach</span>, <span class="ingame-Highlight">Thus Spoke the Blade: To Save</span>, or <span class="ingame-Highlight">Thus Spoke the Blade: To Sacrifice</span> is considered as performing <span class="ingame-Highlight">Echo Skill</span>.<br>- Inksplash of Mind ends when Swordster's Soliloquy is used up.<br><span class="ww-wiki-font-bold"></span><br><span class="ww-wiki-font-bold"><span class="ingame-Title">Swordster's Soliloquy</span></span><br>Qiuyuan can hold up to 600 points of Swordster's Soliloquy.<br>- 100 points of Swordster's Soliloquy is obtained when performing <span class="ingame-Highlight">Basic Attack</span> Stage 3.<br>- 100 points of Swordster's Soliloquy is obtained when performing each stage of Basic Attack <span class="ingame-Highlight">Thus Spoke the Blade: Inkwash</span>.<br>- 100 points of Swordster's Soliloquy is obtained when performing <span class="ingame-Highlight">Dodge Counter</span>.<br>- 400 points of Swordster's Soliloquy is obtained when performing <span class="ingame-Highlight">Intro Skill</span>.<br>- Swordster's Soliloquy cannot be obtained in the Inksplash of Mind state.<br>- Swordster's Soliloquy is cleared when the Inksplash of Mind state ends.</div>`,
  attacks: [
    {
      key: "QuadrupleDownbeatDMG",
      label: "Quadruple Downbeat DMG",
      type: "Heavy",
      talents: {
        "1": "15.80%*10 + 157.95%",
        "2": "17.10%*10 + 170.91%",
        "3": "18.39%*10 + 183.86%",
        "4": "20.20%*10 + 201.99%",
        "5": "21.50%*10 + 214.94%",
        "6": "22.99%*10 + 229.84%",
        "7": "25.06%*10 + 250.56%",
        "8": "27.13%*10 + 271.28%",
        "9": "29.21%*10 + 292.01%",
        "10": "31.41%*10 + 314.03%",
      },
    },
  ],
};
