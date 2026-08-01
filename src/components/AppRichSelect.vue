<template>
  <div
    class="app-rich-select dropdown w-full"
    :class="[
      attrs.class,
      {
        'app-rich-select--ghost': variant === 'ghost',
        'app-rich-select--bordered': variant === 'bordered',
      },
    ]"
    :style="attrs.style as string | Record<string, string> | undefined">
    <div
      ref="triggerRef"
      tabindex="0"
      role="button"
      class="app-rich-select__trigger flex items-center justify-between gap-2 w-full text-left"
      :class="triggerClass"
      :aria-label="ariaLabel"
      :aria-disabled="disabled || undefined"
      :data-test="dataTest"
      v-bind="triggerAttrs"
      @keydown.down.prevent="focusSearchOrFirstOption"
      @keydown.escape.prevent="close">
      <span class="app-rich-select__selected flex items-center gap-1.5 min-w-0 flex-1">
        <slot name="selected" :option="selectedOption">
          <img
            v-if="selectedOption?.image"
            :src="selectedOption.image"
            alt=""
            class="app-rich-select__thumb size-5 rounded-full object-cover shrink-0 bg-base-300" />
          <span class="truncate">{{ selectedLabel }}</span>
        </slot>
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 2048 2048"
        class="size-2.5 shrink-0 opacity-60 fill-current"
        aria-hidden="true">
        <path
          d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z" />
      </svg>
    </div>

    <div
      tabindex="0"
      class="dropdown-content app-rich-select__menu z-50 mt-1 w-full p-1 shadow bg-base-200 text-base-content"
      @keydown.escape.prevent="close">
      <div v-if="searchable" class="p-1 pb-1.5 sticky top-0 z-10 bg-base-200">
        <input
          ref="searchInputRef"
          v-model="searchQuery"
          type="search"
          class="input input-bordered input-xs w-full"
          :placeholder="searchPlaceholder"
          data-test-rich-select-search
          @click.stop
          @keydown.escape.prevent="close" />
      </div>

      <ul
        class="menu menu-xs text-xs p-0 max-h-64 overflow-y-auto flex-col flex-nowrap w-full">
        <template v-if="!visibleGroups.length">
          <li class="disabled w-full">
            <span class="opacity-60 py-2 px-2">No results</span>
          </li>
        </template>
        <template v-else>
          <template
            v-for="group in visibleGroups"
            :key="group.id">
            <li
              v-if="group.label"
              class="app-rich-select__group-label menu-title w-full px-2 py-1">
              <span class="text-[0.65rem] uppercase tracking-wide opacity-60">
                {{ group.label }}
              </span>
            </li>
            <li
              v-for="option in group.options"
              :key="String(option.value)"
              class="w-full">
              <button
                type="button"
                class="app-rich-select__option flex w-full items-center gap-1.5 text-xs min-h-0 h-auto py-1.5 px-2"
                :class="{
                  active: isSelected(option.value),
                  'opacity-40 pointer-events-none': option.disabled,
                }"
                :disabled="option.disabled"
                :data-test-rich-select-option="String(option.value)"
                @click="selectOption(option)">
                <slot name="option" :option="option" :selected="isSelected(option.value)">
                  <img
                    v-if="option.image"
                    :src="option.image"
                    alt=""
                    class="app-rich-select__thumb size-5 rounded-full object-cover shrink-0 bg-base-300" />
                  <span class="truncate">{{ option.label }}</span>
                </slot>
              </button>
            </li>
          </template>
        </template>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, useAttrs, watch } from "vue";

export type AppRichSelectValue = string | number | null;

export type AppRichSelectOption = {
  value: AppRichSelectValue;
  label: string;
  image?: string | null;
  group?: string;
  disabled?: boolean;
  [key: string]: unknown;
};

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    modelValue: AppRichSelectValue;
    options: AppRichSelectOption[];
    searchable?: boolean;
    searchPlaceholder?: string;
    allowEmpty?: boolean;
    emptyLabel?: string;
    placeholder?: string;
    disabled?: boolean;
    variant?: "bordered" | "ghost";
    size?: "sm" | "xs";
    ariaLabel?: string;
    dataTest?: string;
  }>(),
  {
    searchable: false,
    searchPlaceholder: "Type to find…",
    allowEmpty: false,
    emptyLabel: "None",
    placeholder: "Select…",
    disabled: false,
    variant: "bordered",
    size: "sm",
    ariaLabel: undefined,
    dataTest: undefined,
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: AppRichSelectValue];
}>();

