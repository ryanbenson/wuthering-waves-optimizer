<template>
  <div class="flex flex-col gap-2 mt-2">
    <div class="flex items-center justify-between gap-4 flex-wrap">
      <textarea
        v-model="notesDraft"
        rows="1"
        placeholder="What's this build for? (e.g. off-field support, solo content...)"
        class="textarea textarea-ghost textarea-sm flex-1 min-w-[16rem] italic resize-none"
        data-test-workspace-build-notes
        @change="commitNotes" />
      <span class="text-xs opacity-50 font-mono whitespace-nowrap" data-test-workspace-build-updated>
        Updated {{ updatedLabel }}
      </span>
    </div>

    <div class="flex items-center justify-between gap-3 flex-wrap">
      <div class="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          class="btn btn-xs btn-ghost gap-1.5"
          title="Jump to Weapons"
          data-test-workspace-weapon-chip
          @click="$emit('change-screen', 'weapon')">
          <span
            class="size-5 rounded overflow-hidden border border-base-300 bg-base-200 flex items-center justify-center shrink-0">
            <img v-if="weaponIcon" :src="weaponIcon" alt="" class="w-full h-full object-cover" />
          </span>
          <span>{{ weaponName }}</span>
          <span v-if="weaponRefinement" class="text-primary font-mono">R{{ weaponRefinement }}</span>
        </button>

        <button
          type="button"
          class="btn btn-xs btn-ghost gap-1.5"
          title="Jump to Echoes"
          data-test-workspace-score-chip
          @click="$emit('change-screen', 'echoes')">
          Build Score
          <template v-if="scoreRollup">
            <span class="font-mono font-bold" :class="scoreAccent?.text">{{ scoreRollup.grade }}</span>
            <span class="font-mono" :class="scoreAccent?.text">
              {{ Math.round(scoreRollup.percent) }}%{{ scoreRollup.provisional ? "*" : "" }}
            </span>
          </template>
          <span v-else class="opacity-50 font-mono">—</span>
        </button>

        <button
          type="button"
          class="btn btn-xs btn-ghost gap-1.5"
          data-test-workspace-echoes-link
          @click="$emit('change-screen', 'echoes')">
          View Echoes →
        </button>
      </div>

      <WorkspaceProgress :character="character" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { useCharacterStore } from "../../stores/character";
import { useTeamSubstatScoreRollup } from "../../composables/useTeamSubstatScoreRollup";
import { getRatingAccentClasses } from "../../composables/useEchoRating";
import { getWeaponByName } from "../../weapons/weapons";
import WorkspaceProgress from "./WorkspaceProgress.vue";

interface Props {
  character: string;
  weaponType?: string;
}

const props = withDefaults(defineProps<Props>(), { weaponType: "" });
defineEmits<{
  "change-screen": [screen: string];
}>();

const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);

const currentCharacter = computed(
  () => (characters.value[props.character] ?? {}) as Record<string, unknown>,
);

const activeBuild = computed(() => characterStore.getActiveBuild(props.character));

const updatedLabel = computed(() => {
  const updatedAt = activeBuild.value?.updatedAt;
  if (!updatedAt) {
    return "just now";
  }
  const diffMs = Date.now() - Number(updatedAt);
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
});

const notesDraft = ref((currentCharacter.value.notes as string | undefined) ?? "");
watch(
  () => currentCharacter.value.notes,
  (next) => {
    notesDraft.value = (next as string | undefined) ?? "";
  },
);

function commitNotes() {
  characterStore.setCharacterData(props.character, { notes: notesDraft.value });
}

const weaponKey = computed(
  () => (currentCharacter.value as { weapon?: string | null }).weapon ?? null,
);

const weaponName = computed(() => weaponKey.value ?? "No weapon assigned");

const weaponRefinement = computed(() => {
  if (!weaponKey.value) return null;
  const weapons = (currentCharacter.value as {
    weapons?: Record<string, { refinement?: string }>;
  }).weapons;
  return weapons?.[weaponKey.value]?.refinement ?? "1";
});

const weaponIcon = ref<string | null>(null);
watchEffect(async () => {
  const key = weaponKey.value;
  const type = props.weaponType;
  if (!key || !type) {
    weaponIcon.value = null;
    return;
  }
  try {
    const found = await getWeaponByName(type, key);
    weaponIcon.value = found?.info?.image ?? null;
  } catch {
    weaponIcon.value = null;
  }
});

const { rollup: scoreRollup } = useTeamSubstatScoreRollup(() => props.character);
const scoreAccent = computed(() =>
  scoreRollup.value ? getRatingAccentClasses(scoreRollup.value.color) : null,
);
</script>
