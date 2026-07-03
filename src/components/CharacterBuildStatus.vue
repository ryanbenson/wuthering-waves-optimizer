<template>
  <div
    v-if="!interactive"
    class="character-build-status flex items-center gap-1.5 text-xs opacity-80 justify-center"
    :data-test-character-build-status="status">
    <span
      class="character-build-status__dot size-2 rounded-full shrink-0"
      :class="dotClass"></span>
    <span>{{ label }}</span>
  </div>

  <div
    v-else
    class="dropdown character-build-status-dropdown w-full">
    <div
      tabindex="0"
      role="button"
      class="character-build-status character-build-status--interactive flex items-center justify-between gap-1 text-xs w-full"
      data-test-build-status-toggle>
      <span class="flex items-center gap-1 min-w-0">
        <span
          class="character-build-status__dot size-2 rounded-full shrink-0"
          :class="dotClass"></span>
        <span class="whitespace-nowrap">{{ label }}</span>
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
    <ul
      tabindex="0"
      class="dropdown-content character-build-status__menu menu menu-xs text-xs bg-base-200 text-base-content z-50 w-full p-1 shadow mt-1">
      <li v-for="option in statusOptions" :key="option.value">
        <button
          type="button"
          class="character-build-status__menu-item flex items-center gap-1.5 text-xs min-h-0 h-auto py-1.5 px-2"
          :class="{ active: status === option.value }"
          :data-test-build-status-option="option.value"
          @click="selectStatus(option.value)">
          <span
            class="character-build-status__dot size-2 rounded-full shrink-0"
            :class="option.dotClass"></span>
          <span>{{ option.label }}</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  CHARACTER_BUILD_STATUSES,
  getCharacterBuildStatusDotClass,
  getCharacterBuildStatusLabel,
  type CharacterBuildStatus,
} from "../characters/characterBuildStatus";
import { useCharacterStore } from "../stores/character";

interface Props {
  status: CharacterBuildStatus;
  interactive?: boolean;
  characterKey?: string;
}

const props = withDefaults(defineProps<Props>(), {
  interactive: false,
  characterKey: "",
});

const characterStore = useCharacterStore();

const label = computed(() => getCharacterBuildStatusLabel(props.status));

const dotClass = computed(() => getCharacterBuildStatusDotClass(props.status));

const statusOptions = computed(() =>
  CHARACTER_BUILD_STATUSES.map((value) => ({
    value,
    label: getCharacterBuildStatusLabel(value),
    dotClass: getCharacterBuildStatusDotClass(value),
  })),
);

function selectStatus(nextStatus: CharacterBuildStatus) {
  if (!props.characterKey) {
    return;
  }

  characterStore.setCharacterBuildStatus(props.characterKey, nextStatus);
  (document.activeElement as HTMLElement | null)?.blur();
}
</script>

<style lang="scss" scoped>
.character-build-status-dropdown {
  --build-status-radius: var(--rounded-btn, 0.5rem);
  position: relative;

  &:focus-within {
    z-index: 50;
  }

  :deep(.dropdown-content) {
    left: 0;
    right: auto;
    width: 100%;
  }
}

.character-build-status__menu {
  border-radius: var(--build-status-radius);
  overflow: hidden;
}

.character-build-status__menu-item {
  border-radius: var(--build-status-radius);
}

.character-build-status--interactive {
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: var(--build-status-radius);
  padding: 0.125rem 0.25rem;
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
</style>
