<template>
  <dialog id="modal-echoes-importer" class="modal">
    <form method="dialog" class="modal-backdrop" @click="handleClose">
      <button>close</button>
    </form>
    <div v-if="isOpen" class="modal-box max-w-5xl">
      <form method="dialog" @click="handleClose">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
      </form>
      <div class="py-4">
        <template v-if="!isReviewingDuplicates">
          <CalculatorEchoParser
            @echoes-parsed="handleEchoesParsed"></CalculatorEchoParser>
        </template>
        <template v-else>
          <h2 class="text-xl font-bold mb-2">Possible inventory duplicates</h2>
          <p class="mb-4 text-sm opacity-80">
            Some imported echoes already match items in your inventory. New
            echoes are pre-selected and will be added. Possible duplicates are
            unchecked — select any you still want to add, then continue.
          </p>
          <div class="space-y-3 max-h-[60vh] overflow-y-auto">
            <label
              v-for="item in duplicateReviewItems"
              :key="item.index"
              class="flex gap-3 items-start p-3 rounded-lg border border-base-300 cursor-pointer hover:bg-base-200">
              <input
                type="checkbox"
                class="checkbox checkbox-sm mt-5"
                v-model="item.selected" />
              <div
                class="echo__item__image rounded-full border border-solid neutral-content size-14 shrink-0 bg-cover bg-center"
                :class="getRankBorderClass(item.echo.rank)"
                :style="{
                  backgroundImage: `url(${getEchoImage(item.echo)})`,
                }"></div>
              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <span
                    class="font-semibold"
                    :class="getRankTextClass(item.echo.rank)">
                    {{ getEchoDisplayName(item.echo) }}
                  </span>
                  <span class="badge badge-sm badge-primary">
                    {{ item.echo.type }} Cost
                  </span>
                  <img
                    v-if="item.echo.echoSet"
                    :src="getEchoSetIconByType(item.echo.echoSet)"
                    class="size-5 rounded-full"
                    :alt="getEchoSetLabelByType(item.echo.echoSet)" />
                  <span
                    v-if="item.isDuplicate"
                    class="badge badge-sm badge-warning">
                    Possible duplicate
                  </span>
                  <span v-else class="badge badge-sm badge-success">
                    New — will be added
                  </span>
                </div>
                <div
                  v-if="item.echo.stat"
                  class="mt-1 text-sm flex items-center gap-2">
                  <img
                    :src="getSubStatIconByType(item.echo.stat)"
                    class="size-5" />
                  <span>
                    Main:
                    {{ getReadableSubStatLabel(item.echo.stat) }}
                  </span>
                  <span v-if="item.echo.echoSet" class="opacity-70">
                    · {{ getEchoSetLabelByType(item.echo.echoSet) }}
                  </span>
                </div>
                <div
                  v-if="getEchoSubstatLabels(item.echo).length"
                  class="mt-2 pt-2 border-t border-base-300 text-sm flex flex-wrap gap-x-3 gap-y-1 opacity-90">
                  <span
                    v-for="(sub, subIndex) in getEchoSubstatLabels(item.echo)"
                    :key="subIndex"
                    class="inline-flex items-center gap-1">
                    <img v-if="sub.icon" :src="sub.icon" class="size-4" />
                    {{ sub.label }}
                  </span>
                </div>
              </div>
            </label>
          </div>
          <div class="modal-action flex-wrap">
            <button type="button" class="btn" @click="handleCancelDuplicateReview">
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              @click="handleApplyToCharacterOnly">
              Apply to character only
            </button>
            <button
              type="button"
              class="btn btn-primary"
              :disabled="!hasSelectedEchoes"
              @click="handleConfirmDuplicateReview">
              Add selected to inventory & apply
            </button>
          </div>
        </template>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import CalculatorEchoParser from "./CalculatorEchoParser.vue";
import {
  getEchoSetIconByType,
  getEchoSetLabelByType,
  getReadableSubStatLabel,
  getSubStatIconByType,
  verboseStatLabelMap,
} from "../echoes/stats";
import { getEchoData } from "../echoes/index";
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";
import { getEchoIdentityKey } from "../utils/echoIdentity";
import { randomString } from "../utils/strings.ts";

const MODAL_ID = "modal-echoes-importer";
const DEFAULT_ECHO_IMAGE =
  "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/monsters.png";
const isOpen = ref(false);

const props = withDefaults(
  defineProps<{
    character?: string;
  }>(),
  { character: "" },
);

const characterStore = useCharacterStore();
const inventoryStore = useInventoryStore();

