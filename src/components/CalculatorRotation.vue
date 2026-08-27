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
        <EchoSetFilterSelect v-model="echoSetFilter" />
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
        <h2 class="card-title flex justify-between gap-2">
          <div class="flex items-center gap-2 min-w-0 flex-1">
            <span
              v-if="canReorder"
              class="rotation__drag-handle inline-flex items-center justify-center size-7 shrink-0 rounded cursor-grab active:cursor-grabbing text-base-content/50 hover:text-base-content hover:bg-base-200 select-none"
              draggable="true"
              role="button"
              tabindex="0"
              aria-label="Drag to reorder rotation"
              title="Drag to reorder"
              data-test-rotation-drag-handle
              @click.stop.prevent
              @dragstart.stop="onDragReorderStart"
              @dragend.stop="onDragReorderEnd">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="size-4 pointer-events-none">
                <path
                  d="M7 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM7 10a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM7 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM15 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM15 10a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM15 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
              </svg>
            </span>
            <span v-if="!isOpen" class="truncate" v-tooltip="description">{{
              name
            }}</span>
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
          </div>

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
                  'echo__item__image--empty': !currentEchoData?.image,
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
                    'echo__item__image--empty': !currentEchoData?.image,
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
          <div
            v-if="isLiveResultBarEnabled"
            class="rotation__summary-strip flex flex-wrap gap-3 items-center mt-4 text-sm"
            data-test-rotation-summary-strip>
            <span><b>{{ actionsCount }}</b> action{{ actionsCount === 1 ? "" : "s" }}</span>
            <span class="opacity-40">·</span>
            <span><b>{{ totalHits }}</b> hit{{ totalHits === 1 ? "" : "s" }}</span>
            <span class="opacity-40">·</span>
            <span><b>{{ durationValue !== null && durationValue !== "" ? `${durationValue}s` : "—" }}</b> duration</span>
            <span class="opacity-40">·</span>
            <span><b>{{ customizedActionsCount }}</b> customized</span>
          </div>
          <div
            v-if="isLiveResultBarEnabled && damageStripBars.length"
            class="rotation__damage-strip mt-4"
            data-test-rotation-damage-strip>
            <div class="text-xs opacity-60 mb-2">
              Damage by action — ordered, not timed. There's no per-action
              cast timing in the data to plot a real timeline.
            </div>
            <div class="rotation__damage-strip__bars">
              <button
                v-for="bar in damageStripBars"
                :key="bar.id"
                type="button"
                class="rotation__damage-strip__bar"
                :style="{ height: bar.heightPct + '%' }"
                :title="Math.round(bar.value).toLocaleString()"
                @click="scrollToAction(bar.id)"></button>
            </div>
          </div>
          <div class="rotations__list">
            <div
              v-for="(action, index) in actionsList"
              :key="action.id"
              :ref="(el) => setRowEl(action.id, el as HTMLElement | null)"
              class="action-dnd-item rounded-lg"
              :class="{
                'ring-2 ring-primary ring-offset-1 ring-offset-base-100':
                  actionDropIndex === index && actionDragIndex !== null && actionDragIndex !== index,
              }"
              @dragover.prevent="onActionDragOver(index, $event)"
              @dragenter.prevent="onActionDragEnter(index)"
              @drop.prevent="onActionDrop(index)">
              <CalculatorRotationActionEditor
                :ref="(el) => setActionRef(action.id, el)"
                :action="action"
                :character="character"
                :character-data="characterData"
                :character-build-data="characterBuildData"
                :definitions="definitions"
                :rotation-main-echo="echoValue"
                :rotation-main-echo-rank="mainEchoRank"
                :previous-action="previousActionByActionId[action.id] ?? null"
                :range-actions="rangeActions"
                :can-reorder="canReorderActions"
                :damage-value="actionDamageById[action.id] ?? null"
                damage-label="Avg"
                @action-update="handleActionUpdate"
                @action-update:sequence="handleSequenceUpdate"
                @remove-action="handleRemoveAction"
                @duplicate-action="handleDuplicateAction"
                @bulk-apply="handleBulkApplyBuff"
                @drag-reorder-start="onActionDragStart(index)"
                @drag-reorder-end="onActionDragEnd"
                :data-test-rotation-action-by-parent-name="nameValue"
                :data-test-rotation-action-by-attack-key="action.key ?? 'none'"
                :data-test-rotation-action-by-id="
                  action.id
                "></CalculatorRotationActionEditor>
            </div>
          </div>
          <button
            class="rotation__action--add btn btn-primary my-4 btn-xs w-full"
            @click="addAction"
            :data-test-rotation-action-add="nameValue">
            Add Action
          </button>
          <CalculatorRotationQuickAdd
            v-if="isLiveResultBarEnabled"
            :actions="characterActionList"
            @add-actions="handleAddActions" />
          <div class="rotation__action--system">
            <button
              class="btn btn-primary btn-xs"
              @click="handleRotationExport"
              :data-test-rotation-action-export="nameValue">
              Copy to Clipboard
            </button>
            <button
              class="btn btn-primary btn-xs"
              @click="handleRotationExportFile"
              :data-test-rotation-action-export-file="nameValue">
              Download JSON
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
import CalculatorRotationActionEditor from "./CalculatorRotationActionEditor.vue";
import CalculatorRotationQuickAdd from "./CalculatorRotationQuickAdd.vue";
import EchoSetFilterSelect from "./EchoSetFilterSelect.vue";
import { useCharacterActionList } from "../composables/useCharacterActionList";
import Range from "./input/Range.vue";
import { getEchoSetIconByType } from "../echoes/stats";
import { useCharacterStore } from "../stores/character";
import { getCharacterRosterDisplayName } from "../characters/characters";
import {
  mainEchoesData,
  getEchoData,
} from "../echoes/index.ts";
import { useToast } from "../composables/useToast";
import { useDragReorder } from "../composables/useDragReorder";
import { useSettingsStore } from "../stores/settings";
import {
  applyBulkAdvancedConfigOverride,
  hasAdvancedConfigOverrides,
  type AdvancedConfigCategory,
  type RotationAdvancedConfig,
} from "../calculator/rotationAdvancedBuffs";
import type { AdvancedBuffOverride, DurationRangeAction } from "./TeamRotationAdvancedBuffRow.vue";
import type { CharacterCalculationContext } from "../calculator/buildCharacterContext";
import { buildRotationExportPayload, generateRotationExportFilename } from "../characters/rotationExportImport";
import { trackEvent } from "../utils/analytics";

