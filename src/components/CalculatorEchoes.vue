<template>
  <div>
    <CalculatorEchoImporter
      ref="echoesImporter"
      :character="character"></CalculatorEchoImporter>
    <!-- The v3 browser adds swap-impact badges and sort-by-impact; the
    legacy one stays exactly as-is for the un-flagged calculator. Both emit
    the same event, so the post-assign bookkeeping below is shared. -->
    <WorkspaceEchoesBrowser
      v-if="isLiveResultBarEnabled"
      ref="echoesBrowser"
      :character="character"
      @chosen-echo-inventory="handleChosenEchoInventory" />
    <CalculatorEchoesBrowser
      v-else
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
    <CalculatorEchoRatingGuide
      ref="echoRatingGuide"></CalculatorEchoRatingGuide>
    <EchoRatingWeightsEditor
      ref="echoRatingWeightsEditor"></EchoRatingWeightsEditor>
    <Toast
      v-if="showCostOverCapToast"
      variant="error"
      @dismiss="dismissCostOverCapToast">
      You have exceeded to total echo cost of 12 with {{ totalEchoCost }}.
    </Toast>
    <div class="echoes__header flex flex-wrap items-center justify-between gap-4 mb-4 rounded-lg bg-base-200 p-1 pl-3">
      <h3 class="text-sm font-semibold">Echoes</h3>
      <div class="flex flex-wrap items-center gap-2">
        <button class="btn btn-sm" @click="handleOpenEchoesImporter">
          Import Echoes
        </button>
        <button class="btn btn-sm" @click="handleOpenEchoesPreset">
          Use Presets
        </button>
        <button class="btn btn-sm" @click="handleOpenSaveEchoPreset">
          Save Preset
        </button>
        <AppOverflowMenu
          aria-label="More echo actions"
          data-test="calculator-echoes-overflow-menu">
          <li>
            <button type="button" @click="handleOpenWeightsEditor">
              Customize Weights
            </button>
          </li>
          <li>
            <button type="button" @click="handleOpenPresetsGuide">
              <span class="text-primary">Presets Guide</span>
            </button>
          </li>
          <li>
            <button type="button" @click="handleOpenRatingGuide">
              <span class="text-primary">Rating Guide</span>
            </button>
          </li>
        </AppOverflowMenu>
      </div>
    </div>
    <div class="flex flex-wrap items-center gap-2 mb-4">
      <div v-if="echoPresetName" class="badge badge-primary badge-outline">
        Preset: {{ echoPresetName }}
      </div>
      <div
        v-if="teamSubstatScoreRollup && !isLiveResultBarEnabled"
        class="badge text-nowrap"
        :class="teamSubstatScoreRollupBadgeClass"
        v-tooltip="'Build Score — average Substat Score across this character\'s equipped echoes'">
        Build Score: {{ teamSubstatScoreRollup.grade }} {{ Math.round(teamSubstatScoreRollup.percent) }}%{{ teamSubstatScoreRollup.provisional ? "*" : "" }}
      </div>
    </div>
    <div v-if="isLiveResultBarEnabled" class="echoes-layout">
      <div class="echoes-layout__strip echo__list">
        <CalculatorEchoTile
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
          @on-echo-removed="handleEchoRemoved"
          @open-edit-panel="emit('open-echo-edit-panel', $event)"></CalculatorEchoTile>
      </div>
      <CalculatorEchoInsightsPanel
        class="echoes-layout__insights"
        :character="character"></CalculatorEchoInsightsPanel>
    </div>
    <div v-else class="echo__list">
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

      <CalculatorEchoesSetBonusOnePiece
        :character="character"
        :is-override-enabled="setOverride"
        @update-stats="handleSetBonusOnePieceData"
        data-test-echoes-set-one-piece></CalculatorEchoesSetBonusOnePiece>
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
        @updated-buff-stats="handleMainEchoBuffStats" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { mainEchoesData, getEchoData, getMainEchoBuffs, mergeMainEchoBuffStats } from "../echoes/index.ts";
