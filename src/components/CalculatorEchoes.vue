<template>
  <div>
    <CalculatorEchoImporter
      ref="echoesImporter"
      :character="character"></CalculatorEchoImporter>
    <CalculatorEchoesBrowser
      ref="echoesBrowser"
      :character="character"
      @chosen-echo-inventory="
        handleChosenEchoInventory
      "></CalculatorEchoesBrowser>
    <CalculatorEchoesPresets
      ref="echoesPresets"
      :character="character"></CalculatorEchoesPresets>
    <CalculatorSaveEchoesPreset
      ref="echoesSavePreset"
      @on-save-echo-preset="
        handleOnSaveEchoPreset
      "></CalculatorSaveEchoesPreset>
    <CalculatorEchoesPresetsGuide
      ref="echoesPresetsGuide"></CalculatorEchoesPresetsGuide>
    <div v-if="isTotalCostOverCap" class="alert alert--error">
      You have exceeded to total echo cost of 12 with {{ totalEchoCost }}.
    </div>
    <div class="actions mb-4 flex gap-2 flex-wrap">
      <button class="btn btn-sm btn-primary" @click="handleOpenEchoesImporter">
        Import Echoes
      </button>
      <button class="btn btn-sm btn-primary" @click="handleOpenEchoesPreset">
        Use Presets
      </button>
      <button class="btn btn-sm btn-primary" @click="handleOpenSaveEchoPreset">
        Save Preset
      </button>
      <button
        class="btn btn-sm btn-primary btn-outline"
        @click="handleOpenPresetsGuide">
        Presets Guide
      </button>
    </div>
    <div v-if="echoPresetName" class="badge badge-primary badge-outline mb-4">
      Preset: {{ echoPresetName }}
    </div>
    <div class="echo__list">
      <CalculatorEcho
        v-for="(_, index) in 5"
        :key="character + '-' + index"
        :ref="getEchoRefSetter(index)"
        :index="index"
        :character="character"
        class="echo-selector"
        @updated-echo-cost="handleUpdatedEchoCost"
        @update-stats="handleEchoStats"
        @echo:set-chosen="handleEchoSetChosen"
        @main-echo:updated="handleMainEchoUpdated"
        @main-echo-rank:updated="handleMainEchoRankUpdated"
        @open-echoes-browser="handleOpenEchoesBrowser"
        @on-echo-removed="handleEchoRemoved"></CalculatorEcho>
    </div>
    <div class="set-bonus-selector mt-6 mb-2">
      <div class="set-bonus-selector__header flex justify-between items-center">
        <h2 class="text-lg font-bold">Set Bonuses</h2>
        <div class="form-control">
          <label class="label cursor-pointer">
            <input
              type="checkbox"
              v-model="setOverride"
              class="toggle toggle-primary" />
            <span class="label-text p-0 m-0 ml-2">Enable set override</span>
          </label>
        </div>
      </div>

      <CalculatorEchoesSetBonusOne
        :character="character"
        :is-override-enabled="setOverride"
        @update-stats="handleSetBonusOneData"
        data-test-echoes-set-one></CalculatorEchoesSetBonusOne>
      <CalculatorEchoesSetBonusTwo
        :character="character"
        :is-override-enabled="setOverride"
        @update-stats="handleSetBonusTwoData"
        data-test-echoes-set-two></CalculatorEchoesSetBonusTwo>
    </div>
    <h2 v-if="false" class="text-lg font-bold mt-6 mb-2">Main Echo Buff</h2>
    <div class="main__echo relative mt-12">
      <h3
        v-if="echoName"
        class="main-echo__name"
        :class="{
          'text-amber-300': mainEchoRank === '5' || mainEchoRank === 5,
          'text-violet-600': mainEchoRank === '4' || mainEchoRank === 4,
          'text-blue-500': mainEchoRank === '3' || mainEchoRank === 3,
          'text-green-500': mainEchoRank === '2' || mainEchoRank === 2,
        }">
        {{ echoName }}
      </h3>
      <div
        v-if="mainEcho"
        class="card card-bordered card-compact bg-base-100 shadow mb-2 cursor-pointer relative z-10"
        @click="toggleMainEchoBuffEnabled">
        <div class="card-body">
          <div
            v-if="chosenMainEchoData"
            class="main-echo__details"
            v-html="chosenMainEchoData.details"></div>

          <div class="flex gap-2 items-center">
            <div class="form-control" @click.stop>
              <label
                class="label inline-flex justify-start"
                :class="{ 'cursor-pointer': !setAlwaysEnabled }"
                @click.stop>
                <input
                  type="checkbox"
                  class="checkbox checkbox-sm"
                  v-model="mainEchoBuffEnabled"
                  :disabled="setAlwaysEnabled"
                  :data-test-main-echo-enabled="mainEcho" />
                <span class="label-text ml-2">Enabled?</span>
              </label>
            </div>
            <div v-if="mainEchoHasStacks" class="form-control" @click.stop>
              <label
                class="label cursor-pointer inline-flex justify-start"
                v-if="!setAlwaysEnabled">
                <input
                  v-model="mainEchoStacks"
                  type="number"
                  class="input input-bordered input-xs"
                  :min="0"
                  :max="mainEchoMaxStacks"
                  :data-test-main-echo-stacks="mainEcho" />
                <span class="label-text ml-2">Stacks</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { mainEchoesData, getEchoData } from "../echoes/index.ts";
