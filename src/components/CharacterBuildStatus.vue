<template>
  <component
    :is="interactive ? 'button' : 'div'"
    :type="interactive ? 'button' : undefined"
    class="character-build-status flex items-center gap-1.5 text-xs opacity-80 justify-center"
    :class="{
      'character-build-status--interactive': interactive,
    }"
    :data-test-character-build-status="status"
    :data-test-build-complete-toggle="interactive ? '' : undefined"
    @click="handleClick">
    <span class="character-build-status__default flex items-center gap-1.5">
      <span
        class="character-build-status__dot size-2 rounded-full shrink-0"
        :class="dotClass"></span>
      <span>{{ label }}</span>
    </span>
    <span
      v-if="interactive"
      class="character-build-status__hover hidden items-center gap-1.5">
      {{ actionLabel }}
    </span>
  </component>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { CharacterBuildStatus } from "../characters/characterBuildStatus";
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

const label = computed(() => {
  switch (props.status) {
    case "finished":
      return "Finished";
    case "in-progress":
      return "In progress";
    default:
      return "Not started";
  }
});

const actionLabel = computed(() =>
  props.status === "finished" ? "In progress?" : "Complete?",
);

const dotClass = computed(() => {
  switch (props.status) {
    case "finished":
      return "bg-amber-400";
    case "in-progress":
      return "bg-green-500";
    default:
      return "bg-gray-400";
  }
});

function handleClick() {
  if (!props.interactive || !props.characterKey) {
    return;
  }

  void characterStore.setCharacterData(props.characterKey, {
    buildComplete: props.status !== "finished",
  });
}
</script>

<style lang="scss" scoped>
.character-build-status--interactive {
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: var(--rounded-btn, 0.5rem);
  padding: 0.25rem 0.5rem;
  background: transparent;
  color: inherit;
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease;

  &:hover {
    border-color: currentColor;
    opacity: 1;

    .character-build-status__default {
      display: none;
    }

    .character-build-status__hover {
      display: flex;
    }
  }
}
</style>