import { getSetBonusEffects } from "../echoes/sets.ts";
import CalculatorEcho from "./CalculatorEcho.vue";
import CalculatorEchoTile from "./CalculatorEchoTile.vue";
import CalculatorEchoInsightsPanel from "./CalculatorEchoInsightsPanel.vue";
import CalculatorEchoesSetBonusOnePiece from "./CalculatorEchoesSetBonusOnePiece.vue";
import CalculatorEchoesSetBonusOne from "./CalculatorEchoesSetBonusOne.vue";
import CalculatorEchoesSetBonusTwo from "./CalculatorEchoesSetBonusTwo.vue";
import CalculatorEchoesBrowser from "./CalculatorEchoesBrowser.vue";
import WorkspaceEchoesBrowser from "./characterWorkspace/WorkspaceEchoesBrowser.vue";
import CalculatorEchoImporter from "./CalculatorEchoImporter.vue";
import CalculatorEchoesPresets from "./CalculatorEchoesPresets.vue";
import CalculatorSaveEchoesPreset from "./CalculatorSaveEchoesPreset.vue";
import CalculatorEchoesPresetsGuide from "./CalculatorEchoesPresetsGuide.vue";
import CalculatorEchoRatingGuide from "./CalculatorEchoRatingGuide.vue";
import EchoRatingWeightsEditor from "./EchoRatingWeightsEditor.vue";
import CalculatorMainEchoBuff from "./CalculatorMainEchoBuff.vue";
import AppOverflowMenu from "./AppOverflowMenu.vue";
import Toast from "./Toast.vue";
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";
import { useSettingsStore } from "../stores/settings";
import { getRatingBadgeClasses } from "../composables/useEchoRating";
import { useTeamSubstatScoreRollup } from "../composables/useTeamSubstatScoreRollup";
import { randomString } from "../utils/strings.ts";

const MAX_ECHO_COST = 12;

const props = defineProps<{ character: string }>();
const emit = defineEmits<{
  "update-stats": [stats: Record<string, any>];
  "updated-main-echo": [echo: string | null];
  "updated-main-echo-rank": [rank: number | string];
  "open-echo-edit-panel": [index: number];
}>();

const characterStore = useCharacterStore() as any;
const inventoryStore = useInventoryStore() as any;
const settingsStore = useSettingsStore() as any;

const isLiveResultBarEnabled = computed(
  () => settingsStore.labs?.liveResultBar?.isEnabled ?? false,
);

const echoesImporter = ref<any>(null);
const echoesBrowser = ref<any>(null);
const echoesPresets = ref<any>(null);
const echoesSavePreset = ref<any>(null);
const echoesPresetsGuide = ref<any>(null);
const echoRatingGuide = ref<any>(null);
const echoRatingWeightsEditor = ref<any>(null);
const echoRefs = ref<Record<number, any>>({});

const setBonusOnePiece = ref<Record<string, any>>({});
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

const chosenMainEchoData = computed(() =>
  mainEcho.value ? (mainEchoesData as any)?.[mainEcho.value] ?? null : null,
);
const mainEchoBuffList = computed(() => getMainEchoBuffs(chosenMainEchoData.value));
const mainEchoBuffStats = ref<Record<string, Record<string, any>>>({});
const echoName = computed(() => (mainEcho.value ? getEchoData(mainEcho.value)?.name ?? null : null));


const totalEchoCost = computed(() => echoCosts.value.reduce((total, cost) => total + cost, 0));

const { rollup: teamSubstatScoreRollup } = useTeamSubstatScoreRollup(
  () => props.character,
);
const teamSubstatScoreRollupBadgeClass = computed(() =>
  teamSubstatScoreRollup.value
    ? getRatingBadgeClasses(teamSubstatScoreRollup.value.color)
    : null,
);
const isTotalCostOverCap = computed(() => totalEchoCost.value > MAX_ECHO_COST);
const costOverCapToastDismissed = ref(false);
const showCostOverCapToast = computed(
  () => isTotalCostOverCap.value && !costOverCapToastDismissed.value,
);

function dismissCostOverCapToast() {
  costOverCapToastDismissed.value = true;
}

watch(isTotalCostOverCap, (overCap) => {
  if (!overCap) {
    costOverCapToastDismissed.value = false;
  }
});
const echoPresetData = computed(() => inventoryStore.getEchoPresetData?.(echoPresetId.value));
const echoPresetName = computed(() => echoPresetData.value?.name ?? null);

