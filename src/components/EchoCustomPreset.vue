<template>
  <div
    v-if="layout === 'list'"
    class="presetEchoes presetEchoes--list flex items-center gap-3 rounded-lg bg-base-100 border border-base-300 shadow-sm px-3 py-2 mb-2">
    <div class="flex gap-1 shrink-0">
      <EchoCustomPresetEcho v-if="echo1Id" key="echo1" :echo-id="echo1Id" compact />
      <EchoCustomPresetEcho v-if="echo2Id" key="echo2" :echo-id="echo2Id" compact />
      <EchoCustomPresetEcho v-if="echo3Id" key="echo3" :echo-id="echo3Id" compact />
      <EchoCustomPresetEcho v-if="echo4Id" key="echo4" :echo-id="echo4Id" compact />
      <EchoCustomPresetEcho v-if="echo5Id" key="echo5" :echo-id="echo5Id" compact />
    </div>
    <span class="font-semibold truncate flex-1 min-w-[8rem]">{{ name }}</span>
    <div class="flex gap-2 shrink-0">
      <span
        class="echo__item__cost badge badge-sm text-nowrap"
        :class="critValueBadgeClass">
        CV {{ formattedCritValue }}%
      </span>
      <span
        class="echo__item__cost badge badge-sm text-nowrap"
        v-tooltip="'Build Score'"
        :class="buildScoreBadgeClass">
        {{ buildScoreLabel }}
      </span>
    </div>
    <div v-if="!disableAction" class="actions flex gap-2 shrink-0">
      <button
        class="btn btn-xs btn-primary"
        :class="{ 'btn-disabled': isApplying }"
        :disabled="isApplying"
        @click="emit('apply')">
        <span v-if="isApplying" class="loading loading-spinner loading-xs"></span>
        {{ isApplying ? "Applying..." : "Apply preset" }}
      </button>
      <button
        @click.stop="deletePreset"
        class="btn btn-xs btn-error"
        :disabled="isApplying">
        Delete preset
      </button>
    </div>
    <slot></slot>
  </div>

  <div
    v-else
    class="presetEchoes card card-bordered card-compact bg-base-100 shadow mb-2">
    <div class="card-body">
      <div class="flex items-start justify-between gap-2">
        <h2 class="card-title truncate">{{ name }}</h2>
        <div class="flex gap-2 shrink-0">
          <span
            class="echo__item__cost badge text-nowrap"
            :class="critValueBadgeClass">
            CV {{ formattedCritValue }}%
          </span>
          <span
            class="echo__item__cost badge text-nowrap"
            v-tooltip="'Build Score'"
            :class="buildScoreBadgeClass">
            {{ buildScoreLabel }}
          </span>
        </div>
      </div>
      <div class="flex gap-2 mt-2">
        <EchoCustomPresetEcho v-if="echo1Id" key="echo1" :echo-id="echo1Id" />
        <EchoCustomPresetEcho v-if="echo2Id" key="echo2" :echo-id="echo2Id" />
        <EchoCustomPresetEcho v-if="echo3Id" key="echo3" :echo-id="echo3Id" />
        <EchoCustomPresetEcho v-if="echo4Id" key="echo4" :echo-id="echo4Id" />
        <EchoCustomPresetEcho v-if="echo5Id" key="echo5" :echo-id="echo5Id" />
      </div>
      <div v-if="!disableAction" class="actions flex gap-2">
        <button
          class="btn btn-sm btn-primary max-w-40 mt-2"
          :class="{ 'btn-disabled': isApplying }"
          :disabled="isApplying"
          @click="emit('apply')">
          <span v-if="isApplying" class="loading loading-spinner loading-xs"></span>
          {{ isApplying ? "Applying..." : "Apply preset" }}
        </button>
        <button
          @click.stop="deletePreset"
          class="btn btn-sm btn-error max-w-40 mt-2"
          :disabled="isApplying">
          Delete preset
        </button>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import EchoCustomPresetEcho from "./EchoCustomPresetEcho.vue";
