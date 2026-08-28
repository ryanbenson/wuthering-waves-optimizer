<template>
  <div v-if="buffs.length" class="bg-base-200 rounded-xl p-4 flex flex-col gap-3">
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

    <div class="flex items-start justify-between gap-1 px-1 pt-2">
      <button
        type="button"
        class="workspace-rc-node"
        :class="{ 'workspace-rc-node--on': currentLevel >= 0 }"
        title="Base — Sequence 0"
        data-test-workspace-rc-node="0"
        @click="setLevel(0)">
        <span class="workspace-rc-node__dot"></span>
      </button>
      <button
        v-for="(buff, i) in buffs"
        :key="buff.key"
        type="button"
        class="workspace-rc-node"
        :class="{ 'workspace-rc-node--on': currentLevel > i }"
        :title="`Sequence ${i + 1} — ${buff.name}`"
        :data-test-workspace-rc-node="i + 1"
        @click="setLevel(i + 1)">
        S{{ i + 1 }}
      </button>
    </div>

    <div class="flex flex-col gap-2 mt-1">
      <div
        v-for="(buff, i) in buffs"
        :key="`row-${buff.key}`"
        class="rounded-lg border border-base-300 bg-base-100 p-3"
        :class="{ 'opacity-45': !isEnabled(buff.key) }">
        <div class="flex items-start gap-2.5">
          <div
            class="size-6 rounded flex items-center justify-center font-mono text-[.65rem] font-bold shrink-0"
            :class="isEnabled(buff.key) ? 'bg-primary/15 text-primary' : 'bg-base-200 opacity-60'">
            S{{ i + 1 }}
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

// Highest N such that Sequence nodes 1..N are all enabled, counting from the
// start — the sequence track is a convenience layer over the existing
// per-node toggles (no new "level" field), so this stays correct even if a
// user's saved state has gaps from before this view existed.
const currentLevel = computed(() => {
  let level = 0;
  for (const buff of props.buffs) {
    if (!isEnabled(buff.key)) {
      break;
    }
    level += 1;
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
  props.buffs.forEach((buff, i) => {
    const shouldEnable = i < level;
    if (buff.alwaysEnabled && !shouldEnable) {
      return;
    }
    updates[buff.key] = { isEnabled: shouldEnable };
  });
  characterStore.setCharacterData(props.character, { resonanceChains: updates });
  emit("updated-character-resonance-chains");
}

function enableAll() {
  setLevel(props.buffs.length);
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
.workspace-rc-node {
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 0.5rem;
  clip-path: polygon(25% 3%, 75% 3%, 100% 50%, 75% 97%, 25% 97%, 0% 50%);
  background: oklch(var(--b3, var(--b1)));
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: monospace;
  font-size: 0.65rem;
  font-weight: 700;
  opacity: 0.55;
  border: none;
  cursor: pointer;
  flex: none;

  &--on {
    background: oklch(var(--p));
    color: oklch(var(--pc));
    opacity: 1;
  }

  &__dot {
    width: 0.4rem;
    height: 0.4rem;
    border-radius: 9999px;
    background: currentColor;
  }
}
</style>
