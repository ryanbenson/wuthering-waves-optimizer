# Creating a new character

Here's a quick guide on how to build a new character. High level steps:

1. Copy a character folder, and paste from src/characters, and name the folder the name of the character (PascalCase)
2. Go to encore.moe for all of the character data (base stats by level, motion values, text, etc.)
3. Go through all files and ensure you fill it out (basics has base info like element, any NS they can apply, etc.)
4. Setup buffs and fortes (basic, liberation, intro, etc.)
5. Copy the HTML from encore.moe for the text blocks. But ensure to strip out their crazy HTML: `<size>`, text formatting size and colors, replace hard coded colors with our `styles.scss` like .Light -> for spectro, .Highlight for text highlights, .Title for titles of text.
  1. You can use `scripts/removeA.js` and tweak it to help automate this
6. To setup the attacks, use `./prompts/AttackObjectsFromTableAlt.txt` to help you. It's a prompt you can use in ChatGPT to convert raw tables from encore.moe into an array of objects that the app will use
  1. Copy the table of attack names and MVs into the prompt for every forte level (1-10) into the prompt sample
  2. Copy the entire prompt with all of the MV info and run it through ChatGPT
  3. You'll get an array of objects with attacks so you can use in the character forte files
  4. You'll need to manually update the attack type (they're all hard coded as Basic) to make sure it's the right attack type (Basic, Heavy, Echo, Liberation, etc.)
7. Setup the self character buffs in the `buffs.ts` file
8. Add any team buffs to `./buffs/index.ts`
9. Make sure to do the resonance chains
10. If there are new features or buff handling, you'll need to update the app to handle it

## Buff configurations

Here are some common buffs that you'll run into, things like multiplier changes, buffs targeting specific attacks, etc. This is non-exhaustive. Find other characters where needed that could have similar buffs.

Note that Vulnerability is usually a rare buff, and the wording is inconsistent (e.g. Carte self buff uses the same text, but it's not vulnerability). Vulnerability is `specialMultiplier`.

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

### Base talent multiplier additional

When you need to add a multiplier to the base talent value (e.g. Changli R5), but it's a straight addition to the multiplier (e.g. Zani S3). Only works with Resonance Chains right now.

```
  {
    key: "SequenceNode3EachDayANewCommute",
    name: "Sequence Node 3: Each Day A New Commute",
    details: ``,
    hasStacks: true,
    modifiers: [
      {
        modifier: "talentModifierMultiplyAdd",
        modifySpecificTalents: ["TheLastStandDMG"],
        modifierValue: 0.08,
      },
    ],
    minStacks: 0,
    maxStacks: 150,
    alwaysEnabled: false,
  },
```

### talent override

When an entire talent tree is changed through a buff, like 2 of Carlotta's do this.

```

  {
    key: "SequenceNode5SacrificedGains1",
    name: "Sequence Node 5: Sacrificed Gains: Flaming Vow Buff",
    details: `<span class="skilldescription">Heavy Attack <span class="Highlight">Flaming Vow</span>'s multiplier is increased by 50%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentReplace",
        modifySpecificTalents: ["FatalFinaleDMG"],
        modifierValue: {
          "1": "732.45%",
          "2": "792.51%",
          "3": "852.56%",
          "4": "936.66%",
          "5": "996.73%",
          "6": "1065.79%",
          "7": "1161.89%",
          "8": "1257.98%",
          "9": "1354.08%",
          "10": "1456.17%",
        },
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

### Special DMG Multiplier

When you need to add a speceial dmg multiplier to the base talent value (e.g. Cartethyia S6)

```

  {
    key: "...",
    name: "...",
    details: `...`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "specialMultiplier",
        modifySpecificTalents: [
          "SwordtoCallforFreedomDMG",
          "BladeofHowlingSquallDMG",
          ...
        ],
        modifierValue: 0.4,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
```

### Buffs based on forte, and sub type

This looks up the original dmg, it has to match Liberation, and a attackType of Basic. Weird, but specific to this buff

```
      {
        key: "RiteofGildedRevelationLiberation",
        modifiers: [
          {
            modifier: "ForteBased:Liberation:Basic",
            modifierValue: 40,
          },
        ],
        alwaysEnabled: false,
        details: `With 3 stacks, casting Resonance Liberation grants 40% Basic Attack DMG Bonus.`,
      },
```

### Additional based buffs of a specific stat

There are some characters that can buff themselves, or team buffs, where it's based off of a specific state (e.g. SK CR and CD buff based on her ER). You can also target specific talents, at least in self buffs right now.

```
{
  key: `CriticalProtocol`,
  name: `Critical Protocol`,
  details: `<div>For every 1% of Mornye's Energy Regen exceeding 100%, this skill gains an additional 0.5% Crit. Rate (up to 80%) and 1% Crit. DMG (up to 160%).</div>`,
  hasStacks: false,
  modifiers: [
    {
      modifier: "CritRate:AdditionalBase",
      modifierValue: 0.005,
      maximumValue: 0.8,
      modifierStep: 1,
      modifierBasedOn: "EnergyRegen",
      modifierTargetAttr: "CritRate",
      minStatValue: 1,
      modifySpecificTalents: ["CriticalProtocolDMG"],
    },
    {
      modifier: "CritDMG:AdditionalBase",
      modifierValue: 0.01,
      maximumValue: 1.6,
      modifierStep: 1,
      modifierBasedOn: "EnergyRegen",
      modifierTargetAttr: "CritDMG",
      minStatValue: 1,
      modifySpecificTalents: ["CriticalProtocolDMG"],
    },
  ],
  minStacks: 0,
  maxStacks: 0,
  alwaysEnabled: false,
},
```
