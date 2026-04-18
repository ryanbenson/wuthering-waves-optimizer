<template>
  <dialog :id="modalIdPicker" class="modal">
    <form method="dialog" class="modal-backdrop" @click="closeEchoChooser">
      <button>close</button>
    </form>
    <div class="modal-box max-w-5xl">
      <form method="dialog" @click="closeEchoChooser">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
      </form>
      <div class="py-4">
        <div
          class="echoes__filters echo-filters__sets flex align-center gap-1 mb-6 items-center flex-wrap"
          :class="{ 'echo-filters__sets--active': echoSetFilter !== null }">
          <span class="mr-2">Filter</span>
          <button
            v-for="echoSet in echoSetsList"
            :key="echoSet"
            @click="toggleEchoSetFilter(echoSet)"
            class="rounded p-[.3rem]"
            :class="{ 'btn-active': isEchoSetFilterActive(echoSet) }">
            <img
              :src="getEchoSetImage(echoSet)"
              class="size-7 m-width-7"
              :class="echoSet" />
          </button>
          <button @click="resetFilters" class="btn btn-sm btn-ghost">
            Clear
          </button>
        </div>
      </div>
      <div class="echoes__list grid grid-cols-1 md:grid-cols-4 gap-4">
        <template v-if="!allEchoesListFiltered.length">
          <div class="echoes__list--empty py-12 text-center w-full col-span-2">
            No echoes found
          </div>
        </template>
        <template v-else>
          <div
            v-for="echoesToChoose in allEchoesListFiltered"
            :key="echoesToChoose.key"
            class="card card-bordered card-compact bg-base-100 shadow mb-2 cursor-pointer"
            @click="chooseMainEcho(echoesToChoose.key)">
            <div class="card-body items-center">
              <div
                class="echo__item__image rounded-full border border-solid neutral-content size-20 mb-2 bg-cover cursor-pointer mx-auto lg:m-0"
                :style="{
                  backgroundImage: `url(${echoesToChoose.image})`,
                }"
                @click.stop></div>
              <h2 class="card-title text-center text-lg">
                {{ echoesToChoose.name }}
              </h2>
              <h3 class="text-sm">{{ echoesToChoose.class }}</h3>
              <div
                class="echo__item__set-selection flex gap-3 justify-center sm:justify-start flex-wrap">
                <div
                  v-for="echoSetItem in echoesToChoose.sets"
                  :key="echoSetItem"
                  class="size-8 rounded-full cursor-pointer echo__item__set-selection--icon">
                  <img
                    :src="getEchoSetIcon(echoSetItem)"
                    :class="echoSetItem" />
                </div>
              </div>
              <button
                @click="chooseMainEcho(echoesToChoose.key)"
                class="btn btn-sm btn-primary">
                Use echo
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </dialog>
  <div
    class="card card-bordered card-compact bg-base-100 shadow mb-2 cursor-pointer"
    :data-test-rotation-item="id"
    :data-test-rotation-item-by-name="name"
    @click="toggleOpen">
    <div class="rotation__head">
      <div class="card-body">
        <h2 class="card-title flex justify-between">
          <span v-if="!isOpen" v-tooltip="description">{{ name }}</span>
          <input
            v-else
            type="text"
            name="name"
            id="name"
            class="input input-bordered w-full max-w-lg"
            v-model="nameValue"
            @input="onNameChange"
            @click.stop
            :data-test-rotation-name-input="nameValue" />

          <div class="rotation__end">
            <div class="rotation__echo relative size-8">
              <span v-if="!isEquippedEchoSameAsRotationEcho" class="mismatch-echo absolute top-[-8px] right-[-8px]" v-tooltip="'Rotation echo does not match your equipped main echo'">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class="size-4"><path d="M320 64C334.7 64 348.2 72.1 355.2 85L571.2 485C577.9 497.4 577.6 512.4 570.4 524.5C563.2 536.6 550.1 544 536 544L104 544C89.9 544 76.8 536.6 69.6 524.5C62.4 512.4 62.1 497.4 68.8 485L284.8 85C291.8 72.1 305.3 64 320 64zM320 416C302.3 416 288 430.3 288 448C288 465.7 302.3 480 320 480C337.7 480 352 465.7 352 448C352 430.3 337.7 416 320 416zM320 224C301.8 224 287.3 239.5 288.6 257.7L296 361.7C296.9 374.2 307.4 384 319.9 384C332.5 384 342.9 374.3 343.8 361.7L351.2 257.7C352.5 239.5 338.1 224 319.8 224z"/></svg>
              </span>
              <img
                v-tooltip="currentEchoData?.name"
                :src="
                  currentEchoData?.image ||
                  'https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/monsters.png'
                "
                class="size-8 rounded-full border border-solid neutral-content bg-cover"
                :class="{
                  'border-amber-300': mainEchoRank === '5' || mainEchoRank === 5,
                  'border-violet-600': mainEchoRank === '4' || mainEchoRank === 4,
                  'border-blue-500': mainEchoRank === '3' || mainEchoRank === 3,
                  'border-green-500': mainEchoRank === '2' || mainEchoRank === 2,
                }"
                :alt="currentEchoData?.name" />
            </div>
            <div
              class="rotation__actions-count min-w-24"
              :data-test-rotation-actions-count="nameValue">
              {{ actionsCount }} Actions
            </div>
            <div class="rotation__expand">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path
                  d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152L0 424c0 48.6 39.4 88 88 88l272 0c48.6 0 88-39.4 88-88l0-112c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 112c0 22.1-17.9 40-40 40L88 464c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 64z" />
              </svg>
            </div>
          </div>
        </h2>
        <div class="rotation__body" v-if="isOpen" @click.stop>
          <div class="rotation__desc flex flex-col gap-2">
            <label for="description">Description</label>
            <textarea
              v-model="descriptionValue"
              name="description"
              id="description"
              class="textarea textarea-bordered"
              @input="onDescriptionChange"
              >{{ description }}</textarea
            >
          </div>
          <div class="rotation__duration-echo flex gap-4 items-center mt-4">
            <div class="rotation__echo">
              <div
                class="rotation__current-echo flex flex-col gap-2 items-center">
                <h2>Main Echo</h2>
                <img
                  :src="
                    currentEchoData?.image ||
                    'https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/monsters.png'
                  "
                  class="size-12 rounded-full border border-solid neutral-content bg-cover"
                  :class="{
                    'border-amber-300': mainEchoRank === '5' || mainEchoRank === 5,
                    'border-violet-600': mainEchoRank === '4' || mainEchoRank === 4,
                    'border-blue-500': mainEchoRank === '3' || mainEchoRank === 3,
                    'border-green-500': mainEchoRank === '2' || mainEchoRank === 2,
                  }"
                  :alt="currentEchoData?.name" />
                <span class="rotation__echo-echo--name">
                  {{ currentEchoData?.name }}
                </span>
                <button
                  class="btn btn-sm btn-outline btn-primary"
                  @click="openEchoChooser">
                  Choose echo
                </button>
                <button
                  class="btn btn-sm btn-outline btn-secondary"
                  @click="chooseCurrentMainEcho"
                  :disabled="!hasCurrentMainEcho">
                  Use current echo
                </button>
                <span class="main-echo--rank">
                  <span class="font-bold">Rank</span> <span class="text-primary">{{ mainEchoRank }}</span>
                </span>
                <Range
                  id="Rank"
                  :values="[1, 2, 3, 4, 5]"
                  :default-value="5"
                  size="xs"
                  class="w-full"
                  @update-value="(val: string | number) => onMainEchoRankChange(val)"
                  data-test-rotation-main-echo-rank="CritRate" />
              </div>
            </div>
            <div class="rotation__duration flex flex-col gap-2">
              <label for="duration">Duration (seconds)</label>
              <input
                type="text"
                name="duration"
                id="duration"
                class="input input-bordered w-full max-w-lg"
                v-model="durationValue"
                @input="onDurationChange"
                @click.stop
                :data-test-rotation-name-input="durationValue" />
            </div>
          </div>
          <div class="rotations__list">
            <CalculatorRotationAction
              v-for="action in actionsList"
              :key="action.id"
              :id="action.id"
              :ref="(el) => setActionRef(action.id, el)"
              :character="character"
              :character-data="characterData"
              :action-key="rotationActionStr(action.key)"
              :type="rotationActionStr(action.type)"
              :order="rotationActionOrderCount(action.order)"
              :count="rotationActionOrderCount(action.count)"
              :buffs="rotationActionBuffs(action.buffs)"
              :is-disabled="rotationActionBool(action.isDisabled)"
              :ignore-self-buffs="rotationActionBool(action.excludeSelfBuffs)"
              :ignore-team-buffs="rotationActionBool(action.excludeTeamBuffs)"
              :ignore-weapon-buffs="rotationActionBool(action.excludeWeaponBuffs)"
              :action-main-echo="rotationActionStr(action.mainEcho)"
              :action-main-echo-rank="rotationActionEchoRank(action.mainEchoRank)"
              :rotation-main-echo="echoValue"
              :rotation-main-echo-rank="mainEchoRank"
              @action-update="handleActionUpdate"
              @action-update:sequence="handleSequenceUpdate"
              @remove-action="handleRemoveAction"
              :data-test-rotation-action-by-parent-name="nameValue"
              :data-test-rotation-action-by-attack-key="action.key ?? 'none'"
              :data-test-rotation-action-by-id="
                action.id
              "
              :negative-status-stacks="Number(action.negativeStatusStacks ?? 1)"
              :electro-rage-stacks="Number(action.electroRageStacks ?? 0)"></CalculatorRotationAction>
          </div>
          <button
            class="rotation__action--add btn btn-primary my-4 btn-xs w-full"
            @click="addAction"
            :data-test-rotation-action-add="nameValue">
            Add Action
          </button>
          <div class="rotation__action--system">
            <button
              class="btn btn-primary btn-xs"
              @click="handleRotationExport"
              :data-test-rotation-action-export="nameValue">
              Export
            </button>
            <button
              class="btn btn-error btn-xs"
              @click="handleRotationDelete"
              :data-test-rotation-action-delete="nameValue">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineExpose, nextTick, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { randomString } from "../utils/strings";
