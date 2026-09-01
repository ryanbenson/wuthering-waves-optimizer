<template>
  <div class="bg-base-200 rounded-xl p-4 flex flex-col gap-3">
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <h3 class="text-sm font-semibold">Character Buffs</h3>
      <div class="flex gap-2">
        <button type="button" class="btn btn-xs" data-test-workspace-buffs-enable-all @click="enableAll">
          Enable All
        </button>
        <button type="button" class="btn btn-xs" data-test-workspace-buffs-max-all @click="maxAll">
          Max All
        </button>
        <button type="button" class="btn btn-xs" data-test-workspace-buffs-disable-all @click="disableAll">
          Disable All
        </button>
      </div>
    </div>

    <div v-if="statBonusChips.length" class="pt-1 pb-3 border-b border-base-300">
      <div class="text-[.65rem] font-bold uppercase tracking-wider opacity-50 mb-2">
        Stat Bonuses
      </div>
      <div class="flex flex-wrap gap-x-3 gap-y-2">
        <div
          v-for="group in statBonusGroups"
          :key="group.type"
          class="flex items-center gap-1 bg-base-100 border border-base-300 rounded-lg px-1.5 py-1">
          <button
            v-for="chip in group.chips"
            :key="chip.key"
            type="button"
            class="btn btn-xs gap-1.5"
            :class="chip.enabled ? 'btn-primary' : 'btn-ghost opacity-60'"
            v-tooltip="{ content: chip.details, html: true }"
            :data-test-workspace-stat-bonus="chip.key"
            @click="toggleStatBonus(chip.key)">
            <img v-if="chip.icon" :src="chip.icon" class="size-3.5" alt="" />
            {{ chip.label }}
            <span class="font-mono">+{{ chip.formattedValue }}</span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="nonStatBonusBuffs.length" class="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
      <WorkspaceBuffCard
        v-for="buff in nonStatBonusBuffs"
        :key="buff.key"
        :character="character"
        :unique-key="buff.key"
        :name="buff.name"
        :details="buff.details"
        :always-enabled="buff.alwaysEnabled"
        :has-stacks="buff.hasStacks"
        :min-stacks="buff.minStacks"
        :max-stacks="buff.maxStacks"
        :modifiers="buff.modifiers" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { getEffectiveMaxStacks } from "../../characters/effectiveBuffStacks";
import { isStatBonusBuff } from "../../characters/statBonusBuffs";
import { getReadableSubStatLabel, getSubStatIconByType } from "../../echoes/stats";
import { useCharacterStore } from "../../stores/character";
import WorkspaceBuffCard from "./WorkspaceBuffCard.vue";

interface BuffModifier {
  modifier?: string;
  modifierValue?: number;
  modifierValueTalentRef?: string;
}

interface CharacterBuffListItem {
  key: string;
  name: string;
  details: string;
  alwaysEnabled?: boolean;
  hasStacks?: boolean;
  minStacks?: number;
  maxStacks?: number;
  modifiers?: BuffModifier[];
}

interface Props {
  character: string;
  buffs?: CharacterBuffListItem[];
}

const props = withDefaults(defineProps<Props>(), { buffs: () => [] });
const emit = defineEmits<{ "updated-character-buffs": [] }>();

const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);

const currentCharacterBuffs = computed(
  () => (characters.value[props.character] as { buffs?: Record<string, { isEnabled?: boolean }> })
    ?.buffs ?? {},
);

const nonStatBonusBuffs = computed(() => props.buffs.filter((buff) => !isStatBonusBuff(buff.key)));

function isStatBonusEnabled(key: string): boolean {
  return currentCharacterBuffs.value[key]?.isEnabled ?? false;
}

const statBonusChips = computed(() =>
  props.buffs
    .filter((buff) => isStatBonusBuff(buff.key))
    .map((buff) => {
      const modifier = buff.modifiers?.[0];
      const type = modifier?.modifier ?? "";
      const rawValue = modifier?.modifierValue ?? 0;
      return {
        key: buff.key,
        type,
        details: buff.details,
        icon: getSubStatIconByType(type),
        label: getReadableSubStatLabel(type) ?? type,
        formattedValue: `${(rawValue * 100).toFixed(1)}%`,
        enabled: isStatBonusEnabled(buff.key),
      };
    }),
);

const statBonusGroups = computed(() => {
  const groups: { type: string; chips: (typeof statBonusChips.value)[number][] }[] = [];
  const groupsByType = new Map<string, (typeof statBonusChips.value)[number][]>();
  for (const chip of statBonusChips.value) {
    const groupKey = chip.type || chip.label;
    let chips = groupsByType.get(groupKey);
    if (!chips) {
      chips = [];
      groupsByType.set(groupKey, chips);
      groups.push({ type: groupKey, chips });
    }
    chips.push(chip);
  }
  return groups;
});

function toggleStatBonus(key: string) {
  characterStore.setCharacterData(props.character, {
    buffs: { [key]: { isEnabled: !isStatBonusEnabled(key) } },
  });
  emit("updated-character-buffs");
}

function enableAll() {
  const updates: Record<string, { isEnabled: boolean }> = {};
  for (const buff of props.buffs) {
    updates[buff.key] = { isEnabled: true };
  }
  characterStore.setCharacterData(props.character, { buffs: updates });
  emit("updated-character-buffs");
}

function disableAll() {
  const updates: Record<string, { isEnabled: boolean }> = {};
  for (const buff of props.buffs) {
    updates[buff.key] = { isEnabled: false };
  }
  characterStore.setCharacterData(props.character, { buffs: updates });
  emit("updated-character-buffs");
}

function maxAll() {
  const resonanceChains = (characters.value[props.character] as {
    resonanceChains?: Record<string, { isEnabled?: boolean }>;
  })?.resonanceChains ?? {};
  const updates: Record<string, { isEnabled: boolean; stacks?: number }> = {};
  for (const buff of props.buffs) {
    const update: { isEnabled: boolean; stacks?: number } = { isEnabled: true };
    if (buff.hasStacks) {
      update.stacks = getEffectiveMaxStacks(props.character, buff.key, buff.maxStacks, resonanceChains);
    }
    updates[buff.key] = update;
  }
  characterStore.setCharacterData(props.character, { buffs: updates });
  emit("updated-character-buffs");
}

watch(() => props.buffs, () => emit("updated-character-buffs"), { deep: true });
watch(currentCharacterBuffs, () => emit("updated-character-buffs"), { deep: true });
onMounted(() => emit("updated-character-buffs"));
onBeforeUnmount(() => emit("updated-character-buffs"));
</script>
