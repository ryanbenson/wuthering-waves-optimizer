<template>
  <div class="mt-6" data-test-main-echo-panel>
    <h2 class="text-lg font-bold mb-3">Main Echo</h2>

    <template v-if="echoName">
      <div class="card card-bordered card-compact bg-base-100 shadow mb-2">
        <div class="card-body">
          <div class="flex items-center gap-3.5">
            <img
              v-if="echoImage"
              :src="echoImage"
              class="size-14 rounded-full border-2 object-cover shrink-0"
              :class="rankBorderClass" />
            <div class="min-w-0">
              <div class="font-extrabold text-base truncate" :class="rankTextClass">{{ echoName }}</div>
              <span class="badge badge-outline badge-sm mt-1">Rank {{ mainEchoRank }}</span>
            </div>
          </div>
        </div>
      </div>

      <CalculatorMainEchoBuff
        v-for="buff in mainEchoBuffList"
        :key="buff.key"
        :character="character"
        :buff-key="buff.key"
        :details="buff.details"
        :effects="buff.effects"
        :has-stacks="buff.hasStacks"
        :min-stacks="buff.minStacks"
        :max-stacks="buff.maxStacks"
        :always-enabled="buff.alwaysEnabled"
        storage-mode="calculator"
        @updated-buff-stats="handleUpdatedBuffStats" />
    </template>

    <div v-else class="card card-bordered border-dashed bg-transparent shadow-none">
      <div class="card-body">
        <p class="text-xs opacity-60 mb-0">No main echo equipped.</p>
        <p class="text-[11px] opacity-50 mt-0.5 mb-0">Equip an echo in slot 1 to configure its buffs here.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// v3-only redesign of the "Main Echo Buff" block in CalculatorEchoes.vue
// (see docs/adr/0028) — the legacy block (a bare header + unwrapped
// CalculatorMainEchoBuff list) is untouched and still renders when the
// liveResultBar flag is off. CalculatorMainEchoBuff.vue itself is reused
// completely unchanged here — it already renders as its own card, so this
// panel doesn't wrap it in a further outer card (that would double-border).
import { computed } from "vue";
import { useCharacterStore } from "../stores/character";
import CalculatorMainEchoBuff from "./CalculatorMainEchoBuff.vue";
import { getEchoData, getMainEchoBuffs } from "../echoes/index.ts";

const props = defineProps<{ character: string }>();

const emit = defineEmits<{
  "updated-buff-stats": [payload: { stats: Record<string, unknown>; key: string }];
}>();

const characterStore = useCharacterStore();

const currentCharacter = computed(
  () => (characterStore.characters?.[props.character] ?? {}) as Record<string, any>,
);

const mainEchoKey = computed<string | null>(() => currentCharacter.value.mainEcho?.echo ?? null);
const mainEchoRank = computed(() => currentCharacter.value.mainEcho?.rank ?? 5);
const chosenMainEchoData = computed(() => (mainEchoKey.value ? getEchoData(mainEchoKey.value) : null));
const echoName = computed(() => chosenMainEchoData.value?.name ?? null);
const echoImage = computed(() => chosenMainEchoData.value?.image ?? null);
const mainEchoBuffList = computed(() => getMainEchoBuffs(chosenMainEchoData.value));

const rankBorderClass = computed(() => ({
  "border-amber-300": String(mainEchoRank.value) === "5",
  "border-violet-600": String(mainEchoRank.value) === "4",
  "border-blue-500": String(mainEchoRank.value) === "3",
  "border-green-500": String(mainEchoRank.value) === "2",
}));
const rankTextClass = computed(() => ({
  "text-amber-300": String(mainEchoRank.value) === "5",
  "text-violet-600": String(mainEchoRank.value) === "4",
  "text-blue-500": String(mainEchoRank.value) === "3",
  "text-green-500": String(mainEchoRank.value) === "2",
}));

function handleUpdatedBuffStats(payload: { stats: Record<string, unknown>; key: string }) {
  emit("updated-buff-stats", payload);
}
</script>
