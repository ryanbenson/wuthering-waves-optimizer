<template>
  <div class="live-result-rotations">
    <template v-if="!rotationsList.length || !allDamages?.value?.rotations">
      <div class="empty-state">No rotations saved for this character yet.</div>
    </template>
    <template v-else>
      <div
        v-for="rotation in sortedDamageRotations"
        class="rotation__item"
        :key="rotation.id"
        :data-test-live-result-rotation="rotation.name">
        <h3 class="text-base font-bold" v-tooltip="rotation.description">
          {{ rotation.name }}
        </h3>

        <div class="rotation__summary">
          <div
            v-for="block in rotationSummaryBlocks(rotation)"
            :key="block.key"
            class="rotation__summary-block">
            <span class="rotation__summary-block-label">{{ block.label }}</span>
            <div class="rotation__summary-cells">
              <div v-for="cell in block.cells" :key="cell.label" class="rotation__summary-cell">
                <span class="rotation__summary-cell-label">{{ cell.label }}</span>
                <span class="rotation__summary-cell-value font-mono font-bold tabular-nums">{{
                  cell.value
                }}</span>
              </div>
            </div>
          </div>
          <div
            v-if="rotation.damageAggregation.healing"
            class="rotation__summary-chip rotation__summary-chip--healing">
            <span class="rotation__summary-chip-label">Total Healing</span>
            <span class="rotation__summary-chip-value font-mono font-bold tabular-nums">{{
              displayDamage(rotation.damageAggregation.healing).toLocaleString()
            }}</span>
          </div>
          <div
            v-if="rotation.damageAggregation.shield"
            class="rotation__summary-chip rotation__summary-chip--shield">
            <span class="rotation__summary-chip-label">Total Shield</span>
            <span class="rotation__summary-chip-value font-mono font-bold tabular-nums">{{
              displayDamage(rotation.damageAggregation.shield).toLocaleString()
            }}</span>
          </div>
        </div>

        <template v-if="!rotation.attacks?.length">
          <div class="calculation__damage__item">No attacks in this rotation</div>
        </template>
        <template v-else>
          <CalculatorDamageChart
            :key="rotation.id"
            :character="character"
            :rotation="rotation"
            :unique-key="rotation.id"
            :name="rotation.name"
            :char-buffs-data="charBuffsData"
            :char-resonance-chains-data="charResonanceChainsData"
            :chart-width="220" />
          <table class="live-dmg-table table table-zebra table-sm">
            <thead>
              <tr>
                <th>&nbsp;</th>
                <th class="w-20">Normal</th>
                <th class="w-20">Average</th>
                <th class="w-20">Crit</th>
              </tr>
            </thead>
            <tbody>
              <CalculatorDamage
                v-for="damageInstance in rotation.attacks"
                :key="damageInstance.id"
                :attack-key="damageInstance.key"
                :character="character"
                :type="damageInstance.type"
                :label="damageInstance.label"
                :damage="damageInstance.damage"
                :count="damageInstance.count ?? 1"
                :is-enabled="damageInstance.isEnabled"
                :main-echo="damageInstance.mainEcho"
                :main-echo-rank="damageInstance.mainEchoRank"
                :original-is-enabled="damageInstance.originalIsEnabled"
                :always-crit="damageInstance.alwaysCrit"
                @selected-attack="(...args) => emit('selected-attack', ...args)"></CalculatorDamage>
            </tbody>
            <tfoot>
              <tr
                v-if="rotation.damageAggregation.normalDamage"
                class="rotation-total-damage">
                <td>Total Damage</td>
                <td>
                  {{ displayDamage(rotation.damageAggregation.normalDamage) }}
                </td>
                <td>{{ displayDamage(rotation.damageAggregation.avgDamage) }}</td>
                <td>
                  {{ displayDamage(rotation.damageAggregation.critDamage) }}
                </td>
              </tr>
              <tr
                v-if="rotation.damageAggregation.healing"
                class="calculation__damage__item--healing">
                <td>Total Healing</td>
                <td>{{ displayDamage(rotation.damageAggregation.healing) }}</td>
                <td></td>
                <td></td>
              </tr>
              <tr
                v-if="rotation.damageAggregation.shield"
                class="calculation__damage__item--shield">
                <td>Total Shield</td>
                <td>{{ displayDamage(rotation.damageAggregation.shield) }}</td>
                <td></td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { displayDamage } from "../utils/numbers";
import { calcRotationDps } from "../calculator/teamRotation";
import CalculatorDamage from "./CalculatorDamage.vue";
import CalculatorDamageChart from "./CalculatorDamageChart.vue";

