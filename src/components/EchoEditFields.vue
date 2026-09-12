<template>
  <div class="px-4 pt-3 shrink-0">
    <div class="text-xs font-semibold uppercase tracking-wide opacity-60 mb-1">Rank</div>
    <div class="flex gap-1">
      <button
        v-for="r in [2, 3, 4, 5]"
        :key="r"
        type="button"
        class="btn btn-xs"
        :class="String(rank) === String(r) ? 'btn-primary' : 'btn-ghost'"
        :disabled="isEchoLocked"
        :aria-pressed="String(rank) === String(r)"
        :data-test-echo-edit-rank="r"
        @click="setRank(r)">
        {{ r }}★
      </button>
    </div>
  </div>

  <div
    v-if="isEchoLocked"
    class="mx-4 mt-3 alert alert-warning p-2 text-xs"
    data-test-echo-edit-locked-notice>
    This echo is locked — unlock it to change its stats.
  </div>

  <div :class="scrollable ? 'flex-1 overflow-y-auto p-4 flex flex-col gap-4' : 'p-4 flex flex-col gap-4'">
    <div class="echo-edit-panel__locked-row flex items-center gap-2" data-test-echo-edit-cost-row>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="size-3.5 shrink-0 opacity-60"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        v-tooltip="'Set by which echo you picked'">
        <rect x="5" y="11" width="14" height="9" rx="2" stroke-width="1.8" />
        <path d="M8 11V8a4 4 0 018 0v3" stroke-width="1.8" />
      </svg>
      <span class="badge badge-sm font-mono">Cost {{ type ?? "—" }}</span>
      <span v-if="freeStatType" class="badge badge-sm badge-ghost font-mono">
        {{ freeStatLabel }} +{{ freeStatValue }}
      </span>
    </div>

    <div>
      <div class="text-xs font-semibold uppercase tracking-wide opacity-60 mb-1">Main stat</div>
      <AppRichSelect
        v-model="stat"
        :options="mainStatOptions"
        :disabled="!type || isEchoLocked"
        placeholder="Select stat"
        aria-label="Main stat"
        data-test="echo-edit-main-stat" />
    </div>

    <div>
      <div class="text-xs font-semibold uppercase tracking-wide opacity-60 mb-1">Substats</div>
      <div class="flex flex-col gap-2">
        <div
          v-for="(slot, i) in slots"
          :key="i"
          class="echo-edit-panel__slot"
          :class="{ 'echo-edit-panel__slot--empty': !isSlotFilled(i) }"
          :data-test-echo-edit-slot="i">
          <div class="flex items-center gap-2">
            <span class="echo-edit-panel__slot-index">{{ i + 1 }}</span>
            <AppRichSelect
              class="flex-1 min-w-0"
              :model-value="slot.type.value === 'none' ? null : slot.type.value"
              :options="getSubstatOptions(i)"
              allow-empty
              :disabled="isEchoLocked"
              empty-label="Choose substat"
              placeholder="Choose substat"
              :aria-label="`Substat ${i + 1} type`"
              :data-test="`echo-edit-slot-type-${i}`"
              @update:model-value="(v) => assignSlotIfUnlocked(i, v as string | null)" />
          </div>
          <div v-if="isSlotFilled(i)" class="mt-2">
            <EchoSubstatSlider
              :id="`echo-substat-${i}`"
              :values="getSubStatRange(slot.type.value)"
              :model-value="slot.value.value"
              :unit="slot.type.value.includes('FLAT') ? '' : '%'"
              :disabled="isEchoLocked"
              :aria-label="`Substat ${i + 1} value`"
              :data-test-echo-edit-slot-value="i"
              @update:model-value="(v) => setSlotValueIfUnlocked(i, v)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Field-editing body extracted from CalculatorEchoEditPanel.vue — see
