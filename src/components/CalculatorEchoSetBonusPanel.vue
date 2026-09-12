<template>
  <div class="mt-6" data-test-echo-set-bonus-panel>
    <div class="flex items-end justify-between gap-2 mb-3">
      <div>
        <h2 class="text-lg font-bold">Set Bonuses</h2>
        <div class="text-xs opacity-60 mt-0.5">
          {{ setOverride ? "Manually chosen, independent of your equipped echoes" : "Auto-detected from your equipped echoes" }}
        </div>
      </div>
      <div class="join" data-test-set-override-toggle>
        <button
          type="button"
          class="btn btn-xs join-item"
          :class="setOverride ? 'btn-ghost' : 'btn-primary'"
          @click="setOverride = false">
          Auto
        </button>
        <button
          type="button"
          class="btn btn-xs join-item"
          :class="setOverride ? 'btn-primary' : 'btn-ghost'"
          @click="setOverride = true">
          Manual override
        </button>
      </div>
    </div>

    <!--
      Always a single column now — this panel used to span the full tab
      width (its md:grid-cols-2/3 assumed that), but it moved into the
      same fixed-width column as the echo tiles (see
      docs/adr/0030-echoes-tab-v3-redesign.md); md:* is a viewport-width
      breakpoint, not a container query, so it would otherwise still try
      to lay out 2-3 columns into a ~460px column on any desktop-width
      screen regardless of how narrow this column actually is.
    -->
    <div class="grid grid-cols-1 gap-3">
      <CalculatorEchoSetBonusSlot
        v-if="show1pcSlot"
        :character="character"
        field-key="setBonusOnePiece"
        :candidate-sets="oneSetBonuses"
        :effects-map="setBonusEffectsOnePiece"
        allow-empty
        slot-label="1-piece set"
        :is-override-enabled="setOverride"
        @update-stats="(stats) => emitSlotStats('onePiece', stats)"></CalculatorEchoSetBonusSlot>
      <CalculatorEchoSetBonusSlot
        :character="character"
        field-key="setBonusOne"
        :candidate-sets="twoSetBonuses"
        :effects-map="setBonusEffectsOne"
        allow-empty
        slot-label="2-piece set"
        :is-override-enabled="setOverride"
        @update-stats="(stats) => emitSlotStats('one', stats)"></CalculatorEchoSetBonusSlot>
      <CalculatorEchoSetBonusSlot
        :character="character"
        field-key="setBonusTwo"
        :candidate-sets="twoAndHigherSetBonuses"
        :effects-map="setBonusEffectsTwo"
        slot-label="2/3/5-piece set"
        :is-override-enabled="setOverride"
        @update-stats="(stats) => emitSlotStats('two', stats)"></CalculatorEchoSetBonusSlot>
    </div>
  </div>
</template>

<script setup lang="ts">
// v3-only redesign of the "Set Bonuses" block in CalculatorEchoes.vue (see
// docs/adr/0028) — the legacy block (CalculatorEchoesSetBonusOnePiece/One/
// Two.vue + the bare "Enable set override" checkbox) is untouched and still
// renders when the liveResultBar flag is off.
import { computed } from "vue";
import { useCharacterStore } from "../stores/character";
import CalculatorEchoSetBonusSlot from "./CalculatorEchoSetBonusSlot.vue";
import {
  oneSetBonuses,
  twoSetBonuses,
  threeSetBonuses,
  fiveSetBonuses,
  setBonusEffectsOnePiece,
  setBonusEffectsOne,
  setBonusEffectsTwo,
} from "../echoes/sets";

const props = defineProps<{ character: string }>();

const emit = defineEmits<{
  "set-bonus-stats": [payload: { slot: "onePiece" | "one" | "two"; stats: Record<string, number | string> }];
}>();

const characterStore = useCharacterStore();

const currentCharacter = computed(
  () => (characterStore.characters?.[props.character] ?? {}) as Record<string, any>,
);

// Same character.setOverride field the legacy checkbox reads/writes — the
// existing watch(setOverride, ...) re-sync in CalculatorEchoes.vue fires
// regardless of which UI (legacy or v3) changed the value.
const setOverride = computed({
  get: () => currentCharacter.value.setOverride ?? false,
  set: (value: boolean) => {
    void characterStore.setCharacterData(props.character, { setOverride: value });
  },
});

const twoAndHigherSetBonuses = computed(() => [...twoSetBonuses, ...threeSetBonuses, ...fiveSetBonuses]);

// Only one set in the game (Shadow of Shattered Dreams) has a 1pc bonus, so
// most builds never trigger it — showing an always-empty card for it here
// is more clutter than signal. Hide it in Auto mode unless it's actually
// active; always show it in Manual override so it stays pickable.
const show1pcSlot = computed(
  () => setOverride.value || Boolean(currentCharacter.value.echoSetBonus?.setBonusOnePiece),
);

function emitSlotStats(slot: "onePiece" | "one" | "two", stats: Record<string, number | string>) {
  emit("set-bonus-stats", { slot, stats });
}
</script>