import CalculatorRotationAction from "./CalculatorRotationAction.vue";
import Range from "./input/Range.vue";
import { getEchoSetIconByType, echoSetLabelMap } from "../echoes/stats";
import { useCharacterStore } from "../stores/character";
import {
  mainEchoesData,
  getEchoData,
} from "../echoes/index.ts";

type RotationActionRow = Record<string, unknown> & { id: string };

type EchoGridRow = {
  key: string;
  name: string;
  class: string;
  sets: string[];
  image?: string;
};

const props = withDefaults(
  defineProps<{
    characterData?: Record<string, unknown>;
    character: string;
    id: string;
    name: string;
    description: string;
    duration?: string | number | null;
    echo?: string | null;
    echoRank?: string | number | null;
    actions?: RotationActionRow[];
  }>(),
  {
    characterData: () => ({}),
    duration: null,
    echo: null,
    echoRank: null,
    actions: () => [],
  },
);

const emit = defineEmits<{
  "updated-rotation": [payload: Record<string, unknown>];
  "rotation-delete": [id: string];
}>();

const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);

const isOpen = ref(false);
const nameValue = ref<string | null>(null);
const descriptionValue = ref<string | null>(null);
const durationValue = ref<string | number | null>(null);
const echoValue = ref<string | null>(null);
const mainEchoRank = ref<string | number>(5);
const actionsList = ref<RotationActionRow[]>([]);
const modalIdPicker = `echo-chooser-modal-${randomString()}`;
const echoSetFilter = ref<string | null>(null);

