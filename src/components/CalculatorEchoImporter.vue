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
                class="checkbox checkbox-sm mt-1"
                v-model="item.selected" />
              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-center gap-2 mb-1">
                  <span class="font-semibold">
                    {{ getEchoDisplayName(item.echo) }}
                  </span>
                  <span class="badge badge-sm badge-primary">
                    {{ item.echo.type }} Cost
                  </span>
                  <span
                    v-if="item.isDuplicate"
                    class="badge badge-sm badge-warning">
                    Possible duplicate
                  </span>
                  <span v-else class="badge badge-sm badge-success">
                    New — will be added
                  </span>
                </div>
                <div class="text-sm opacity-80 flex flex-wrap gap-x-3 gap-y-1">
                  <span v-if="item.echo.echoSet">
                    Set: {{ getEchoSetLabelByType(item.echo.echoSet) }}
                  </span>
                  <span v-if="item.echo.stat">
                    Main: {{ getReadableSubStatLabel(item.echo.stat) }}
                  </span>
                  <span
                    v-for="(sub, subIndex) in getEchoSubstatLabels(item.echo)"
                    :key="subIndex">
                    {{ sub }}
                  </span>
                </div>
              </div>
            </label>
          </div>
          <div class="modal-action">
            <button type="button" class="btn" @click="handleCancelDuplicateReview">
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="handleConfirmDuplicateReview">
              Add selected to inventory
            </button>
          </div>
        </template>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { nextTick, ref } from "vue";
import CalculatorEchoParser from "./CalculatorEchoParser.vue";
import {
  getEchoSetLabelByType,
  getReadableSubStatLabel,
  verboseStatLabelMap,
} from "../echoes/stats";
import { getEchoData } from "../echoes/index";
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";
import { randomString } from "../utils/strings.ts";

const MODAL_ID = "modal-echoes-importer";
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

function getEchoIdentityKey(echo: {
  echo?: string | null;
  echoSet?: string | null;
  type?: unknown;
  rank?: unknown;
  stat?: string | null;
  echoSubStatsType1?: string | null;
  echoSubStatsValue1?: number | null;
  echoSubStatsType2?: string | null;
  echoSubStatsValue2?: number | null;
  echoSubStatsType3?: string | null;
  echoSubStatsValue3?: number | null;
  echoSubStatsType4?: string | null;
  echoSubStatsValue4?: number | null;
  echoSubStatsType5?: string | null;
  echoSubStatsValue5?: number | null;
}) {
  return [
    echo.echo ?? "",
    echo.echoSet ?? "",
    echo.type ?? "",
    echo.rank ?? "",
    echo.stat ?? "",
    echo.echoSubStatsType1 ?? "",
    echo.echoSubStatsValue1 ?? "",
    echo.echoSubStatsType2 ?? "",
    echo.echoSubStatsValue2 ?? "",
    echo.echoSubStatsType3 ?? "",
    echo.echoSubStatsValue3 ?? "",
    echo.echoSubStatsType4 ?? "",
    echo.echoSubStatsValue4 ?? "",
    echo.echoSubStatsType5 ?? "",
    echo.echoSubStatsValue5 ?? "",
  ]
    .map(String)
    .join(":");
}

function isExactInventoryMatch(echo: MappedEcho) {
  if (!echo.echo) {
    return false;
  }
  const identityKey = getEchoIdentityKey(echo);
  return inventoryStore.echoes.some(
    (inventoryEcho) => getEchoIdentityKey(inventoryEcho) === identityKey,
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

function formatSubStatDisplay(
  type: string | null,
  value: number | null,
): string | null {
  if (!type || value === null || value === undefined) {
    return null;
  }
  const label = getReadableSubStatLabel(type) ?? type;
  if (type.includes("FLAT")) {
    return `${label} ${value}`;
  }
  return `${label} ${value}%`;
}

function getEchoSubstatLabels(echo: MappedEcho) {
  return [
    formatSubStatDisplay(echo.echoSubStatsType1, echo.echoSubStatsValue1),
    formatSubStatDisplay(echo.echoSubStatsType2, echo.echoSubStatsValue2),
    formatSubStatDisplay(echo.echoSubStatsType3, echo.echoSubStatsValue3),
    formatSubStatDisplay(echo.echoSubStatsType4, echo.echoSubStatsValue4),
    formatSubStatDisplay(echo.echoSubStatsType5, echo.echoSubStatsValue5),
  ].filter((label): label is string => Boolean(label));
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

async function handleConfirmDuplicateReview() {
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
