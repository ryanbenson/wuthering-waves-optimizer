<template>
  <dialog ref="modalElementRef" class="modal">
    <form method="dialog" class="modal-backdrop" @click="handleClose">
      <button>close</button>
    </form>
    <div v-if="isOpen" class="modal-box max-w-2xl">
      <form method="dialog" @click="handleClose">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
      </form>
      <div class="py-4">
        <h3 class="font-bold text-lg mb-4 pr-8">{{ title }}</h3>
        <div class="flex flex-wrap items-center gap-2 mb-4">
          <input
            ref="searchInputRef"
            v-model="filterQuery"
            type="search"
            :placeholder="searchPlaceholder"
            class="input input-bordered input-sm w-full max-w-md"
            data-test-picker-search />
          <button
            v-if="filterQuery"
            type="button"
            class="btn btn-sm btn-ghost"
            @click="filterQuery = ''">
            Clear
          </button>
        </div>

        <div
          ref="listContainerRef"
          class="picker__list max-h-[60vh] overflow-y-auto">
          <template v-if="!filteredGroups.length">
            <div class="py-12 text-center opacity-70">No results found</div>
          </template>
          <template v-else>
            <div
              v-for="group in filteredGroups"
              :key="group.id"
              class="picker__group mb-4">
              <div
                class="picker__group-label sticky top-0 z-10 bg-base-100 py-1 text-sm font-semibold opacity-80 border-b border-base-300 mb-1">
                {{ group.label }}
              </div>
              <ul class="menu p-0 gap-0.5">
                <li v-for="item in group.items" :key="item.key">
                  <button
                    type="button"
                    class="picker__item justify-between rounded-md"
                    :class="{
                      'picker__item--selected bg-primary text-primary-content':
                        item.key === selectedKey,
                      'opacity-40 pointer-events-none': item.disabled,
                    }"
                    :disabled="item.disabled"
                    :data-test-picker-choose="item.key"
                    @click="chooseItem(item.key, group.id)">
                    <span>{{ item.label }}</span>
                    <span
                      v-if="item.key === selectedKey"
                      class="text-xs opacity-80"
                      aria-hidden="true">
                      ✓
                    </span>
                  </button>
                </li>
              </ul>
            </div>
          </template>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from "vue";

export type PickerItem = {
  key: string;
  label: string;
  disabled?: boolean;
  searchText?: string;
};

export type PickerGroup = {
  id: string;
  label: string;
  items: PickerItem[];
};

const props = withDefaults(
  defineProps<{
    title: string;
    groups: PickerGroup[];
    selectedKey?: string | null;
    searchPlaceholder?: string;
  }>(),
  {
    selectedKey: null,
    searchPlaceholder: "Search…",
  },
);

const emit = defineEmits<{
  chosen: [payload: { key: string; groupId: string }];
}>();

const filterQuery = ref("");
const isOpen = ref(false);
const modalElementRef = ref<HTMLDialogElement | null>(null);
const searchInputRef = ref<HTMLInputElement | null>(null);
const listContainerRef = ref<HTMLElement | null>(null);

function spacedCamelCase(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/(\d+)/g, " $1 ")
    .replace(/\s+/g, " ")
    .trim();
}

function itemHaystack(item: PickerItem, groupLabel: string): string {
  const parts = [
    item.label,
    item.key,
    groupLabel,
    item.searchText ?? "",
    spacedCamelCase(item.key),
  ];
  return parts.join(" ").toLowerCase();
}

function matchesLoose(haystack: string, query: string): boolean {
  const tokens = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  if (!tokens.length) {
    return true;
  }
  return tokens.every((token) => haystack.includes(token));
}

const filteredGroups = computed((): PickerGroup[] => {
  const q = filterQuery.value;
  return props.groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        matchesLoose(itemHaystack(item, group.label), q),
      ),
    }))
    .filter((group) => group.items.length > 0);
});

function scrollSelectedIntoView() {
  const key = props.selectedKey;
  if (!key || !listContainerRef.value) {
    return;
  }
  const el = listContainerRef.value.querySelector(
    `[data-test-picker-choose="${CSS.escape(key)}"]`,
  );
  if (el instanceof HTMLElement) {
    el.scrollIntoView({ block: "nearest" });
  }
}

async function triggerOpenModal() {
  filterQuery.value = "";
  isOpen.value = true;
  await nextTick();
  modalElementRef.value?.showModal();
  await nextTick();
  searchInputRef.value?.focus();
  scrollSelectedIntoView();
}

function triggerCloseModal() {
  modalElementRef.value?.close();
  isOpen.value = false;
}

function handleClose() {
  filterQuery.value = "";
  triggerCloseModal();
}

function chooseItem(key: string, groupId: string) {
  emit("chosen", { key, groupId });
  handleClose();
}

defineExpose({
  triggerOpenModal,
  triggerCloseModal,
});
</script>

<style lang="scss" scoped>
.picker__item {
  min-height: 2.25rem;
}

html[data-theme="light"] {
  .modal-backdrop {
    opacity: 0.5;
  }
}
</style>
