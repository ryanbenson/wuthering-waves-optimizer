<template>
  <div class="optimizer__header flex flex-wrap items-center justify-between gap-4 mb-4 rounded-lg bg-base-200 p-1 pl-3">
    <h3 class="text-sm font-semibold">Rotations</h3>
    <div class="join">
      <button
        class="btn btn-sm join-item"
        @click="handleCreateRotation"
        data-test-rotations-action="create">
        Create
      </button>
      <button
        class="btn btn-sm join-item"
        @click="handleToggleImport"
        data-test-rotations-action="import">
        Import
      </button>
      <button
        class="btn btn-sm join-item"
        @click="togglePresetRotations"
        data-test-rotations-action="presets">
        List Presets
      </button>
    </div>
  </div>
  <div
    v-if="isImportOpen"
    class="card card-bordered card-compact bg-base-100 shadow mb-2 cursor-pointer">
    <div class="card-body">
      <h2 class="card-title">Import rotation</h2>
      <p>Import a rotation in JSON form below.</p>
      <textarea
        v-model="importRotationData"
        name="importRotation"
        id="importRotaton"
        class="textarea textarea-bordered"></textarea>
      <button class="btn btn-primary" @click="handleImportRotation">
        Confirm Import
      </button>
    </div>
  </div>
  <div v-if="isPresetRotationsOpen">
    <template v-if="!hasRotations">
      <div
        class="presetRotations card card-bordered card-compact bg-base-100 shadow mb-2 cursor-pointer">
        <div class="card-body">
          No presets are available for {{ character }} yet.
        </div>
      </div>
    </template>
    <template v-else>
      <div
        v-for="preset in presets"
        :key="preset.name"
        class="presetRotations card card-bordered card-compact bg-base-100 shadow mb-2 cursor-pointer">
        <div class="card-body">
          <h2 class="card-title">{{ preset.name }}</h2>
          <p>
            {{ preset.description }}
          </p>
          <p class="italic">Author: {{ preset.author }}</p>
          <button class="btn btn-primary" @click="handleImportPreset(preset)">
            Import
          </button>
        </div>
      </div>
    </template>
  </div>
  <div class="flex flex-col gap-4">
    <div
      v-for="(rotation, index) in rotations"
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
        @drag-reorder-start="onDragStart(index)"
        @drag-reorder-end="onDragEnd"
        @updated-rotation="handleUpdatedRotation"
        @rotation-delete="handleDeleteRotation"></CalculatorRotation>
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
import { useToast } from "../composables/useToast";
import { useDragReorder } from "../composables/useDragReorder";
import {
  buildCharacterCalculationContext,
  type CharacterCalculationContext,
  type TeamEnemyConfig,
} from "../calculator/buildCharacterContext";

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
};

type RotationPreset = {
  name: string;
  description?: string;
  author?: string;
  data: RotationRow;
};

const props = defineProps<{
  character: string;
}>();

const emit = defineEmits<{
  "updated-rotations": [payload: RotationRow[]];
}>();

const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);
const { setCharacterData, setCharacterRotations } = characterStore;
const inventoryStore = useInventoryStore();
const { echoes: inventoryEchoes } = storeToRefs(inventoryStore);

const importRotationData = ref<string | null>(null);
const isImportOpen = ref(false);
const isPresetRotationsOpen = ref(false);
const rotations = ref<RotationRow[]>([]);
const characterData = ref<Record<string, unknown>>({});
const presets = ref<RotationPreset[]>([]);

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

const hasRotations = computed(() => presets.value.length > 0);
const canReorder = computed(() => rotations.value.length > 1);

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

async function handleImportRotation() {
  try {
    const rotationData = JSON.parse(
      importRotationData.value ?? "",
    ) as RotationRow;
    const processedImportedRotation = addIdsToImportedRotation(rotationData);
    processedImportedRotation.order = rotations.value.length;
    const next = [...rotations.value, processedImportedRotation];
    importRotationData.value = null;
    isImportOpen.value = false;
    await persistRotations(next);
  } catch {
    showToast("Rotation data is not valid", "error");
  }
}

async function handleImportPreset(preset: RotationPreset) {
  try {
    const rotationData = JSON.parse(JSON.stringify(preset.data)) as RotationRow;
    const processedImportedRotation = addIdsToImportedRotation(rotationData);
    processedImportedRotation.order = rotations.value.length;
    const next = [...rotations.value, processedImportedRotation];
    importRotationData.value = null;
    isImportOpen.value = false;
    await persistRotations(next);
  } catch {
    showToast("Rotation data is not valid", "error");
  }
}

function handleToggleImport() {
  isImportOpen.value = !isImportOpen.value;
}

async function handleUpdatedRotation(rotationData: Record<string, unknown>) {
  const next = JSON.parse(JSON.stringify(rotations.value)) as RotationRow[];
  const rid = rotationData.id as string;
  const foundIndex = next.findIndex((rotation) => rotation.id === rid);
  if (foundIndex === -1) {
    return;
  }
  const existingOrder = next[foundIndex].order;
  next[foundIndex] = {
    ...(rotationData as RotationRow),
    order: rotationOrderValue(rotationData.order, existingOrder),
  };
  await persistRotations(next);
}

async function handleDeleteRotation(rotationId: string) {
  const next = rotations.value.filter((rotation) => rotation.id !== rotationId);
  await persistRotations(next);
}

function togglePresetRotations() {
  isPresetRotationsOpen.value = !isPresetRotationsOpen.value;
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
  const presetList = (characterData.value?.rotations ?? []) as RotationPreset[];
  presets.value = presetList;
  await recomputeCharacterContext();
});
</script>

<style scoped lang="scss"></style>
