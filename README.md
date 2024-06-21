# wuthering-waves-optimizer

[Optimizer for your resonators and weapons and echoes](https://ryanbenson.github.io/wuthering-waves-optimizer/)

See the project for more information on where things are at, and where things are going: https://github.com/users/ryanbenson/projects/2

## Buff configurations

### Base talent multiplier

When you need to add a multiplier to the base talent value (e.g. Changli R5)

```

  {
    key: "SequenceNode5SacrificedGains1",
    name: "Sequence Node 5: Sacrificed Gains: Flaming Vow Buff",
    details: `<span class="skilldescription">Heavy Attack <span class="Highlight">Flaming Vow</span>'s multiplier is increased by 50%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["FlamingVowDMG"],
        modifierValue: 0.5,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
```

### Base talent addition

When you need to add to the base talent multiplier, but not multiply to it (e.g. Jinhsi Incandescence), this also takes in the the talent level of something like "forte" to know which modifier to use. If you don't need that, just use the same value for all of them.

```

  {
    key: "Incandescence",
    name: "Incandescence",
    details:
      '<div class="skilldescription">When Jinhsi has "Incandescence", consume up to 50 Incandescence, each point of Incandescence grants an additional DMG multiplier percentage to the <span class="Highlight">Star Glamour</span>.</div>',
    hasStacks: true,
    modifiers: [
      {
        modifier: "Talent",
        modifierTalentKey: "StarGlamourDMG",
        modifierValue: {
          "1": 0.224,
          "2": 0.2424,
          "3": 0.2608,
          "4": 0.2865,
          "5": 0.3049,
          "6": 0.326,
          "7": 0.3554,
          "8": 0.3848,
          "9": 0.4142,
          "10": 0.4454,
        },
        modifierValueTalentRef: "forte",
      },
    ],
    minStacks: 0,
    maxStacks: 50,
    alwaysEnabled: false,
  },
```

### Specific skill multiplier

When you need to have a multiplier to a specific skill where it's added to the rest of the damage multipliers like elemental dmg bonus (e.g. R5 Changli second part)

```

  {
    key: "SequenceNode5SacrificedGains2",
    name: "Sequence Node 5: Sacrificed Gains: Flaming Vow Buff",
    details: `<span class="skilldescription"> When Heavy Attack Flaming Vow is released, it receives a 50% DMG Bonus.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifySpecificTalents: ["FlamingVowDMG"],
        modifierValue: 0.5,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
```

### Other basic stuff

Basic ATK, CR, etc.

```
  {
    key: "SequenceNode4PolishedWords",
    name: "Sequence Node 4: Polished Words",
    details: `<span class="skilldescription">Intro Skill increases the ATK of all team members by 20%, lasting for 30s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
```
