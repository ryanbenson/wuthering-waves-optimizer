# @wutheringtools/formulas

The **Wuthering Waves damage formulas** behind [Wuthering Tools](https://wutheringtools.com): direct damage, crit and average damage, healing, shields, Tune Break, and the negative status effects (Spectro Frazzle, Aero Erosion, Fusion Burst, Glacio Chafe, Electro Flare, Glacio Bite).

Every formula here is the same code Wuthering Tools runs for its calculator and optimizer. They're checked against in-game numbers and covered by unit tests in the app repo.

It's plain TypeScript with **no runtime dependencies** and no DOM or framework code, so it runs in a browser, a web worker, Node, Deno or Bun.

```bash
npm install @wutheringtools/formulas
```

---

## Contents

- [What it does (and doesn't)](#what-it-does-and-doesnt)
- [Quick start](#quick-start)
- [Conventions you need to know](#conventions-you-need-to-know)
- [The damage formula](#the-damage-formula)
- [API reference](#api-reference)
  - [Direct damage](#direct-damage)
  - [Formula building blocks](#formula-building-blocks)
  - [Healing and shields](#healing-and-shields)
  - [Fixed damage](#fixed-damage)
  - [Tune Break](#tune-break)
  - [Negative status effects](#negative-status-effects)
  - [Lookup tables](#lookup-tables)
- [Result objects](#result-objects)
- [Talent strings](#talent-strings)
- [Per-skill special cases](#per-skill-special-cases)
- [Accuracy and testing](#accuracy-and-testing)
- [Versioning](#versioning)
- [License](#license)

---

## What it does (and doesn't)

This package answers one question: **given final stats and a skill's multiplier, how much does a hit do?**

| The package does | You (the host app) do |
|---|---|
| Turns a talent string (`"51.7%*2 + 79.53%"`) into per-hit damage | Look up a skill's talent string for the right skill level |
| Applies the DMG bonus, Deepen, DEF, RES and Total DMG multipliers in the game's order | Add up a character's final ATK/HP/DEF, DMG bonuses, crit, buffs |
| Handles negative resistance (halved reduction below 0%) | Decide which buffs are active |
| Computes non-crit, crit and average (expected) damage | Sum a rotation |
| Healing and shield amounts, including flat-base talents | |
| Tune Break and every negative status effect, with their level constants and motion-value tables | |
| A human-readable breakdown of each hit for tooltips | |

There's **no character, weapon, echo or buff data** in here, and no stat aggregation. That keeps the package small and means a new character doesn't need a new version. Wuthering Tools layers its stat engine on top of these functions.

---

## Quick start

A level 90 resonator with 2,000 ATK, 30% Electro DMG Bonus, 50% Crit Rate and 250% Crit DMG uses a 100% ATK skill on a level 90 enemy with 10% Electro RES:

```ts
import { calcDamage } from "@wutheringtools/formulas";

const hit = calcDamage(
  "90",   // character level
  90,     // enemy level
  0.1,    // enemy RES (10%)
  "100%", // talent string
  2000,   // final ATK (or HP/DEF for skills that scale off those)
  0,      // DEF ignore
  0,      // skill-type DMG bonus (e.g. Resonance Skill DMG Bonus)
  0,      // DMG bonus for this specific skill
  0.3,    // element DMG bonus (30%)
  0,      // Deepen
  0,      // RES reduction
  0.5,    // Crit Rate (50%)
  2.5,    // Crit DMG (250%)
);

hit.totalDamage; // 1173.1  (non-crit)
hit.critDamage;  // 2932.8  (on crit)
hit.avgDamage;   // 2052.9  (expected value at 50% crit)
```

That breaks down as:

```
2000 ATK × 1.00 talent × (1 + 0.3) DMG bonus × 0.5013 DEF × (1 − 0.1) RES ≈ 1173
```

---

## Conventions you need to know

These trip people up, so they're worth reading before you wire anything in.

- **Percentages are decimals.** 30% is `0.3`. This applies to DMG bonuses, Deepen, RES, DEF ignore, crit rate, Total DMG and so on.
- **Crit DMG is the full multiplier, not the bonus.** The in-game stat reads "Crit DMG 250%", so pass `2.5`. A character with no Crit DMG would be `1`.
- **Crit Rate over 100% is capped** when computing average damage.
- **Talent values are strings,** exactly as the game displays them: `"100%"`, `"51.7%*2 + 79.53%"`, `"1200 + 20%"` (heals and shields). See [Talent strings](#talent-strings).
- **Character level is a string,** because ascension matters elsewhere in the app: `"90"`, `"80+"`. A trailing `+` is ignored by these formulas.
- **Enemy level is a number.**
- **Numeric inputs are forgiving.** Every number is coerced with `Number()` and anything non-finite becomes `0` (or `1` for `count`). Passing `"0.3"` instead of `0.3` gives the right answer rather than string concatenation, and `undefined` or `NaN` can't poison a result.
- **Parameters are positional.** Most functions take many optional trailing arguments; pass `0` for anything that doesn't apply. (A named-options API is on the roadmap. See [Versioning](#versioning).)

---

## The damage formula

Direct damage for a single hit:

```
damage = Scaling stat
       × Talent multiplier
       × (1 + skill-type bonus + specific-skill bonus + element bonus)
       × (1 + Deepen)
       × (1 + special multiplier)
       × (1 + Total DMG)
       × (1 + Total DMG (endgame))
       × DEF multiplier
       × RES multiplier
```

### DEF multiplier

```
enemy DEF      = 8 × enemyLevel + 792
DEF multiplier = (800 + 8 × charLevel)
               / (800 + 8 × charLevel + enemy DEF × (1 − DEF ignore) × (1 − DEF reduction))
```

At level 90 vs. level 90 with no DEF ignore that's `1520 / 3032 ≈ 0.5013`.

### RES multiplier

Total reduction is `RES reduction + RES ignore`. Once the enemy's resistance drops **below 0%**, every further point of reduction only counts for **half**:

| Situation | RES multiplier |
|---|---|
| No reduction | `1 − baseRes` |
| Base RES ≥ 0, reduction ≤ base | `1 − (baseRes − reduction)` |
| Base RES ≥ 0, reduction > base | `1 + (reduction − baseRes) / 2` |
| Base RES < 0 | `1 − (baseRes − reduction / 2)` |

So 10% base RES with 30% reduction gives `1 + 0.2 / 2 = 1.1`, not `1.2`.

### Crit and average

```
crit damage    = damage × critDMG
average damage = damage × (1 + min(critRate, 1) × (critDMG − 1))
```

### Talent modifiers

Some buffs change the **multiplier** rather than adding a DMG bonus. They're applied to each hit before the multipliers above, in this order:

1. `talentModifierAdd`: adds to the multiplier (e.g. Jinhsi's Incandescence). It's added to the **last hit only** unless the skill has a [special case](#per-skill-special-cases).
2. `talentModifierMultiply`: `× (1 + value)`.
3. `totalTalentModifierSpecialMultiply`: another `× (1 + value)`, applied after the first.

### Negative status effects

These don't scale off ATK. They use a level constant and a motion value per stack:

```
damage = level constant × (motion value / 10000) × (1 + MV bonus) × DEF multiplier × RES multiplier × (1 + Deepen)
```

DEF ignore never applies to negative status damage; DEF reduction does.

### Tune Break

```
damage = level modifier × (1 + MV bonus) × (1 + special multiplier) × Tune multiplier
       × DEF multiplier × RES multiplier × (1 + DMG bonus) × enemy-type multiplier × (1 + Tune Break boost)
```

The enemy-type multiplier is Common 1, Elite 3, Overlord 14, Calamity 14.

---

## API reference

Every function is a named export:

```ts
import { calcDamage, calcHeal, getDefenseModifier } from "@wutheringtools/formulas";
```

### Direct damage

#### `calcDamage(...)`

The main entry point. Splits a talent string into hits, applies talent modifiers per hit, and returns totals plus a breakdown.

| # | Parameter | Type | Default | Meaning |
|---|---|---|---|---|
| 1 | `charLevel` | `string` | | `"90"`, `"80+"` |
| 2 | `enemyLevel` | `number` | | |
| 3 | `enemyResist` | `number` | | Base RES for this element (`0.1` = 10%) |
| 4 | `talent` | `string` | | [Talent string](#talent-strings) |
| 5 | `attack` | `number` | | Final scaling stat (ATK, HP or DEF) |
| 6 | `defIgnore` | `number` | `0` | |
| 7 | `bonusTotalSkillDmg` | `number` | `0` | Skill-type bonus (Basic/Heavy/Skill/Liberation…) |
| 8 | `bonusSpecificSkillDmg` | `number` | `0` | Bonus for this specific skill |
| 9 | `bonusElementDmg` | `number` | `0` | Element DMG bonus |
| 10 | `totalDeepenEffect` | `number` | `0` | Deepen (Amplify) |
| 11 | `resistanceReduction` | `number` | `0` | |
| 12 | `critRate` | `number` | `0` | |
| 13 | `critDamage` | `number` | `0` | Full multiplier (`2.5` = 250%) |
| 14 | `talentModifierAdd` | `number` | `0` | Flat multiplier added (see above) |
| 15 | `talentModifierMultiply` | `number` | `0` | |
| 16 | `totalTalentModifierSpecialMultiply` | `number` | `0` | |
| 17 | `count` | `number` | `1` | How many times the skill is used |
| 18 | `skillKey` | `string` | `""` | Only matters for [special cases](#per-skill-special-cases) |
| 19 | `additiveMultiplierStacks` | `number` | `0` | Stack count for Nightfall-style skills |
| 20 | `additiveMultiplierPercent` | `number` | `0` | Multiplier per stack |
| 21 | `specialMultiplier` | `number` | `0` | Separate `(1 + x)` multiplier |
| 22 | `defReduction` | `number` | `0` | |
| 23 | `resistanceIgnore` | `number` | `0` | Stacks with RES reduction |
| 24 | `totalDamage` | `number` | `0` | "Total DMG" bonus |
| 25 | `totalDamageEndgame` | `number` | `0` | Separate endgame Total DMG multiplier |

Returns a [damage result](#damage-result).

#### `calcHitDamage(...)`

One hit with an already-numeric talent value (`1.0` for 100%). Same parameters as `calcDamage` minus crit, talent modifiers, count and stacks:

```ts
calcHitDamage(charLevel, enemyLevel, enemyResist, talent, attack,
  defIgnore?, bonusTotalSkillDmg?, bonusSpecificSkillDmg?, bonusElementDmg?,
  totalDeepenEffect?, resistanceReduction?, specialMultiplier?, defReduction?,
  resistanceIgnore?, totalDamage?, totalDamageEndgame?): number
```

Use this in hot loops when you don't need the breakdown strings.

### Formula building blocks

Each factor of the damage formula is exported on its own, which is handy for "what if" UIs and for checking numbers by hand.

| Function | Returns |
|---|---|
| `getEnemyDefense(enemyLevel)` | `8 × level + 792` |
| `getDefenseModifier(charLevel, enemyLevel, defIgnore, defReduction = 0)` | The DEF multiplier |
| `getEnemyResistValue(baseResist, reduction, ignore = 0)` | The RES multiplier, with the below-zero halving |
| `getBonusDamageValue(skillType = 0, specificSkill = 0, element = 0, deepen = 0)` | `(1 + bonuses) × (1 + deepen)` |
| `getBaseDamage(talent, attack, bonusValue, defModifier, resistValue, special = 0, totalDamage = 0, totalDamageEndgame = 0)` | The product of everything above |
| `getTalentValue("51.7%")` | `0.517` |

### Healing and shields

```ts
calcHeal(talent, finalStat?, healingBonus?, specificBonus?,
  talentModifierAdd?, talentModifierMultiply?, talentModifierSpecialMultiply?, count?)

calcShield(talent, finalStat?, shieldBonus?, specificBonus?,
  talentModifierAdd?, talentModifierMultiply?, count?)
```

Both use:

```
amount = (talent × final stat + flat base) × (1 + bonus + specific bonus)
```

The talent string is either `"20%"` or `"1200 + 20%"` (flat base first). Talent multipliers scale both the percentage and the flat base for heals; for shields they scale the percentage only.

Returns `{ healAmount | shieldAmount, detailedCalculation, totalDamageContext }`.

### Fixed damage

```ts
calcFixedDamage(talent: string, count = 1)
```

For hits that deal a flat amount no matter the stats (`talent` is the number as a string, e.g. `"500"`). No multipliers apply, and crit and average equal the base.

### Tune Break

```ts
calcTuneBreak(talent, charLevel, enemyLevel, enemyResist, enemyType,
  resistanceReduction, defIgnore?, defReduction?, tuneBreakBoost?,
  talentModifierMultiply?, specialMultiplier?, bonusDmg?, critRate?,
  critDamage = 1, count?, resistanceIgnore?)
```

`enemyType` is `"Common" | "Elite" | "Overlord" | "Calamity"` (unknown values use Overlord's 14). Also exported: `calcTuneBreakHit(...)`, `getTuneBreakLevelModifier(charLevel)` and `getTuneBreakEnemyTypeMultiplier(enemyType)`.

### Negative status effects

All of these share one signature:

```ts
fn(charLevel, enemyLevel, enemyResist, resistanceReduction,
   defReduction = 0, talentModifierMultiply = 0, totalDeepenEffect = 0,
   critRate = 0, critDamage = 1, count = 1, stacks = 1)
```

| Function | Effect |
|---|---|
| `getSpectroFrazzleDamage` | Spectro Frazzle |
| `getAeroErosionDamage` | Aero Erosion |
| `getFusionBurstDamage` | Fusion Burst |
| `getGlacioChafeDamage` | Glacio Chafe |
| `getElectroFlareDamage` | Electro Flare. Takes a 12th argument, `electroRageStacks`, whose motion value is added to the base stacks' |

Glacio Bite (Hiyuki's Forte) is a little different. It reads its motion value from a forte talent string and includes the special and Total DMG multipliers. It never crits.

```ts
getGlacioBiteForteDamage(charLevel, enemyLevel, enemyResist, resistanceReduction,
  defReduction, talentModifierMultiply, totalDeepenEffect, specialMultiplier,
  totalDamage, count, forteTalentString, totalDamageEndgame = 0)
```

### Lookup tables

| Function | Notes |
|---|---|
| `getNegativeStatusLevelConstant(level: number)` | Levels 1, 20, 40, 50, 60, 70, 80, 90, 100. Unknown levels fall back to 90 |
| `getSpectroFrazzleMotionValueByStacks(stacks)` | Motion value in basis points (`÷ 10000`) |
| `getAeroErosionMotionValueByStacks(stacks)` | |
| `getFusionBurstMotionValueByStacks(stacks)` | |
| `getGlacioChafeMotionValueByStacks(stacks)` | |
| `getElectroFlareMotionValueByStacks(stacks)` | |

> **Out-of-range stacks:** for Spectro Frazzle, Aero Erosion, Fusion Burst and Glacio Chafe, any stack count that isn't in the table (**including `0`**) returns the **maximum** stack value. Electro Flare returns `0` instead, so `electroRageStacks = 0` adds nothing. Clamp stacks to a valid range yourself if `0` should mean "no damage".
| `parseGlacioBiteForteMotionValueBasisPoints("102%")` | `10200` |
| `getSpectroFrazzleModifierByLevelByStacks(level, stacks)` | Legacy per-level table (levels 60–90). Kept for compatibility; new code should use the motion-value functions |
| `getAeroErosionModifierByLevelByStacks(level, stacks)` | Legacy, as above |

---

## Result objects

Functions return plain objects, so they're safe to `postMessage` between workers or serialize to JSON. They're typed loosely (`any`) today; precise types are planned.

### Damage result

Returned by `calcDamage`, `calcFixedDamage`, `calcTuneBreak` and the negative-status functions:

```ts
{
  totalDamage: number,  // non-crit damage, × count
  critDamage: number,   // damage if every hit crits
  avgDamage: number,    // expected damage at the given crit rate

  // Per-hit numbers (calcDamage and calcTuneBreak; calcFixedDamage has instanceDamage only)
  instanceDamage: Record<string, number>, // "51.70%" → damage of one such hit
  instanceDamageEntries: { percentage: string; damage: number; count: number }[],

  // Breakdown for tooltips: an HTML string such as "2 x <strong>540</strong> * 2 + <strong>831</strong>"
  detailedCalculation: string,
  detailedCalculationCrit: string,
  detailedCalculationAvg: string,

  // Every factor that went into the number, for "show your work" UIs
  totalDamageContext: {
    type: "attack" | "tuneBreak" | "spectroFrazzle" | "aeroErosion"
        | "fusionBurst" | "glacioChafe" | "electroFlare" | "glacioBiteForte",
    defenseModifier, resistValue /* or resistModifier */, ...
  },
}
```

> The breakdown strings contain `<strong>` tags. Escape or strip them if you render them somewhere that isn't HTML.

### Heal and shield results

```ts
{ healAmount: number, detailedCalculation: string, totalDamageContext: { type: "healing", ... } }
{ shieldAmount: number, detailedCalculation: string, totalDamageContext: { type: "shield", ... } }
```

---

## Talent strings

Talent strings are copied from the game's skill descriptions:

| String | Meaning |
|---|---|
| `"100%"` | One hit at 100% |
| `"51.7%*2"` | Two hits at 51.7% each |
| `"51.7%*2 + 15.91%*2 + 79.53%"` | Five hits |
| `"1200 + 20%"` | Heals/shields only: 1,200 flat plus 20% of the scaling stat |

Each hit is calculated on its own and then summed, so per-hit modifiers land on the right hit.

---

## Per-skill special cases

`talentModifierAdd` normally goes on the last hit. A few multi-hit skills split it across hits the way the game does. You opt in by passing the skill's key as `skillKey`:

| `skillKey` | Split |
|---|---|
| `HeavyAttackSoulRaidDMG` | 7%, 7%, 9%, 9%, 9%, 59% |
| `HeavyAttackStardomeMeanderDMG` | 10%, 10%, 20%, 60% |
| `SawringEradicationDMG` | 20%, 80% |
| `ForeclaimingBladeLiberationBaseDMG` | 20%, 80% |
| `ScarletCodaDMG` | 5%, 5%, then 1.875% × 8, then 75% |
| `HeavySlashNightfallDMG` | Stack-based: `additiveMultiplierStacks` fill hits 1, 2, 5 and 9 in caps of 5, 5, 10 and 20, each stack worth `additiveMultiplierPercent` |

The keys are Wuthering Tools' internal attack keys. Any other `skillKey` uses the default behaviour.

---

## Accuracy and testing

- The formulas are tested in the Wuthering Tools repo (`tests/calculator/`), including the full stat and rotation suites that call them. CI runs those tests before every publish.
- New formulas are checked against in-game damage numbers before they ship. The app's [accuracy guide](https://github.com/ryanbenson/wuthering-waves-optimizer/blob/master/docs/accuracy-verification.md) describes how.
- Found a number that doesn't match the game? Please [open an issue](https://github.com/ryanbenson/wuthering-waves-optimizer/issues) with the character, the build and a screenshot of the in-game hit.

---

## Versioning

The package follows [semver](https://semver.org). While it's `0.x`:

- **Patch** (`0.1.x`): formula fixes and new lookup values. Numbers can change when a fix makes them more accurate. That's the point of the package, so pin a version if you need stable output.
- **Minor** (`0.x.0`): new functions or parameters. Existing positional parameters keep their order.

Planned for 1.0: precise return types and a named-options variant of `calcDamage`.

Source lives in [`packages/formulas`](https://github.com/ryanbenson/wuthering-waves-optimizer/tree/master/packages/formulas). Bumping its `version` on `master` publishes it automatically ([ADR 0036](https://github.com/ryanbenson/wuthering-waves-optimizer/blob/master/docs/adr/0036-formulas-package.md)).

---

## License

[GPL-3.0-or-later](https://github.com/ryanbenson/wuthering-waves-optimizer/blob/master/LICENSE), the same as Wuthering Tools. If you ship software that includes this package, it has to be GPL-compatible too.

Wuthering Waves is a trademark of Kuro Games. This project isn't affiliated with or endorsed by Kuro Games.