const { showToast } = useToast();

type RotationActionRow = Record<string, unknown> & { id: string; advancedConfig?: RotationAdvancedConfig };

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
    characterBuildData?: Record<string, unknown>;
    definitions?: CharacterCalculationContext["definitions"] | null;
    character: string;
    id: string;
    name: string;
    description: string;
    duration?: string | number | null;
    echo?: string | null;
    echoRank?: string | number | null;
    order?: number;
    actions?: RotationActionRow[];
    canReorder?: boolean;
    /** Rotation Flow (Labs) — Calculator.vue's already-computed allDamages
     * (threaded through CalculatorRotations.vue), used only to read this
     * rotation's real per-action damage for the damage-by-action strip. No
     * damage calculation happens in this component. */
    allDamages?: Record<string, unknown> | null;
  }>(),
  {
    characterData: () => ({}),
    characterBuildData: () => ({}),
    definitions: null,
    duration: null,
    echo: null,
    echoRank: null,
    order: 0,
    actions: () => [],
    canReorder: false,
    allDamages: null,
  },
);

const emit = defineEmits<{
  "updated-rotation": [payload: Record<string, unknown>];
  "rotation-delete": [id: string];
  "drag-reorder-start": [event: DragEvent];
  "drag-reorder-end": [];
}>();

const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);
const settingsStore = useSettingsStore();
const isLiveResultBarEnabled = computed(
  () => settingsStore.labs?.liveResultBar?.isEnabled ?? false,
);

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

function emitRotation(partial?: Partial<Record<string, unknown>>) {
  emit("updated-rotation", {
    id: props.id,
    name: nameValue.value,
    description: descriptionValue.value,
    duration: durationValue.value,
    echo: echoValue.value,
    echoRank: mainEchoRank.value,
    order: props.order,
    actions: actionsList.value,
    ...partial,
  });
}