import { getEchoSetLabelByType, echoSetLabelMap } from "../echoes/stats.ts";
import { twoSetBonuses, threeSetBonuses, fiveSetBonuses } from "../echoes/sets.ts";
import CalculatorEcho from "./CalculatorEcho.vue";
import CalculatorEchoesSetBonusOne from "./CalculatorEchoesSetBonusOne.vue";
import CalculatorEchoesSetBonusTwo from "./CalculatorEchoesSetBonusTwo.vue";
import CalculatorEchoesBrowser from "./CalculatorEchoesBrowser.vue";
import CalculatorEchoImporter from "./CalculatorEchoImporter.vue";
import CalculatorEchoesPresets from "./CalculatorEchoesPresets.vue";
import CalculatorSaveEchoesPreset from "./CalculatorSaveEchoesPreset.vue";
import CalculatorEchoesPresetsGuide from "./CalculatorEchoesPresetsGuide.vue";
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";
import { randomString } from "../utils/strings.ts";

const MAX_ECHO_COST = 12;

const props = defineProps<{ character: string }>();
const emit = defineEmits<{
  "update-stats": [stats: Record<string, any>];
  "updated-main-echo": [echo: string | null];
  "updated-main-echo-rank": [rank: number | string];
}>();

const characterStore = useCharacterStore() as any;
const inventoryStore = useInventoryStore() as any;

const echoesImporter = ref<any>(null);
const echoesBrowser = ref<any>(null);
const echoesPresets = ref<any>(null);
const echoesSavePreset = ref<any>(null);
const echoesPresetsGuide = ref<any>(null);
const echoRefs = ref<Record<number, any>>({});

const setBonusOne = ref<Record<string, any>>({});
const setBonusTwo = ref<Record<string, any>>({});
const echoData = ref<Record<number, Record<string, any>>>({});
const echoCosts = ref<number[]>([]);
const echoSetsChosen = ref<(string | null)[]>([]);

const currentCharacter = computed(
  () => (characterStore.characters?.[props.character] as Record<string, any>) ?? {},
);

const mainEcho = computed({
  get: () => currentCharacter.value?.mainEcho?.echo ?? null,
  set: async (value: string | null) => {
    await characterStore.setCharacterData(props.character, { mainEcho: { echo: value } });
  },
});

const echoPresetId = computed({
  get: () => currentCharacter.value?.echoPresetId ?? null,
  set: async (value: string | null) => {
    await characterStore.setCharacterData(props.character, { echoPresetId: value });
  },
});

const setOverride = computed({
  get: () => currentCharacter.value?.setOverride ?? null,
  set: async (value: boolean | null) => {
    await characterStore.setCharacterData(props.character, { setOverride: value });
  },
});

const mainEchoRank = computed({
  get: () => currentCharacter.value?.mainEcho?.rank ?? 5,
  set: async (value: number | string) => {
    await characterStore.setCharacterData(props.character, { mainEcho: { rank: value } });
  },
});

const mainEchoBuffEnabled = computed({
  get: () => currentCharacter.value?.mainEcho?.isEnabled ?? false,
  set: async (value: boolean) => {
    await characterStore.setCharacterData(props.character, { mainEcho: { isEnabled: value } });
  },
});

const mainEchoStacks = computed({
  get: () => currentCharacter.value?.mainEcho?.stacks ?? 0,
  set: async (value: number) => {
    await characterStore.setCharacterData(props.character, { mainEcho: { stacks: value } });
  },
});