import { getEchoCritValue, type EchoSubStatsSource } from "../echoes/stats";
import { useInventoryStore } from "../stores/inventory";
import { useCharacterStore } from "../stores/character";
import { getBadgeClass } from "../composables/useEchoCardStats";
import { getRatingBadgeClasses } from "../composables/useEchoRating";
import { usePresetBuildScore } from "../composables/usePresetBuildScore";

const emit = defineEmits<{
  apply: [];
}>();

const props = withDefaults(
  defineProps<{
    presetId: string;
    name: string;
    echo1Id?: string;
    echo2Id?: string;
    echo3Id?: string;
    echo4Id?: string;
    echo5Id?: string;
    disableAction?: boolean;
    showEquippedChars?: boolean;
    isApplying?: boolean;
    layout?: "tile" | "list";
  }>(),
  {
    disableAction: false,
    showEquippedChars: false,
    isApplying: false,
    layout: "tile",
  },
);

const inventoryStore = useInventoryStore();
const characterStore = useCharacterStore();

function slotEcho(id: string | undefined) {
  if (!id) {
    return null;
  }
  return inventoryStore.echoById(id)?.[0] ?? null;
}

const echo1Data = computed(() => slotEcho(props.echo1Id));
const echo2Data = computed(() => slotEcho(props.echo2Id));
const echo3Data = computed(() => slotEcho(props.echo3Id));
const echo4Data = computed(() => slotEcho(props.echo4Id));
const echo5Data = computed(() => slotEcho(props.echo5Id));

function echoCv(data: EchoSubStatsSource | null) {
  return data ? getEchoCritValue(data) : 0;
}

const totalCv = computed(
  () =>
    echoCv(echo1Data.value) +
    echoCv(echo2Data.value) +
    echoCv(echo3Data.value) +
    echoCv(echo4Data.value) +
    echoCv(echo5Data.value),
);

const formattedCritValue = computed(() => {
  const num = totalCv.value ?? 0;
  if (Number.isInteger(num)) {
    return num;
  }
  const rounded = num.toFixed(1);
  return rounded.endsWith(".0") ? parseInt(rounded, 10) : parseFloat(rounded);
});

const critValueBadgeClass = computed(() =>
  getBadgeClass((totalCv.value ?? 0) / 5, 42, "cv"),
);

// A preset has no persisted "which character is this for" field — derive it
// from whichever character (if any) currently has this preset equipped, the
// same lookup the equipped-avatars footer already uses.
const buildScoreCharacterId = computed(
  () => inventoryStore.getEchoPresetCharacters(props.presetId)[0] ?? null,
);

const { rollup: buildScoreRollup } = usePresetBuildScore(
  () => [props.echo1Id, props.echo2Id, props.echo3Id, props.echo4Id, props.echo5Id],
  () => buildScoreCharacterId.value,
);

const buildScoreLabel = computed(() => {
  const rollup = buildScoreRollup.value;
  if (!rollup) return "BS —";
  return `BS ${rollup.grade} ${Math.round(rollup.percent)}%${rollup.provisional ? "*" : ""}`;
});

const buildScoreBadgeClass = computed(() => {
  const rollup = buildScoreRollup.value;
  if (!rollup) return ["bg-base-300", "text-base-content/50", "border-base-300", ""];
  return getRatingBadgeClasses(rollup.color);
});

function getEquippedCharactersForPreset() {
  return inventoryStore.getEchoPresetCharacters(props.presetId);
}

async function deletePreset() {
  const allCharacters = getEquippedCharactersForPreset();
  for (const character of allCharacters) {
    await inventoryStore.deleteEquippedPreset(character);
    await characterStore.setCharacterData(character, { echoPresetId: null });
  }
  await inventoryStore.deleteEchoPreset(props.presetId);
}
</script>
