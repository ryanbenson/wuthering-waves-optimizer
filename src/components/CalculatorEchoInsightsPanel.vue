<template>
  <div
    class="echo-insights card card-bordered card-compact bg-base-100 shadow"
    data-test-echo-insights-panel>
    <div class="card-body">
      <component
        :is="canToggle ? 'button' : 'div'"
        v-if="insights.equippedCount > 0"
        :type="canToggle ? 'button' : undefined"
        class="echo-insights__build-score rounded-lg bg-base-200 border-l-4 px-4 py-3 flex items-center justify-between gap-3"
        :class="[
          substatScoreRollupAccent?.border,
          canToggle ? 'w-full text-left' : '',
          { 'mb-4': showDetails },
        ]"
        :aria-expanded="canToggle ? isExpanded : undefined"
        data-test-echo-insights-build-score
        :data-test-echo-insights-toggle="canToggle ? '' : undefined"
        @click="canToggle && (isExpanded = !isExpanded)">
        <span class="text-sm font-semibold uppercase tracking-widest opacity-60">
          Build Score
        </span>
        <div class="flex items-center gap-2">
          <div v-if="substatScoreRollup" class="flex items-baseline gap-2">
            <span class="text-4xl font-extrabold" :class="substatScoreRollupAccent?.text">
              {{ substatScoreRollup.grade }}
            </span>
            <span class="text-4xl font-extrabold" :class="substatScoreRollupAccent?.text">
              {{ Math.round(substatScoreRollup.percent) }}%{{ substatScoreRollup.provisional ? "*" : "" }}
            </span>
          </div>
          <svg
            v-if="canToggle"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="size-4 shrink-0 opacity-60 transition-transform"
            :class="{ 'rotate-180': isExpanded }"
            fill="none"
            stroke="currentColor"
            aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </component>

      <div
        v-else
        class="echo-insights__build-score rounded-lg bg-base-200 border-l-4 border-l-base-300 px-4 py-3 flex items-center justify-between gap-3"
        data-test-echo-insights-build-score>
        <span class="text-sm font-semibold uppercase tracking-widest opacity-60">
          Build Score
        </span>
        <span class="text-xs opacity-60">Equip an echo to see build insights here</span>
      </div>

      <template v-if="showDetails && insights.equippedCount > 0">
        <div
          v-if="rollFor.length"
          class="rounded-lg bg-base-200 border-l-4 border-l-success px-4 py-2.5 mb-4 flex flex-col gap-0.5"
          data-test-echo-insights-roll-for>
          <span class="text-xs font-semibold uppercase tracking-widest text-success">Roll for</span>
          <span class="font-semibold">
            <span data-test-echo-insights-roll-for-best>{{ getReadableSubStatLabel(rollFor[0].key) }}</span>
            <span class="font-mono text-success ml-1">
              {{ formatRollGain(rollFor[0].gain.delta) }} · +{{ (rollFor[0].gain.pct * 100).toFixed(1) }}%
            </span>
          </span>
          <span v-if="rollFor.length > 1" class="text-xs opacity-60">
            Then {{ rollForRest }}
          </span>
        </div>

        <div class="flex items-center justify-between gap-2 mb-3">
          <h3 class="text-sm font-semibold">Echo Insights</h3>
          <span class="text-xs opacity-60" data-test-echo-insights-equipped-count>
            {{ insights.equippedCount }}/5 echoes equipped
          </span>
        </div>

        <div class="echo-insights__stat flex items-center justify-between mb-3">
          <span class="text-xs opacity-60">Total Crit Value</span>
          <span class="font-mono font-bold" data-test-echo-insights-total-cv>
            {{ insights.totalCV.toFixed(1) }}%
          </span>
        </div>

        <div v-if="insights.relevantRollPercent !== null" class="mb-4" data-test-echo-insights-relevance>
          <div class="flex items-center justify-between text-xs mb-1">
            <span class="opacity-60">Rolls on priority substats</span>
            <span class="font-mono font-bold">{{ insights.relevantRollPercent }}%</span>
          </div>
          <progress
            class="progress progress-primary w-full"
            :value="insights.relevantRollPercent"
            max="100"></progress>
        </div>

        <!--
          Side by side once this is the desktop (always-expanded) instance
          AND the viewport is wide enough — the wider sidebar it lives in
          (see CalculatorEchoes.vue's .echoes-sidebar) has the room at that
          point, and stacking both lists vertically here was pushing the
          panel's bottom past the fold. alwaysExpanded doubles as "this is
          the desktop instance" (the mobile pinned bar never passes it — see
          the prop comment below); the 1400px floor on top of that handles
          the narrower end of the desktop instance's own range (it's still
          visible down to 769px, where two columns don't fit) — see the
          --split modifier below.
        -->
        <template v-if="insights.isCurated">
          <div
            v-if="insights.priorityRows.length || insights.otherRows.length"
            class="echo-insights__substat-groups"
            :class="{ 'echo-insights__substat-groups--split': alwaysExpanded }">
            <div v-if="insights.priorityRows.length" class="mb-4">
              <div class="flex items-baseline justify-between gap-2 text-xs font-semibold uppercase tracking-wide opacity-60 mb-1.5">
                <span>Priority substats</span>
                <span v-if="showRollGains">Next roll</span>
              </div>
              <div class="flex flex-col gap-1">
                <div
                  v-for="row in insights.priorityRows"
                  :key="row.type"
                  class="echo-insights__row flex flex-wrap items-center gap-x-2 gap-y-1 text-xs"
                  :class="{ 'echo-insights__row--missing': row.missing }"
                  :data-test-echo-insights-row="row.type">
                  <img :src="row.icon" class="size-4 shrink-0" />
                  <span class="flex-1 min-w-0">{{ row.label }}</span>
                  <template v-if="row.missing">
                    <span class="echo-insights__missing-tag">0 rolls</span>
                  </template>
                  <template v-else>
                    <span class="badge badge-xs badge-ghost font-mono">×{{ row.count }}</span>
                    <span class="font-mono font-bold">{{ row.formattedTotal }}</span>
                  </template>
                  <EchoInsightsRollGain
                    v-if="showRollGains"
                    :type="row.type"
                    :gain="rollValues?.gains[row.type]"
                    :max-delta="maxRollDelta"
                    :label="rollValues?.label ?? ''"
                    :loading="rollValuesLoading" />
                </div>
              </div>
            </div>

            <div v-if="insights.otherRows.length" class="mb-4">
              <div class="text-xs font-semibold uppercase tracking-wide opacity-60 mb-1.5">
                Other rolled substats
              </div>
              <div class="flex flex-col gap-1">
                <div
                  v-for="row in insights.otherRows"
                  :key="row.type"
                  class="echo-insights__row flex flex-wrap items-center gap-x-2 gap-y-1 text-xs"
                  :data-test-echo-insights-row="row.type">
                  <img :src="row.icon" class="size-4 shrink-0" />
                  <span class="flex-1 min-w-0">{{ row.label }}</span>
                  <span class="badge badge-xs badge-ghost font-mono">×{{ row.count }}</span>
                  <span class="font-mono font-bold">{{ row.formattedTotal }}</span>
                  <EchoInsightsRollGain
                    v-if="showRollGains"
                    :type="row.type"
                    :gain="rollValues?.gains[row.type]"
                    :max-delta="maxRollDelta"
                    :label="rollValues?.label ?? ''"
                    :loading="rollValuesLoading" />
                </div>
              </div>
            </div>
          </div>
        </template>

        <template v-else>
          <p class="text-xs opacity-60 mb-2">
            Substat priorities aren't set for this character — showing raw totals only.
          </p>
          <div class="flex flex-col gap-1">
            <div
              v-for="row in insights.otherRows"
              :key="row.type"
              class="echo-insights__row flex flex-wrap items-center gap-x-2 gap-y-1 text-xs"
              :data-test-echo-insights-row="row.type">
              <img :src="row.icon" class="size-4 shrink-0" />
              <span class="flex-1 min-w-0">{{ row.label }}</span>
              <span class="badge badge-xs badge-ghost font-mono">×{{ row.count }}</span>
              <span class="font-mono font-bold">{{ row.formattedTotal }}</span>
              <EchoInsightsRollGain
                v-if="showRollGains"
                :type="row.type"
                :gain="rollValues?.gains[row.type]"
                :max-delta="maxRollDelta"
                :label="rollValues?.label ?? ''"
                :loading="rollValuesLoading" />
            </div>
          </div>
        </template>
        <p v-if="rollValues" class="text-xs opacity-60 mt-3" data-test-echo-insights-roll-note>
          Next roll: what one more average roll adds to
          <span class="font-semibold opacity-100">{{ rollValues.label }}</span>
          ({{ rollValues.damageType }}) in the Live Result Bar.
        </p>
        <p
          v-else-if="!rollValuesLoading && rollValuesUnavailable"
          class="text-xs opacity-60 mt-3"
          data-test-echo-insights-roll-unavailable>
          Pick an attack or rotation in the Live Result Bar to see what each roll adds.
        </p>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useEchoInsights } from "../composables/useEchoInsights";
