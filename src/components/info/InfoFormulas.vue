<template>
  <div class="flex flex-col gap-7" data-test-info-formulas>
    <header class="flex flex-col gap-2 max-w-3xl">
      <h1 class="text-3xl sm:text-4xl leading-tight font-extrabold text-base-content">
        How one hit becomes the number you see
      </h1>
      <p class="text-lg leading-relaxed">
        Damage is one long multiplication. Follow a sample crit from ATK to the
        final number, and see which steps raise it and which the enemy takes
        away. These are the same formulas as the Wuthering Waves Wiki, minus
        Special Damage, which isn't in the game yet.
      </p>
    </header>

    <section class="bg-base-200 rounded-2xl p-4 sm:p-6 flex flex-col gap-5" data-test-formula-walkthrough>
      <div class="flex flex-col gap-1.5">
        <div
          v-for="step in steps"
          :key="step.label"
          class="grid grid-cols-[minmax(0,1fr)_auto_5.5rem] sm:grid-cols-[13rem_5rem_minmax(0,1fr)_5.5rem] gap-x-3 gap-y-1 items-center sm:min-h-10"
          :data-test-formula-step="step.label">
          <span class="font-medium text-base-content">{{ step.label }}</span>
          <span class="font-mono text-sm">{{ step.factor }}</span>
          <span class="col-span-3 row-start-2 sm:col-span-1 sm:row-start-auto h-5 rounded bg-base-300 overflow-hidden">
            <span
              class="block h-full rounded"
              :class="step.reduces ? 'bg-warning' : 'bg-primary'"
              :style="{ width: `${(step.total / maxTotal) * 100}%` }"></span>
          </span>
          <span class="font-mono tabular-nums text-right text-base-content" data-test-formula-total>
            {{ Math.round(step.total).toLocaleString("en-US") }}
          </span>
        </div>
      </div>
      <div class="grid gap-5 sm:grid-cols-3 pt-4 border-t border-base-300">
        <label class="form-control">
          <span class="flex justify-between gap-2 pb-1 font-medium">Total ATK <span class="font-mono">{{ attack }}</span></span>
          <input v-model.number="attack" type="range" min="500" max="4000" step="50" class="range range-primary range-sm" data-test-formula-attack />
        </label>
        <label class="form-control">
          <span class="flex justify-between gap-2 pb-1 font-medium">DMG Bonus <span class="font-mono">{{ bonusPercent }}%</span></span>
          <input v-model.number="bonusPercent" type="range" min="0" max="150" step="5" class="range range-primary range-sm" data-test-formula-bonus />
        </label>
        <label class="form-control">
          <span class="flex justify-between gap-2 pb-1 font-medium">Enemy resistance <span class="font-mono">{{ resistPercent }}%</span></span>
          <input v-model.number="resistPercent" type="range" min="0" max="40" step="5" class="range range-primary range-sm" data-test-formula-resist />
        </label>
      </div>
      <p class="text-sm leading-relaxed">
        Sample values, not a real character: {{ SAMPLE_MOTION_VALUE * 100 }}% multiplier,
        {{ SAMPLE_CRIT_DAMAGE * 100 }}% Crit DMG, level {{ SAMPLE_LEVEL }} attacker
        against a level {{ SAMPLE_LEVEL }} enemy, with no amplify, DEF ignore or
        resistance reduction.
      </p>
    </section>

    <section class="grid gap-4 lg:grid-cols-2 items-start">
      <div v-for="group in formulaGroups" :key="group.title" class="bg-base-200 rounded-2xl p-4 sm:p-6 flex flex-col gap-4 min-w-0">
        <h2 class="text-xl font-bold">{{ group.title }}</h2>
        <div v-for="block in group.blocks" :key="block.label" class="min-w-0">
          <div class="font-semibold text-base-content mb-1">{{ block.label }}</div>
          <p v-if="block.note" class="text-sm leading-relaxed mb-1.5">{{ block.note }}</p>
          <div
            v-if="block.expr"
            class="bg-base-100 rounded-lg p-3 font-mono text-sm overflow-x-auto"
            v-html="styleFormula(block.expr)"></div>
          <div v-if="block.example" class="text-xs mt-1 font-mono overflow-x-auto">
            e.g. {{ block.example }}
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useDocumentTitle } from "../../composables/useDocumentTitle";
import {
  SAMPLE_CRIT_DAMAGE,
  SAMPLE_LEVEL,
  SAMPLE_MOTION_VALUE,
  buildSampleHitSteps,
} from "../../utils/formulaWalkthrough";

useDocumentTitle(
  "Formulas — Wuthering Waves Calculator & Optimizer",
  "The damage, defense, resistance, healing, and negative status (DoT) formulas used by the Wuthering Waves Calculator & Optimizer.",
);

const attack = ref(2600);
const bonusPercent = ref(60);
const resistPercent = ref(10);
const steps = computed(() =>
  buildSampleHitSteps({
    attack: attack.value,
    damageBonus: bonusPercent.value / 100,
    enemyResist: resistPercent.value / 100,
  }),
);
const maxTotal = computed(() => Math.max(...steps.value.map((step) => step.total)));

interface FormulaBlock {
  label: string;
  note?: string;
  expr?: string;
  example?: string;
}

const formulaGroups: { title: string; blocks: FormulaBlock[] }[] = [
  {
    title: "Each step, exactly",
    blocks: [
      {
        label: "The full formula",
        expr: "totalAttack * MV * totalAmplify * totalDamageBonus * crit * defenseMultiplier * resistMultiplier",
      },
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
        label: "Crit",
        note: "Looking at no-crit? Ignore this, or use 1. Looking for crit damage? Use totalCritDamage, and do not add 1 to it.",
      },
    ],
  },
  {
    title: "What the enemy takes away, and other damage",
    blocks: [
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
      {
        label: "Negative Status DMG (Fusion, Frazzle, Erosion, Chafe, Flare)",
        note: "Damage-over-time effects from stacking a status - Fusion Burst, Spectro Frazzle, Aero Erosion, Glacio Chafe, Electro Flare - use a level-based constant instead of ATK. DEF Ignore and Resist Ignore don't apply to this damage type.",
        expr: "levelConstant * (MV / 10000) * (1 + talentMultiplier) * defenseMultiplier * resistMultiplier * (1 + totalAmplify)",
        example:
          "285560 = 3674 × (1 + 850.00%) × (139726 ÷ 10000) × 61.9619097312% × 90.0% × (1 + 5.0%)",
      },
    ],
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