function setEchoRef(index: number, el: any) {
  if (el) echoRefs.value[index] = el;
}
function getEchoRefSetter(index: number) {
  return (el: any) => setEchoRef(index, el);
}

function updateTotalStats() {
  const stats: Record<string, any> = {};

  Object.values(JSON.parse(JSON.stringify(echoData.value || {}))).forEach((echo: any) => {
    Object.entries(echo).forEach(([stat, value]) => {
      stats[stat] = (stats[stat] || 0) + (value as number);
    });
  });
  Object.entries(JSON.parse(JSON.stringify(setBonusOnePiece.value || {}))).forEach(([stat, value]) => {
    stats[stat] = (stats[stat] || 0) + (value as number);
  });
  Object.entries(JSON.parse(JSON.stringify(setBonusOne.value || {}))).forEach(([stat, value]) => {
    stats[stat] = (stats[stat] || 0) + (value as number);
  });
  Object.entries(JSON.parse(JSON.stringify(setBonusTwo.value || {}))).forEach(([stat, value]) => {
    if (stat === "EnableAttack") stats[stat] = value;
    else stats[stat] = (stats[stat] || 0) + (value as number);
  });

  mergeMainEchoBuffStats(mainEchoBuffStats.value, stats);

  emit("update-stats", stats);
}

function handleSetBonusOnePieceData(data: Record<string, any>) {
  setBonusOnePiece.value = JSON.parse(JSON.stringify(data));
  updateTotalStats();
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
function handleMainEchoBuffStats({
  stats,
  key,
}: {
  stats: Record<string, unknown>;
  key: string;
}) {
  mainEchoBuffStats.value[key] = stats as Record<string, any>;
  updateTotalStats();
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
  if (setOverride.value) return;
  const { setBonusOnePiece, setBonusOne, setBonusTwo } = getSetBonusEffects(echoSetsChosen.value);
  await characterStore.setCharacterData(props.character, {
    echoSetBonus: { setBonusOnePiece, setBonusOne, setBonusTwo },
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
function handleOpenRatingGuide() {
  echoRatingGuide.value?.triggerOpenModal?.();
}
function handleOpenWeightsEditor() {
  echoRatingWeightsEditor.value?.triggerOpenModal?.({
    mode: "character",
    characterId: props.character,
  });
}
function handleOpenSaveEchoPreset() {
  if (echoPresetId.value) echoesSavePreset.value?.setPresetId?.(echoPresetId.value);
  echoesSavePreset.value?.triggerOpenModal?.();
}

async function handleOnSaveEchoPreset(data: { name: string | null }) {
  const id = randomString();
  for (let i = 0; i < 5; i += 1) {
    await echoRefs.value[i]?.saveEchoItem?.();
  }
  const presetData = {
    presetId: id,
    name: data.name ?? "",
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
    mainEchoBuffStats.value = {};
    updateTotalStats();
  },
  { immediate: true },
);
watch(mainEchoRank, () => handleMainEchoRank(), { immediate: true });
watch(setOverride, (newValue) => {
  if (newValue === false) {
    updateEchoSets();
  }
});

// Calculator.vue hosts the shared echo edit panel itself now (as a sibling
// of .calculations__screens, not nested inside this tab's own scrollable
// content — see docs/adr/0014), so its "Browse" action needs a way back
// into this component's own CalculatorEchoesBrowser instance.
defineExpose({ openEchoesBrowserForIndex: handleOpenEchoesBrowser });
</script>

<style scoped>
/*
 * Two-column split for the Labs-flagged layout: the build strip keeps its
 * existing width, the new insights panel docks beside it — see
 * docs/adr/0014-echo-editor-redesign.md decision #10. This is inline
 * content within the tab (not a third overlay dock like the edit panel /
 * Full Breakdown at the Calculator.vue level), so it scrolls together with
 * .calculations__screens instead of needing its own scroll region.
 */
.echoes-layout {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.echoes-layout__strip {
  flex: 1;
  min-width: 0;
}

.echoes-layout__insights {
  flex: 0 0 320px;
  min-width: 0;
}

@media (max-width: 768px) {
  .echoes-layout {
    flex-direction: column;
  }

  .echoes-layout__insights {
    flex: none;
    width: 100%;
  }
}

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
html[data-theme-style="light"] {
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
