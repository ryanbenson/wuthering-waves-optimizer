<template>
  <div
    class="party-rotation-stats mt-4 p-4 rounded-lg border border-base-300"
    :data-test-party-rotation-stats="teammateCharacterKey">
    <h4 class="font-bold text-lg mb-3">Rotation damage stats</h4>
    <p class="text-sm opacity-80 mb-4">
      Used when this character performs attacks in your rotations. Team buffs from
      your main character still apply.
    </p>

    <label class="label cursor-pointer justify-start gap-3 mb-4">
      <input
        type="checkbox"
        class="toggle toggle-primary toggle-sm"
        v-model="useSavedBuild"
        :data-test-party-rotation-use-saved="teammateCharacterKey" />
      <span class="label-text">Use saved build (stats, buffs, resonance chains)</span>
    </label>

    <template v-if="!useSavedBuild">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div
          v-for="field in statFields"
          :key="field.key"
          class="form-control">
          <label class="label py-0">
            <span class="label-text">{{ field.label }}</span>
          </label>
          <input
            type="number"
            class="input input-bordered input-sm"
            :value="manualStatValue(field.key)"
            @input="onManualStatInput(field.key, $event)"
            :data-test-party-rotation-stat="`${teammateCharacterKey}-${field.key}`" />
        </div>
      </div>
    </template>

    <div class="rotation-performer-echo flex flex-col gap-2">
      <h5 class="font-semibold">Main echo (for echo attacks)</h5>
      <div class="flex flex-wrap items-center gap-3">
        <img
          v-if="selectedMainEchoImage"
          :src="selectedMainEchoImage"
          class="size-12 rounded-full border border-solid neutral-content bg-cover"
          :alt="selectedMainEchoName ?? ''" />
        <select
          v-model="mainEcho"
          class="select select-bordered select-sm flex-1 min-w-[12rem]"
          :data-test-party-rotation-main-echo="teammateCharacterKey">
          <option :value="null">None</option>
          <option
            v-for="echo in mainEchoOptions"
            :key="echo.key"
            :value="echo.key">
            {{ echo.name }}
          </option>
        </select>
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium">Rank</span>
          <select
            v-model="mainEchoRank"
            class="select select-bordered select-sm w-16"
            :data-test-party-rotation-main-echo-rank="teammateCharacterKey">
            <option v-for="rank in [1, 2, 3, 4, 5]" :key="rank" :value="rank">
              {{ rank }}
            </option>
          </select>
        </div>
        <button
          type="button"
          class="btn btn-xs btn-outline btn-secondary"
          @click="syncMainEchoFromSaved"
          :disabled="!savedMainEcho">
          Use saved main echo
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useCharacterStore } from "../stores/character";
import {
  MAIN_ECHO_OPTIONS,
  type RotationPerformerManualStats,
} from "../calculator/rotationPerformer";
import { getEchoData } from "../echoes";

const props = defineProps<{
  activeCharacter: string;
  teammateCharacterKey: string;
}>();

const emit = defineEmits<{
  "rotation-performer-updated": [];
}>();

const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);
const { setCharacterData } = characterStore;

