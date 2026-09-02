<template>
  <div class="flex flex-col gap-3">
    <div
      class="enemy__header flex flex-wrap items-center justify-between gap-4 rounded-lg bg-base-200 p-1 pl-3">
      <h3 class="text-sm font-semibold">Enemy</h3>
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="btn btn-xs"
          data-test-enemy-workspace-reset
          @click="handleReset">
          Reset all
        </button>
      </div>
    </div>

    <div class="bg-base-200 rounded-xl p-4 flex flex-col gap-3" data-test-enemy-workspace-identity>
      <div class="flex flex-wrap gap-4">
        <div class="flex gap-3 flex-1 min-w-[14rem]">
          <button
            type="button"
            class="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-base-300 border border-base-300"
            data-test-enemy-workspace-portrait
            @click="openEnemyBrowser">
            <img
              :src="portraitUrl"
              :alt="selectedEnemyEntry?.name ?? 'No enemy selected'"
              class="w-full h-full object-cover" />
          </button>
          <div class="min-w-0 flex flex-col justify-center gap-1.5">
            <div class="flex items-center gap-2 flex-wrap">
              <h4
                class="font-bold text-lg leading-tight truncate"
                data-test-enemy-workspace-name>
                {{ selectedEnemyEntry?.name ?? "No enemy selected" }}
              </h4>
              <span class="badge badge-sm" :class="enemyTypeBadgeClass" data-test-enemy-workspace-type-badge>
                {{ enemyType }}
              </span>
            </div>
            <div class="flex gap-2 flex-wrap">
              <button
                type="button"
                class="btn btn-xs"
                data-test-enemy-workspace-browse-open
                @click="openEnemyBrowser">
                Browse enemies
              </button>
              <button
                v-if="enemyBrowserKey"
                type="button"
                class="btn btn-xs btn-ghost"
                data-test-enemy-workspace-clear
                @click="clearEnemyPreset">
                Clear preset
              </button>
            </div>
          </div>
        </div>

        <div v-if="recentEnemyKeys.length" class="flex flex-col gap-1.5" data-test-enemy-workspace-recents>
          <div class="text-[.65rem] font-bold uppercase tracking-wider opacity-50">Recently used</div>
          <div class="flex gap-1.5">
            <button
              v-for="key in recentEnemyKeys"
              :key="key"
              type="button"
              class="w-9 h-9 rounded-lg overflow-hidden border-2 shrink-0"
              :class="key === enemyBrowserKey ? 'border-primary' : 'border-transparent'"
              :title="enemiesCatalog[key]?.name"
              :data-test-enemy-workspace-recent="key"
              @click="selectEnemyByKey(key)">
              <img
                :src="enemiesCatalog[key]?.imageUrl"
                :alt="enemiesCatalog[key]?.name"
                class="w-full h-full object-cover" />
            </button>
          </div>
        </div>
      </div>

      <CalculatorEnemyBrowser
        ref="enemyBrowserRef"
        :character-element="props.characterElement"
        @enemy-browser:chosen-enemy="onEnemyChosenFromBrowser" />

      <div v-if="selectedEnemyEntry" class="border-t border-base-300 pt-3" data-test-enemy-workspace-resist>
        <div class="text-[.65rem] font-bold uppercase tracking-wider opacity-50 mb-2">
          Resistances
        </div>
        <div class="flex flex-wrap gap-1.5">
          <div
            v-for="el in RESIST_ELEMENTS"
            :key="el"
            class="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs"
            :class="el === props.characterElement
              ? 'bg-primary/10 border border-primary'
              : 'bg-base-300 opacity-70 border border-transparent'"
            :data-test-enemy-workspace-resist-chip="el">
            <img v-if="elementIcon(el)" :src="elementIcon(el)!" class="size-3.5" :alt="el" />
            <span v-else class="size-3.5 inline-flex items-center justify-center text-[.6rem] opacity-70">◆</span>
            {{ el }}
            <template v-if="el === props.characterElement">
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                class="input input-xs w-12 text-right font-mono"
                v-model.number="enemyResistPercent"
                :data-test-enemy-workspace-resist-active-input="el" />%
            </template>
            <span v-else class="font-mono" :data-test-enemy-workspace-resist-value="el">
              {{ selectedEnemyEntry.resist[el] ?? 0 }}%
            </span>
          </div>
        </div>
        <p v-if="!props.characterElement" class="text-xs opacity-60 mt-2" data-test-enemy-workspace-no-element>
          No character element set yet — Enemy Resistance defaults to 10% until one is known.
          <span class="inline-flex items-center gap-1">
            <span class="text-[.65rem] uppercase tracking-wide font-bold">Enemy Resistance</span>
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              class="input input-xs w-14 text-right font-mono"
              v-model.number="enemyResistPercent"
              data-test-enemy-workspace-resist-fallback-input />%
          </span>
        </p>
      </div>

      <div v-else class="border-t border-base-300 pt-3 flex items-center gap-2" data-test-enemy-workspace-resist-manual>
        <span class="text-[.65rem] font-bold uppercase tracking-wider opacity-50">Enemy Resistance</span>
        <input
          type="number"
          min="0"
          max="100"
          step="1"
          class="input input-xs w-14 text-right font-mono"
          v-model.number="enemyResistPercent"
          data-test-enemy-workspace-resist-fallback-input />%
      </div>
    </div>

    <div class="grid gap-3 sm:grid-cols-2">
      <div class="bg-base-200 rounded-xl p-3">
        <div class="flex items-baseline justify-between mb-1">
          <span class="text-[.65rem] font-bold uppercase tracking-wider opacity-50">Enemy Level</span>
          <span class="font-mono text-sm font-bold" data-test-enemy-workspace-level-value>{{ enemyLevel }}</span>
        </div>
        <input
          v-model.number="enemyLevel"
          type="range"
          min="1"
          max="120"
          step="1"
          class="range range-xs"
          :class="rangeClasses"
          data-test-enemy-workspace-level-input />
        <div class="range-ticks" aria-hidden="true">
          <div
            v-for="t in LEVEL_TICKS"
            :key="t"
            class="range-tick"
            :style="tickStyle(t, 1, 120)">
            <span class="range-tick__mark"></span>
            <span class="range-tick__label">{{ t }}</span>
          </div>
        </div>
        <div class="flex gap-1.5 mt-2">
          <button
            v-for="lvl in LEVEL_QUICK_SETS"
            :key="lvl"
            type="button"
            class="btn btn-xs"
            :class="enemyLevel === lvl ? 'btn-primary' : 'btn-ghost'"
            :data-test-enemy-workspace-level-quickset="lvl"
            @click="enemyLevel = lvl">
            {{ lvl === 120 ? "120 max" : lvl }}
          </button>
        </div>
      </div>

      <div class="bg-base-200 rounded-xl p-3">
        <div class="text-[.65rem] font-bold uppercase tracking-wider opacity-50 mb-2">Enemy Type</div>
        <div class="join w-full" data-test-enemy-workspace-type>
          <button
            v-for="t in ENEMY_TYPE_OPTIONS"
            :key="t"
            type="button"
            class="join-item btn btn-xs flex-1"
            :class="enemyType === t ? 'btn-active' : ''"
            :data-test-enemy-workspace-type-option="t"
            @click="enemyType = t">
            {{ t }}
          </button>
        </div>
      </div>
    </div>

    <div class="bg-base-200 rounded-xl p-4" data-test-enemy-workspace-status>
      <div class="flex items-center gap-2 mb-1">
        <span class="text-sm font-semibold">Status Effects</span>
        <span class="badge badge-sm badge-primary font-mono" data-test-enemy-workspace-status-count>
          {{ activeStatusCount }} active
        </span>
      </div>
      <p class="text-xs opacity-50 mb-3">
        Effects relevant to this character's kit show by default.
      </p>

      <div class="grid gap-1.5 sm:grid-cols-2">
        <div
          v-for="def in visibleStatusDefs"
          :key="def.key"
          class="rounded-lg px-2.5 py-2"
          :class="[
            def.relevant && statusFields[def.key].value > 0 ? 'bg-primary/10' : 'bg-base-100',
            def.relevant ? '' : 'opacity-50',
          ]"
          :data-test-enemy-workspace-status-row="def.key">
          <div class="flex items-start justify-between gap-2 mb-1">
            <span class="text-xs leading-tight">
              {{ def.label }}
              <small class="block opacity-50 text-[.65rem]">{{ def.small }}</small>
            </span>
            <span class="font-mono text-xs font-bold shrink-0 pt-0.5" :data-test-enemy-workspace-status-value="def.key">
              {{ statusFields[def.key].value }}
            </span>
          </div>
          <input
            v-model.number="statusFields[def.key].value"
            type="range"
            min="0"
            :max="def.max"
            step="1"
            class="range range-xs"
            :class="rangeClasses"
            :data-test-enemy-workspace-status-input="def.key" />
          <div class="range-ticks" aria-hidden="true">
            <span
              v-for="t in tickRange(def.max)"
              :key="t"
              class="range-tick"
              :class="{ 'range-tick--minor': !isMajorTick(t, def.max) }"
              :style="tickStyle(t, 0, def.max)">
              <span class="range-tick__mark"></span>
              <span v-if="isMajorTick(t, def.max)" class="range-tick__label">{{ t }}</span>
            </span>
          </div>
        </div>
      </div>

      <button
        v-if="hiddenStatusDefs.length"
        type="button"
        class="btn btn-ghost btn-xs w-full mt-2"
        data-test-enemy-workspace-status-showmore
        @click="showMoreStatus = !showMoreStatus">
        {{
          showMoreStatus
            ? "Hide effects outside this character's kit"
            : `Show ${hiddenStatusDefs.length} more effect${hiddenStatusDefs.length === 1 ? "" : "s"}`
        }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, watchEffect } from "vue";
