<template>
  <div class="optimizer__header flex flex-wrap items-center justify-between gap-4 mb-4 rounded-lg bg-base-200 p-1 pl-3">
    <h3 class="text-sm font-semibold">Rotations</h3>
    <div class="flex flex-wrap items-center gap-2">
      <button
        class="btn btn-sm"
        @click="handleCreateRotation"
        data-test-rotations-action="create">
        Create
      </button>
      <AppOverflowMenu
        aria-label="More rotation actions"
        data-test="rotations-overflow-menu">
        <li>
          <button
            type="button"
            @click="isImportOpen = true"
            data-test-rotations-action="import">
            Import
          </button>
        </li>
        <li>
          <button
            type="button"
            @click="isPresetRotationsOpen = true"
            data-test-rotations-action="presets">
            List Presets
          </button>
        </li>
      </AppOverflowMenu>
    </div>
  </div>
  <CalculatorRotationsImportModal v-model:open="isImportOpen" @import="handleImportedRotation" />
  <CalculatorRotationsPresetsModal
    v-model:open="isPresetRotationsOpen"
    :presets="presets"
    :character-name="character"
    @import="handleImportPreset" />
  <div
    v-if="isLiveResultBarEnabled && rotations.length > 0"
    class="rotations__summary mb-4 rounded-lg bg-base-200 p-4"
    data-test-rotations-summary>
    <div class="flex items-center justify-between gap-2 flex-wrap mb-3">
      <h3 class="text-sm font-semibold">All Rotations Summary</h3>
      <div class="flex items-center gap-2">
        <span class="text-xs opacity-70">Sort by:</span>
        <div class="join" data-test-rotations-sort-metric>
          <input
            v-model="sortMetric"
            value="normal"
            class="join-item btn btn-xs"
            type="radio"
            name="rotation-sort-metric"
            aria-label="Normal" />
          <input
            v-model="sortMetric"
            value="avg"
            class="join-item btn btn-xs"
            type="radio"
            name="rotation-sort-metric"
            aria-label="Average" />
          <input
            v-model="sortMetric"
            value="crit"
            class="join-item btn btn-xs"
            type="radio"
            name="rotation-sort-metric"
            aria-label="Crit" />
          <input
            v-model="sortMetric"
            value="name"
            class="join-item btn btn-xs"
            type="radio"
            name="rotation-sort-metric"
            aria-label="Name (A-Z)" />
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
      <button
        v-if="strongestRotationByDamage"
        type="button"
        class="card bg-base-100 p-3 text-left hover:bg-base-300 transition-colors"
        data-test-rotations-summary-strongest
        @click="goToRotation(strongestRotationByDamage!.rotation.id)">
        <div class="text-xs opacity-70 mb-1">Strongest Rotation (Dmg)</div>
        <div class="font-semibold truncate">{{ strongestRotationByDamage.rotation.name }}</div>
        <div>{{ displayDamage(strongestRotationByDamage.value) }}</div>
      </button>
      <button
        v-if="strongestRotationByDps"
        type="button"
        class="card bg-base-100 p-3 text-left hover:bg-base-300 transition-colors"
        data-test-rotations-summary-dps
        @click="goToRotation(strongestRotationByDps!.rotation.id)">
        <div class="text-xs opacity-70 mb-1">Best DPS</div>
        <div class="font-semibold truncate">{{ strongestRotationByDps.rotation.name }}</div>
        <div>{{ displayDamage(strongestRotationByDps.value) }}</div>
      </button>
      <button
        v-if="strongestRotationByHit"
        type="button"
        class="card bg-base-100 p-3 text-left hover:bg-base-300 transition-colors"
        data-test-rotations-summary-hit
        @click="goToRotation(strongestRotationByHit!.rotation.id)">
        <div class="text-xs opacity-70 mb-1">Strongest Hit</div>
        <div class="font-semibold truncate">{{ strongestRotationByHit.rotation.name }}</div>
        <div>{{ displayDamage(strongestRotationByHit.value) }}</div>
      </button>
    </div>
  </div>
  <div class="flex flex-col gap-4">
    <div
      v-for="(rotation, index) in sortedRotations"
      :key="rotation.id"
      class="rotation-dnd-item rounded-lg"
      :class="{
        'ring-2 ring-primary ring-offset-1 ring-offset-base-100':
          dropIndex === index && dragIndex !== null && dragIndex !== index,
      }"
      @dragover.prevent="onDragOver(index, $event)"
      @dragenter.prevent="onDragEnter(index)"
      @drop.prevent="onDrop(index)">
      <CalculatorRotation
        :ref="(el) => setRotationRef(rotation.id, el)"
        :character="character"
        :character-data="characterData"
        :character-build-data="currentCharacter"
        :definitions="characterContext?.definitions ?? null"
        :id="rotation.id"
        :name="rotation.name"
        :description="rotation.description"
        :duration="rotation.duration"
        :echo="rotation.echo"
        :echo-rank="rotation.echoRank"
        :order="rotation.order"
        :actions="rotation.actions"
        :can-reorder="canReorder"
        :all-damages="allDamages"
        :favorite="rotation.favorite ?? false"
        :rank="isLiveResultBarEnabled ? index + 1 : null"
        :stat-value="isLiveResultBarEnabled ? (rotationStatsById[rotation.id]?.[leaderboardMetric] ?? 0) : null"
        :stat-label="leaderboardMetric === 'normal' ? 'Normal' : leaderboardMetric === 'crit' ? 'Crit' : 'Avg'"
        @drag-reorder-start="onDragStart(index)"
        @drag-reorder-end="onDragEnd"
        @updated-rotation="handleUpdatedRotation"
        @rotation-delete="handleDeleteRotation"
        @toggle-favorite="toggleFavoriteRotation(rotation.id)"></CalculatorRotation>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";
