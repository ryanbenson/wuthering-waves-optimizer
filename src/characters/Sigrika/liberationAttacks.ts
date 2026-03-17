export const liberationAttacks = {
  name: "Resonance Liberation: Where Trust Leads Me!",
  description: `<div class="skilldescription">Deal <span class="Wind">Aero</span> DMG (considered Echo Skill DMG). Gain <span class="Highlight">Divergent</span> for 20s.<br><br>
  <span class="Title">Divergent</span><br>
The next time Sigrika obtains a <span class="Highlight">Rune</span>, she additionally obtains a <span class="Highlight">Rune</span> of the opposite type and removes <span class="Highlight">Divergent</span>.
When Sigrika holds <span class="Highlight">Divergent</span> and <span class="Highlight">Convergent</span> at the same time, <span class="Highlight">Convergent</span> takes priority.
When Sigrika holds 100 points of <span class="Highlight">Full Stop</span>, <span class="Highlight">Divergent</span> doesn't take effect.</div>`,
  attacks: [
    {
      key: "WhereTrustLeadsMeDMG",
      label: "Where Trust Leads Me! DMG",
      type: "Echo",
      talents: {
        "1": "433.29%",
        "2": "468.82%",
        "3": "504.35%",
        "4": "554.10%",
        "5": "589.63%",
        "6": "630.49%",
        "7": "687.33%",
        "8": "744.18%",
        "9": "801.03%",
        "10": "861.43%",
      },
    },
  ],
};