import { useCharacterStore } from "../stores/character";
import { useSettingsStore } from "../stores/settings";
import { characterElementsSetImageMap } from "../characters/characters";
import enemiesCatalog, {
  getEnemyResistFractionForElement,
  mapEnemyTypeToBrowserCategory,
  type Enemy,
  type ResistStats,
} from "../enemies/index";
import CalculatorEnemyBrowser from "./CalculatorEnemyBrowser.vue";

const props = withDefaults(
  defineProps<{
    character: string;
    characterElement?: string;
    isSpectroFrazzleEnabled?: boolean;
    isAeroErosionEnabled?: boolean;
    isFusionBurstEnabled?: boolean;
    isElectroFlareEnabled?: boolean;
    isGlacioChafeEnabled?: boolean;
  }>(),
  {
    characterElement: "",
    isSpectroFrazzleEnabled: false,
    isAeroErosionEnabled: false,
    isFusionBurstEnabled: false,
    isElectroFlareEnabled: false,
    isGlacioChafeEnabled: false,
  },
);

const emit = defineEmits<{
  "updated-enemy-data": [payload: Record<string, unknown>];
}>();

const characterStore = useCharacterStore();
const settingsStore = useSettingsStore();

const currentCharacter = computed(
  () => characterStore.characters?.[props.character] ?? {},
);

