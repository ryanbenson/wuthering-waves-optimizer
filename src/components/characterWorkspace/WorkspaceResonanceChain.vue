<template>
  <div v-if="groups.length" class="bg-base-200 rounded-xl p-4 flex flex-col gap-3">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-semibold">Resonance Chain</h3>
      <div class="flex gap-2">
        <button type="button" class="btn btn-xs" data-test-workspace-rc-enable-all @click="enableAll">
          Enable All
        </button>
        <button type="button" class="btn btn-xs" data-test-workspace-rc-max-all @click="maxAll">
          Max All
        </button>
      </div>
    </div>

    <div class="workspace-rc-track flex items-start justify-between px-1 pt-2">
      <div class="workspace-rc-track__line"></div>
      <button
        v-for="group in groups"
        :key="group.level"
        type="button"
        class="workspace-rc-node"
        :class="currentLevel >= group.level ? 'workspace-rc-node--on' : 'workspace-rc-node--off'"
        :title="`Sequence ${group.level}`"
        :data-test-workspace-rc-node="group.level"
        @click="setLevel(group.level)">
        <img v-if="group.icon" :src="group.icon" alt="" class="workspace-rc-node__icon" />
        <span v-else class="font-mono">S{{ group.level }}</span>
      </button>
    </div>

    <div class="flex flex-col gap-2 mt-1">
      <div
        v-for="group in groups"
        :key="`group-${group.level}`"
        class="flex flex-col gap-2 rounded-lg border border-base-300 bg-base-100 p-3"
        :class="{ 'opacity-45': !isGroupEnabled(group) }">
        <div
          v-for="buff in group.buffs"
          :key="buff.key"
          :class="{ 'pt-2 border-t border-base-300': group.buffs.indexOf(buff) > 0 }">
          <div class="flex items-start gap-2.5">
            <div
              class="size-6 rounded flex items-center justify-center font-mono text-[.65rem] font-bold shrink-0 overflow-hidden"
              :class="isEnabled(buff.key) ? 'bg-primary/15 text-primary' : 'bg-base-200 opacity-60'">
              <img v-if="buff.icon" :src="buff.icon" alt="" class="w-full h-full object-cover" />
              <template v-else>S{{ group.level }}</template>
            </div>
            <div class="min-w-0 flex-1">
              <h4 class="text-sm font-semibold leading-tight">{{ buff.name }}</h4>
              <div class="text-xs opacity-70 mt-1 leading-relaxed" v-html="buff.details"></div>
            </div>
            <input
              type="checkbox"
              class="toggle toggle-primary toggle-sm shrink-0"
              :checked="isEnabled(buff.key)"
              :disabled="buff.alwaysEnabled"
              @change="setEnabled(buff.key, ($event.target as HTMLInputElement).checked)" />
          </div>
          <div
            v-if="buff.hasStacks && Number(buff.maxStacks) > 0 && !buff.alwaysEnabled"
            class="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-base-300">
            <span class="text-[.65rem] font-bold uppercase tracking-wide opacity-60">Stacks</span>
            <input
              type="range"
              :min="buff.minStacks ?? 0"
              :max="buff.maxStacks"
              class="range range-xs range-primary flex-1"
              :value="stacksFor(buff.key)"
              @input="setStacks(buff.key, ($event.target as HTMLInputElement).value, buff.maxStacks)" />
            <span class="font-mono text-xs text-primary shrink-0">
              {{ stacksFor(buff.key) }} / {{ buff.maxStacks }}
            </span>
          </div>
          <div v-if="buff.buffAttackTargetSelection" class="mt-2.5 pt-2.5 border-t border-base-300">
            <label class="text-xs opacity-70 block mb-1">
              {{ buff.buffAttackTargetSelection.label ?? "Buff applies to" }}
            </label>
            <select
              class="select select-xs select-bordered w-full max-w-xs"
              :value="attackTargetFor(buff)"
              @change="
                setAttackTarget(buff, ($event.target as HTMLSelectElement).value)
              ">
              <option
                v-for="opt in buff.buffAttackTargetSelection.options"
                :key="opt.value"
                :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useCharacterStore } from "../../stores/character";

interface AttackTargetOption {
  value: string;
  label: string;
}
interface AttackTargetSelection {
  configKey: string;
  defaultValue?: string;
  label?: string;
  options: AttackTargetOption[];
}
interface ResonanceChainBuffRow {
  key: string;
  name?: string;
  icon?: string;
  details?: string;
  alwaysEnabled?: boolean;
  hasStacks?: boolean;
  minStacks?: number;
  maxStacks?: number;
  buffAttackTargetSelection?: AttackTargetSelection;
}

interface Props {
  character: string;
  buffs?: ResonanceChainBuffRow[];
}

const props = withDefaults(defineProps<Props>(), { buffs: () => [] });
const emit = defineEmits<{ "updated-character-resonance-chains": [] }>();

const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);

const chains = computed(
  () =>
    (characters.value[props.character] as {
      resonanceChains?: Record<string, { isEnabled?: boolean; stacks?: number; [key: string]: unknown }>;
    })?.resonanceChains ?? {},
);

function isEnabled(key: string): boolean {
  return chains.value[key]?.isEnabled ?? false;
}

function stacksFor(key: string): number {
  return chains.value[key]?.stacks ?? 0;
}

