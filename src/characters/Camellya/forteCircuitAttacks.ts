export const forteCircuitAttacks = {
  name: "Forte Circuit: Botanical Universe",
  description: `<div class="skilldescription"><p>When <span class="Highlight">Basic Attack</span>, <span class="Highlight">Normal Attack Vine Dance</span>, <span class="Highlight">Normal Attack Whirling Dance</span>, <span class="Highlight">Dodge Counter Atonement</span>, <span class="Highlight">Resonance Skill Red Camellia Bloom</span>, <span class="Highlight">Resonance Skill Dark Pistil</span> Seeker hits the target, consumes <span class="Highlight">【Red Camellia Pistil】</span>, the base resonance energy recovery efficiency of this attack is increased by 150%.</p>
  <p>Every 10 points of <span class="Highlight">【Red Camellia Pistil】</span> consumed, restores 4 points of <span class="Highlight">Concerto Energy</span>, then gain 1 stack of <span class="Highlight">【Red Camellia Bud】</span>, lasting for 15s, stacking up to 10 stacks.</p>
  
  <p><strong>Resonance Skill-Dayflower</strong><br>
  When <span class="Highlight">Concerto Energy</span> is filled, Resonance Skill is replaced with <span class="Highlight">Resonance Skill Dayflower</span>.<br>
  When casting <span class="Highlight">Resonance Skill Dayflower</span>, consumes 70 <span class="Highlight">Concerto Energy</span>, then attack the target, dealing <span class="Dark">Havoc</span> damage.<br>
  After casting <span class="Highlight">Resonance Skill Dayflower</span>, enters the Bud state.
  </p>
  
  <p><strong>Bud state</strong><br>
  <span class="Highlight">Deep Slumber</span>: <span class="Highlight">Basic Attack</span>, <span class="Highlight">Normal Attack Vine Dance</span>, <span class="Highlight">Normal Attack Whirling Dance</span>, <span class="Highlight">Dodge Counter Atonement</span>, <span class="Highlight">Resonance Skill Red Camellia Bloom</span>, <span class="Highlight">Resonance Skill Dark Pistil Seeker</span> damage multiplier increases by 50%;<br>
  - When casting <span class="Highlight">Dayflower</span>, removes all <span class="Highlght">Red Camellia Bud</span>, every stack of <span class="Highlight">Red Camellia Bud</span> additional increases the damage multiplier of <span class="Highlight">Deep Slumber</span> by 5%, up to 50%;<br>
  -During the Bud state, unable to increase Red Camellia·Bud stacks.<br>
  - During the Bud state, Camellya’s base resonance energy recovery efficiency is reduced to 0%.<br>
-When switching to another Resonator, the Bud state will end early.<br>
-During the Bud state, Camellya’s base resonance energy recovery efficiency is reduced to 0%
When <span class="Dark">【Red Camellia·Pistil】</span>is fully consumed, the Bud state will end early.
  
  <p><strong>Red Camellia Pistil</strong><br>
  Maximum limit of 100 points.<br>
  After casting <span class="Highlight">Intro Skill</span>, restores 100 <span class="Dark">【Red Camellia Pistil】</span> points.<br>
After casting <span class="Highlight">Resonance Skill Dark Pistil Seeker</span>, restores 100  <span class="Dark">【Red Camellia·Pistil】</span>points.
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
    {
      key: "SequenceNode6EternalFlowerDMG",
      label: "S6 Eternal Flower",
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
      requiresResonanceChain: "SequenceNode6EternalFlowerDMG",
    },
  ],
};