const settingsTheme = computed(() => settingsStore.config?.theme ?? null);
const rangeClasses = computed(() =>
  settingsTheme.value === "black" ? ["[--range-shdw:gray]"] : [],
);

const enemyBrowserRef = ref<{
  triggerOpenModal: () => void;
  triggerCloseModal: () => void;
} | null>(null);

const enemyBrowserKey = computed({
  get() {
    const raw = (currentCharacter.value as { enemyBrowserKey?: string | null }).enemyBrowserKey;
    return raw && typeof raw === "string" ? raw : "";
  },
  set(value: string) {
    void characterStore.setCharacterData(props.character, {
      enemyBrowserKey: value === "" ? null : value,
    });
  },
});

const selectedEnemyEntry = computed((): Enemy | null => {
  const key = enemyBrowserKey.value;
  return key ? (enemiesCatalog[key] ?? null) : null;
});

const portraitUrl = computed(
  () =>
    selectedEnemyEntry.value?.imageUrl ??
    "https://ryanbenson.github.io/wuthering-waves-assets/images/enemy.png",
);

const enemyLevel = computed({
  get: () => (currentCharacter.value as { enemyLevel?: number }).enemyLevel ?? 90,
  set: (value: number) =>
    void characterStore.setCharacterData(props.character, { enemyLevel: value }),
});

