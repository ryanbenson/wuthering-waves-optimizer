<template>
  <!-- Fragment, deliberately not wrapped in an enclosing element: a sticky
  element can only stay "stuck" while scroll stays within its own
  *containing block*'s height. Wrapping the sentinel + sticky card in their
  own small <div> here would make that div (barely taller than the card
  itself) the containing block, so it'd run out of room and un-stick almost
  immediately. Rendering them as top-level siblings makes the parent (the
  whole editor, including the tall actions list below) the containing block
  instead, matching the same fix applied earlier for the two-column damages
  layout's sticky column. -->
  <div ref="sentinelEl" class="h-px"></div>
  <div
    class="sticky top-20 z-30"
    :class="isStuck ? 'bg-base-200/95 backdrop-blur shadow-md rounded-lg px-4 py-2 mb-6' : 'bg-base-200 shadow-lg rounded-lg p-4 mb-6'"
    data-test-team-rotation-summary
    :data-test-team-rotation-summary-stuck="isStuck">
    <div v-if="isStuck" class="flex items-center gap-3 flex-wrap text-sm">
      <span class="font-semibold truncate max-w-[10rem]">{{ teamName }}</span>
      <div class="flex -space-x-2 shrink-0">
        <div
          v-for="(characterId, idx) in characterIds"
          v-show="characterId"
          :key="idx"
          class="size-6 rounded-full border-2 border-base-200 bg-cover bg-center"
          :style="characterId ? { backgroundImage: `url(${characterImage(characterId)})` } : {}"></div>
      </div>
      <span class="opacity-70 shrink-0">{{ actionCount }} action{{ actionCount === 1 ? "" : "s" }}</span>
      <span class="font-semibold shrink-0">
        Normal: {{ displayDamage(result.total.normalDamage ?? 0) }} /
        Average: {{ displayDamage(result.total.avgDamage ?? 0) }} /
        Crit: {{ displayDamage(result.total.critDamage ?? 0) }}
      </span>
      <span v-if="duration" class="opacity-70 shrink-0">{{ displayDamage(result.dps.normal) }} DPS</span>
      <div class="flex-1 min-w-[100px] max-w-xs">
        <TeamRotationDamageBar :per-character="result.perCharacter" compact />
      </div>
      <button
        type="button"
        class="btn btn-xs btn-primary shrink-0"
        data-test-team-rotation-summary-view-damages
        @click="emit('view-damages')">
        View Damages
      </button>
      <button
        type="button"
        class="btn btn-xs btn-secondary shrink-0"
        data-test-team-rotation-summary-view-summary
        @click="emit('view-summary')">
        View Summary
      </button>
    </div>
    <div v-else class="flex flex-col gap-3">
      <div class="flex items-center justify-between gap-2">
        <h2 class="font-semibold truncate">{{ teamName }}</h2>
        <div class="flex gap-2 shrink-0">
          <button
            type="button"
            class="btn btn-sm btn-primary"
            data-test-team-rotation-summary-view-damages
            @click="emit('view-damages')">
            View Damages
          </button>
          <button
            type="button"
            class="btn btn-sm btn-secondary"
            data-test-team-rotation-summary-view-summary
            @click="emit('view-summary')">
            View Summary
          </button>
        </div>
      </div>
      <div class="flex flex-wrap gap-x-6 gap-y-1 text-sm">
        <span>
          <span class="font-bold">Total DMG:</span>
          Normal: {{ displayDamage(result.total.normalDamage ?? 0) }} /
          Average: {{ displayDamage(result.total.avgDamage ?? 0) }} /
          Crit: {{ displayDamage(result.total.critDamage ?? 0) }}
        </span>
        <span v-if="duration"><span class="font-bold">DPS:</span> {{ displayDamage(result.dps.normal) }}</span>
        <span class="opacity-70">{{ actionCount }} action{{ actionCount === 1 ? "" : "s" }}</span>
      </div>
      <TeamRotationDamageBar :per-character="result.perCharacter" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import TeamRotationDamageBar from "./TeamRotationDamageBar.vue";
import { displayDamage } from "../utils/numbers";
import type { DamageAggregation, RotationDps, TeamRotationCharacterResult } from "../calculator/teamRotation";

defineProps<{
  teamName: string;
  characterIds: Array<string | null>;
  actionCount: number;
  duration: number | string | null;
  result: {
    perCharacter: Record<string, TeamRotationCharacterResult>;
    total: DamageAggregation;
    dps: RotationDps;
  };
}>();

const emit = defineEmits<{
  "view-damages": [];
  "view-summary": [];
}>();

function characterImage(characterId: string) {
  return `https://ryanbenson.github.io/wuthering-waves-assets/images/${characterId}.png`;
}

const sentinelEl = ref<HTMLElement | null>(null);
const isStuck = ref(false);
let observer: IntersectionObserver | null = null;

onMounted(() => {
  // `root: null` (the default) tracks the browser viewport — on this page
  // the actual scroll position lives on `document.documentElement`
  // (confirmed empirically), not a body-level scroll container.
  observer = new IntersectionObserver(
    ([entry]) => {
      isStuck.value = !entry.isIntersecting;
    },
    { rootMargin: "-80px 0px 0px 0px", threshold: 0 },
  );
  if (sentinelEl.value) observer.observe(sentinelEl.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
});
</script>