import { getCharByName } from "../characters/characters.ts";
import { randomString } from "../utils/strings.ts";
import CalculatorRotation from "./CalculatorRotation.vue";
import CalculatorRotationsImportModal from "./CalculatorRotationsImportModal.vue";
import CalculatorRotationsPresetsModal from "./CalculatorRotationsPresetsModal.vue";
import AppOverflowMenu from "./AppOverflowMenu.vue";
import { useToast } from "../composables/useToast";
import { useDragReorder } from "../composables/useDragReorder";
import { useSettingsStore } from "../stores/settings";
import {
  buildCharacterCalculationContext,
  type CharacterCalculationContext,
  type TeamEnemyConfig,
} from "../calculator/buildCharacterContext";
import type { RotationExportData, CharacterRotationPreset } from "../characters/rotationExportImport";
import { trackEvent } from "../utils/analytics";

const { showToast } = useToast();

type RotationAction = Record<string, unknown> & {
  id: string;
  buffs?: Array<Record<string, unknown> & { id: string }>;
};

type RotationRow = {
  id: string;
  name: string;
  description: string;
  duration: string | number | null;
  echo: string | null;
  echoRank: string | number | null;
  order: number;
  actions: RotationAction[];
  /** Rotation Flow (Labs) — a plain field on the rotation itself (unlike
   * Team Rotations' separate favoriteTeamIds array) since a single
   * character's rotations don't need cross-entity favorite lookups. */
  favorite?: boolean;
};

type RotationDamageAttack = {
  id: string;
  damage?: {
    totalDamage?: number;
    avgDamage?: number;
    critDamage?: number;
    healAmount?: number;
    shieldAmount?: number;
  };
};

type RotationStats = {
  normal: number;
  avg: number;
  crit: number;
  healing: number;
  shield: number;
  hitNormal: number;
  hitAvg: number;
  hitCrit: number;
  dpsNormal: number;
  dpsAvg: number;
  dpsCrit: number;
};

type SortMetric = "normal" | "avg" | "crit" | "name";

const props = defineProps<{
  character: string;
  /** Rotation Flow (Labs) — Calculator.vue's already-computed allDamages,
   * threaded through so CalculatorRotation can show real per-action damage
   * (allDamages.rotations[i].attacks[j], matched by rotation/action id).
   * Optional and read-only here — this component owns no damage math. */
  allDamages?: Record<string, unknown> | null;
}>();

