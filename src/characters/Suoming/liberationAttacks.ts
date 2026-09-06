export const liberationAttacks = {
  name: "Resonance Liberation: Umbral Canopy: Miasma Lock",
  description: `<div>While in the <span style="color:#ffd12f;" class="font-bold">Deep Mind</span> state, <span style="color:#ffd12f;" class="font-bold">Resonance Liberation</span> becomes available. Casting Resonance Liberation deals <span style="color:#ebb0ff;">Electro DMG</span> to targets within range.<br>- Casting <span style="color:#ffd12f;" class="font-bold">Resonance Liberation</span> grants Suoming <span style="color:#ffd12f;" class="font-bold">Unison</span> for 5s, triggered only once every 25s.<br><br><span class="Title">Blight Rain, Miasmic Thunder</span></span><br><br>While casting <span style="color:#ffd12f;" class="font-bold">Outro Skill</span>, if Suoming has <span style="color:#ffd12f;" class="font-bold">Unison</span>, when the active Resonator deals damage, a <span style="color:#ffd12f;" class="font-bold">Thunder Crest</span> is summoned as a Coordinated Attack on the target, dealing <span style="color:#ebb0ff;">Electro DMG</span>.<br>- Within 3s after this damage is dealt, a <span style="color:#ffd12f;" class="font-bold">Thunder Crest</span> can be summoned each second. This effect is triggered once per second. The damage dealt by <span style="color:#ffd12f;" class="font-bold">Thunder Crest</span> does not trigger this effect.<br>- Only 1 <span style="color:#ffd12f;" class="font-bold">Thunder Crest</span> can be summoned per second, up to 6 in total.<br>- This effect lasts 8s, or until the number of summoned <span style="color:#ffd12f;" class="font-bold">Thunder Crest</span> reaches the limit.</div>`,
  icon: "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconSuoming/SP_IconSuomingC1.webp",
  attacks: [
    {
      key: "ResonanceLiberationUmbralCanopyMiasmaLockDMG",
      label: "Resonance Liberation - Umbral Canopy: Miasma Lock DMG",
      talents: {
        "1": "35.00%*7+105.00%",
        "2": "37.87%*7+113.61%",
        "3": "40.74%*7+122.22%",
        "4": "44.76%*7+134.28%",
        "5": "47.63%*7+142.89%",
        "6": "50.93%*7+152.79%",
        "7": "55.53%*7+166.57%",
        "8": "60.12%*7+180.34%",
        "9": "64.71%*7+194.12%",
        "10": "69.59%*7+208.76%",
      },
      type: "Liberation",
    },
    {
      key: "ResonanceLiberationBlightRainMiasmicThunderDMG",
      label: "Resonance Liberation - Blight Rain, Miasmic Thunder DMG",
      talents: {
        "1": "30.00%",
        "2": "32.46%",
        "3": "34.92%",
        "4": "38.37%",
        "5": "40.83%",
        "6": "43.66%",
        "7": "47.59%",
        "8": "51.53%",
        "9": "55.47%",
        "10": "59.65%",
      },
      type: "Liberation",
    }
  ],
};