const actionRefs = new Map<string, { toggleEdit: () => void }>();

function setActionRef(id: string, el: unknown) {
  if (
    el &&
    typeof el === "object" &&
    "toggleEdit" in el &&
    typeof (el as { toggleEdit: unknown }).toggleEdit === "function"
  ) {
    actionRefs.set(id, el as { toggleEdit: () => void });
  } else {
    actionRefs.delete(id);
  }
}

type RotationBuffRow = {
  id: string;
  modifier?: string | null;
  modifierValue?: unknown;
};

function rotationActionStr(v: unknown): string | null {
  if (v === null || v === undefined) {
    return null;
  }
  return String(v);
}

function rotationActionOrderCount(v: unknown): string | number {
  if (typeof v === "number" || typeof v === "string") {
    return v;
  }
  const n = Number(v);
  return Number.isNaN(n) ? 1 : n;
}

function rotationActionBuffs(v: unknown): RotationBuffRow[] {
  return Array.isArray(v) ? (v as RotationBuffRow[]) : [];
}

function rotationActionBool(v: unknown): boolean {
  return Boolean(v);
}

function rotationActionEchoRank(v: unknown): number | null {
  if (v === null || v === undefined || v === "") {
    return null;
  }
  if (typeof v === "number") {
    return v;
  }
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}