const emit = defineEmits<{
  "updated-rotations": [payload: RotationRow[]];
}>();

const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);
const { setCharacterData, setCharacterRotations } = characterStore;
const inventoryStore = useInventoryStore();
const { echoes: inventoryEchoes } = storeToRefs(inventoryStore);

const isImportOpen = ref(false);
const isPresetRotationsOpen = ref(false);
const rotations = ref<RotationRow[]>([]);
const characterData = ref<Record<string, unknown>>({});
const presets = ref<CharacterRotationPreset[]>([]);

const rotationRefs = new Map<string, { toggleOpen: () => void }>();

function setRotationRef(id: string, el: unknown) {
  if (
    el &&
    typeof el === "object" &&
    "toggleOpen" in el &&
    typeof (el as { toggleOpen: unknown }).toggleOpen === "function"
  ) {
    rotationRefs.set(id, el as { toggleOpen: () => void });
  } else {
    rotationRefs.delete(id);
  }
}

const currentCharacter = computed(
  () => characters.value[props.character] ?? ({} as Record<string, unknown>),
);

// Enemy config only affects computed damage numbers, not the buff/passive
// definition catalogs the advanced buff editor needs — a placeholder is
// fine here since this context is only ever read for `.definitions`, never
// for its numeric stats/damage output (real rotation damage is computed
// separately, in Calculator.vue, against the real enemy config).
const PLACEHOLDER_ENEMY_CONFIG: TeamEnemyConfig = { enemyLevel: 1, enemyResist: 0, enemyType: "" };
const characterContext = ref<CharacterCalculationContext | null>(null);

async function recomputeCharacterContext() {
  if (!props.character) {
    characterContext.value = null;
    return;
  }
  characterContext.value = await buildCharacterCalculationContext(
    props.character,
    characters.value,
    PLACEHOLDER_ENEMY_CONFIG,
    inventoryEchoes.value,
  );
}

watch(currentCharacter, () => void recomputeCharacterContext(), { deep: true });

const settingsStore = useSettingsStore();
const isLiveResultBarEnabled = computed(
  () => settingsStore.labs?.liveResultBar?.isEnabled ?? false,
);

// Rotation Flow (Labs) list/summary — sort-driven ranking replaces manual
// drag order, matching TeamRotations.vue's list; drag-reorder is legacy-only.
const canReorder = computed(() => rotations.value.length > 1 && !isLiveResultBarEnabled.value);

const sortMetric = ref<SortMetric>("avg");
// Sorting by "name" still needs a numeric leaderboard metric to rank the
// "strongest rotation" stat cards by — falls back to average, same as
// TeamRotations.vue's leaderboardMetric.
const leaderboardMetric = computed<"normal" | "avg" | "crit">(() =>
  sortMetric.value === "name" ? "avg" : sortMetric.value,
);

// Reads Calculator.vue's already-computed allDamages (same prop the
// damage-by-action strip uses) — no new damage calculation here, just
// summing/maxing what's already been computed per rotation.
const rotationStatsById = computed<Record<string, RotationStats>>(() => {
  const map: Record<string, RotationStats> = {};
  const rotationsDamage =
    ((props.allDamages as { rotations?: Array<{ id: string; damageAggregation?: Record<string, number>; attacks?: RotationDamageAttack[] }> } | null)
      ?.rotations) ?? [];
  for (const entry of rotationsDamage) {
    const agg = entry.damageAggregation ?? {};
    let hitNormal = 0;
    let hitAvg = 0;
    let hitCrit = 0;
    for (const attack of entry.attacks ?? []) {
      hitNormal = Math.max(hitNormal, attack.damage?.totalDamage ?? 0);
      hitAvg = Math.max(hitAvg, attack.damage?.avgDamage ?? 0);
      hitCrit = Math.max(hitCrit, attack.damage?.critDamage ?? 0);
    }
    const rotation = rotations.value.find((r) => r.id === entry.id);
    const duration = rotation && Number(rotation.duration) > 0 ? Number(rotation.duration) : 0;
    const normal = agg.normalDamage ?? 0;
    const avg = agg.avgDamage ?? 0;
    const crit = agg.critDamage ?? 0;
    map[entry.id] = {
      normal,
      avg,
      crit,
      healing: agg.healing ?? 0,
      shield: agg.shield ?? 0,
      hitNormal,
      hitAvg,
      hitCrit,
      dpsNormal: duration ? normal / duration : 0,
      dpsAvg: duration ? avg / duration : 0,
      dpsCrit: duration ? crit / duration : 0,
    };
  }
  return map;
});