// Each buff's `name` reliably reads "Sequence Node {N}: ..." across the
// entire roster — more reliable than the `key`, which sometimes packs extra
// digits into the same slot (e.g. Danjin's "SequenceNode51"/"SequenceNode52"
// are both Sequence 5) or drops the number entirely (Mortefi's
// "SequenceNodeFuneraryQuartet" is Sequence 5 with no digit in the key at
// all). A character can also have more than one buff at the same sequence
// level — some are stance variants already filtered upstream by
// filterBuffsForStance, others (like Danjin's two Sequence 5 effects) are
// just two effects that both come with the same node — so this groups by
// parsed level rather than assuming one buff per level.
interface Group {
  level: number;
  buffs: ResonanceChainBuffRow[];
  icon?: string;
}

const groups = computed((): Group[] => {
  const byLevel = new Map<number, ResonanceChainBuffRow[]>();
  let lastLevel = 0;
  for (const buff of props.buffs) {
    const match = buff.name?.match(/Sequence Node (\d+):/);
    const level = match ? Number(match[1]) : lastLevel + 1;
    lastLevel = level;
    if (!byLevel.has(level)) {
      byLevel.set(level, []);
    }
    byLevel.get(level)!.push(buff);
  }
  return Array.from(byLevel.entries())
    .sort(([a], [b]) => a - b)
    .map(([level, buffs]) => ({
      level,
      buffs,
      icon: buffs.find((b) => b.icon)?.icon,
    }));
});

function isGroupEnabled(group: Group): boolean {
  return group.buffs.some((b) => isEnabled(b.key) || b.alwaysEnabled);
}

// Highest level such that every group from 1 up to it is enabled, counting
// from the start — the track is a convenience layer over the existing
// per-buff toggles (no separate "level" field), so this stays correct even
// with gaps from before this view existed.
const currentLevel = computed(() => {
  let level = 0;
  for (const group of groups.value) {
    if (!isGroupEnabled(group)) {
      break;
    }
    level = group.level;
  }
  return level;
});

function setEnabled(key: string, value: boolean) {
  characterStore.setCharacterData(props.character, {
    resonanceChains: { [key]: { isEnabled: value } },
  });
  emit("updated-character-resonance-chains");
}

function setStacks(key: string, rawValue: string, maxStacks?: number) {
  let value = Number(rawValue);
  if (typeof maxStacks === "number" && value > maxStacks) {
    value = maxStacks;
  }
  characterStore.setCharacterData(props.character, {
    resonanceChains: { [key]: { stacks: value } },
  });
  emit("updated-character-resonance-chains");
}

function attackTargetFor(buff: ResonanceChainBuffRow): string {
  const configKey = buff.buffAttackTargetSelection?.configKey;
  if (!configKey) return "";
  const stored = chains.value[buff.key]?.[configKey];
  return (
    (typeof stored === "string" ? stored : undefined) ??
    buff.buffAttackTargetSelection?.defaultValue ??
    buff.buffAttackTargetSelection?.options?.[0]?.value ??
    "none"
  );
}

function setAttackTarget(buff: ResonanceChainBuffRow, value: string) {
  const configKey = buff.buffAttackTargetSelection?.configKey;
  if (!configKey) return;
  characterStore.setCharacterData(props.character, {
    resonanceChains: { [buff.key]: { [configKey]: value } },
  });
  emit("updated-character-resonance-chains");
}

function setLevel(level: number) {
  const updates: Record<string, { isEnabled: boolean }> = {};
  for (const group of groups.value) {
    const shouldEnable = group.level <= level;
    for (const buff of group.buffs) {
      if (buff.alwaysEnabled && !shouldEnable) {
        continue;
      }
      updates[buff.key] = { isEnabled: shouldEnable };
    }
  }
  characterStore.setCharacterData(props.character, { resonanceChains: updates });
  emit("updated-character-resonance-chains");
}

function enableAll() {
  const maxLevel = groups.value[groups.value.length - 1]?.level ?? 0;
  setLevel(maxLevel);
}

function maxAll() {
  const updates: Record<string, { isEnabled: boolean; stacks?: number }> = {};
  for (const buff of props.buffs) {
    const update: { isEnabled: boolean; stacks?: number } = { isEnabled: true };
    if (buff.hasStacks) {
      update.stacks = Number(buff.maxStacks) || 0;
    }
    updates[buff.key] = update;
  }
  characterStore.setCharacterData(props.character, { resonanceChains: updates });
  emit("updated-character-resonance-chains");
}
</script>

<style scoped lang="scss">
.workspace-rc-track {
  position: relative;
}
.workspace-rc-track__line {
  // Vertically centered on the nodes: the track's own top padding (0.5rem,
  // from `pt-2`) plus half the node height (2.1rem / 2).
  position: absolute;
  left: 1.05rem;
  right: 1.05rem;
  top: calc(0.5rem + 1.05rem);
  height: 0;
  border-top: 2px dotted oklch(var(--bc) / 0.25);
  z-index: 0;
}
// Matches the icon treatment on the Build Card's own Resonance Chain row
// (.build-card__resonance-node in CalculatorBuildCard.vue) — same circular
// frame, same active/inactive language, so the two surfaces read as one
// visual system.
.workspace-rc-node {
  position: relative;
  z-index: 1;
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.62rem;
  font-weight: 700;
  border: 1px solid oklch(var(--bc) / 0.4);
  background: oklch(var(--b1));
  cursor: pointer;
  flex: none;
  overflow: hidden;

  &--on {
    border-color: oklch(var(--p) / 0.9);
    background: oklch(var(--p) / 0.35);
    box-shadow: 0 0 8px 1px oklch(var(--p) / 0.4);
  }

  &--off {
    opacity: 0.5;
  }

  &__icon {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