function emitRotation(partial?: Partial<Record<string, unknown>>) {
  emit("updated-rotation", {
    id: props.id,
    name: nameValue.value,
    description: descriptionValue.value,
    duration: durationValue.value,
    echo: echoValue.value,
    echoRank: mainEchoRank.value,
    actions: actionsList.value,
    ...partial,
  });
}

function toggleOpen() {
  isOpen.value = !isOpen.value;
}

defineExpose({ toggleOpen });

const actionsCount = computed(() => actionsList.value?.length || 0);

const echoSetsList = computed(() => Object.keys(echoSetLabelMap));

const allEchoesListFiltered = computed(() => {
  let allEchoes = Object.values(mainEchoesData) as unknown as EchoGridRow[];
  if (echoSetFilter.value) {
    allEchoes = allEchoes.filter((echo) =>
      echo.sets.includes(echoSetFilter.value!),
    );
  }
  const classOrder: Record<string, number> = {
    Calamity: 0,
    Overlord: 1,
    Elite: 2,
    Common: 3,
  };
  return [...allEchoes].sort((a, b) => {
    const classComparison =
      (classOrder[a.class] ?? 99) - (classOrder[b.class] ?? 99);
    if (classComparison === 0) {
      return a.name.localeCompare(b.name);
    }
    return classComparison;
  });
});

const currentEchoData = computed(() => {
  if (!echoValue.value) {
    return null;
  }
  return getEchoData(echoValue.value);
});

const currentCharacterMainEcho = computed(() => {
  return (
    (characters.value[props.character] as { mainEcho?: { echo?: string } } | undefined)
      ?.mainEcho?.echo ?? null
  );
});

const hasCurrentMainEcho = computed(() => !!currentCharacterMainEcho.value);

const isEquippedEchoSameAsRotationEcho = computed(() => {
  if (!currentCharacterMainEcho.value || !echoValue.value) {
    return true;
  }
  return currentCharacterMainEcho.value === echoValue.value;
});

function addAction() {
  const newSequence = actionsCount.value + 1;
  const id = randomString();
  actionsList.value.push({
    id,
    type: null,
    order: newSequence,
    count: 1,
    buffs: [],
    negativeStatusStacks: 1,
    electroRageStacks: 0,
  });
  void nextTick(() => {
    actionRefs.get(id)?.toggleEdit();
  });
}

function removeIdsFromExport(rotationData: Record<string, unknown>) {
  const rotation = JSON.parse(JSON.stringify(rotationData)) as {
    id?: string;
    actions: Array<{
      id?: string;
      buffs?: Array<{ id?: string }>;
    }>;
  };
  delete rotation.id;
  rotation.actions.forEach((action) => {
    delete action.id;
    action.buffs?.forEach((buff) => {
      delete buff.id;
    });
  });
  return rotation;
}

function handleRotationExport() {
  const rotationData = {
    id: props.id,
    name: nameValue.value ?? props.name,
    description: descriptionValue.value ?? props.description,
    actions: actionsList.value,
    echo: echoValue.value,
  };
  const cleanRotationJson = removeIdsFromExport(rotationData);
  void navigator.clipboard.writeText(JSON.stringify(cleanRotationJson));
  alert("Rotation copied to clipboard!");
}

function onNameChange(e: Event) {
  const target = e.target as HTMLInputElement;
  emitRotation({
    name: target.value,
  });
}

function onDescriptionChange(e: Event) {
  const target = e.target as HTMLTextAreaElement;
  emitRotation({
    description: target.value,
  });
}

function onDurationChange(e: Event) {
  const target = e.target as HTMLInputElement;
  emitRotation({
    duration: target.value,
  });
}

function onEchoChange() {
  emitRotation();
}

function handleActionUpdate(actionData: Record<string, unknown>) {
  const actions = JSON.parse(JSON.stringify(actionsList.value)) as RotationActionRow[];
  const foundIndex = actions.findIndex((action) => action.id === actionData.id);
  if (foundIndex === -1) {
    return;
  }
  actions[foundIndex] = actionData as RotationActionRow;
  actionsList.value = actions;
  emitRotation();
}