defineOptions({ name: "CalculatorLiveResultRotations" });

const props = defineProps<{
  character: string;
  allDamages: Record<string, any> | null | undefined;
  rotationsList: any[];
  charBuffsData: Record<string, any>;
  charResonanceChainsData: Record<string, any>;
}>();

const emit = defineEmits<{
  "selected-attack": [attackKey: string, damage: Record<string, any>, label: string];
}>();

function rotationDps(rotation: { damageAggregation: any; duration: unknown }) {
  return calcRotationDps(rotation.damageAggregation, rotation.duration as any);
}

const sortedDamageRotations = computed(() => {
  const rotations = props.allDamages?.value?.rotations;
  if (!Array.isArray(rotations)) {
    return [];
  }
  return [...rotations].sort((a, b) => {
    const aOrder = Number.isFinite(Number(a?.order))
      ? Number(a.order)
      : Number.MAX_SAFE_INTEGER;
    const bOrder = Number.isFinite(Number(b?.order))
      ? Number(b.order)
      : Number.MAX_SAFE_INTEGER;
    return aOrder - bOrder;
  });
});

// Comma-formats the otherwise-unformatted Math.ceil() displayDamage() gives —
// worth it here since these are the headline aggregate numbers for the
// rotation, unlike the many small per-attack cells in the table below.
function formatAggregateDamage(value: number): string {
  return displayDamage(value).toLocaleString();
}

function rotationSummaryBlocks(rotation: { damageAggregation: any; duration: unknown }) {
  const agg = rotation.damageAggregation;
  const blocks = [
    {
      key: "total",
      label: "Total DMG",
      cells: [
        { label: "Normal", value: formatAggregateDamage(agg.normalDamage) },
        { label: "Average", value: formatAggregateDamage(agg.avgDamage) },
        { label: "Crit", value: formatAggregateDamage(agg.critDamage) },
      ],
    },
  ];
  if (rotation.duration) {
    const dps = rotationDps(rotation);
    blocks.push({
      key: "dps",
      label: `DPS (${rotation.duration}s)`,
      cells: [
        { label: "Normal", value: formatAggregateDamage(dps.normal) },
        { label: "Average", value: formatAggregateDamage(dps.avg) },
        { label: "Crit", value: formatAggregateDamage(dps.crit) },
      ],
    });
  }
  return blocks;
}
</script>

<style scoped lang="scss">
.rotation__item {
  padding-top: 20px;

  &:first-child {
    padding-top: 0;
  }
}
.empty-state {
  padding: 20px 4px;
  font-size: 13.5px;
  color: oklch(var(--bc) / 0.6);
}

// See the matching comment in CalculatorLiveResultAttackGroup.vue — same
// reasoning: not `.calculator__damages` (a global rule with its own
// still-live legacy callers), :deep() reaches into <CalculatorDamage>'s own
// template cells, which carry no font-size of their own.
.live-dmg-table {
  :deep(td) {
    padding: 3px 6px;
    font-size: 13px;
  }
  :deep(td:not(:first-child)) {
    font-family:
      ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
      "Courier New", monospace;
    font-variant-numeric: tabular-nums;
  }
}

.rotation__summary {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}
.rotation__summary-block {
  flex: 1 1 auto;
  min-width: 100%;
  background: oklch(var(--b2));
  border-radius: 8px;
  padding: 8px 10px;
}
.rotation__summary-block-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: oklch(var(--bc) / 0.55);
}
.rotation__summary-cells {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 4px;
  margin-top: 4px;
}
.rotation__summary-cell {
  display: flex;
  flex-direction: column;
}
.rotation__summary-cell-label {
  font-size: 9.5px;
  color: oklch(var(--bc) / 0.5);
}
.rotation__summary-cell-value {
  font-size: 13px;
}
.rotation__summary-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  background: oklch(var(--b2));
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 11.5px;
}
.rotation__summary-chip-label {
  font-weight: 700;
  opacity: 0.75;
}
.rotation__summary-chip-value {
  font-size: 12px;
}
.rotation__summary-chip--healing {
  color: #3bea3b;
}
.rotation__summary-chip--shield {
  color: #00adff;
}
html[data-theme-style="light"] {
  .rotation__summary-chip--healing {
    color: #13a813;
  }
  .rotation__summary-chip--shield {
    color: #4a92ff;
  }
}

.calculation__damage__item--healing {
  color: #3bea3b;
}
.calculation__damage__item--shield {
  color: #00adff;
}
html[data-theme-style="light"] {
  .calculation__damage__item--healing {
    color: #13a813;
  }
  .calculation__damage__item--shield {
    color: #4a92ff;
  }
}
</style>
