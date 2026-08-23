<template>
  <dialog :id="modalId" class="modal">
    <form method="dialog" class="modal-backdrop" @click="handleClose">
      <button>close</button>
    </form>
    <div class="modal-box max-w-2xl">
      <form method="dialog" @click="handleClose">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
      </form>
      <div class="py-4">
        <div class="flex items-center justify-between gap-2 mb-2">
          <h1 class="text-xl">
            {{ mode === "character" ? `Substat Priorities — ${characterId}` : "Echo Rating Weights" }}
          </h1>
          <button class="btn btn-sm btn-ghost" @click="handleReset">
            Reset to Default
          </button>
        </div>
        <p class="text-sm opacity-70 mb-6">
          Weight each substat from 0 (ignored) to 4 (most important) in 0.5
          steps to control how much it counts toward
          {{
            mode === "character"
              ? `${characterId}'s Substat Score`
              : "the Echo Rating shown everywhere"
          }}. A stat left at 1 is neutral.
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <div v-for="stat in subStatsList" :key="stat">
            <div class="flex justify-between items-baseline gap-2 text-xs mb-1">
              <span class="font-medium opacity-80">{{ getReadableSubStatLabel(stat) }}</span>
              <span class="tabular-nums opacity-70">{{ currentWeights[stat] ?? 1 }}</span>
            </div>
            <Range
              :id="`echo-rating-weight-${stat}`"
              :values="WEIGHT_VALUES"
              :default-value="currentWeights[stat] ?? 1"
              size="xs"
              show-ticks
              @update-value="handleWeightChange(stat, $event)" />
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { subStats, getReadableSubStatLabel } from "../echoes/stats";
import { clampSubstatWeight } from "../echoes/rating";
import { useSettingsStore } from "../stores/settings";
import { useCharacterStore } from "../stores/character";
import Range from "./input/Range.vue";

const WEIGHT_VALUES = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4];
const MODAL_ID = "modal-echo-rating-weights-editor";
const modalId = MODAL_ID;
const subStatsList = subStats;

const settingsStore = useSettingsStore();
const characterStore = useCharacterStore();

const mode = ref<"global" | "character">("global");
const characterId = ref<string | null>(null);

const currentWeights = computed(() => {
  if (mode.value === "character" && characterId.value) {
    return characterStore.getCharacterSubstatWeights(characterId.value);
  }
  return settingsStore.echoRatingWeights;
});

function handleWeightChange(stat: string, value: number) {
  const clamped = clampSubstatWeight(value);
  const updated = { ...currentWeights.value, [stat]: clamped };
  if (mode.value === "character" && characterId.value) {
    characterStore.setCharacterSubstatWeights(characterId.value, updated);
  } else {
    settingsStore.setEchoRatingWeights(updated);
  }
}

function handleReset() {
  if (mode.value === "character" && characterId.value) {
    characterStore.resetCharacterSubstatWeights(characterId.value);
  } else {
    settingsStore.resetEchoRatingWeights();
  }
}

function triggerOpenModal(
  options: { mode: "global" | "character"; characterId?: string | null } = {
    mode: "global",
  },
) {
  mode.value = options.mode;
  characterId.value = options.characterId ?? null;
  (document.getElementById(MODAL_ID) as HTMLDialogElement | null)?.showModal();
}
function triggerCloseModal() {
  (document.getElementById(MODAL_ID) as HTMLDialogElement | null)?.close();
}
function handleClose() {
  triggerCloseModal();
}

defineExpose({ triggerOpenModal, triggerCloseModal });
</script>