const enemyResist = computed({
  get: () => (currentCharacter.value as { enemyResist?: number }).enemyResist ?? 0.1,
  set: (value: number) =>
    void characterStore.setCharacterData(props.character, { enemyResist: value }),
});

const enemyResistPercent = computed({
  get: () => Math.round(enemyResist.value * 100),
  set: (value: number) => {
    const clamped = Math.min(100, Math.max(0, Math.round(Number(value) || 0)));
    enemyResist.value = clamped / 100;
  },
});

const enemyType = computed({
  get: () => (currentCharacter.value as { enemyType?: string }).enemyType ?? "Calamity",
  set: (value: string) =>
    void characterStore.setCharacterData(props.character, { enemyType: value }),
});

const ENEMY_TYPE_OPTIONS = ["Common", "Elite", "Overlord", "Calamity"] as const;
const LEVEL_QUICK_SETS = [80, 90, 100, 120] as const;
const LEVEL_TICKS = [1, 30, 60, 90, 120] as const;

// Matches DaisyUI's `range-xs` thumb width/height so ticks line up with the
// thumb's actual stop positions, which are inset by half the thumb's own
// width from each end of the track (same math as src/components/input/Range.vue).
const RANGE_XS_THUMB_REM = 1;

function tickStyle(value: number, min: number, max: number) {
  const fraction = max > min ? (value - min) / (max - min) : 0;
  return {
    left: `calc(${RANGE_XS_THUMB_REM / 2}rem + (100% - ${RANGE_XS_THUMB_REM}rem) * ${fraction})`,
  };
}

function tickRange(max: number): number[] {
  return Array.from({ length: max + 1 }, (_, i) => i);
}

// A dash renders at every stack count, but only every-other value (plus the
// two endpoints) gets a number — labeling all 13 values on a max-13 slider
// crowds a card half this width, so only "major" ticks are labeled.
function isMajorTick(value: number, max: number): boolean {
  const step = max > 9 ? 2 : 1;
  return value === 0 || value === max || value % step === 0;
}

const RESIST_ELEMENTS: (keyof ResistStats)[] = [
  "Aero",
  "Electro",
  "Fusion",
  "Glacio",
  "Havoc",
  "Physical",
  "Spectro",
];

function elementIcon(element: string): string | null {
  return characterElementsSetImageMap[element] ?? null;
}

const enemyTypeBadgeClass = computed(() => {
  switch (enemyType.value) {
    case "Elite":
      return "badge-info badge-outline";
    case "Overlord":
      return "badge-warning badge-outline";
    case "Calamity":
      return "badge-error badge-outline";
    default:
      return "badge-ghost";
  }
});

function openEnemyBrowser() {
  enemyBrowserRef.value?.triggerOpenModal();
}

function clearEnemyPreset() {
  enemyBrowserKey.value = "";
}

function applyEnemyEntry(key: string) {
  const entry = enemiesCatalog[key];
  if (!entry) return;
  enemyBrowserKey.value = key;
  enemyType.value = mapEnemyTypeToBrowserCategory(entry.type);
  enemyResist.value = props.characterElement
    ? getEnemyResistFractionForElement(entry.resist, props.characterElement)
    : 0.1;
  settingsStore.addRecentEnemyKey(key);
}

function onEnemyChosenFromBrowser(key: string) {
  applyEnemyEntry(key);
}

function selectEnemyByKey(key: string) {
  applyEnemyEntry(key);
}

watch(
  () => props.characterElement,
  (element) => {
    const key = enemyBrowserKey.value;
    if (!key || !element) return;
    const entry = enemiesCatalog[key];
    if (!entry) return;
    enemyResist.value = getEnemyResistFractionForElement(entry.resist, element);
  },
);

const recentEnemyKeys = computed(() => {
  const keys: unknown = settingsStore.config?.recentEnemyKeys;
  return Array.isArray(keys) ? keys.filter((key): key is string => !!enemiesCatalog[key]) : [];
});

function characterField(key: string) {
  return computed<number>({
    get: () => ((currentCharacter.value as Record<string, unknown>)[key] as number) ?? 0,
    set: (value: number) =>
      void characterStore.setCharacterData(props.character, { [key]: value }),
  });
}