const chosenMainEchoData = computed(() =>
  mainEcho.value ? (mainEchoesData as any)?.[mainEcho.value] ?? null : null,
);
const chosenMainEchoBuffs = computed(() => chosenMainEchoData.value?.modifiers ?? []);
const mainEchoHasStacks = computed(() => chosenMainEchoData.value?.hasStacks ?? false);
const mainEchoMaxStacks = computed(() => chosenMainEchoData.value?.maxStacks ?? 0);
const echoName = computed(() => (mainEcho.value ? getEchoData(mainEcho.value)?.name ?? null : null));


const totalEchoCost = computed(() => echoCosts.value.reduce((total, cost) => total + cost, 0));
const isTotalCostOverCap = computed(() => totalEchoCost.value > MAX_ECHO_COST);
const echoPresetData = computed(() => inventoryStore.getEchoPresetData?.(echoPresetId.value));
const echoPresetName = computed(() => echoPresetData.value?.name ?? null);

function setEchoRef(index: number, el: any) {
  if (el) echoRefs.value[index] = el;
}
function getEchoRefSetter(index: number) {
  return (el: any) => setEchoRef(index, el);
}

const setAlwaysEnabled = computed(() => chosenMainEchoData.value?.alwaysEnabled === true);

function updateTotalStats() {
  const stats: Record<string, any> = {};

  Object.values(JSON.parse(JSON.stringify(echoData.value || {}))).forEach((echo: any) => {
    Object.entries(echo).forEach(([stat, value]) => {
      stats[stat] = (stats[stat] || 0) + (value as number);
    });
  });
  Object.entries(JSON.parse(JSON.stringify(setBonusOne.value || {}))).forEach(([stat, value]) => {
    stats[stat] = (stats[stat] || 0) + (value as number);
  });
  Object.entries(JSON.parse(JSON.stringify(setBonusTwo.value || {}))).forEach(([stat, value]) => {
    if (stat === "EnableAttack") stats[stat] = value;
    else stats[stat] = (stats[stat] || 0) + (value as number);
  });

  if (mainEchoBuffEnabled.value) {
    for (const mainEchoBuff of chosenMainEchoBuffs.value as any[]) {
      const specificCharacters = mainEchoBuff?.specificCharacters ?? [];
      if (specificCharacters.length > 0 && !specificCharacters.includes(props.character)) continue;
      if (mainEchoBuff?.modifySpecificTalents) {
        stats.specificTalentBuffs = {};
        mainEchoBuff.modifySpecificTalents.forEach((buffTalentName: string) => {
          stats.specificTalentBuffs[buffTalentName] = mainEchoBuff.modifierValue;
        });
      } else {
        const buffVal = mainEchoBuff.modifierValue * 100;
        const appliedVal = mainEchoHasStacks.value ? buffVal * mainEchoStacks.value : buffVal;
        stats[mainEchoBuff.modifier] = (stats[mainEchoBuff.modifier] || 0) + appliedVal;
      }
    }
  }

  emit("update-stats", stats);
}

function handleSetBonusOneData(data: Record<string, any>) {
  setBonusOne.value = JSON.parse(JSON.stringify(data));
  updateTotalStats();
}
function handleSetBonusTwoData(data: Record<string, any>) {
  setBonusTwo.value = JSON.parse(JSON.stringify(data));
  updateTotalStats();
}
function handleEchoStats({ index, stats }: { index: number; stats: Record<string, any> }) {
  echoData.value[index] = stats;
  updateTotalStats();
}
function handleUpdatedEchoCost({ index, cost }: { index: number; cost: number }) {
  echoCosts.value[index] = cost;
}
function toggleMainEchoBuffEnabled() {
  mainEchoBuffEnabled.value = !mainEchoBuffEnabled.value;
}
function handleMainEchoChange() {
  emit("updated-main-echo", mainEcho.value);
}
function handleMainEchoRank() {
  emit("updated-main-echo-rank", mainEchoRank.value);
}
async function handleEchoSetChosen({ set, index }: { set: string | null; index: number }) {
  echoSetsChosen.value[index] = set;
  await updateEchoSets();
}

