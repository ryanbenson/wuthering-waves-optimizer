<template>
  <div class="bg-base-200 rounded-xl p-4 flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-semibold">Forte Progression</h3>
      <button type="button" class="btn btn-xs" data-test-workspace-forte-max-all @click="maxAll">
        Max All
      </button>
    </div>

    <div
      v-for="track in tracks"
      :key="track.key"
      class="flex flex-col gap-1.5">
      <div class="flex items-center gap-2 text-sm font-medium">
        <span v-html="track.icon" class="size-4 opacity-70 shrink-0"></span>
        <span class="flex-1">{{ track.label }}</span>
        <span class="font-mono text-xs text-primary">{{ track.value }}</span>
      </div>
      <input
        type="range"
        min="1"
        max="10"
        step="1"
        class="range range-xs range-primary"
        :value="track.value"
        :data-test-workspace-forte-slider="track.key"
        @input="update(track.key, ($event.target as HTMLInputElement).value)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useCharacterStore } from "../../stores/character";

interface Props {
  character: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "character-talent-updated": [payload: { type: string; value: string }];
}>();

const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);
const { setCharacterData } = characterStore;

const currentCharacter = computed(
  () => characters.value[props.character] ?? ({} as Record<string, unknown>),
);

const talents = computed(
  () => (currentCharacter.value as { talents?: Record<string, number> }).talents ?? {},
);

const ICONS: Record<string, string> = {
  basic:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M14.5 3.5l6 6-8.2 8.2-6-6 8.2-8.2z" stroke-linejoin="round"/><path d="M9 13l-5.5 5.5M4 21l1.5-3.5L7.5 19 4 21z" stroke-linejoin="round"/></svg>',
  skill:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M12 3v6M12 15v6M3 12h6M15 12h6M5.6 5.6l4.2 4.2M14.2 14.2l4.2 4.2M18.4 5.6l-4.2 4.2M9.8 14.2l-4.2 4.2"/></svg>',
  forte:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 018 8" stroke-width="2.2" stroke-linecap="round"/><circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none"/></svg>',
  liberation:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2l5 10-5 10-5-10 5-10z" stroke-linejoin="round"/></svg>',
  intro:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h13M11 6l6 6-6 6"/><path d="M19 5v14"/></svg>',
};

const TRACK_DEFS: { key: string; label: string }[] = [
  { key: "basic", label: "Basic Attack" },
  { key: "skill", label: "Resonance Skill" },
  { key: "forte", label: "Forte Circuit" },
  { key: "liberation", label: "Resonance Liberation" },
  { key: "intro", label: "Intro Skill" },
];

const tracks = computed(() =>
  TRACK_DEFS.map((def) => ({
    ...def,
    icon: ICONS[def.key],
    value: talents.value[def.key] ?? 10,
  })),
);

function update(type: string, rawValue: string) {
  const value = Number(rawValue);
  void setCharacterData(props.character, { talents: { [type]: value } });
  emit("character-talent-updated", { type, value: rawValue });
}

function maxAll() {
  const updates: Record<string, number> = {};
  for (const def of TRACK_DEFS) {
    updates[def.key] = 10;
  }
  void setCharacterData(props.character, { talents: updates });
  for (const def of TRACK_DEFS) {
    emit("character-talent-updated", { type: def.key, value: "10" });
  }
}
</script>