function handleSequenceUpdate(actionData: Record<string, unknown>) {
  const actions = JSON.parse(JSON.stringify(actionsList.value)) as RotationActionRow[];
  const id = actionData.id as string;
  const newOrder = actionData.order as number | string;
  const maxOrder = actions.length;
  const validatedOrder = Math.max(1, Math.min(Number(newOrder), maxOrder));
  const actionIndex = actions.findIndex((action) => action.id === id);
  const [updatedAction] = actions.splice(actionIndex, 1);
  const originalOrder = Number(updatedAction.order);
  updatedAction.order = validatedOrder;
  actions.forEach((action) => {
    const ord = Number(action.order);
    if (
      originalOrder < validatedOrder &&
      ord > originalOrder &&
      ord <= validatedOrder
    ) {
      action.order = ord - 1;
    } else if (
      originalOrder > validatedOrder &&
      ord < originalOrder &&
      ord >= validatedOrder
    ) {
      action.order = ord + 1;
    }
  });
  actions.splice(validatedOrder - 1, 0, updatedAction);
  actions.sort((a, b) => Number(a.order) - Number(b.order));
  actionsList.value = actions;
  emitRotation();
}

function handleRemoveAction(actionData: { id: string }) {
  actionsList.value = actionsList.value.filter((action) => action.id !== actionData.id);
  emitRotation();
}

function handleRotationDelete() {
  emit("rotation-delete", props.id);
}

function chooseMainEcho(echoKey: string) {
  echoValue.value = echoKey;
  closeEchoChooser();
  onEchoChange();
}

function closeEchoChooser() {
  echoSetFilter.value = null;
  const modalEl = document.getElementById(modalIdPicker) as HTMLDialogElement | null;
  modalEl?.close();
}

function openEchoChooser() {
  const modalEl = document.getElementById(modalIdPicker) as HTMLDialogElement | null;
  modalEl?.showModal();
}

function getEchoSetImage(echoSet: string) {
  return getEchoSetIconByType(echoSet);
}

function toggleEchoSetFilter(echoSet: string) {
  echoSetFilter.value = echoSetFilter.value === echoSet ? null : echoSet;
}

function isEchoSetFilterActive(echoSet: string) {
  return echoSetFilter.value === echoSet;
}

function resetFilters() {
  echoSetFilter.value = null;
}

function getEchoSetIcon(type: string) {
  return getEchoSetIconByType(type);
}

function chooseCurrentMainEcho() {
  if (!hasCurrentMainEcho.value) {
    return;
  }
  echoValue.value = currentCharacterMainEcho.value;
  onEchoChange();
}

function onMainEchoRankChange(val: string | number) {
  mainEchoRank.value = val;
  emitRotation({ echoRank: val });
}

onMounted(() => {
  const actions = JSON.parse(JSON.stringify(props.actions)) as RotationActionRow[];
  actions.sort((a, b) => Number(a.order) - Number(b.order));
  actionsList.value = actions;
  nameValue.value = props.name;
  descriptionValue.value = props.description;
  durationValue.value = props.duration ?? null;
  echoValue.value = props.echo ?? null;
  mainEchoRank.value = props.echoRank ?? 5;
});
</script>

<style scoped lang="scss">
.mismatch-echo {
  svg {
    filter: none !important;
  }
  path {
    fill: oklch(var(--wa));
  }
}
.echo-filters__sets--active {
  button {
    opacity: 0.6;
  }
  button.btn-active {
    opacity: 1;
  }
}
.rotation__head {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  cursor: pointer;

  .rotation__name {
    flex-grow: 2;
    display: flex;
    gap: 0.5rem;

    input {
      flex-grow: 2;
    }

    span {
      font-weight: bold;
    }
  }

  .rotation__info {
    border: none;
    background-color: #121212;
    border-radius: 4rem;

    svg {
      width: 1rem;
      height: 1rem;
    }
  }
}
.rotation__end {
  display: flex;
  align-items: center;
  gap: 1rem;

  svg {
    width: 1rem;
    height: 1rem;
    filter: invert(100%);
  }
}
html[data-theme="light"] {
  .rotation__end {
    svg {
      filter: unset;
    }
  }
}
.rotations__list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 1rem;
  margin-top: 1rem;
}
.rotation__action--system {
  display: flex;
  gap: 0.5rem;

  button {
    flex-grow: 2;
  }
}

textarea {
  height: 6rem;
}
</style>
