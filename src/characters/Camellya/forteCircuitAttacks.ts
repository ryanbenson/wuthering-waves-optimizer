export const forteCircuitAttacks = {
  name: "Forte Circuit: Botanical Universe",
  description: `<div class="skilldescription"><p>When <span class="Highlight">Basic Attack</span>, <span class="Highlight">Plunging Attack</span>, <span class="Highlight">Normal Attack Vine Dance</span>, <span class="Highlight">Normal Attack Whirling Dance</span>, <span class="Highlight">Dodge Counter</span>, <span class="Highlight">Dodge Counter Atonement</span> hits the target, consumes <span class="Highlight">【Red Camellia·Pistil】</span>, the base resonance energy recovery efficiency of this attack is increased by 150%.</p>
  <p>Every 10 points of <span class="Highlight">【Red Camellia·Pistil】</span> consumed, restores 4 points of <span class="Highlight">Concerto Energy</span>, then gain 1 stack of <span class="Highlight">【Red Camellia·Bud】</span>, lasting for 15s, stacking up to 10 stacks.</p>
  
  <p><strong>Resonance Skill-Dayflower</strong><br>
  When <span class="Highlight">Concerto Energy</span> is filled, Resonance Skill is replaced with <span class="Highlight">Resonance Skill Dayflower</span>.<br>
  When casting <span class="Highlight">Resonance Skill Dayflower</span>, consumes 70 <span class="Highlight">Concerto Energy</span>, restores 100 points of <span class="Highlight">【Red Camellia·Pistil】</span>, then attack the target, dealing <span class="Dark">Havoc</span> damage.<br>
  After casting <span class="Highlight">Resonance Skill Dayflower</span>, enters the Bud state.
  </p>
  
  <p><strong>Bud state</strong><br>
  <span class="Highlight">Basic Attack</span>, <span class="Highlight">Plunging Attack</span>, <span class="Highlight">Normal Attack Vine Dance</span>, <span class="Highlight">Normal Attack Whirling Dance</span>, <span class="Highlight">Dodge Counter</span>, <span class="Highlight">Dodge Counter Atonement</span>, <span class="Highlight">Resonance Skill Red Camellia Bloom</span>, <span class="Highlight">Resonance Skill Dark Pistil Seeker</span> damage multiplier increases by 50%;<br>
  When casting <span class="Highlight">Resonance Skill Dayflower</span>, removes all <span class="Highlight">Red Camellia·Bud</span>, every stack of <span class="Highlight">Red Camellia·Bud</span> additionally increases the damage multiplier by 5%, up to 50%;<br>
  When <span class="Highlight">Resonance Skill Red Camellia Bloom</span>, <span class="Highlight">Resonance Skill Dark Pistil Seeker</span> hits the target, consumes <span class="Highlight">【Red Camellia·Pistil】</span>;<br>
  During the Bud state, Camellya’s base resonance energy recovery efficiency is reduced to 0%.<br>
  When <span class="Highlight">【Red Camellia·Pistil】</span> is fully consumed, the Bud state will end early.
  </p>
  
  <p><strong>Red Camellia·Pistil</strong><br>
  Maximum limit of 100 points.<br>
  Can’t restore <span class="Dark">【Red Camellia·Pistil】</span> under the <span class="Dark">Bud state</span>.<br>
  After casting <span class="Highlight">Intro Skill</span>, restores 50 <span class="Dark">【Red Camellia·Pistil】</span> points.<br>
  After casting <span class="Highlight">Outro Skill</span>, restores 50 <span class="Dark">【Red Camellia·Pistil】</span> points.<br>
  After casting <span class="Highlight">Resonance Skill Red Camellia Bloom</span>, restores 20 <span class="Dark">【Red Camellia·Pistil】</span> points.<br>
  After casting <span class="Highlight">Resonance Skill Dark Pistil Seeker</span>, restores 20 <span class="Dark">【Red Camellia·Pistil】</span> points.
  </p>
  </div>`,
  attacks: [
    {
      key: "DayflowerDMG",
      label: "Dayflower DMG",
      talents: {
        "1": "635.00%",
        "2": "687.07%",
        "3": "739.14%",
        "4": "812.04%",
        "5": "864.11%",
        "6": "923.99%",
        "7": "1007.31%",
        "8": "1090.62%",
        "9": "1173.93%",
        "10": "1262.45%",
      },
      type: "Basic",
    },
  ],
};