// docs/adr/0030-echoes-tab-v3-redesign.md decision #6. Header chrome
// (avatar/name/badges/Find/Browse/set-icon row/close button) stays
// per-host, since the docked panel and the inline-in-tile editor need
// genuinely different chrome; this is the part that's identical either
// way. Self-sources via useEchoEditFields(target) rather than taking a
// dozen props/emits, mirroring how CalculatorEchoTile.vue and
// CalculatorEchoEditPanel.vue already each independently call the
// composable today.
import { computed } from "vue";
import { useEchoEditFields, type EchoEditTarget } from "../composables/useEchoEditFields";
import { useEchoInventory } from "../composables/useEchoInventory";
import { getSubstatFamily } from "../echoes/substatFamilies";
import { subStats, getReadableSubStatLabel } from "../echoes/stats";
import AppRichSelect from "./AppRichSelect.vue";
import EchoSubstatSlider from "./EchoSubstatSlider.vue";

defineOptions({ name: "EchoEditFields" });

const props = withDefaults(
  defineProps<{
    target: EchoEditTarget;
    // Docked-panel hosts scroll their own body (flex-1 overflow-y-auto);
    // an inline-in-tile host grows the page instead and shouldn't get its
    // own nested scroll region. Defaults to the docked-panel behavior so
    // existing callers are unaffected.
    scrollable?: boolean;
  }>(),
  { scrollable: true },
);

const {
  echoId,
  rank,
  stat,
  type,
  slots,
  freeStatType,
  freeStatValue,
  freeStatLabel,
  mainStatOptions,
  getSubStatRange,
} = useEchoEditFields(() => props.target);

const { getEchoFlags } = useEchoInventory();
const isEchoLocked = computed(() => (echoId.value ? getEchoFlags(echoId.value).locked : false));

function setRank(r: number) {
  if (isEchoLocked.value) return;
  rank.value = r;
}

function assignSlotIfUnlocked(i: number, statKey: string | null) {
  if (isEchoLocked.value) return;
  assignSlot(i, statKey);
}

function setSlotValueIfUnlocked(i: number, value: number) {
  if (isEchoLocked.value) return;
  slots[i].value.value = value;
}

const FAMILY_LABELS: Record<string, string> = {
  crit: "Crit",
  dmg: "DMG Bonus",
  util: "Utility",
  flat: "Flat / %",
};

const substatOptions = subStats.map((key) => ({
  value: key,
  label: getReadableSubStatLabel(key),
  group: FAMILY_LABELS[getSubstatFamily(key)],
}));

// Each substat can only appear in one slot on a given echo — disable an
// option in slot `i`'s list once it's already chosen in a different slot,
// so picking a duplicate isn't possible from the dropdown.
function getSubstatOptions(i: number) {
  const usedElsewhere = new Set(
    slots
      .filter((_, j) => j !== i)
      .map((s) => s.type.value)
      .filter((t) => t && t !== "none"),
  );
  if (!usedElsewhere.size) return substatOptions;
  return substatOptions.map((option) =>
    usedElsewhere.has(option.value as string)
      ? { ...option, disabled: true }
      : option,
  );
}

function isSlotFilled(i: number) {
  const t = slots[i].type.value;
  return Boolean(t) && t !== "none";
}

function assignSlot(i: number, statKey: string | null) {
  if (!statKey) {
    slots[i].type.value = "none";
    slots[i].value.value = 0;
    return;
  }
  const range = getSubStatRange(statKey);
  slots[i].type.value = statKey;
  slots[i].value.value = range[Math.floor(range.length / 2)];
}
</script>

<style scoped>
.echo-edit-panel__locked-row {
  background: oklch(var(--b2));
  border: 1px dashed oklch(var(--b3));
  border-radius: 0.6rem;
  padding: 0.5rem 0.65rem;
}

.echo-edit-panel__slot {
  border: 1px solid oklch(var(--b3));
  border-radius: 0.6rem;
  padding: 0.5rem 0.6rem;
  background: oklch(var(--b2));
}

.echo-edit-panel__slot--empty {
  border-style: dashed;
  background: transparent;
}

.echo-edit-panel__slot-index {
  width: 1.15rem;
  height: 1.15rem;
  border-radius: 999px;
  background: oklch(var(--b3));
  font-family: ui-monospace, "SFMono-Regular", monospace;
  font-size: 0.65rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
</style>
