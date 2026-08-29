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
        <span
          v-tooltip="track.description ? { content: track.description, html: true } : undefined"
          class="size-5 rounded overflow-hidden shrink-0 flex items-center justify-center"
          :class="{ 'cursor-help': track.description }">
          <img v-if="track.icon" :src="track.icon" alt="" class="w-full h-full object-contain" />
          <span v-else v-html="FALLBACK_ICON"></span>
        </span>
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

interface AttackInfo {
  icon?: string;
  description?: string;
}

interface Props {
  character: string;
  attackInfo?: {
    basic?: AttackInfo;
    skill?: AttackInfo;
    forte?: AttackInfo;
    liberation?: AttackInfo;
    intro?: AttackInfo;
  };
}

const props = withDefaults(defineProps<Props>(), { attackInfo: () => ({}) });
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

// Shown only if a character's attack data is missing an icon — shouldn't
// normally happen, just a defensive fallback so the row never looks broken.
const FALLBACK_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="opacity-50"><circle cx="12" cy="12" r="8"/></svg>';

const TRACK_DEFS: { key: "basic" | "skill" | "forte" | "liberation" | "intro"; label: string }[] = [
  { key: "basic", label: "Basic Attack" },
  { key: "skill", label: "Resonance Skill" },
  { key: "forte", label: "Forte Circuit" },
  { key: "liberation", label: "Resonance Liberation" },
  { key: "intro", label: "Intro Skill" },
];

const tracks = computed(() =>
  TRACK_DEFS.map((def) => ({
    ...def,
    icon: props.attackInfo[def.key]?.icon,
    description: props.attackInfo[def.key]?.description,
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