const emptyStats: RotationStats = {
  normal: 0,
  avg: 0,
  crit: 0,
  healing: 0,
  shield: 0,
  hitNormal: 0,
  hitAvg: 0,
  hitCrit: 0,
  dpsNormal: 0,
  dpsAvg: 0,
  dpsCrit: 0,
};

const sortedRotations = computed(() => {
  if (!isLiveResultBarEnabled.value) return rotations.value;
  const list = [...rotations.value];
  if (sortMetric.value === "name") {
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }
  const metric = sortMetric.value;
  return list.sort(
    (a, b) => (rotationStatsById.value[b.id]?.[metric] ?? 0) - (rotationStatsById.value[a.id]?.[metric] ?? 0),
  );
});

function findStrongestBy(getValue: (stats: RotationStats) => number): { rotation: RotationRow; value: number } | null {
  let best: { rotation: RotationRow; value: number } | null = null;
  for (const rotation of rotations.value) {
    const value = getValue(rotationStatsById.value[rotation.id] ?? emptyStats);
    if (value > 0 && (!best || value > best.value)) {
      best = { rotation, value };
    }
  }
  return best;
}

const DAMAGE_KEY: Record<"normal" | "avg" | "crit", keyof RotationStats> = {
  normal: "normal",
  avg: "avg",
  crit: "crit",
};
const DPS_KEY: Record<"normal" | "avg" | "crit", keyof RotationStats> = {
  normal: "dpsNormal",
  avg: "dpsAvg",
  crit: "dpsCrit",
};
const HIT_KEY: Record<"normal" | "avg" | "crit", keyof RotationStats> = {
  normal: "hitNormal",
  avg: "hitAvg",
  crit: "hitCrit",
};

const strongestRotationByDamage = computed(() => findStrongestBy((s) => s[DAMAGE_KEY[leaderboardMetric.value]]));
const strongestRotationByDps = computed(() => findStrongestBy((s) => s[DPS_KEY[leaderboardMetric.value]]));
const strongestRotationByHit = computed(() => findStrongestBy((s) => s[HIT_KEY[leaderboardMetric.value]]));

function displayDamage(value: number): string {
  return Math.round(value).toLocaleString();
}

function goToRotation(id: string) {
  rotationRefs.get(id)?.toggleOpen();
}

async function toggleFavoriteRotation(id: string) {
  const next = rotations.value.map((rotation) =>
    rotation.id === id ? { ...rotation, favorite: !rotation.favorite } : rotation,
  );
  await persistRotations(next);
}

function rotationOrderValue(value: unknown, fallback: number): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return fallback;
}

function normalizeRotationOrders(
  list: RotationRow[],
): { rotations: RotationRow[]; didBackfill: boolean } {
  let didBackfill = false;
  const withOrder = list.map((rotation, index) => {
    const existing = rotationOrderValue(rotation.order, Number.NaN);
    if (!Number.isFinite(existing)) {
      didBackfill = true;
      return { ...rotation, order: index };
    }
    return { ...rotation, order: existing };
  });

  withOrder.sort((a, b) => a.order - b.order);

  const renumbered = withOrder.map((rotation, index) => {
    if (rotation.order !== index) {
      didBackfill = true;
    }
    return { ...rotation, order: index };
  });

  return { rotations: renumbered, didBackfill };
}

/** Trust current array order and stamp order 0..n-1 (used after drag/create/delete). */
function renumberByArrayOrder(list: RotationRow[]): RotationRow[] {
  return list.map((rotation, index) => ({ ...rotation, order: index }));
}