async function updateEchoSets() {
  const counts = echoSetsChosen.value
    .filter((v) => v !== null)
    .reduce((acc: Record<string, number>, val) => {
      const key = val as string;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

  const buildBonusSet = (source: string[], targetCountLabel: string) =>
    new Set(
      source
        .map((bonus) => {
          const match = bonus.match(new RegExp(`^(.+) ${targetCountLabel}$`));
          return match
            ? Object.keys(echoSetLabelMap).find((key) => getEchoSetLabelByType(key) === match[1])
            : null;
        })
        .filter(Boolean),
    );

  const has2SetBonus = buildBonusSet(twoSetBonuses, "2 Set");
  const has3SetBonus = buildBonusSet(threeSetBonuses, "3 Set");
  const has5SetBonus = buildBonusSet(fiveSetBonuses, "5 Set");

  const availableBonuses: Array<{ bonus: string; priority: number; setType: string }> = [];
  for (const [setType, count] of Object.entries(counts)) {
    const setLabel = getEchoSetLabelByType(setType);
    if (count >= 5 && has5SetBonus.has(setType)) availableBonuses.push({ bonus: `${setLabel} 5 Set`, priority: 3, setType });
    if (count >= 3 && has3SetBonus.has(setType)) availableBonuses.push({ bonus: `${setLabel} 3 Set`, priority: 2, setType });
    if (count >= 2 && has2SetBonus.has(setType)) availableBonuses.push({ bonus: `${setLabel} 2 Set`, priority: 1, setType });
  }

  const twoSetOptions = availableBonuses.filter((b) => b.bonus.includes("2 Set"));
  const higherTierBonuses = availableBonuses.filter((b) => b.bonus.includes("3 Set") || b.bonus.includes("5 Set"));
  twoSetOptions.sort((a, b) => a.setType.localeCompare(b.setType));
  higherTierBonuses.sort((a, b) => (a.priority !== b.priority ? b.priority - a.priority : a.setType.localeCompare(b.setType)));

  let setBonusOneVal: string | null = twoSetOptions.length > 0 ? twoSetOptions[0].bonus : null;
  let setBonusTwoVal: string | null = null;
  const usedSetTypes = setBonusOneVal ? new Set([twoSetOptions[0].setType]) : new Set<string>();

  for (const { bonus, setType } of higherTierBonuses) {
    if (!usedSetTypes.has(setType) || setBonusOneVal?.includes(getEchoSetLabelByType(setType))) {
      setBonusTwoVal = bonus;
      break;
    }
  }
  if (!setBonusTwoVal) {
    for (const { bonus, setType } of twoSetOptions.slice(1)) {
      if (!usedSetTypes.has(setType)) {
        setBonusTwoVal = bonus;
        break;
      }
    }
  }

  if (setOverride.value) return;
  await characterStore.setCharacterData(props.character, {
    echoSetBonus: { setBonusOne: setBonusOneVal, setBonusTwo: setBonusTwoVal },
  });
}

function handleMainEchoUpdated(echo: string | null) {
  mainEcho.value = echo;
}
function handleMainEchoRankUpdated(rank: number | string) {
  mainEchoRank.value = rank;
}
function handleOpenEchoesBrowser(echoIndex: number) {
  echoesBrowser.value?.triggerOpenModal?.(echoIndex);
}
function handleOpenEchoesImporter() {
  echoesImporter.value?.triggerOpenModal?.();
}
function handleOpenEchoesPreset() {
  echoesPresets.value?.triggerOpenModal?.();
}
function handleOpenPresetsGuide() {
  echoesPresetsGuide.value?.triggerOpenModal?.();
}
function handleOpenSaveEchoPreset() {
  if (echoPresetId.value) echoesSavePreset.value?.setPresetId?.(echoPresetId.value);
  echoesSavePreset.value?.triggerOpenModal?.();
}

async function handleOnSaveEchoPreset(data: { name: string }) {
  const id = randomString();
  for (let i = 0; i < 5; i += 1) {
    await echoRefs.value[i]?.saveEchoItem?.();
  }
  const presetData = {
    presetId: id,
    name: data.name,
    echo1Id: currentCharacter.value?.echoes?.[0]?.echoId ?? null,
    echo2Id: currentCharacter.value?.echoes?.[1]?.echoId ?? null,
    echo3Id: currentCharacter.value?.echoes?.[2]?.echoId ?? null,
    echo4Id: currentCharacter.value?.echoes?.[3]?.echoId ?? null,
    echo5Id: currentCharacter.value?.echoes?.[4]?.echoId ?? null,
  };
  await inventoryStore.saveEchoPreset(presetData);
  echoPresetId.value = id;
  await inventoryStore.setEquippedPresetData(props.character, id);
}

async function handleEchoRemoved() {
  await inventoryStore.deleteEquippedPreset(props.character);
  echoPresetId.value = null;
}

async function handleChosenEchoInventory() {
  await handleEchoRemoved();
  await inventoryStore.removeCharacterFromAllEquipped(props.character);
  for (let i = 0; i < 5; i += 1) {
    const echoId = currentCharacter.value?.echoes?.[i]?.echoId ?? null;
    const equippedData: Record<string, number> = {};
    equippedData[props.character] = i;
    await inventoryStore.setEquippedData(echoId, equippedData);
  }
}

watch(
  mainEcho,
  () => {
    handleMainEchoChange();
    if (mainEchoStacks.value > mainEchoMaxStacks.value) {
      mainEchoStacks.value = mainEchoMaxStacks.value;
    }
    updateTotalStats();
  },
  { immediate: true },
);
watch(mainEchoRank, () => handleMainEchoRank(), { immediate: true });
watch(mainEchoBuffEnabled, () => updateTotalStats(), { immediate: true });
watch(
  mainEchoStacks,
  (stacksVal) => {
    if (stacksVal > mainEchoMaxStacks.value) {
      mainEchoStacks.value = mainEchoMaxStacks.value;
    }
    updateTotalStats();
  },
  { immediate: true },
);
watch(setOverride, (newValue) => {
  if (newValue === false) {
    updateEchoSets();
  }
});
</script>

<style scoped>
.echo-selector {
  margin-bottom: 20px;
}

.sub-stat-selector {
  display: flex;
  margin-top: 5px;
}

.sub-stat-selector select,
.sub-stat-selector input {
  margin-right: 10px;
}

.set-bonus-selector {
  margin-bottom: 20px;
}

.set-bonus-selector select {
  margin-right: 10px;
}
.echo-selector {
  margin-bottom: 20px;
}

.cost-selector,
.rank-selector {
  margin: 0 1rem 1rem 0;
}
.echo-setup {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.rank-options {
  display: flex;
}
.cost-options button,
.rank-options .rank-circle {
  margin-right: 10px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  cursor: pointer;
}

.rank-options .rank-circle {
  width: 24px;
  height: 24px;
  border-radius: 100%;
  display: inline-block;
  padding: 0;
  border: none;
}

.cost-options button {
  background-color: transparent;
  border-radius: 6px;
}
.cost-options button.selected {
  font-weight: bold;
  border-color: yellow !important;
}

.sub-stat-selector {
  display: flex;
  margin-top: 5px;
}

.sub-stat-selector select,
.sub-stat-selector input {
  margin-right: 10px;
}

.set-bonus-selector {
  margin-bottom: 20px;
}

.set-bonus-selector select {
  margin-right: 10px;
}
.rank-circle.selected {
  transform: scale(1.3);
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
}
.sub-stat__input {
  max-width: 3rem;
  width: 3rem;
}
.main-echo__image {
  width: 100px;
  height: 100px;
  background-repeat: no-repeat;
  display: block;
  background-size: contain;
  border-radius: 100%;
  border: 1px solid white;
}
.main-echo__selection {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 1rem;
}
.main-echo__enabled {
  margin-top: 1rem;
}
.alert {
  background: #126a5a;
  padding: 0.25rem 0.5rem;
  font-size: 14px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  color: white;
}
.alert--error {
  background-color: #7b7c27;
}
.main-echo-level {
  padding-top: 0.5rem;
  label {
    display: block;
  }
}
.main-echo {
  background-color: #161616;
  padding: 0.5rem 0.75rem;
  margin-top: 2rem;
  border-radius: 6px;
  cursor: pointer;

  span:first-of-type {
    font-weight: bold;
  }
}
.substats__label {
  position: relative;
  left: -10px;
  top: 4px;
  z-index: 0;
  font-size: 24px;
}
html[data-theme="light"] {
  .main-echo {
    background-color: #f8f8f8;
  }
  .echo__item__actions {
    svg {
      filter: invert(100%);
    }
  }
}

.main-echo__name {
  font-size: 36px;
  font-weight: 700;
  position: absolute;
  top: -2.6rem;
  left: 0.5rem;
  z-index: 0;
}

.rank__label {
  font-size: 24px;
  font-weight: 700;
  position: absolute;
  top: -1.6rem;
  left: 0.5rem;
  z-index: 0;
}
.substat__label {
  font-size: 16px;
  position: absolute;
  left: 3rem;
  top: -0.9rem;
  z-index: 0;
}
.echo__selection__rank__input {
  position: relative;
  z-index: 10;
}
</style>
