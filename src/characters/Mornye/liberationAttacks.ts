export const liberationAttacks = {
  name: "Resonance Liberation: Critical Protocol",
  description: `<div>Attack the targets within the effective range, dealing <span class="Fusion"><strong>Fusion DMG</strong></span>.<br>For every 1% of Mornye's Energy Regen exceeding 100%, this skill gains an additional 0.5% Crit. Rate (up to 80%) and 1% Crit. DMG (up to 160%).<br>When casting this skill, if a <span class="Highlight"><strong></strong></span> is present, remove it and generate a <span class="Highlight"><strong></strong></span>.<br>Can be performed in mid-air.<br><br><span class="Title"><strong>High Syntony Field</strong></span><br>- <span class="Highlight"><strong>High Syntony Field</strong></span> lasts for 25s. <br>- Increases the DEF of all nearby Resonators in the team within the <span class="Highlight"><strong>High Syntony Field</strong></span> by 20%.<br>- Inherits the <span class="Highlight"><strong></strong></span>'s boost to resistance to interruption and <span class="Highlight"><strong>Off-Tune Buildup Rate</strong></span>.<br>- Inherits the <span class="Highlight"><strong></strong></span>'s healing effect and increases the Healing Multiplier by 40%.</div>`,
  attacks: [
    {
      key: "CriticalProtocolDMG",
      label: "Critical Protocol DMG",
      type: "Liberation",
      attribute: "def",
      talents: {
        "1": "262.73%",
        "2": "284.27%",
        "3": "305.82%",
        "4": "335.98%",
        "5": "357.52%",
        "6": "382.30%",
        "7": "416.77%",
        "8": "451.24%",
        "9": "485.70%",
        "10": "522.33%",
      },
    },
  ],
};
