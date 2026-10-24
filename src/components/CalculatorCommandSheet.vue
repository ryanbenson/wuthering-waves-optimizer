<template>
  <!-- Phones only: the Command Bar shrinks to one row there, and the inputs
  it drops live in this sheet instead, in two halves: "character" (level,
  build, mode), opened from the name, and "damage" (what's measured, damage
  type, stats), opened from ⌃ by the number. -->
  <Teleport to="body">
    <Transition name="command-sheet">
      <div
        v-if="section"
        class="command-sheet fixed inset-0 z-[60] flex flex-col justify-end md:hidden"
        @keydown.esc="emit('close')">
        <div class="absolute inset-0 bg-black/50" aria-hidden="true" @click="emit('close')"></div>
        <div
          ref="panelRef"
          role="dialog"
          aria-modal="true"
          aria-labelledby="command-sheet-title"
          class="command-sheet__panel relative rounded-t-2xl bg-base-100 text-base-content border-t border-base-300 shadow-2xl px-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]"
          data-test-command-sheet
          :data-test-command-sheet-section="section">
          <div class="mx-auto mb-2 h-1 w-10 rounded-full bg-base-content/20" aria-hidden="true"></div>

          <div class="flex items-center gap-2 mb-3">
            <h2 id="command-sheet-title" class="font-bold truncate">
              {{ section === "character" ? characterName : "Damage" }}
            </h2>
            <button
              v-if="section === 'character'"
              type="button"
              class="btn btn-circle btn-ghost btn-sm shrink-0"
              :class="{ 'text-pink-400': isFavorite }"
              :aria-label="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
              :aria-pressed="isFavorite"
              @click="characterStore.toggleFavoriteCharacter(character)">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-4" aria-hidden="true">
                <path
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                  :fill="isFavorite ? 'currentColor' : 'none'"
                  stroke="currentColor"
                  :stroke-width="isFavorite ? 0 : 2" />
              </svg>
            </button>
            <button
              ref="closeRef"
              type="button"
              class="btn btn-circle btn-ghost btn-sm ml-auto shrink-0"
              aria-label="Close"
              data-test-command-sheet-close
              @click="emit('close')">
              <svg xmlns="http://www.w3.org/2000/svg" class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div v-if="section === 'character'" class="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-3">
            <span class="command-sheet__label">Level</span>
            <div class="font-mono text-sm">
              <WorkspaceLevelStepper
                class="w-fit"
                :character="character"
                @character-level-updated="emit('character-level-updated', $event)" />
            </div>

            <span class="command-sheet__label">Build</span>
            <div class="flex items-center gap-1 min-w-0">
              <CalculatorBuildSelect :character="character" size="sm" root-class="flex-1 min-w-0" />
              <button
                type="button"
                class="btn btn-sm btn-ghost shrink-0"
                data-test-command-sheet-manage-builds
                @click="emit('manage-builds')">
                Manage
              </button>
            </div>

            <template v-if="stanceOptions.length > 1">
              <span class="command-sheet__label">Mode</span>
              <div class="join w-full" role="group" aria-label="Mode">
                <button
                  v-for="option in stanceOptions"
                  :key="String(option.value)"
                  type="button"
                  class="join-item btn btn-sm flex-1 gap-1.5 min-w-0"
                  :class="{ 'btn-primary': option.value === activeStance }"
                  :aria-pressed="option.value === activeStance"
                  :data-test-command-sheet-stance="option.value"
                  @click="emit('select-stance', String(option.value))">
                  <img
                    v-if="option.image"
                    :src="option.image"
                    alt=""
                    class="command-sheet__stance-icon size-4 shrink-0"
                    :style="option.imageStyle"
                    loading="lazy" />
                  <span class="truncate">{{ option.label }}</span>
                </button>
              </div>
            </template>
          </div>

          <div v-else class="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-3">
            <span class="command-sheet__label">Measure</span>
            <CalculatorOptimizerTarget
              :key="character"
              class="w-full"
              :character="character"
              :current-optimization-target="target"
              @optimizer:target-updated="emit('update:target', $event)"></CalculatorOptimizerTarget>

            <span class="command-sheet__label">Damage</span>
            <CalculatorOptimizerDamageType
              name="command-sheet-damage-type"
              :character="character"
              :current-damage-type="damageType"
              @optimizer:damage-type-updated="emit('update:damage-type', $event)"></CalculatorOptimizerDamageType>
          </div>

          <template v-if="section === 'damage'">
            <div v-if="statChips.length" class="grid grid-cols-3 gap-2 mt-4" data-test-command-sheet-stats>
              <button
                v-for="chip in statChips"
                :key="chip.key"
                type="button"
                class="flex flex-col items-start rounded-box bg-base-200 px-3 py-2 text-left leading-tight"
                @click="emit('stat-selected', chip.label)">
                <span class="text-[10px] uppercase tracking-wide opacity-60 truncate max-w-full">{{ chip.label }}</span>
                <span class="font-mono font-bold text-sm tabular-nums">{{ chip.display }}</span>
              </button>
            </div>

            <button
              type="button"
              class="btn btn-block btn-sm mt-4"
              data-test-command-sheet-breakdown
              @click="emit('open-detail')">
              Full breakdown
            </button>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import CalculatorOptimizerTarget from "./CalculatorOptimizerTarget.vue";