function onDragReorderStart(event: DragEvent) {
  // Must set dataTransfer during dragstart on the draggable node (esp. Safari/Firefox)
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", props.id);
  }
  emit("drag-reorder-start", event);
}

function onDragReorderEnd() {
  emit("drag-reorder-end");
}

function toggleOpen() {
  isOpen.value = !isOpen.value;
}

defineExpose({ toggleOpen });

const actionsCount = computed(() => actionsList.value?.length || 0);
const canReorderActions = computed(() => actionsList.value.length > 1);

// Rotation Flow (Labs) summary strip — pure derivations of the same
// actionsList data already driving the rest of this component, no new
// data sources.
const totalHits = computed(() =>
  actionsList.value.reduce((sum, action) => sum + (Number(action.count) || 1), 0),
);
const customizedActionsCount = computed(
  () =>
    actionsList.value.filter(
      (action) =>
        (Array.isArray(action.buffs) && action.buffs.length > 0) ||
        hasAdvancedConfigOverrides(action.advancedConfig),
    ).length,
);

// Rotation Flow (Labs) damage-by-action strip. Reads this rotation's real
// per-action damage out of Calculator.vue's already-computed `allDamages`
// (matched by rotation id, then attack id === action id — see
// calcCharacterRotationDamage/resolveRotationAction). No damage math here;
// ordered by action sequence, never by time — there's no per-action cast
// timing in the data model to plot honestly.
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

const rotationDamageAttacks = computed<RotationDamageAttack[]>(() => {
  const rotations = (
    props.allDamages as { rotations?: Array<{ id: string; attacks?: RotationDamageAttack[] }> } | null
  )?.rotations;
  return rotations?.find((r) => r.id === props.id)?.attacks ?? [];
});

const actionDamageById = computed<Record<string, number>>(() => {
  const map: Record<string, number> = {};
  for (const attack of rotationDamageAttacks.value) {
    map[attack.id] =
      attack.damage?.avgDamage ??
      attack.damage?.totalDamage ??
      attack.damage?.healAmount ??
      attack.damage?.shieldAmount ??
      0;
  }
  return map;
});

const maxActionDamage = computed(() =>
  Math.max(1, ...Object.values(actionDamageById.value)),
);

const damageStripBars = computed(() =>
  actionsSorted.value
    .filter((action) => actionDamageById.value[action.id] !== undefined)
    .map((action) => {
      const value = actionDamageById.value[action.id] ?? 0;
      return {
        id: action.id,
        value,
        heightPct: Math.max(4, Math.round((value / maxActionDamage.value) * 100)),
      };
    }),
);

const rowEls = new Map<string, HTMLElement>();
function setRowEl(id: string, el: unknown) {
  if (el instanceof HTMLElement) {
    rowEls.set(id, el);
  } else {
    rowEls.delete(id);
  }
}
function scrollToAction(id: string) {
  const el = rowEls.get(id);
  if (!el) return;
  el.scrollIntoView({ block: "center", behavior: "smooth" });
  el.classList.add("rotation__action--flash");
  window.setTimeout(() => el.classList.remove("rotation__action--flash"), 900);
}

/** Trust current array order and stamp order 1..n (used after a drag reorder). */
function renumberActionsByArrayOrder(list: RotationActionRow[]): RotationActionRow[] {
  return list.map((action, index) => ({ ...action, order: index + 1 }));
}

const {
  dragIndex: actionDragIndex,
  dropIndex: actionDropIndex,
  onDragStart: onActionDragStart,
  onDragEnter: onActionDragEnter,
  onDragOver: onActionDragOver,
  onDrop: onActionDrop,
  onDragEnd: onActionDragEnd,
} = useDragReorder((from, to) => {
  const next = [...actionsList.value];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  actionsList.value = renumberActionsByArrayOrder(next);
  emitRotation();
});

// This rotation's own actions in displayed (order) sequence — the pool the
// per-buff "Duration" control draws its range from, and the basis for
// "copy previous action settings". Scoped to one rotation rather than the
// whole character, unlike Team Rotation's team-wide equivalents, since a
// character rotation's actions only ever belong to one character.
const actionsSorted = computed(() =>
  [...actionsList.value].sort(
    (a, b) => Number(a.order ?? 0) - Number(b.order ?? 0),
  ),
);