type ParsedSubstat = { subStat?: string; subStatValue?: string };
type ParsedEcho = {
  substats: ParsedSubstat[];
  cost?: unknown;
  rank?: number;
  mainStatLabel?: string;
  echo?: string | null;
  set?: string | null;
};

type MappedEcho = {
  echo: string | null;
  type: number | null;
  rank: number;
  stat: string | null;
  echoId: string | null;
  echoSet: string | null | undefined;
  echoSubStatsType1: string | null;
  echoSubStatsValue1: number | null;
  echoSubStatsType2: string | null;
  echoSubStatsValue2: number | null;
  echoSubStatsType3: string | null;
  echoSubStatsValue3: number | null;
  echoSubStatsType4: string | null;
  echoSubStatsValue4: number | null;
  echoSubStatsType5: string | null;
  echoSubStatsValue5: number | null;
};

type DuplicateReviewItem = {
  index: number;
  echo: MappedEcho;
  isDuplicate: boolean;
  selected: boolean;
};

const isReviewingDuplicates = ref(false);
const duplicateReviewItems = ref<DuplicateReviewItem[]>([]);
const hasSelectedEchoes = computed(() =>
  duplicateReviewItems.value.some((item) => item.selected),
);

async function triggerOpenModal() {
  isOpen.value = true;
  await nextTick();
  const modalEl = document.getElementById(MODAL_ID);
  (modalEl as HTMLDialogElement | null)?.showModal();
}

function resetDuplicateReview() {
  isReviewingDuplicates.value = false;
  duplicateReviewItems.value = [];
}

function triggerCloseModal() {
  const modalEl = document.getElementById(MODAL_ID);
  (modalEl as HTMLDialogElement | null)?.close();
  isOpen.value = false;
  resetDuplicateReview();
}

function handleClose() {
  triggerCloseModal();
}

function handleCancelDuplicateReview() {
  triggerCloseModal();
}

function getSubstatValue(subStatValue: string | undefined) {
  if (!subStatValue) {
    return null;
  }
  const valueWithoutPercent = subStatValue.replace("%", "");
  return Number(valueWithoutPercent);
}

function getSubstatType(subStatData: ParsedSubstat | undefined) {
  const type = subStatData?.subStat;
  const value = subStatData?.subStatValue;
  if (!type || !value) {
    return null;
  }
  if (type === "DEF Y") {
    return "DEF";
  }
  if (["ATK", "DEF", "HP"].includes(type)) {
    if (value.includes("%")) {
      return type;
    }
    return `${type}_FLAT`;
  }
  return (
    verboseStatLabelMap[type as keyof typeof verboseStatLabelMap] ?? null
  );
}

function isExactInventoryMatch(echo: MappedEcho) {
  if (!echo.echo) {
    return false;
  }
  const identityKey = getEchoIdentityKey(echo);
  return inventoryStore.echoes.some(
    (inventoryEcho: MappedEcho) =>
      getEchoIdentityKey(inventoryEcho) === identityKey,
  );
}

function mapParsedEchoes(
  echoData: ParsedEcho[],
  isSavingToInventory: boolean,
): MappedEcho[] {
  return echoData.map((echo) => {
    const echoSubStatsType1 = getSubstatType(echo.substats[0]);
    const echoSubStatsValue1 = getSubstatValue(echo.substats[0]?.subStatValue);
    const echoSubStatsType2 = getSubstatType(echo.substats[1]);
    const echoSubStatsValue2 = getSubstatValue(echo.substats[1]?.subStatValue);
    const echoSubStatsType3 = getSubstatType(echo.substats[2]);
    const echoSubStatsValue3 = getSubstatValue(echo.substats[2]?.subStatValue);
    const echoSubStatsType4 = getSubstatType(echo.substats[3]);
    const echoSubStatsValue4 = getSubstatValue(echo.substats[3]?.subStatValue);
    const echoSubStatsType5 = getSubstatType(echo.substats[4]);
    const echoSubStatsValue5 = getSubstatValue(echo.substats[4]?.subStatValue);
    let echoId: string | null = null;
    if (isSavingToInventory) {
      echoId = randomString();
    }
    return {
      echo: echo.echo ?? null,
      type: Number(echo.cost) || null,
      rank: echo.rank ?? 5,
      stat: echo.mainStatLabel
        ? verboseStatLabelMap[
            echo.mainStatLabel as keyof typeof verboseStatLabelMap
          ]
        : null,
      echoId,
      echoSet: echo.set,
      echoSubStatsType1,
      echoSubStatsValue1,
      echoSubStatsType2,
      echoSubStatsValue2,
      echoSubStatsType3,
      echoSubStatsValue3,
      echoSubStatsType4,
      echoSubStatsValue4,
      echoSubStatsType5,
      echoSubStatsValue5,
    };
  });
}

