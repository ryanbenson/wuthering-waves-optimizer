<template>
  <div class="flex gap-4 mb-4">
    <button
      class="btn btn-primary"
      @click="handleCreateRotation"
      data-test-rotations-action="create">
      Create
    </button>
    <button
      class="btn btn-primary"
      @click="handleToggleImport"
      data-test-rotations-action="import">
      Import
    </button>
    <button
      class="btn btn-primary"
      @click="togglePresetRotations"
      data-test-rotations-action="presets">
      List Presets
    </button>
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
    <CalculatorRotation
      v-for="rotation in rotations"
      :key="rotation.id"
      :ref="(el) => setRotationRef(rotation.id, el)"
      :character="character"
      :character-data="characterData"
      :id="rotation.id"
      :name="rotation.name"
      :description="rotation.description"
      :duration="rotation.duration"
      :echo="rotation.echo"
      :echo-rank="rotation.echoRank"
      :actions="rotation.actions"
      @updated-rotation="handleUpdatedRotation"
      @rotation-delete="handleDeleteRotation"></CalculatorRotation>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useCharacterStore } from "../stores/character";
import { getCharByName } from "../characters/characters.ts";
import { randomString } from "../utils/strings.ts";
import CalculatorRotation from "./CalculatorRotation.vue";

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

const hasRotations = computed(() => presets.value.length > 0);

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
    actions: [],
  };
  rotations.value.push(newRotationData);
  await nextTick();
  rotationRefs.get(id)?.toggleOpen();
  await setCharacterData(props.character, {
    rotations: JSON.parse(JSON.stringify(rotations.value)),
  });
  emit("updated-rotations", JSON.parse(JSON.stringify(rotations.value)));
}

async function handleImportRotation() {
  try {
    const rotationData = JSON.parse(
      importRotationData.value ?? "",
    ) as RotationRow;
    const processedImportedRotation = addIdsToImportedRotation(rotationData);
    rotations.value.push(processedImportedRotation);
    importRotationData.value = null;
    isImportOpen.value = false;
    await setCharacterData(props.character, {
      rotations: JSON.parse(JSON.stringify(rotations.value)),
    });
    emit("updated-rotations", JSON.parse(JSON.stringify(rotations.value)));
  } catch {
    alert("Rotation data is not valid");
  }
}

async function handleImportPreset(preset: RotationPreset) {
  try {
    const rotationData = JSON.parse(JSON.stringify(preset.data)) as RotationRow;
    const processedImportedRotation = addIdsToImportedRotation(rotationData);
    rotations.value.push(processedImportedRotation);
    importRotationData.value = null;
    isImportOpen.value = false;
    await setCharacterData(props.character, {
      rotations: JSON.parse(JSON.stringify(rotations.value)),
    });
    emit("updated-rotations", JSON.parse(JSON.stringify(rotations.value)));
  } catch {
    alert("Rotation data is not valid");
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
  next[foundIndex] = rotationData as RotationRow;
  rotations.value = next;
  await setCharacterRotations(
    props.character,
    JSON.parse(JSON.stringify(rotations.value)),
  );
  emit("updated-rotations", JSON.parse(JSON.stringify(rotations.value)));
}

async function handleDeleteRotation(rotationId: string) {
  const next = rotations.value.filter((rotation) => rotation.id !== rotationId);
  rotations.value = next;
  await setCharacterRotations(props.character, next);
  emit("updated-rotations", JSON.parse(JSON.stringify(rotations.value)));
}

function togglePresetRotations() {
  isPresetRotationsOpen.value = !isPresetRotationsOpen.value;
}

onMounted(async () => {
  rotations.value =
    ((currentCharacter.value as { rotations?: RotationRow[] }).rotations ??
      []) as RotationRow[];
  emit("updated-rotations", JSON.parse(JSON.stringify(rotations.value)));
  characterData.value = (await getCharByName(props.character)) as Record<
    string,
    unknown
  >;
  const presetList = (characterData.value?.rotations ?? []) as RotationPreset[];
  presets.value = presetList;
});
</script>

<style scoped lang="scss"></style>
