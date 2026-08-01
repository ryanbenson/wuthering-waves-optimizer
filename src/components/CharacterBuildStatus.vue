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

  <AppRichSelect
    v-else
    class="character-build-status-dropdown"
    :model-value="status"
    :options="statusOptions"
    variant="ghost"
    data-test-build-status-toggle
    aria-label="Character build status"
    @update:model-value="selectStatus">
    <template #selected="{ option }">
      <span class="flex items-center gap-1 min-w-0">
        <span
          class="character-build-status__dot size-2 rounded-full shrink-0"
          :class="String(option?.dotClass ?? '')"></span>
        <span class="whitespace-nowrap">{{ option?.label }}</span>
      </span>
    </template>
    <template #option="{ option }">
      <span
        class="character-build-status__dot size-2 rounded-full shrink-0"
        :class="String(option.dotClass ?? '')"></span>
      <span>{{ option.label }}</span>
    </template>
  </AppRichSelect>
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
import AppRichSelect, {
  type AppRichSelectOption,
  type AppRichSelectValue,
} from "./AppRichSelect.vue";

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

const statusOptions = computed((): AppRichSelectOption[] =>
  CHARACTER_BUILD_STATUSES.map((value) => ({
    value,
    label: getCharacterBuildStatusLabel(value),
    dotClass: getCharacterBuildStatusDotClass(value),
  })),
);

function selectStatus(nextStatus: AppRichSelectValue) {
  if (!props.characterKey || typeof nextStatus !== "string") {
    return;
  }

  characterStore.setCharacterBuildStatus(
    props.characterKey,
    nextStatus as CharacterBuildStatus,
  );
}
</script>
