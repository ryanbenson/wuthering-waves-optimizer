<template>
  <div
    class="attack-group"
    :class="{ 'attack-group--pinned': variant === 'pinned' }"
    data-test-live-result-attack-group
    :data-test-live-result-attack-group-key="groupKey">
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
      <svg
        v-if="variant === 'pinned'"
        xmlns="http://www.w3.org/2000/svg"
        class="pinned-icon"
        viewBox="0 0 24 24"
        :fill="attacks.length ? 'currentColor' : 'none'"
        stroke="currentColor"
        stroke-width="1.8"
        aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 2v6M8.5 8h7l1.5 5h-10l1.5-5Z" />
        <path stroke-linecap="round" d="M12 13v9" />
      </svg>
      <span class="attack-group__title">
        {{ label }}
        <span v-if="variant !== 'pinned' || attacks.length" class="attack-group__count">({{ attacks.length }})</span>
        <span v-if="isTarget" class="attack-group__target-badge">Target</span>
      </span>
    </button>

    <template v-if="expanded">
      <p v-if="variant === 'pinned' && !attacks.length" class="attack-group__hint" data-test-live-result-pinned-attacks-hint>
        Pin attacks with
        <svg xmlns="http://www.w3.org/2000/svg" class="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 2v6M8.5 8h7l1.5 5h-10l1.5-5Z" />
          <path stroke-linecap="round" d="M12 13v9" />
        </svg>
        to keep them here.
      </p>

      <table v-else class="live-dmg-table table table-zebra table-sm">
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th class="w-20">Normal</th>
            <th class="w-20">Average</th>
            <th class="w-20">Crit</th>
            <th v-if="pinSide === 'right'" class="w-6"><span class="sr-only">Pin</span></th>
          </tr>
        </thead>
        <tbody>
          <CalculatorDamage
            v-for="row in rows"
            :key="row.pinId"
            :attack-key="row.attack.key"
            :character="character"
            :type="row.attack.type"
            :label="row.attack.label"
            :damage="row.attack.damage"
            :always-crit="row.attack.alwaysCrit"
            :class="{ 'is-target-attack': row.isTarget }"
            :data-test-live-result-attack-row="row.pinId"
            @selected-attack="(...args) => emit('selected-attack', ...args)">
            <template v-if="pinSide === 'left'" #before-label>
              <CalculatorLiveResultAttackPin
                :label="row.attack.label"
                :pinned="row.isPinned"
                @toggle="emit('toggle-pin', row.pinId)"></CalculatorLiveResultAttackPin>
            </template>
            <template v-else #row-end>
              <CalculatorLiveResultAttackPin
                :label="row.attack.label"
                :pinned="row.isPinned"
                @toggle="emit('toggle-pin', row.pinId)"></CalculatorLiveResultAttackPin>
            </template>
            <template v-if="row.sourceLabel" #label="{ label: attackLabel }">
              <span class="attack-label">
                {{ attackLabel }}
                <span class="attack-label__source">{{ row.sourceLabel }}</span>
              </span>
            </template>
            <template #after-label>
              <span v-if="row.isTarget" class="attack-group__target-badge attack-group__target-badge--row" data-test-live-result-attack-target>
                Target
              </span>
            </template>
          </CalculatorDamage>
        </tbody>
      </table>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import CalculatorDamage from "./CalculatorDamage.vue";
import CalculatorLiveResultAttackPin from "./CalculatorLiveResultAttackPin.vue";
import { attackPinId, type AttackPinSide } from "../calculator/pinnedAttacks";

defineOptions({ name: "CalculatorLiveResultAttackGroup" });

/**
 * An attack row. In the Pinned section each one carries the group it came
 * from (`pinGroupKey`) and that group's short name (`sourceLabel`); in a
 * regular group both fall back to the group's own key and nothing.
 */
type AttackRow = Record<string, any> & { pinGroupKey?: string; sourceLabel?: string };

const props = withDefaults(
  defineProps<{
    groupKey: string;
    label: string;
    character: string;
    attacks: AttackRow[];
    isTarget?: boolean;
    expanded?: boolean;
    /** "pinned" = the Pinned section at the top (ADR 0060). */
    variant?: "group" | "pinned";
    /** `group|key` ids of this character's pinned attacks. */
    pinnedIds?: Set<string>;
    /** `group|key` id of the optimizer's target attack, if it's an attack. */
    targetAttackId?: string | null;
    /** Which side of the row the pin button sits on (global setting). */
    pinSide?: AttackPinSide;
  }>(),
  {
    isTarget: false,
    expanded: false,
    variant: "group",
    pinnedIds: () => new Set<string>(),
    targetAttackId: null,
    pinSide: "left",
  },
);

const emit = defineEmits<{
  toggle: [groupKey: string];
  "toggle-pin": [pinId: string];
  "selected-attack": [attackKey: string, damage: Record<string, any>, label: string];
}>();

const rows = computed(() =>
  props.attacks.map((attack) => {
    const pinId = attackPinId(attack.pinGroupKey ?? props.groupKey, attack.key);
    return {
      attack,
      pinId,
      isPinned: props.pinnedIds.has(pinId),
      isTarget: pinId === props.targetAttackId,
      sourceLabel: attack.sourceLabel ?? null,
    };
  }),
);
</script>

<style scoped lang="scss">
.attack-group {
  border-bottom: 1px solid oklch(var(--b3) / 0.7);
}
.attack-group--pinned {
  border-bottom: 2px solid oklch(var(--p) / 0.35);
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
    font-size: 15px;
  }
  :deep(td:first-child) {
    gap: 4px;
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
  :deep(td.row-end) {
    width: 24px;
    padding-left: 0;
  }
  :deep(tr.is-target-attack td:first-child) {
    font-weight: 600;
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
.pinned-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  color: oklch(var(--p));
}
.attack-group__title {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
}
.attack-group__count {
  font-size: 12px;
  font-weight: 500;
  color: oklch(var(--bc) / 0.45);
  margin-left: 4px;
}
.attack-group__target-badge {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  background: oklch(var(--p) / 0.18);
  color: oklch(var(--p));
  padding: 1px 6px;
  border-radius: 999px;
  margin-left: 6px;
}
.attack-group__target-badge--row {
  font-size: 10px;
  padding: 0 5px;
  margin-left: 2px;
  flex-shrink: 0;
}
.attack-group__hint {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  padding: 0 4px 10px 28px;
  font-size: 13px;
  color: oklch(var(--bc) / 0.55);
}
.attack-label {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}
.attack-label__source {
  font-size: 11px;
  color: oklch(var(--bc) / 0.45);
}
</style>
