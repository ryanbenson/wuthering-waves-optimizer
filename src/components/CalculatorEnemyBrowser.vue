<template>
  <dialog ref="modalElementRef" class="modal">
    <form method="dialog" class="modal-backdrop" @click="handleClose">
      <button>close</button>
    </form>
    <div class="modal-box max-w-5xl">
      <form method="dialog" @click="handleClose">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
      </form>
      <div class="py-4">
        <p
          v-if="!characterElement"
          class="text-sm opacity-80 mb-4"
          data-test-enemy-browser-no-element>
          No character element is set yet. Enemy resistance will default to 10%
          until your character has an element.
        </p>
        <div class="enemies__filters flex flex-wrap items-center gap-2 mb-6">
          <input
            v-model="filterName"
            type="search"
            placeholder="Search by name"
            class="input input-bordered input-sm w-full max-w-xs"
            data-test-enemy-browser-search />
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
          <button type="button" class="btn btn-sm btn-ghost" @click="resetFilters">
            Clear
          </button>
        </div>

        <div class="enemies__list">
          <template v-if="!enemiesFilteredSorted.length">
            <div class="enemies__list--empty py-12 text-center w-full">
              No enemies found
            </div>
          </template>
          <template v-else>
            <div
              class="enemies__list__items grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="enemy in enemiesFilteredSorted"
                :key="enemy.key"
                class="card card-bordered bg-base-200 shadow-sm overflow-hidden flex flex-row">
                <figure class="w-24 shrink-0 bg-base-300 m-0 self-stretch">
                  <img
                    :src="enemy.imageUrl"
                    :alt="enemy.name"
                    class="h-full w-full object-cover min-h-[5.5rem]"
                    loading="lazy" />
                </figure>
                <div class="card-body p-3 gap-2 flex-1 min-w-0">
                  <h3 class="card-title text-base leading-tight line-clamp-2">
                    {{ enemy.name }}
                  </h3>
                  <p class="text-xs opacity-70">{{ enemy.browserType }}</p>
                  <button
                    type="button"
                    class="btn btn-sm btn-primary self-start"
                    :data-test-enemy-browser-choose="enemy.key"
                    @click="chooseEnemy(enemy)">
                    Choose
                  </button>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import {
  ENEMY_BROWSER_UI_TYPES,
  allEnemiesList,
  type EnemyBrowserUiType,
  type ListedEnemy,
} from "../enemies/index";

interface Props {
  characterElement?: string;
}

withDefaults(defineProps<Props>(), {
  characterElement: "",
});

const emit = defineEmits<{
  "enemy-browser:chosen-enemy": [key: string];
}>();

const filterName = ref("");
const filterType = ref<EnemyBrowserUiType | null>(null);

const TYPE_SORT = {
  Calamity: 0,
  Overlord: 1,
  Elite: 2,
  Common: 3,
} as const;

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

const modalElementRef = ref<HTMLDialogElement | null>(null);

function triggerOpenModal() {
  modalElementRef.value?.showModal();
}

function triggerCloseModal() {
  modalElementRef.value?.close();
}

function resetFilters() {
  filterName.value = "";
  filterType.value = null;
}

function handleClose() {
  resetFilters();
}

function toggleTypeFilter(t: EnemyBrowserUiType) {
  filterType.value = filterType.value === t ? null : t;
}

function chooseEnemy(enemy: ListedEnemy) {
  emit("enemy-browser:chosen-enemy", enemy.key);
  handleClose();
  triggerCloseModal();
}

defineExpose({
  triggerOpenModal,
  triggerCloseModal,
});
</script>

<style lang="scss" scoped>
html[data-theme="light"] {
  .modal-backdrop {
    opacity: 0.5;
  }
}
</style>
