<template>
  <div>
    <div class="buffs__header flex flex-wrap items-center justify-between gap-4 mb-4 rounded-lg bg-base-200 p-1 pl-3">
      <h3 class="text-sm font-semibold">Character Buffs</h3>
      <div class="join">
        <button
          type="button"
          class="btn btn-sm join-item"
          data-test-character-buffs-enable-all
          @click="enableAllCharacterBuffs">
          Enable all
        </button>
        <button
          type="button"
          class="btn btn-sm join-item"
          data-test-character-buffs-max-all
          @click="maxAllCharacterBuffs">
          Max all
        </button>
      </div>
    </div>
    <div v-if="buffs" class="character__buffs p-2">
      <div v-if="statBonusGrid" class="stat-bonus-grid mb-4 relative mt-4">
        <div class="label-stylized">Stat Bonuses</div>
        <div
          v-for="(row, rowIndex) in statBonusGrid"
          :key="rowIndex"
          class="stat-bonus-grid__row">
          <button
            v-for="cell in row"
            :key="cell.key"
            type="button"
            class="stat-bonus-grid__cell"
            :class="{
              'stat-bonus-grid__cell--enabled': isStatBonusEnabled(cell.key),
            }"
            v-tooltip="{
              content: cell.details,
              html: true,
            }"
            @click="toggleStatBonus(cell.key)">
            <img v-if="cell.icon" :src="cell.icon" alt="" />
          </button>
        </div>
      </div>
      <CalculatorCharacterBuff
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
        :modifiers="buff.modifiers"
        :energy-regen="energyRegen"
        :crit-rate="critRate"
        @updated-character-buff="handleUpdatedCharacterBuff"
        :talent-data="talentData"></CalculatorCharacterBuff>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { getEffectiveMaxStacks } from "../characters/effectiveBuffStacks";
import { getSubStatIconByType } from "../echoes/stats";
import { useCharacterStore } from "../stores/character";
import CalculatorCharacterBuff from "./CalculatorCharacterBuff.vue";

interface StatBonusModifier {
  modifier?: string;
  modifierValue?: number;
}

interface CharacterBuffListItem {
  key: string;
  name: string;
  details: string;
  alwaysEnabled?: boolean;
  hasStacks?: boolean;
  minStacks?: number;
  maxStacks?: number;
  modifiers?: StatBonusModifier[];
}

interface StatBonusGridCell {
  key: string;
  icon?: string;
  details: string;
}

interface Props {
  character: string;
  buffs?: CharacterBuffListItem[];
  talentData?: Record<string, unknown>;
  energyRegen?: number;
  critRate?: number;
}

const props = withDefaults(defineProps<Props>(), {
  buffs: () => [],
  talentData: () => ({}),
  energyRegen: 0,
  critRate: 0,
});

const emit = defineEmits<{
  "updated-character-buffs": [];
}>();

const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);

const currentCharacterBuffs = computed(
  () => characters.value[props.character]?.buffs ?? {},
);

function isStatBonusBuff(buff: CharacterBuffListItem): boolean {
  return buff.key.startsWith("StatBonus");
}

function getStatBonusGroupKey(key: string): string {
  return key.replace(/^StatBonus/, "").replace(/\d+$/, "");
}

function getStatBonusTier(key: string): number {
  const match = key.match(/(\d+)$/);
  return match ? Number.parseInt(match[1], 10) : 0;
}

const nonStatBonusBuffs = computed(() =>
  props.buffs.filter((buff) => !isStatBonusBuff(buff)),
);

const statBonusGrid = computed((): StatBonusGridCell[][] | null => {
  const statBonuses = props.buffs.filter(isStatBonusBuff);
  if (statBonuses.length === 0) {
    return null;
  }

  const groups = new Map<string, CharacterBuffListItem[]>();
  const groupOrder: string[] = [];

  for (const buff of statBonuses) {
    const groupKey = getStatBonusGroupKey(buff.key);
    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
      groupOrder.push(groupKey);
    }
    groups.get(groupKey)!.push(buff);
  }

  return groupOrder.map((groupKey) => {
    const groupBuffs = groups
      .get(groupKey)!
      .sort((left, right) => getStatBonusTier(left.key) - getStatBonusTier(right.key));
    const modifier = groupBuffs[0]?.modifiers?.[0]?.modifier;
    const icon = modifier ? getSubStatIconByType(modifier) : undefined;

    return groupBuffs.map((buff) => ({
      key: buff.key,
      icon,
      details: buff.details,
    }));
  });
});

function isStatBonusEnabled(key: string): boolean {
  return currentCharacterBuffs.value[key]?.isEnabled ?? false;
}

async function toggleStatBonus(key: string) {
  await characterStore.setCharacterData(props.character, {
    buffs: {
      [key]: { isEnabled: !isStatBonusEnabled(key) },
    },
  });
  handleUpdatedCharacterBuff();
}

function updatedStats() {
  emit("updated-character-buffs");
}

function handleUpdatedCharacterBuff() {
  emit("updated-character-buffs");
}

async function enableAllCharacterBuffs() {
  const buffUpdates: Record<string, { isEnabled: boolean }> = {};

  for (const buff of props.buffs) {
    buffUpdates[buff.key] = { isEnabled: true };
  }

  await characterStore.setCharacterData(props.character, {
    buffs: buffUpdates,
  });
  handleUpdatedCharacterBuff();
}

async function maxAllCharacterBuffs() {
  const resonanceChains =
    characters.value[props.character]?.resonanceChains ?? {};
  const buffUpdates: Record<
    string,
    { isEnabled: boolean; stacks?: number }
  > = {};

  for (const buff of props.buffs) {
    const update: { isEnabled: boolean; stacks?: number } = {
      isEnabled: true,
    };

    if (buff.hasStacks) {
      update.stacks = getEffectiveMaxStacks(
        props.character,
        buff.key,
        buff.maxStacks,
        resonanceChains,
      );
    }

    buffUpdates[buff.key] = update;
  }

  await characterStore.setCharacterData(props.character, {
    buffs: buffUpdates,
  });
  handleUpdatedCharacterBuff();
}

function retriggerBuffCalculations() {
  emit("updated-character-buffs");
}

watch(
  () => props.buffs,
  () => {
    updatedStats();
  },
  { deep: true },
);

watch(
  currentCharacterBuffs,
  () => {
    updatedStats();
  },
  { deep: true },
);

onMounted(() => {
  updatedStats();
});

onBeforeUnmount(() => {
  emit("updated-character-buffs");
});

defineExpose({
  retriggerBuffCalculations,
});
</script>

<style scoped lang="scss">
.character__buff {
  margin-top: 1rem;
  background-color: #161616;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
}
html[data-theme="light"] {
  .character__buff {
    background-color: #f8f8f8;
  }
}

.stat-bonus-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-bonus-grid__row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.stat-bonus-grid__cell {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 6px;
  background-color: #161616;
  border: 1px solid transparent;
  opacity: 0.35;
  cursor: pointer;
  transition:
    opacity 0.15s ease,
    border-color 0.15s ease;

  img {
    width: 1.75rem;
    height: 1.75rem;
    object-fit: contain;
  }

  &--enabled {
    opacity: 1;
    border-color: oklch(var(--p) / 0.4);
  }

  &:hover {
    opacity: 0.75;

    &.stat-bonus-grid__cell--enabled {
      opacity: 1;
    }
  }
}

html[data-theme="light"] {
  .stat-bonus-grid__cell {
    background-color: #f8f8f8;

    img {
      filter: contrast(0);
    }
  }
}
</style>