async function persistRotations(next: RotationRow[]) {
  const normalized = renumberByArrayOrder(next);
  rotations.value = normalized;
  const payload = JSON.parse(JSON.stringify(normalized));
  // Ensure character entry exists — setCharacterRotations is a no-op otherwise
  if (!characters.value[props.character]) {
    await setCharacterData(props.character, {});
  }
  await setCharacterRotations(props.character, payload);
  emit("updated-rotations", payload);
}

function addIdsToImportedRotation(rotationData: RotationRow): RotationRow {
  const rotation = JSON.parse(JSON.stringify(rotationData)) as RotationRow;
  rotation.id = randomString();
  rotation.actions.forEach((action) => {
    action.id = randomString();
    if (action?.buffs) {
      action.buffs.forEach((buff) => {
        buff.id = randomString();
      });
    }
  });
  return rotation;
}

async function handleCreateRotation() {
  const id = randomString();
  const newRotationData: RotationRow = {
    id,
    name: "Untitled Rotation",
    description: "",
    duration: null,
    echo: null,
    echoRank: null,
    order: rotations.value.length,
    actions: [],
  };
  const next = [...rotations.value, newRotationData];
  await persistRotations(next);
  await nextTick();
  rotationRefs.get(id)?.toggleOpen();
}

async function importRotationFromData(rotationData: RotationRow) {
  const processedImportedRotation = addIdsToImportedRotation(rotationData);
  processedImportedRotation.order = rotations.value.length;
  const next = [...rotations.value, processedImportedRotation];
  isImportOpen.value = false;
  isPresetRotationsOpen.value = false;
  await persistRotations(next);
  showToast(`"${processedImportedRotation.name}" has been imported.`, "success");
  trackEvent("rotation-imported");
}

async function handleImportedRotation(data: RotationExportData) {
  await importRotationFromData({ id: "", order: 0, ...data } as RotationRow);
}

async function handleImportPreset(preset: CharacterRotationPreset) {
  try {
    const rotationData = JSON.parse(JSON.stringify(preset.data)) as RotationRow;
    await importRotationFromData(rotationData);
  } catch {
    showToast("Rotation data is not valid", "error");
  }
}

async function handleUpdatedRotation(rotationData: Record<string, unknown>) {
  const next = JSON.parse(JSON.stringify(rotations.value)) as RotationRow[];
  const rid = rotationData.id as string;
  const foundIndex = next.findIndex((rotation) => rotation.id === rid);
  if (foundIndex === -1) {
    return;
  }
  const existingOrder = next[foundIndex].order;
  // Merge rather than replace: CalculatorRotation.vue's own emitRotation()
  // payload has no idea about list-level fields it doesn't own (e.g.
  // `favorite`) — a wholesale replace would silently wipe those out on
  // every unrelated edit (name change, duration tweak, etc).
  next[foundIndex] = {
    ...next[foundIndex],
    ...(rotationData as RotationRow),
    order: rotationOrderValue(rotationData.order, existingOrder),
  };
  await persistRotations(next);
}

async function handleDeleteRotation(rotationId: string) {
  const next = rotations.value.filter((rotation) => rotation.id !== rotationId);
  await persistRotations(next);
}

const { dragIndex, dropIndex, onDragStart, onDragEnter, onDragOver, onDrop, onDragEnd } =
  useDragReorder((from, to) => {
    const next = [...rotations.value];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    void persistRotations(next);
  });

onMounted(async () => {
  const loaded =
    ((currentCharacter.value as { rotations?: RotationRow[] }).rotations ??
      []) as RotationRow[];
  const { rotations: normalized, didBackfill } = normalizeRotationOrders(loaded);
  rotations.value = normalized;
  emit("updated-rotations", JSON.parse(JSON.stringify(normalized)));
  if (didBackfill) {
    await setCharacterRotations(
      props.character,
      JSON.parse(JSON.stringify(normalized)),
    );
  }
  characterData.value = (await getCharByName(props.character)) as Record<
    string,
    unknown
  >;
  const presetList = (characterData.value?.rotations ?? []) as CharacterRotationPreset[];
  presets.value = presetList;
  await recomputeCharacterContext();
});
</script>

<style scoped lang="scss"></style>
