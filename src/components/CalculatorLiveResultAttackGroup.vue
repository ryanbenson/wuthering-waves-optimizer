<template>
  <div class="attack-group" data-test-live-result-attack-group :data-test-live-result-attack-group-key="groupKey">
    <button
      type="button"
      class="attack-group__head"
      :aria-expanded="expanded"
      data-test-live-result-attack-group-toggle
      @click="emit('toggle', groupKey)">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="chev"
        :class="{ 'chev--open': expanded }"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6" />
      </svg>
      <span class="attack-group__title">
        {{ label }}
        <span class="attack-group__count">({{ attacks.length }})</span>
        <span v-if="isTarget" class="attack-group__target-badge">Target</span>
      </span>
      <span v-if="!expanded && peekValue !== null" class="attack-group__peek" data-test-live-result-attack-group-peek>
        avg
        <span class="font-mono font-bold tabular-nums">{{ peekValue }}</span>
      </span>
    </button>

    <table v-if="expanded" class="live-dmg-table table table-zebra table-sm">
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
          v-for="damageInstance in attacks"
          :key="damageInstance.key"
          :attack-key="damageInstance.key"
          :character="character"
          :type="damageInstance.type"
          :label="damageInstance.label"
          :damage="damageInstance.damage"
          :always-crit="damageInstance.alwaysCrit"
          @selected-attack="(...args) => emit('selected-attack', ...args)"></CalculatorDamage>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import CalculatorDamage from "./CalculatorDamage.vue";
import { displayDamage } from "../utils/numbers";

defineOptions({ name: "CalculatorLiveResultAttackGroup" });

const props = withDefaults(
  defineProps<{
    groupKey: string;
    label: string;
    character: string;
    attacks: Array<Record<string, any>>;
    isTarget?: boolean;
    expanded: boolean;
  }>(),
  {
    isTarget: false,
  },
);

const emit = defineEmits<{
  toggle: [groupKey: string];
  "selected-attack": [attackKey: string, damage: Record<string, any>, label: string];
}>();

const peekValue = computed(() => {
  const top = props.attacks[0];
  const avg = top?.damage?.avgDamage;
  if (typeof avg !== "number") return null;
  return displayDamage(avg).toLocaleString();
});
</script>

<style scoped lang="scss">
.attack-group {
  border-bottom: 1px solid oklch(var(--b3) / 0.7);
}
// Deliberately not `.calculator__damages` — that class is a GLOBAL
// (unscoped) rule from CalculatorDamages.vue (font-size:16px, padding:0.5rem)
// that still has independent legacy callers; reusing its name here would
// silently inherit and couple to whatever that rule does. :deep() reaches
// into <CalculatorDamage>'s own template (its cells carry no font-size of
// their own — they've always inherited it from the ancestor table).
.live-dmg-table {
  :deep(td) {
    padding: 3px 6px;
    font-size: 13px;
  }
  :deep(td:not(:first-child)) {
    // Matches Tailwind's `font-mono` stack exactly (can't apply the utility
    // class itself here — it'd need to live on <CalculatorDamage>'s own
    // template, which this deliberately doesn't touch; see note above).
    font-family:
      ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
      "Courier New", monospace;
    font-variant-numeric: tabular-nums;
  }
}
.attack-group__head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 4px;
  width: 100%;
  border-radius: 8px;
  text-align: left;

  &:hover {
    background: oklch(var(--b2));
  }
}
.chev {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  transition: transform 0.15s ease;
  color: oklch(var(--bc) / 0.55);

  &--open {
    transform: rotate(90deg);
  }
}
.attack-group__title {
  flex: 1;
  font-size: 13.5px;
  font-weight: 600;
}
.attack-group__count {
  font-size: 10.5px;
  font-weight: 500;
  color: oklch(var(--bc) / 0.45);
  margin-left: 4px;
}
.attack-group__target-badge {
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  background: oklch(var(--p) / 0.18);
  color: oklch(var(--p));
  padding: 1px 6px;
  border-radius: 999px;
  margin-left: 6px;
}
.attack-group__peek {
  font-size: 11.5px;
  color: oklch(var(--bc) / 0.6);

  span {
    font-size: 12.5px;
    color: oklch(var(--bc) / 0.85);
  }
}
</style>