const attrs = useAttrs();
const triggerAttrs = computed(() => {
  const next: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(attrs)) {
    if (key === "class" || key === "style") {
      continue;
    }
    next[key] = value;
  }
  return next;
});

const searchQuery = ref("");
const triggerRef = ref<HTMLElement | null>(null);
const searchInputRef = ref<HTMLInputElement | null>(null);

const allOptions = computed((): AppRichSelectOption[] => {
  const options = [...props.options];
  if (props.allowEmpty) {
    options.unshift({
      value: null,
      label: props.emptyLabel,
    });
  }
  return options;
});

const selectedOption = computed(() =>
  allOptions.value.find((option) => option.value === props.modelValue) ?? null,
);

const selectedLabel = computed(() => {
  if (selectedOption.value) {
    return selectedOption.value.label;
  }
  return props.placeholder;
});

const triggerClass = computed(() => {
  if (props.variant === "ghost") {
    return [
      "app-rich-select__trigger--ghost",
      "text-xs",
      props.size === "xs" ? "py-0.5 px-1" : "py-1 px-2",
    ];
  }
  return [
    "select",
    "select-bordered",
    props.size === "xs" ? "select-xs" : "select-sm",
    "items-center",
    "h-auto",
    "min-h-8",
  ];
});

const filteredOptions = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) {
    return allOptions.value;
  }
  return allOptions.value.filter((option) =>
    option.label.toLowerCase().includes(query),
  );
});

type OptionGroup = {
  id: string;
  label: string | null;
  options: AppRichSelectOption[];
};

const visibleGroups = computed((): OptionGroup[] => {
  const groups: OptionGroup[] = [];
  const indexByLabel = new Map<string, number>();

  for (const option of filteredOptions.value) {
    const label = option.group ?? null;
    const key = label ?? "__ungrouped__";
    const existingIndex = indexByLabel.get(key);
    if (existingIndex == null) {
      indexByLabel.set(key, groups.length);
      groups.push({
        id: key,
        label,
        options: [option],
      });
      continue;
    }
    groups[existingIndex].options.push(option);
  }

  return groups;
});

watch(
  () => props.modelValue,
  () => {
    searchQuery.value = "";
  },
);

function isSelected(value: AppRichSelectValue) {
  return value === props.modelValue;
}

function selectOption(option: AppRichSelectOption) {
  if (option.disabled || props.disabled) {
    return;
  }
  emit("update:modelValue", option.value);
  searchQuery.value = "";
  close();
}

function close() {
  (document.activeElement as HTMLElement | null)?.blur();
  triggerRef.value?.blur();
}

async function focusSearchOrFirstOption() {
  if (!props.searchable) {
    return;
  }
  await nextTick();
  searchInputRef.value?.focus();
}
</script>

<style lang="scss" scoped>
.app-rich-select {
  --app-rich-select-radius: var(--rounded-btn, 0.5rem);
  // Percentage widths collapse inside content-sized flex/grid parents, so the
  // trigger needs an intrinsic width to size those containers.
  --app-rich-select-min-width: 12rem;
  position: relative;
  max-width: 100%;

  &:focus-within {
    z-index: 50;
  }

  :deep(.dropdown-content) {
    left: 0;
    right: auto;
    width: 100%;
  }
}

.app-rich-select__menu {
  border-radius: var(--app-rich-select-radius);
  overflow: hidden;
}

.app-rich-select__option {
  border-radius: var(--app-rich-select-radius);
}

.app-rich-select__trigger--ghost {
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: var(--app-rich-select-radius);
  background: transparent;
  color: inherit;
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease;

  &:hover,
  &:focus-visible {
    border-color: currentColor;
    opacity: 1;
    outline: none;
  }
}

.app-rich-select--bordered {
  min-width: var(--app-rich-select-min-width);
}

.app-rich-select--bordered .app-rich-select__trigger.select {
  display: flex;
  cursor: pointer;
}

html[data-density="compact"] {
  .app-rich-select--ghost {
    min-width: 9.5rem;

    :deep(.dropdown-content) {
      width: max-content;
      min-width: 9.5rem;
    }
  }

  .app-rich-select__trigger--ghost {
    gap: 0.5rem;
    padding: 0.25rem 0.5rem;
  }

  .app-rich-select__option {
    gap: 0.5rem;
    padding: 0.375rem 0.625rem;
  }
}
</style>
