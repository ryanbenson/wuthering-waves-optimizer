<template>
  <dialog id="modal-echoes-importer" class="modal">
    <form method="dialog" class="modal-backdrop" @click="handleClose">
      <button>close</button>
    </form>
    <div class="modal-box max-w-5xl">
      <form method="dialog" @click="handleClose">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
      </form>
      <div class="py-4">
        <CalculatorEchoParser
          @echoes-parsed="handleEchoesParsed"></CalculatorEchoParser>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import CalculatorEchoParser from "./CalculatorEchoParser.vue";
import { verboseStatLabelMap } from "../echoes/stats";
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";
import { randomString } from "../utils/strings.ts";

const MODAL_ID = "modal-echoes-importer";

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

function triggerOpenModal() {
  const modalEl = document.getElementById(MODAL_ID);
  (modalEl as HTMLDialogElement | null)?.showModal();
}

function triggerCloseModal() {
  const modalEl = document.getElementById(MODAL_ID);
  (modalEl as HTMLDialogElement | null)?.close();
}

function handleClose() {
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

async function handleEchoesParsed(
  echoData: ParsedEcho[],
  isSavingToInventory: boolean,
) {
  const echoes = echoData.map((echo) => {
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
      type: Number(echo.cost) ?? null,
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
  await characterStore.setCharacterEchoes(props.character, {});
  await characterStore.setCharacterEchoes(props.character, echoes);
  await characterStore.setCharacterData(props.character, { echoPresetId: null });
  await inventoryStore.deleteEquippedPreset(props.character);
  await inventoryStore.removeCharacterFromAllEquipped(props.character);

  if (isSavingToInventory) {
    for (const [index, echo] of echoes.entries()) {
      await inventoryStore.saveEcho(echo);
      const equippedData: Record<string, number> = {};
      equippedData[props.character] = index;
      await inventoryStore.setEquippedData(echo.echoId, equippedData);
    }
  }
  triggerCloseModal();
}

defineExpose({ triggerOpenModal, triggerCloseModal });
</script>
