<template>
  <div class="flex flex-col gap-2 mt-2">
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <div class="flex items-center gap-3 flex-wrap">
        <div
          class="flex items-stretch divide-x divide-base-300 rounded-lg border border-base-300 bg-base-200/60 overflow-hidden">
          <button
            type="button"
            class="btn btn-sm btn-ghost rounded-none gap-1.5"
            title="Jump to Weapons"
            data-test-workspace-weapon-chip
            @click="$emit('change-screen', 'weapon')">
            <span
              class="size-5 rounded overflow-hidden border border-base-300 bg-base-100 flex items-center justify-center shrink-0">
              <img v-if="weaponIcon" :src="weaponIcon" alt="" class="w-full h-full object-cover" />
            </span>
            <span>{{ weaponName }}</span>
            <span v-if="weaponRefinement" class="text-primary font-mono">R{{ weaponRefinement }}</span>
          </button>

          <button
            type="button"
            class="btn btn-sm btn-ghost rounded-none gap-1.5"
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
        </div>
      </div>

      <WorkspaceProgress :character="character" />
    </div>

    <div class="flex items-center gap-1.5">
      <CharacterBuildStatus
        :status="buildStatus"
        :character-key="character"
        interactive
        class="w-fit shrink-0" />
      <span class="opacity-40 text-xs">&middot;</span>
      <button
        v-if="!isEditingNotes"
        type="button"
        class="btn btn-xs btn-ghost gap-1.5 opacity-60 hover:opacity-100 max-w-full"
        data-test-workspace-build-notes-toggle
        @click="startEditingNotes">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-3 shrink-0" aria-hidden="true">
          <path
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4 20.5l4-1 11-11-3-3-11 11-1 4z" />
        </svg>
        <span class="truncate italic">{{ notesDraft || "Add a build note" }}</span>
      </button>
      <textarea
        v-else
        ref="notesInputRef"
        v-model="notesDraft"
        rows="1"
        placeholder="What's this build for? (e.g. off-field support, solo content...)"
        class="textarea textarea-ghost textarea-xs flex-1 min-w-[16rem] italic resize-none"
        data-test-workspace-build-notes
        @change="commitNotes"
        @blur="isEditingNotes = false" />
      <span class="text-xs opacity-50 font-mono whitespace-nowrap shrink-0" data-test-workspace-build-updated>
        Updated {{ updatedLabel }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { useCharacterStore } from "../../stores/character";
import { useTeamSubstatScoreRollup } from "../../composables/useTeamSubstatScoreRollup";
import { getRatingAccentClasses } from "../../composables/useEchoRating";
import { getWeaponByName } from "../../weapons/weapons";
import { getCharacterBuildStatus } from "../../characters/characterBuildStatus";
import CharacterBuildStatus from "../CharacterBuildStatus.vue";
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

const buildStatus = computed(() => getCharacterBuildStatus(props.character, characters.value));

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

const isEditingNotes = ref(false);
const notesInputRef = ref<HTMLTextAreaElement | null>(null);

async function startEditingNotes() {
  isEditingNotes.value = true;
  await nextTick();
  notesInputRef.value?.focus();
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
