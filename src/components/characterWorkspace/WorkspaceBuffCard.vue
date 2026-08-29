<template>
  <article
    class="rounded-lg border border-base-300 bg-base-100 p-3 cursor-pointer transition-opacity"
    :class="{ 'opacity-50': !isEnabled }"
    :data-test-workspace-buff-card="uniqueKey"
    @click="toggleEnabled">
    <div class="flex items-start gap-2.5">
      <div class="min-w-0 flex-1">
        <h4 class="text-sm font-semibold leading-tight">{{ displayName }}</h4>
        <span
          v-if="scalesWithLabel"
          class="inline-block mt-1 text-[.62rem] font-bold uppercase tracking-wide text-primary bg-primary/10 rounded px-1.5 py-0.5">
          Scales with {{ scalesWithLabel }}
        </span>
      </div>
      <input
        type="checkbox"
        class="toggle toggle-primary toggle-sm shrink-0"
        :checked="isEnabled"
        :disabled="alwaysEnabled"
        @click.stop
        @change="isEnabled = ($event.target as HTMLInputElement).checked" />
    </div>
    <div class="text-xs opacity-70 mt-2 leading-relaxed" v-html="details"></div>
    <div
      v-if="hasStacks && effectiveMaxStacks > 0 && !alwaysEnabled"
      class="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-base-300"
      @click.stop>
      <span class="text-[.65rem] font-bold uppercase tracking-wide opacity-60">Stacks</span>
      <input
        v-model.number="stacks"
        type="range"
        :min="minStacks"
        :max="effectiveMaxStacks"
        class="range range-xs range-primary flex-1"
        @input="ensureMaxStacks" />
      <span class="font-mono text-xs text-primary shrink-0">{{ stacks }} / {{ effectiveMaxStacks }}</span>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { getCharacterRosterDisplayName } from "../../characters/characters";
import { getEffectiveMaxStacks } from "../../characters/effectiveBuffStacks";
import { useCharacterStore } from "../../stores/character";

interface BuffModifier {
  modifierValueTalentRef?: string;
}

interface Props {
  character: string;
  uniqueKey: string;
  name?: string;
  details?: string;
  alwaysEnabled?: boolean;
  hasStacks?: boolean;
  minStacks?: number;
  maxStacks?: number;
  modifiers?: BuffModifier[];
}

const props = withDefaults(defineProps<Props>(), {
  alwaysEnabled: false,
  hasStacks: false,
  minStacks: 0,
  maxStacks: 0,
  modifiers: () => [],
});

const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);

const TALENT_LABELS: Record<string, string> = {
  basic: "Basic Attack",
  skill: "Resonance Skill",
  forte: "Forte Circuit",
  liberation: "Resonance Liberation",
  intro: "Intro Skill",
};

const displayName = computed(() => getCharacterRosterDisplayName(props.name ?? ""));

const scalesWithLabel = computed(() => {
  const ref = props.modifiers.find((m) => m.modifierValueTalentRef)?.modifierValueTalentRef;
  return ref ? (TALENT_LABELS[ref] ?? null) : null;
});

const currentCharacter = computed(
  () =>
    (characters.value[props.character] ?? {}) as {
      buffs?: Record<string, { isEnabled?: boolean; stacks?: number }>;
      resonanceChains?: Record<string, { isEnabled?: boolean }>;
    },
);

const isEnabled = computed({
  get: (): boolean => currentCharacter.value.buffs?.[props.uniqueKey]?.isEnabled ?? false,
  set: (value: boolean) => {
    characterStore.setCharacterData(props.character, {
      buffs: { [props.uniqueKey]: { isEnabled: value } },
    });
  },
});

const stacks = computed({
  get: (): number => currentCharacter.value.buffs?.[props.uniqueKey]?.stacks ?? 0,
  set: (value: number) => {
    characterStore.setCharacterData(props.character, {
      buffs: { [props.uniqueKey]: { stacks: value } },
    });
  },
});

const effectiveMaxStacks = computed(() =>
  getEffectiveMaxStacks(
    props.character,
    props.uniqueKey,
    props.maxStacks,
    currentCharacter.value.resonanceChains,
  ),
);

function ensureMaxStacks() {
  if (stacks.value > effectiveMaxStacks.value) {
    stacks.value = effectiveMaxStacks.value;
  }
}

function toggleEnabled() {
  if (props.alwaysEnabled) {
    return;
  }
  isEnabled.value = !isEnabled.value;
}
</script>
