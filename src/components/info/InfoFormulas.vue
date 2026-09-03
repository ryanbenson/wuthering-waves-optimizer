<template>
  <div class="bg-base-200 rounded-xl p-4">
    <div class="flex items-center justify-between mb-4 flex-wrap gap-1">
      <div class="text-[.65rem] font-bold uppercase tracking-wider opacity-50">
        Formulas
      </div>
      <span class="text-xs opacity-50">
        Same formulas as the Wuthering Waves Wiki, minus Special Damage (not
        yet in-game).
      </span>
    </div>

    <div class="flex flex-col gap-4">
      <div>
        <div class="text-xs font-bold mb-1 opacity-70">The full formula</div>
        <div
          class="bg-base-100 rounded-lg p-3 font-mono text-sm overflow-x-auto"
          v-html="styleFormula('totalAttack * MV * totalAmplify * totalDamageBonus * crit * defenseMultiplier * resistMultiplier')"></div>
      </div>

      <div v-for="block in formulaBlocks" :key="block.label">
        <div class="text-xs font-bold mb-1">{{ block.label }}</div>
        <p v-if="block.note" class="text-sm opacity-70 mb-1">{{ block.note }}</p>
        <div
          v-if="block.expr"
          class="bg-base-100 rounded-lg p-3 font-mono text-sm overflow-x-auto"
          v-html="styleFormula(block.expr)"></div>
      </div>

      <div>
        <div class="text-xs font-bold mb-1">Crit</div>
        <p class="text-sm opacity-80">
          Looking at no-crit? Ignore this, or just use
          <code class="text-primary font-semibold">1</code>. Looking for crit
          damage?
          <code class="text-primary font-semibold">(totalCritDamage)</code>
          — do not add 1 to it.
        </p>
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

const formulaBlocks = [
  {
    label: "ATK (or HP/DEF)",
    expr: "(characterAttack + weaponAttack) * (1 + allAtkPercent) + allFlatAttack",
  },
  {
    label: "MV",
    expr: "(motionValue + additionalMV) * (1 + MVMultipliers)",
  },
  {
    label: "Amplify",
    expr: "(1 + allAmplify)",
  },
  {
    label: "Damage Bonus",
    expr: "(1 + elementalDmgBonus + attackDmgBonus + skillSpecificDmgBonus ...)",
  },
  {
    label: "Defense Multiplier",
    expr:
      "(800 + 8 * charLevel) / (800 + 8 * charLevel + (8 * enemyLevel + 792) * (1 - defIgnore) * (1 - defReduction))",
  },
  {
    label: "Resistance Multiplier",
    note: "If resistanceReduction pushes total resistance under 0, the remainder is halved.",
    expr: "(1 - resistance + resistanceReduction)",
  },
  {
    label: "Shields & Healing",
    expr: "(MV% * finalAtkDefHpVal + flatBase) * (1 + totalHealBonus)",
  },
];

/**
 * Light syntax-highlighting for a formula string: identifiers get the
 * primary accent color, math operators/parens are dimmed. Safe to render
 * with v-html - every input is a hardcoded constant string above, never
 * user data.
 */
function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function styleFormula(expr: string): string {
  return expr
    .split(/(\s*[*/+\-()]\s*)/g)
    .map((token) => {
      if (!token) return "";
      const trimmed = token.trim();
      if (/^[*/+\-()]$/.test(trimmed)) {
        return `<span class="opacity-35">${escapeHtml(token)}</span>`;
      }
      if (/^[A-Za-z][A-Za-z0-9]*%?$/.test(trimmed)) {
        return `<span class="text-primary font-semibold">${escapeHtml(token)}</span>`;
      }
      return escapeHtml(token);
    })
    .join("");
}
</script>
