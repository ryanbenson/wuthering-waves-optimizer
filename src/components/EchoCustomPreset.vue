<template>
  <div
    class="presetEchoes card card-bordered card-compact bg-base-100 shadow mb-2">
    <div class="card-body">
      <h2 class="card-title">{{ name }}</h2>
      <div class="mb-2 flex gap-2">
        <span
          class="echo__item__cost badge text-nowrap"
          :class="critValueBadgeClass">
          CV {{ formattedCritValue }}%
        </span>
        <span
          class="echo__item__cost badge text-nowrap"
          :class="rollValueBadgeClass">
          RV {{ totalRv }}%
        </span>
      </div>
      <div class="flex gap-2">
        <EchoCustomPresetEcho v-if="echo1Id" key="echo1" :echo-id="echo1Id" />
        <EchoCustomPresetEcho v-if="echo2Id" key="echo2" :echo-id="echo2Id" />
        <EchoCustomPresetEcho v-if="echo3Id" key="echo3" :echo-id="echo3Id" />
        <EchoCustomPresetEcho v-if="echo4Id" key="echo4" :echo-id="echo4Id" />
        <EchoCustomPresetEcho v-if="echo5Id" key="echo5" :echo-id="echo5Id" />
      </div>
      <div v-if="!disableAction" class="actions flex gap-2">
        <button class="btn btn-sm btn-primary max-w-40 mt-2">
          Apply preset
        </button>
        <button
          @click.stop="deletePreset"
          class="btn btn-sm btn-error max-w-40 mt-2">
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
import { getRollValue } from "../echoes/stats";
import { useInventoryStore } from "../stores/inventory";
import { useCharacterStore } from "../stores/character";

type EchoSlotData = Record<string, unknown>;

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
  }>(),
  {
    disableAction: false,
    showEquippedChars: false,
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

function getEchoStatsFormatted(data: EchoSlotData): Record<string, string> {
  const echoData: Record<string, string> = {};
  for (let i = 1; i <= 5; i += 1) {
    const typeKey = `echoSubStatsType${i}`;
    const valueKey = `echoSubStatsValue${i}`;
    if (data[typeKey]) {
      echoData[String(data[typeKey])] = String(data[valueKey] ?? 0);
    }
  }
  return echoData;
}

function calculateCritValue(echoData: EchoSlotData) {
  let cv = 0;
  for (let i = 1; i <= 5; i += 1) {
    const typeKey = `echoSubStatsType${i}`;
    const valueKey = `echoSubStatsValue${i}`;
    if (echoData[typeKey] === "CritRate") {
      cv += (echoData[valueKey] as number) * 2;
    } else if (echoData[typeKey] === "CritDMG") {
      cv += echoData[valueKey] as number;
    }
  }
  return cv;
}

function echoRv(data: EchoSlotData | null) {
  if (!data) {
    return 0;
  }
  return getRollValue(getEchoStatsFormatted(data));
}

const echo1Rv = computed(() => echoRv(echo1Data.value));
const echo2Rv = computed(() => echoRv(echo2Data.value));
const echo3Rv = computed(() => echoRv(echo3Data.value));
const echo4Rv = computed(() => echoRv(echo4Data.value));
const echo5Rv = computed(() => echoRv(echo5Data.value));

const echo1Cv = computed(() =>
  echo1Data.value ? calculateCritValue(echo1Data.value) : 0,
);
const echo2Cv = computed(() =>
  echo2Data.value ? calculateCritValue(echo2Data.value) : 0,
);
const echo3Cv = computed(() =>
  echo3Data.value ? calculateCritValue(echo3Data.value) : 0,
);
const echo4Cv = computed(() =>
  echo4Data.value ? calculateCritValue(echo4Data.value) : 0,
);
const echo5Cv = computed(() =>
  echo5Data.value ? calculateCritValue(echo5Data.value) : 0,
);

const totalRv = computed(
  () =>
    echo1Rv.value +
    echo2Rv.value +
    echo3Rv.value +
    echo4Rv.value +
    echo5Rv.value,
);

const totalCv = computed(
  () =>
    echo1Cv.value +
    echo2Cv.value +
    echo3Cv.value +
    echo4Cv.value +
    echo5Cv.value,
);

const formattedCritValue = computed(() => {
  const num = totalCv.value ?? 0;
  if (Number.isInteger(num)) {
    return num;
  }
  const rounded = num.toFixed(1);
  return rounded.endsWith(".0") ? parseInt(rounded, 10) : parseFloat(rounded);
});

const rollValueBadgeClass = computed(() => {
  const rv = totalRv.value / 5 ?? 0;
  const percentage = Math.min(Math.max(rv, 0), 600);
  let bgColor: string;
  let color = "text-white";
  let boxShadow: string | undefined;
  let borderColor: string;
  if (percentage <= 180) {
    bgColor = "bg-emerald-800";
    borderColor = "border-emerald-800";
  } else if (percentage <= 220) {
    bgColor = "bg-green-500";
    borderColor = "border-green-500";
  } else if (percentage <= 300) {
    bgColor = "bg-blue-600";
    borderColor = "border-blue-600";
    color = "text-black";
  } else if (percentage < 400) {
    bgColor = "bg-purple-600";
    borderColor = "border-purple-600";
    color = "text-black";
  } else {
    bgColor = "bg-yellow-500";
    borderColor = "border-yellow-500";
    color = "text-black";
  }
  if (percentage >= 450) {
    boxShadow = "shadow-md shadow-yellow-500/50";
  }
  return [bgColor, color, borderColor, boxShadow];
});

const critValueBadgeClass = computed(() => {
  const cv = totalCv.value / 5 ?? 0;
  const percentage = Math.min(Math.max(cv, 0), 42);
  let bgColor: string;
  let color = "text-white";
  let boxShadow: string | undefined;
  let borderColor: string;
  if (percentage <= 7) {
    bgColor = "bg-emerald-800";
    borderColor = "border-emerald-800";
  } else if (percentage <= 14) {
    bgColor = "bg-green-500";
    borderColor = "border-green-500";
  } else if (percentage <= 21) {
    bgColor = "bg-blue-600";
    borderColor = "border-blue-600";
    color = "text-black";
  } else if (percentage <= 28) {
    bgColor = "bg-purple-600";
    borderColor = "border-purple-600";
    color = "text-black";
  } else if (percentage <= 35) {
    bgColor = "bg-purple-400";
    borderColor = "border-purple-400";
    color = "text-black";
  } else {
    bgColor = "bg-yellow-500";
    borderColor = "border-yellow-500";
    color = "text-black";
  }
  if (percentage >= 40) {
    boxShadow = "shadow-md shadow-yellow-500/50";
  }
  return [bgColor, color, borderColor, boxShadow];
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