function getEchoDisplayName(echo: MappedEcho) {
  if (!echo.echo) {
    return "Unknown echo";
  }
  return getEchoData(echo.echo)?.name ?? echo.echo;
}

function getEchoImage(echo: MappedEcho) {
  if (!echo.echo) {
    return DEFAULT_ECHO_IMAGE;
  }
  return getEchoData(echo.echo)?.image ?? DEFAULT_ECHO_IMAGE;
}

function getRankBorderClass(rank: number) {
  if (rank === 5) return "border-amber-300";
  if (rank === 4) return "border-violet-600";
  if (rank === 3) return "border-blue-500";
  if (rank === 2) return "border-green-500";
  return "";
}

function getRankTextClass(rank: number) {
  if (rank === 5) return "text-amber-300";
  if (rank === 4) return "text-violet-600";
  if (rank === 3) return "text-blue-500";
  if (rank === 2) return "text-green-500";
  return "";
}

function formatSubStatDisplay(
  type: string | null,
  value: number | null,
): { label: string; icon: string } | null {
  if (!type || value === null || value === undefined) {
    return null;
  }
  const name = getReadableSubStatLabel(type) ?? type;
  const label = type.includes("FLAT")
    ? `${name} ${value}`
    : `${name} ${value}%`;
  return {
    label,
    icon: getSubStatIconByType(type),
  };
}

function getEchoSubstatLabels(echo: MappedEcho) {
  return [
    formatSubStatDisplay(echo.echoSubStatsType1, echo.echoSubStatsValue1),
    formatSubStatDisplay(echo.echoSubStatsType2, echo.echoSubStatsValue2),
    formatSubStatDisplay(echo.echoSubStatsType3, echo.echoSubStatsValue3),
    formatSubStatDisplay(echo.echoSubStatsType4, echo.echoSubStatsValue4),
    formatSubStatDisplay(echo.echoSubStatsType5, echo.echoSubStatsValue5),
  ].filter((sub): sub is { label: string; icon: string } => Boolean(sub));
}

async function finalizeImport(
  echoes: MappedEcho[],
  inventoryEchoIndexes: Set<number> | null,
) {
  const characterEchoes = echoes.map((echo, index) => {
    if (inventoryEchoIndexes && !inventoryEchoIndexes.has(index)) {
      return { ...echo, echoId: null };
    }
    return echo;
  });

  await characterStore.setCharacterEchoes(props.character, {});
  await characterStore.setCharacterEchoes(props.character, characterEchoes);
  await characterStore.setCharacterData(props.character, { echoPresetId: null });
  await inventoryStore.deleteEquippedPreset(props.character);
  await inventoryStore.removeCharacterFromAllEquipped(props.character);

  if (inventoryEchoIndexes) {
    for (const index of inventoryEchoIndexes) {
      const echo = characterEchoes[index];
      if (!echo?.echoId) {
        continue;
      }
      await inventoryStore.saveEcho(echo);
      const equippedData: Record<string, number> = {};
      equippedData[props.character] = index;
      await inventoryStore.setEquippedData(echo.echoId, equippedData);
    }
  }

  triggerCloseModal();
}

async function handleApplyToCharacterOnly() {
  const echoes = duplicateReviewItems.value.map((item) => item.echo);
  await finalizeImport(echoes, new Set());
}

async function handleConfirmDuplicateReview() {
  if (!hasSelectedEchoes.value) {
    return;
  }
  const echoes = duplicateReviewItems.value.map((item) => item.echo);
  const inventoryEchoIndexes = new Set(
    duplicateReviewItems.value
      .filter((item) => item.selected)
      .map((item) => item.index),
  );
  await finalizeImport(echoes, inventoryEchoIndexes);
}

async function handleEchoesParsed(
  echoData: ParsedEcho[],
  isSavingToInventory: boolean,
) {
  const echoes = mapParsedEchoes(echoData, isSavingToInventory);

  if (!isSavingToInventory) {
    await finalizeImport(echoes, null);
    return;
  }

  const reviewItems: DuplicateReviewItem[] = echoes.map((echo, index) => {
    const isDuplicate = isExactInventoryMatch(echo);
    return {
      index,
      echo,
      isDuplicate,
      selected: !isDuplicate,
    };
  });

  const hasDuplicates = reviewItems.some((item) => item.isDuplicate);
  if (!hasDuplicates) {
    await finalizeImport(
      echoes,
      new Set(echoes.map((_, index) => index)),
    );
    return;
  }

  duplicateReviewItems.value = reviewItems;
  isReviewingDuplicates.value = true;
}

defineExpose({ triggerOpenModal, triggerCloseModal });
</script>