const statFields: Array<{ key: keyof RotationPerformerManualStats; label: string }> =
  [
    { key: "totalAtk", label: "ATK" },
    { key: "totalHp", label: "HP" },
    { key: "totalDef", label: "DEF" },
    { key: "critRate", label: "Crit Rate (%)" },
    { key: "critDMG", label: "Crit DMG (%)" },
    { key: "energyRegen", label: "Energy Regen (%)" },
    { key: "glacio", label: "Glacio DMG Bonus (%)" },
    { key: "fusion", label: "Fusion DMG Bonus (%)" },
    { key: "electro", label: "Electro DMG Bonus (%)" },
    { key: "aero", label: "Aero DMG Bonus (%)" },
    { key: "spectro", label: "Spectro DMG Bonus (%)" },
    { key: "havoc", label: "Havoc DMG Bonus (%)" },
    { key: "basicAttackDMGBonus", label: "Basic Attack DMG Bonus (%)" },
    { key: "heavyAttackDMGBonus", label: "Heavy Attack DMG Bonus (%)" },
    { key: "resonanceSkillDMGBonus", label: "Res. Skill DMG Bonus (%)" },
    { key: "introSkillDMGBonus", label: "Intro Skill DMG Bonus (%)" },
    { key: "outroSkillDMGBonus", label: "Outro Skill DMG Bonus (%)" },
    {
      key: "resonanceLiberationDMGBonus",
      label: "Res. Liberation DMG Bonus (%)",
    },
    { key: "echoDMGBonus", label: "Echo DMG Bonus (%)" },
  ];

const mainEchoOptions = MAIN_ECHO_OPTIONS;

const activeCharacterData = computed(
  () => characters.value[props.activeCharacter] ?? {},
);

const teammateStoreData = computed(
  () => characters.value[props.teammateCharacterKey] ?? {},
);

const performerConfig = computed(() => {
  const performers =
    (activeCharacterData.value.teamBuffs as { rotationPerformers?: Record<string, unknown> })
      ?.rotationPerformers ?? {};
  return (performers[props.teammateCharacterKey] ?? {}) as {
    useSavedBuild?: boolean;
    mainEcho?: string | null;
    mainEchoRank?: number | string | null;
    manualStats?: RotationPerformerManualStats;
  };
});

const savedMainEcho = computed(
  () => (teammateStoreData.value.mainEcho as { echo?: string })?.echo ?? null,
);

const selectedMainEchoImage = computed(() => {
  if (!mainEcho.value) {
    return null;
  }
  return getEchoData(mainEcho.value)?.image ?? null;
});

const selectedMainEchoName = computed(() => {
  if (!mainEcho.value) {
    return null;
  }
  return getEchoData(mainEcho.value)?.name ?? null;
});

async function updatePerformerConfig(
  partial: Record<string, unknown>,
) {
  await setCharacterData(props.activeCharacter, {
    teamBuffs: {
      rotationPerformers: {
        [props.teammateCharacterKey]: partial,
      },
    },
  });
  emit("rotation-performer-updated");
}

const useSavedBuild = computed({
  get: () => performerConfig.value.useSavedBuild !== false,
  set: (value: boolean) => {
    void updatePerformerConfig({
      ...performerConfig.value,
      useSavedBuild: value,
    });
  },
});

const mainEcho = computed({
  get: () => performerConfig.value.mainEcho ?? null,
  set: (value: string | null) => {
    void updatePerformerConfig({
      ...performerConfig.value,
      mainEcho: value,
    });
  },
});

const mainEchoRank = computed({
  get: () => Number(performerConfig.value.mainEchoRank ?? 5),
  set: (value: number) => {
    void updatePerformerConfig({
      ...performerConfig.value,
      mainEchoRank: value,
    });
  },
});

function manualStatValue(key: keyof RotationPerformerManualStats) {
  return performerConfig.value.manualStats?.[key] ?? "";
}

function onManualStatInput(
  key: keyof RotationPerformerManualStats,
  event: Event,
) {
  const target = event.target as HTMLInputElement;
  const raw = target.value;
  const value = raw === "" ? null : Number(raw);
  void updatePerformerConfig({
    ...performerConfig.value,
    manualStats: {
      ...(performerConfig.value.manualStats ?? {}),
      [key]: value,
    },
  });
}

function syncMainEchoFromSaved() {
  if (!savedMainEcho.value) {
    return;
  }
  const rank =
    (teammateStoreData.value.mainEcho as { rank?: number })?.rank ?? 5;
  void updatePerformerConfig({
    ...performerConfig.value,
    mainEcho: savedMainEcho.value,
    mainEchoRank: rank,
  });
}
</script>