import CalculatorOptimizerDamageType from "./CalculatorOptimizerDamageType.vue";
import CalculatorBuildSelect from "./CalculatorBuildSelect.vue";
import WorkspaceLevelStepper from "./characterWorkspace/WorkspaceLevelStepper.vue";
import type { AppRichSelectOption } from "./AppRichSelect.vue";
import { useCharacterStore } from "../stores/character";

defineOptions({ name: "CalculatorCommandSheet" });

export type CommandSheetSection = "character" | "damage";

const props = defineProps<{
  /** Which half is open; null when the sheet is closed. */
  section: CommandSheetSection | null;
  character: string;
  characterName: string;
  target: string | null;
  damageType: string;
  stanceOptions: AppRichSelectOption[];
  activeStance: string | null | undefined;
  statChips: Array<{ key: string; label: string; display: string }>;
}>();

const emit = defineEmits<{
  close: [];
  "update:target": [target: string | null];
  "update:damage-type": [damageType: string];
  "select-stance": [stance: string];
  "stat-selected": [stat: string];
  "open-detail": [];
  "manage-builds": [];
  "character-level-updated": [level: string];
}>();

const characterStore = useCharacterStore();
const isFavorite = computed(() => characterStore.isFavoriteCharacter(props.character));

const closeRef = ref<HTMLButtonElement | null>(null);

// Focus moves into the sheet so Esc and screen readers land in it; the bar
// puts focus back on its own button when the sheet closes.
watch(
  () => props.section,
  async (open) => {
    if (!open) return;
    await nextTick();
    closeRef.value?.focus();
  },
);
</script>

<style scoped lang="scss">
/* No scroll area unless the screen is too short for the sheet: one would clip
the Measure picker, which opens upwards when there's little room below. */
@media (max-height: 560px) {
  .command-sheet__panel {
    max-height: 85vh;
    overflow-y: auto;
  }
}

.command-sheet__label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  opacity: 0.6;
}

.command-sheet-enter-active,
.command-sheet-leave-active {
  transition: opacity 0.2s ease;
  .command-sheet__panel {
    transition: transform 0.2s ease;
  }
}
.command-sheet-enter-from,
.command-sheet-leave-to {
  opacity: 0;
  .command-sheet__panel {
    transform: translateY(100%);
  }
}
@media (prefers-reduced-motion: reduce) {
  .command-sheet-enter-active,
  .command-sheet-leave-active,
  .command-sheet-enter-active .command-sheet__panel,
  .command-sheet-leave-active .command-sheet__panel {
    transition: none;
  }
}

/* Same as CalculatorCommandBar.vue's stance select: the untinted stance
glyphs are white, so flip them on light themes. */
html[data-theme-style="light"] .command-sheet__stance-icon:not([style*="filter"]) {
  filter: invert(1);
}
</style>
