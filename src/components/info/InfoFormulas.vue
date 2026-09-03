<template>
  <div class="bg-base-200 rounded-xl p-4">
    <div class="flex items-center justify-between mb-3 flex-wrap gap-1">
      <div class="text-[.65rem] font-bold uppercase tracking-wider opacity-50">
        Formulas
      </div>
      <span class="text-xs opacity-50">
        Same formulas as the Wuthering Waves Wiki, minus Special Damage (not
        yet in-game).
      </span>
    </div>

    <div class="bg-base-100 rounded-lg p-3 font-mono text-sm mb-4 overflow-x-auto">
      totalAttack * MV * totalAmplify * totalDamageBonus * crit *
      defenseMultiplier * resistMultiplier
    </div>

    <div class="grid gap-3 sm:grid-cols-2">
      <div>
        <div class="text-xs font-bold mb-1">ATK (or HP/DEF)</div>
        <div class="bg-base-100 rounded-lg p-3 font-mono text-sm overflow-x-auto">
          (characterAttack + weaponAttack) * (1 + allAtkPercent) + allFlatAttack
        </div>
      </div>
      <div>
        <div class="text-xs font-bold mb-1">MV</div>
        <div class="bg-base-100 rounded-lg p-3 font-mono text-sm overflow-x-auto">
          (motionValue + additionalMV) * (1 + MVMultipliers)
        </div>
      </div>
      <div>
        <div class="text-xs font-bold mb-1">Amplify</div>
        <div class="bg-base-100 rounded-lg p-3 font-mono text-sm overflow-x-auto">
          (1 + allAmplify)
        </div>
      </div>
      <div>
        <div class="text-xs font-bold mb-1">Damage Bonus</div>
        <div class="bg-base-100 rounded-lg p-3 font-mono text-sm overflow-x-auto">
          (1 + elementalDmgBonus + attackDmgBonus + skillSpecificDmgBonus ...)
        </div>
      </div>
      <div>
        <div class="text-xs font-bold mb-1">Crit</div>
        <p class="text-sm opacity-80">
          Looking at no-crit? Ignore this, or just use
          <code>1</code>. Looking for crit damage?
          <code>(totalCritDamage)</code>
          — do not add 1 to it.
        </p>
      </div>
      <div>
        <div class="text-xs font-bold mb-1">Defense Multiplier</div>
        <div class="bg-base-100 rounded-lg p-3 font-mono text-xs overflow-x-auto">
          (800 + 8 * charLevel) / (800 + 8 * charLevel + (8 * enemyLevel + 792)
          * (1 - defIgnore) * (1 - defReduction))
        </div>
      </div>
      <div>
        <div class="text-xs font-bold mb-1">Resistance Multiplier</div>
        <p class="text-sm opacity-80 mb-1">
          If resistanceReduction pushes total resistance under 0, the
          remainder is halved.
        </p>
        <div class="bg-base-100 rounded-lg p-3 font-mono text-sm overflow-x-auto">
          (1 - resistance + resistanceReduction)
        </div>
      </div>
      <div>
        <div class="text-xs font-bold mb-1">Shields &amp; Healing</div>
        <div class="bg-base-100 rounded-lg p-3 font-mono text-sm overflow-x-auto">
          (MV% * finalAtkDefHpVal + flatBase) * (1 + totalHealBonus)
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDocumentTitle } from "../../composables/useDocumentTitle";

useDocumentTitle(
  "Formulas — Wuthering Waves Calculator & Optimizer",
  "The damage, defense, resistance, and healing formulas used by the Wuthering Waves Calculator & Optimizer.",
);
</script>