import { useTeamSubstatScoreRollup } from "../composables/useTeamSubstatScoreRollup";
import { getRatingAccentClasses } from "../composables/useEchoRating";
import EchoInsightsRollGain from "./EchoInsightsRollGain.vue";
import { getReadableSubStatLabel } from "../echoes/stats";
import { formatRollGain, pickRollFor, type SubstatRollValues } from "../echoes/substatRollValue";

defineOptions({ name: "CalculatorEchoInsightsPanel" });

const props = withDefaults(
  defineProps<{
    character: string;
    // CalculatorEchoes.vue renders two instances of this component — a
    // desktop sidebar (always-expanded, no toggle — the original design,
    // restored per review feedback: the pinned/collapsible bar below is
    // mobile-only) and a mobile-only pinned bar (collapsible, default
    // false). CSS media queries pick which one is visible, matching the
    // existing CalculatorSubNav/CalculatorMobileSubNav pattern in
    // Calculator.vue rather than a JS breakpoint check — this app has no
    // useBreakpoint-style composable to reuse, and every other responsive
    // split in this redesign is CSS-only too.
    alwaysExpanded?: boolean;
    // What one more roll of each substat adds (ADR 0056). Calculated once
    // by CalculatorEchoes.vue (useSubstatRollValues) and shared by both
    // instances. Left out, the panel shows no roll values.
    rollValues?: SubstatRollValues | null;
    rollValuesLoading?: boolean;
  }>(),
  { alwaysExpanded: false, rollValues: undefined, rollValuesLoading: false },
);

