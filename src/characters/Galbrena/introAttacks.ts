export const introAttacks = {
  name: "Intro Skill: Hellflare Overload",
  description: `<div>Attack the target and deal <span class="ingame-Fire">Fusion DMG</span>.<br>Hold Normal Attack after casting this skill to cast <span class="ingame-Highlight">Heavy Attack - Volley of Death Stage 2</span>. While in <span class="ingame-Highlight"><te href="120805">Demon Hypostasis</te></span>, cast <span class="ingame-Highlight">Heavy Attack - Flamewing Verdict Stage 2</span> instead.<br>Press Normal Attack right after casting this skill to perform <span class="ingame-Highlight">Basic Attack Stage 2</span>, which is replaced with <span class="ingame-Highlight"> Basic Attack - Seraphic Execution Stage 2</span> if Galbrena is in <span class="ingame-Highlight"><te href="120805">Demon Hypostasis</te></span>.</div>`,
  attacks: [
    {
      key: "HellflareOverloadDMG",
      label: "Hellflare Overload DMG",
      talents: {
        "1": "47.34%",
        "2": "51.23%",
        "3": "55.11%",
        "4": "60.54%",
        "5": "64.43%",
        "6": "68.89%",
        "7": "75.10%",
        "8": "81.31%",
        "9": "87.52%",
        "10": "94.12%",
      },
      type: "Intro",
    },
  ],
};