const rangeActions = computed<DurationRangeAction[]>(() =>
  actionsSorted.value.map((action) => ({
    id: action.id,
    characterName: getCharacterRosterDisplayName(props.character),
    key: (action.key as string | null | undefined) ?? null,
  })),
);

const previousActionByActionId = computed(() => {
  const map: Record<string, RotationActionRow | null> = {};
  actionsSorted.value.forEach((action, index) => {
    map[action.id] = index > 0 ? actionsSorted.value[index - 1] : null;
  });
  return map;
});

function handleBulkApplyBuff(payload: {
  category: AdvancedConfigCategory;
  key: string | null;
  override: AdvancedBuffOverride;
  actionIds: string[];
}) {
  actionsList.value = applyBulkAdvancedConfigOverride(
    actionsList.value,
    payload.actionIds,
    payload.category,
    payload.key,
    payload.override,
  );
  emitRotation();
  showToast(
    `Applied to ${payload.actionIds.length} action${payload.actionIds.length === 1 ? "" : "s"}.`,
    "success",
  );
}

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

const characterActionList = useCharacterActionList(computed(() => props.characterData));

function handleAddActions(entries: Array<{ key: string; type: string; count: number }>) {
  if (!entries.length) return;
  const newActions: RotationActionRow[] = entries.map((entry) => ({
    id: randomString(),
    type: entry.type,
    key: entry.key,
    order: 0,
    count: entry.count,
    buffs: [],
    negativeStatusStacks: 1,
    electroRageStacks: 0,
  }));
  actionsList.value = renumberActionsByArrayOrder([...actionsList.value, ...newActions]);
  emitRotation();
}

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

function currentRotationExportData() {
  return {
    name: nameValue.value ?? props.name,
    description: descriptionValue.value ?? props.description,
    duration: durationValue.value,
    echo: echoValue.value,
    echoRank: mainEchoRank.value,
    actions: actionsList.value,
  };
}

function handleRotationExport() {
  const payload = buildRotationExportPayload(currentRotationExportData());
  void navigator.clipboard.writeText(JSON.stringify(payload));
  showToast("Rotation copied to clipboard!", "success");
  trackEvent("rotation-exported", { via: "clipboard" });
}

function handleRotationExportFile() {
  const rotationData = currentRotationExportData();
  const payload = buildRotationExportPayload(rotationData);
  const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = generateRotationExportFilename(rotationData.name);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast("Rotation downloaded!", "success");
  trackEvent("rotation-exported", { via: "file" });
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
  // Merge rather than replace: CalculatorRotationAction's own payload
  // (buildActionPayload) doesn't know about fields owned by the wrapper
  // around it, like `advancedConfig` — a wholesale replace would silently
  // wipe those out on every unrelated edit (attack change, hit count, etc).
  actions[foundIndex] = { ...actions[foundIndex], ...actionData } as RotationActionRow;
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

function handleDuplicateAction(payload: { id: string }) {
  const actions = JSON.parse(JSON.stringify(actionsList.value)) as RotationActionRow[];
  const sourceIndex = actions.findIndex((action) => action.id === payload.id);
  if (sourceIndex === -1) return;
  const clone: RotationActionRow = { ...actions[sourceIndex], id: randomString() };
  actions.splice(sourceIndex + 1, 0, clone);
  actionsList.value = renumberActionsByArrayOrder(actions);
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
.rotation__damage-strip__bars {
  display: flex;
  align-items: flex-end;
  gap: 0.375rem;
  height: 3.5rem;
}
.rotation__damage-strip__bar {
  flex: 1;
  min-width: 0.5rem;
  max-width: 2.5rem;
  border-radius: 0.25rem 0.25rem 0.125rem 0.125rem;
  background: oklch(var(--p) / 0.45);
  border: none;
  cursor: pointer;
  transition: background 0.15s ease;
}
.rotation__damage-strip__bar:hover {
  background: oklch(var(--p) / 0.8);
}
.rotation__action--flash {
  outline: 2px solid oklch(var(--p));
  outline-offset: -2px;
}
.mismatch-echo {
  svg {
    filter: none !important;
  }
  path {
    fill: oklch(var(--wa));
  }
}
.rotation__drag-handle {
  -webkit-user-drag: element;
  user-select: none;
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
html[data-theme-style="light"] {
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
