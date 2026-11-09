<template>
  <span
    v-if="equippedBy.others.length"
    class="inline-flex items-center gap-1 min-w-0 max-w-full text-xs font-semibold text-warning"
    :data-test-optimizer-result-echo-equipped-others="echoId"
    v-tooltip="tooltip">
    <span class="flex shrink-0 -space-x-1.5">
      <img
        v-for="character in shownAvatars"
        :key="character"
        :src="characterPortraitUrl(character)"
        :alt="getCharacterRosterDisplayName(character)"
        class="size-5 rounded-full bg-accent-content ring-1 ring-base-100 object-cover" />
    </span>
    <span class="truncate">{{ label }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useEchoEquippedBy } from "../composables/useEchoEquippedBy";
import {
  characterPortraitUrl,
  getCharacterRosterDisplayName,
} from "../characters/characters";

const MAX_AVATARS = 3;

const props = defineProps<{
  echoId: string | null | undefined;
}>();

const equippedBy = useEchoEquippedBy(() => props.echoId);

const otherNames = computed(() =>
  equippedBy.value.others.map(getCharacterRosterDisplayName),
);

const shownAvatars = computed(() =>
  equippedBy.value.others.slice(0, MAX_AVATARS),
);

const label = computed(() => {
  const [first, ...rest] = otherNames.value;
  return rest.length ? `Also on ${first} +${rest.length}` : `Also on ${first}`;
});

function joinNames(names: string[]) {
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

const tooltip = computed(
  () =>
    `Also equipped on ${joinNames(otherNames.value)}. Equipping this loadout keeps it on them too.`,
);
</script>