const { insights } = useEchoInsights(() => props.character);

// Same Build Score used by CalculatorEchoes.vue's own header pill (now
// hidden there once this panel is showing — see docs/adr/0014 decision
// #10) and CalculatorBuildCard.vue, whose big/bold treatment this mirrors.
const { rollup: substatScoreRollup } = useTeamSubstatScoreRollup(() => props.character);
const substatScoreRollupAccent = computed(() =>
  substatScoreRollup.value ? getRatingAccentClasses(substatScoreRollup.value.color) : null,
);

// The mobile instance is a sticky bar pinned at the top of the Echoes tab
// (see docs/adr/0030-echoes-tab-v3-redesign.md) — collapsed to just the
// Build Score hero by default so it stays compact while pinned, expandable
// on click to reveal the rest. Collapses back whenever the character
// changes (a fresh :key remounts this component per CalculatorEchoes.vue's
// :key="characterBuildKey" on its own ancestor, so a plain ref default is
// enough — no watcher needed).
const isExpanded = ref(false);

// undefined = this screen doesn't calculate roll values at all; null = it
// does, but there's nothing to measure (a Stat target, or no damage).
const rollValuesUnavailable = computed(() => props.rollValues === null);
const showRollGains = computed(
  () => props.rollValues !== undefined && (Boolean(props.rollValues) || props.rollValuesLoading),
);
const maxRollDelta = computed(() =>
  Math.max(0, ...Object.values(props.rollValues?.gains ?? {}).map((gain) => gain.delta)),
);
const rollFor = computed(() => (props.rollValues ? pickRollFor(props.rollValues.gains) : []));
const rollForRest = computed(() => {
  const rest = rollFor.value.slice(1).map(
    (pick) => `${getReadableSubStatLabel(pick.key)} (${formatRollGain(pick.gain.delta)})`,
  );
  return rest.length > 1 ? `${rest.slice(0, -1).join(", ")} and ${rest[rest.length - 1]}` : rest[0];
});
const canToggle = computed(() => !props.alwaysExpanded && insights.value.equippedCount > 0);
const showDetails = computed(() => props.alwaysExpanded || isExpanded.value);
</script>

<style scoped>
.echo-insights__row {
  border: 1px solid oklch(var(--b3));
  border-radius: 0.5rem;
  padding: 0.4rem 0.55rem;
  background: oklch(var(--b2));
}

.echo-insights__row--missing {
  border-style: dashed;
  opacity: 0.7;
}

.echo-insights__missing-tag {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: oklch(var(--er));
}

/*
 * Stacked by default (mobile-bar instance, and the desktop instance at
 * narrower widths); --split only ever goes side by side from 1400px, even
 * though the modifier class itself is present down to 769px (the desktop
 * instance's whole visible range — see CalculatorEchoes.vue's
 * .echoes-layout, hidden below 768px). A real viewport breakpoint, not just
 * the alwaysExpanded prop, since the desktop sidebar doesn't have room for
 * two columns for its own narrower stretch (769-1399px).
 */
.echo-insights__substat-groups {
  display: flex;
  flex-direction: column;
}

/* 1400px, not 1025px: with a "Next roll" value on each row (ADR 0056), each
   list needs about 340px, and the sidebar only has room for two from here. */
@media (min-width: 1400px) {
  .echo-insights__substat-groups--split {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
}

/* Priority/Other-rolled-substat row icons are dark-line glyphs drawn for a
   dark background — same light-mode inversion convention as
   EchoCardSubstatList.vue / CalculatorEchoTile.vue's substat icons. */
html[data-theme-style="light"] img {
  filter: contrast(0);
}
</style>
