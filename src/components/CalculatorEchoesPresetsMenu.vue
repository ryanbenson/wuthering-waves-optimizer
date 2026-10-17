<template>
  <!--
    The Echoes header's Presets button (v3). Presets are a small share of
    usage, so this stays one header button rather than anything above the
    echo tiles; it still shows which preset is on, and its menu offers the
    next step for that state. See docs/adr/0043-echo-presets-header-button.md.
  -->
  <AppOverflowMenu
    class="echoes-presets-menu"
    menu-class="w-72"
    :aria-label="ariaLabel"
    data-test="calculator-echoes-presets-menu">
    <template #trigger>
      <span class="flex min-w-0 items-center gap-1.5" data-test-echoes-presets-trigger>
        <span class="relative inline-flex shrink-0" :class="iconClass">
          <svg
            v-if="status.kind === 'theorycrafter'"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="size-4"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="size-4"
            :fill="hasPreset ? 'currentColor' : 'none'"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          <span
            v-if="status.kind === 'edited'"
            class="absolute -right-1 -top-1 size-2 rounded-full bg-warning ring-2 ring-base-200"
            data-test-echoes-presets-edited-dot
            aria-hidden="true"></span>
        </span>
        <span class="hidden max-w-40 truncate sm:inline" data-test-echoes-active-preset>{{ buttonLabel }}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          class="hidden size-4 shrink-0 fill-current opacity-60 sm:inline"
          aria-hidden="true">
          <path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4z" />
        </svg>
      </span>
    </template>

    <li class="menu-title flex flex-col gap-1 font-normal text-base-content" data-test-echoes-presets-status>
      <span class="text-xs font-semibold uppercase tracking-wide opacity-60">Current echoes</span>
      <span class="flex min-w-0 items-center gap-2">
        <span
          v-if="chipLabel"
          class="badge badge-sm shrink-0"
          :class="status.kind === 'theorycrafter' ? 'badge-accent badge-outline' : 'badge-primary badge-outline'">
          {{ chipLabel }}
        </span>
        <span class="truncate text-sm font-semibold">{{ statusTitle }}</span>
      </span>
      <span class="text-xs" :class="status.kind === 'edited' ? 'text-warning' : 'opacity-70'">{{ statusDetail }}</span>
    </li>

    <template v-if="status.kind === 'unsaved'">
      <li>
        <button type="button" class="font-semibold" data-test-echoes-presets-save @click="emit('save')">
          Save current echoes as preset
        </button>
      </li>
    </template>
    <template v-else-if="status.kind === 'edited'">
      <li>
        <button type="button" class="font-semibold" data-test-echoes-presets-update @click="emit('update')">
          Update preset with these echoes
        </button>
      </li>
      <li>
        <button type="button" data-test-echoes-presets-save @click="emit('save')">Save as new preset</button>
      </li>
      <li>
        <button type="button" data-test-echoes-presets-revert @click="emit('revert')">Revert to preset</button>
      </li>
    </template>
    <template v-else-if="status.kind === 'active'">
      <li>
        <button type="button" data-test-echoes-presets-save @click="emit('save')">Save a copy as a new preset</button>
      </li>
    </template>
    <template v-else-if="status.kind === 'theorycrafter'">
      <li>
        <button type="button" data-test-echoes-presets-save @click="emit('save')">Save to my presets</button>
      </li>
    </template>

    <li class="mt-1 border-t border-base-content/10 pt-1">
      <button
        type="button"
        class="flex flex-col items-start gap-0"
        data-test-echoes-presets-open
        @click="emit('browse')">
        <span class="font-semibold">Browse all presets</span>
        <span class="text-xs opacity-60">{{ savedCount }} yours · {{ communityCount }} theorycrafter</span>
      </button>
    </li>
    <li>
      <button type="button" data-test-echoes-presets-guide @click="emit('guide')">
        <span class="text-primary">How presets work</span>
      </button>
    </li>
  </AppOverflowMenu>
</template>

<script setup lang="ts">
import { computed } from "vue";
import AppOverflowMenu from "./AppOverflowMenu.vue";
import type { EchoPresetStatus } from "../echoes/presetStatus";

const props = defineProps<{
  status: EchoPresetStatus;
  savedCount: number;
  communityCount: number;
}>();

const emit = defineEmits<{
  save: [];
  update: [];
  revert: [];
  browse: [];
  guide: [];
}>();

const hasPreset = computed(() => props.status.kind === "active" || props.status.kind === "edited");

const presetName = computed(() => ("name" in props.status ? props.status.name : null));

const buttonLabel = computed(() => presetName.value ?? "Presets");

const ariaLabel = computed(() => {
  if (props.status.kind === "edited") return `Presets: ${presetName.value}, changed since applied`;
  if (presetName.value) return `Presets: ${presetName.value}`;
  return "Presets";
});

const iconClass = computed(() => {
  if (props.status.kind === "theorycrafter") return "text-accent";
  if (hasPreset.value) return "text-primary";
  return "opacity-70";
});

const chipLabel = computed(() => {
  if (hasPreset.value) return "My preset";
  if (props.status.kind === "theorycrafter") return "Theorycrafter";
  return null;
});

const statusTitle = computed(() => {
  if (props.status.kind === "empty") return "No echoes equipped";
  if (props.status.kind === "unsaved") return "Unsaved build";
  return presetName.value;
});

const statusDetail = computed(() => {
  const status = props.status;
  switch (status.kind) {
    case "empty":
      return "Apply one of your presets or a theorycrafter build to fill all five slots at once.";
    case "unsaved":
      return "Save these five echoes to switch back to them later, or reuse them on another character.";
    case "active":
      return "Matches your current echoes.";
    case "edited":
      return `${status.changedSlots} ${status.changedSlots === 1 ? "echo" : "echoes"} changed since you applied it.`;
    case "theorycrafter":
      return `${status.author ? `by ${status.author}. ` : ""}Reference echoes, not from your inventory.`;
    default:
      return "";
  }
});
</script>

<style scoped>
/* AppOverflowMenu's trigger is a ghost button; give it the same filled look as the header's other buttons. */
.echoes-presets-menu :deep(.app-overflow-menu__trigger) {
  background-color: var(--fallback-b1, oklch(var(--b1) / 1));
  border: 1px solid var(--fallback-bc, oklch(var(--bc) / 0.15));
  font-weight: 600;
}
.echoes-presets-menu :deep(.app-overflow-menu__trigger:hover) {
  background-color: var(--fallback-b3, oklch(var(--b3) / 1));
}
</style>
