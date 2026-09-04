<template>
  <AppChooserModal
    ref="modalRef"
    title="Choose enemy"
    close-test-attr="data-test-enemy-browser-close"
    @close="resetFilters">
    <template #toolbar>
      <p
        v-if="!characterElement"
        class="text-sm opacity-80 mb-2"
        data-test-enemy-browser-no-element>
        No character element is set yet. Enemy resistance will default to 10%
        until your character has an element.
      </p>
      <AppFilterPanel
        panel-key="calculator-enemies"
        :active-count="activeFilterCount"
        :clear-disabled="!activeFilterCount"
        @clear="resetFilters">
        <template #bar>
          <input
            v-model="filterName"
            type="search"
            placeholder="Search by name"
            class="input input-bordered input-sm flex-1 min-w-40"
            aria-label="Search enemies"
            data-test-enemy-browser-search />
        </template>
        <div class="flex flex-wrap gap-1 items-center">
          <span class="text-sm opacity-70 mr-1">Type:</span>
          <button
            v-for="t in ENEMY_BROWSER_UI_TYPES"
            :key="t"
            type="button"
            class="btn btn-sm rounded"
            :class="{ 'btn-active': filterType === t }"
            @click="toggleTypeFilter(t)">
            {{ t }}
          </button>
        </div>
      </AppFilterPanel>

      <div class="flex items-center justify-between gap-2 mt-2">
        <span class="text-xs opacity-60" data-test-enemy-browser-count>
          {{ enemiesFilteredSorted.length }}
          {{ enemiesFilteredSorted.length === 1 ? "enemy" : "enemies" }}
        </span>
      </div>
    </template>

    <div
      v-if="!enemiesFilteredSorted.length"
      class="py-12 text-center w-full opacity-60">
      No enemies found
    </div>
    <div v-else class="flex flex-col gap-2" data-test-enemy-browser-list>
      <div
        v-for="enemy in enemiesFilteredSorted"
        :key="enemy.key"
        class="card card-bordered card-compact bg-base-200 shadow-sm hover:bg-base-300 transition-colors"
        :class="{ 'border-l-4 border-l-primary': enemy.key === currentEnemy }">
        <div class="card-body flex-row items-center gap-3 py-2">
          <img
            :src="enemy.imageUrl"
            :alt="enemy.name"
            class="w-16 h-12 object-cover rounded shrink-0 bg-base-300"
            loading="lazy" />

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-semibold text-sm">{{ enemy.name }}</span>
              <span class="badge badge-sm" :class="typeBadgeClass(enemy.browserType)">
                {{ enemy.browserType }}
              </span>
            </div>
            <!-- The resistances that actually change this character's numbers
            lead: their own element first, then Physical, then the rest. -->
            <div class="flex flex-wrap gap-1 mt-1">
              <span
                v-for="entry in resistChips(enemy)"
                :key="entry.element"
                class="badge badge-xs font-mono"
                :class="entry.highlight ? 'badge-primary' : 'badge-ghost'"
                :data-test-enemy-browser-resist="`${enemy.key}-${entry.element}`">
                {{ entry.element }} {{ entry.value }}%
              </span>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <span
              v-if="enemy.key === currentEnemy"
              class="badge badge-primary badge-sm">
              Selected
            </span>
            <button
              v-else
              type="button"
              class="btn btn-sm btn-primary"
              :data-test-enemy-browser-choose="enemy.key"
              @click="chooseEnemy(enemy)">
              Use
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppChooserModal>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import {
  ENEMY_BROWSER_UI_TYPES,
  RESIST_ELEMENTS,
  allEnemiesList,
  type EnemyBrowserUiType,
  type ListedEnemy,
  type ResistStats,
} from "../enemies/index";
import AppFilterPanel from "./AppFilterPanel.vue";
import AppChooserModal from "./AppChooserModal.vue";

const props = withDefaults(
  defineProps<{ characterElement?: string; currentEnemy?: string | null }>(),
  { characterElement: "", currentEnemy: null },
);

const emit = defineEmits<{ "enemy-browser:chosen-enemy": [key: string] }>();

const modalRef = ref<InstanceType<typeof AppChooserModal> | null>(null);
const filterName = ref("");
const filterType = ref<EnemyBrowserUiType | null>(null);

const TYPE_SORT = {
  Calamity: 0,
  Overlord: 1,
  Elite: 2,
  Common: 3,
} as const;

const activeFilterCount = computed(() => {
  let count = 0;
  if (filterName.value.trim()) count += 1;
  if (filterType.value) count += 1;
  return count;
});

const enemiesFilteredSorted = computed((): ListedEnemy[] => {
  const q = filterName.value.trim().toLowerCase();
  let list = allEnemiesList.slice();
  if (q) {
    list = list.filter((e) => e.name.toLowerCase().includes(q));
  }
  if (filterType.value) {
    list = list.filter((e) => e.browserType === filterType.value);
  }
  list.sort((a, b) => {
    const ta = TYPE_SORT[a.browserType] ?? 99;
    const tb = TYPE_SORT[b.browserType] ?? 99;
    if (ta !== tb) return ta - tb;
    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  });
  return list;
});

function typeBadgeClass(browserType: EnemyBrowserUiType) {
  if (browserType === "Calamity") return "badge-error";
  if (browserType === "Overlord") return "badge-warning";
  if (browserType === "Elite") return "badge-info";
  return "badge-ghost";
}

/**
 * Three chips per row rather than all seven — enough to judge a target at a
 * glance without turning the list into a table. The character's own element
 * is always one of them (and highlighted), since that is the only resistance
 * that changes their damage.
 */
function resistChips(enemy: ListedEnemy) {
  const own = props.characterElement;
  const ordered = [...RESIST_ELEMENTS].sort((a, b) => {
    if (a === own) return -1;
    if (b === own) return 1;
    if (a === "Physical") return -1;
    if (b === "Physical") return 1;
    return 0;
  });
  return ordered.slice(0, 3).map((element) => ({
    element,
    value: enemy.resist?.[element as keyof ResistStats] ?? 10,
    highlight: element === own,
  }));
}

function triggerOpenModal() {
  return modalRef.value?.triggerOpenModal();
}

function triggerCloseModal() {
  modalRef.value?.triggerCloseModal();
}

function resetFilters() {
  filterName.value = "";
  filterType.value = null;
}

function toggleTypeFilter(t: EnemyBrowserUiType) {
  filterType.value = filterType.value === t ? null : t;
}

function chooseEnemy(enemy: ListedEnemy) {
  emit("enemy-browser:chosen-enemy", enemy.key);
  resetFilters();
  triggerCloseModal();
}

defineExpose({ triggerOpenModal, triggerCloseModal });
</script>