const STATUS_FIELD_KEYS = [
  "strainStacks",
  "havocBaneStacks",
  "spectroFrazzleStacks",
  "aeroErosionStacks",
  "fusionBurstStacks",
  "electroFlareStacks",
  "electroRageStacks",
  "glacioChafeStacks",
] as const;

const statusFields = Object.fromEntries(
  STATUS_FIELD_KEYS.map((key) => [key, characterField(key)]),
) as Record<(typeof STATUS_FIELD_KEYS)[number], ReturnType<typeof characterField>>;

// Havoc Bane and Tune Strain apply regardless of the selected character (no
// kit flag gates them). Electro Rage always accompanies Electro Flare rather
// than getting its own flag — both are a deliberate pairing, not a gap.
const STATUS_DEFS = computed(() => [
  { key: "strainStacks" as const, label: "Tune Strain", small: "Interfered Stacks", max: 9, relevant: true },
  { key: "havocBaneStacks" as const, label: "Havoc Bane", small: "Stacks", max: 9, relevant: true },
  { key: "spectroFrazzleStacks" as const, label: "Spectro Frazzle", small: "Stacks", max: 13, relevant: props.isSpectroFrazzleEnabled },
  { key: "aeroErosionStacks" as const, label: "Aero Erosion", small: "Stacks", max: 12, relevant: props.isAeroErosionEnabled },
  { key: "fusionBurstStacks" as const, label: "Fusion Burst", small: "Stacks", max: 13, relevant: props.isFusionBurstEnabled },
  { key: "electroFlareStacks" as const, label: "Electro Flare", small: "Stacks", max: 13, relevant: props.isElectroFlareEnabled },
  { key: "electroRageStacks" as const, label: "Electro Rage", small: "Stacks", max: 13, relevant: props.isElectroFlareEnabled },
  { key: "glacioChafeStacks" as const, label: "Glacio Chafe", small: "Stacks", max: 13, relevant: props.isGlacioChafeEnabled },
]);

const showMoreStatus = ref(false);
const visibleStatusDefs = computed(() =>
  STATUS_DEFS.value.filter((def) => def.relevant || showMoreStatus.value),
);
const hiddenStatusDefs = computed(() => STATUS_DEFS.value.filter((def) => !def.relevant));
const activeStatusCount = computed(
  () => STATUS_DEFS.value.filter((def) => def.relevant && statusFields[def.key].value > 0).length,
);

function handleReset() {
  enemyBrowserKey.value = "";
  enemyLevel.value = 90;
  enemyResist.value = 0.1;
  enemyType.value = "Calamity";
  showMoreStatus.value = false;
  STATUS_FIELD_KEYS.forEach((key) => {
    statusFields[key].value = 0;
  });
}

watchEffect(() => {
  emit("updated-enemy-data", {
    enemyLevel: enemyLevel.value,
    enemyResist: enemyResist.value,
    enemyType: enemyType.value,
    spectroFrazzleStacks: statusFields.spectroFrazzleStacks.value,
    aeroErosionStacks: statusFields.aeroErosionStacks.value,
    havocBaneStacks: statusFields.havocBaneStacks.value,
    strainStacks: statusFields.strainStacks.value,
    fusionBurstStacks: statusFields.fusionBurstStacks.value,
    electroFlareStacks: statusFields.electroFlareStacks.value,
    electroRageStacks: statusFields.electroRageStacks.value,
    glacioChafeStacks: statusFields.glacioChafeStacks.value,
  });
});
</script>

<style lang="scss" scoped>
.range-ticks {
  position: relative;
  width: 100%;
  height: 1.35rem;
  margin-top: 0.25rem;
}

.range-tick {
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translateX(-50%);
}

.range-tick__mark {
  display: block;
  width: 1px;
  height: 0.35rem;
  background-color: currentColor;
  opacity: 0.35;
}

.range-tick--minor .range-tick__mark {
  height: 0.2rem;
  opacity: 0.22;
}

.range-tick__label {
  margin-top: 0.15rem;
  font-size: 0.625rem;
  line-height: 1;
  opacity: 0.6;
  white-space: nowrap;
}
</style>
