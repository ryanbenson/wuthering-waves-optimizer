<template>
  <article
    class="bg-base-100 rounded-xl p-3 sm:p-4 flex flex-col gap-3 border border-base-300"
    :class="{ 'opacity-60': !included }"
    :aria-label="title"
    data-test-wavescan-loadout>
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3 min-w-0">
        <img
          v-if="portrait"
          :src="portrait"
          alt=""
          class="size-11 rounded-full bg-base-200 object-cover shrink-0" />
        <div v-else class="size-11 rounded-full bg-base-200 shrink-0" aria-hidden="true"></div>
        <div class="flex flex-col min-w-0">
          <div class="flex flex-wrap items-center gap-2">
            <h3 class="font-bold text-base" data-test-wavescan-loadout-title>{{ title }}</h3>
            <span v-if="isNew" class="badge badge-success badge-outline badge-sm">
              New to your profile
            </span>
          </div>
          <span class="text-xs opacity-60 font-mono">{{ costLine }}</span>
        </div>
      </div>
      <label class="label cursor-pointer gap-2 py-0 min-h-11">
        <span class="label-text text-sm font-semibold">{{ toggleLabel }}</span>
        <input
          type="checkbox"
          class="toggle toggle-primary toggle-sm"
          :checked="included"
          :disabled="toggleDisabled"
          @change="emit('update:included', ($event.target as HTMLInputElement).checked)"
          data-test-wavescan-loadout-toggle />
      </label>
    </div>

    <div v-if="roverOptions" class="flex flex-wrap items-center gap-2">
      <label :for="roverSelectId" class="text-sm font-semibold">Which Rover is this?</label>
      <select
        :id="roverSelectId"
        class="select select-bordered select-sm w-full sm:w-auto"
        :value="roverValue ?? ''"
        @change="emit('update:rover', ($event.target as HTMLSelectElement).value || null)"
        data-test-wavescan-loadout-rover>
        <option value="">Choose a Rover…</option>
        <option v-for="option in roverOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <span class="text-xs opacity-60">The game shows your player name, not which Rover.</span>
    </div>

    <div v-if="current" class="flex flex-col gap-1.5">
      <span class="text-[.65rem] font-bold uppercase tracking-wider opacity-50">
        Equipped here now
      </span>
      <div class="flex flex-wrap gap-1.5">
        <img
          v-for="echo in current"
          :key="echo.id"
          :src="echo.image ?? undefined"
          :alt="echo.name"
          :title="echo.name"
          class="size-8 rounded-lg bg-base-200 object-cover" />
        <span v-if="!current.length" class="text-xs opacity-60">No echoes equipped</span>
      </div>
      <span class="text-[.65rem] font-bold uppercase tracking-wider opacity-50 mt-1">
        From your scan
      </span>
    </div>

    <ol
      class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2"
      :aria-label="`${title} echo slots`">
      <li
        v-for="(tile, index) in tiles"
        :key="tile.id"
        class="relative flex sm:flex-col items-center sm:text-center gap-3 rounded-xl border bg-base-200 p-2 sm:p-3 transition"
        :class="[
          index === 0 ? 'border-warning ring-1 ring-warning' : 'border-base-300',
          dropIndex === index && dragIndex !== null && dragIndex !== index
            ? 'ring-2 ring-primary'
            : '',
          dragIndex === index ? 'opacity-40' : '',
        ]"
        @dragover.prevent="onDragOver(index, $event)"
        @dragenter.prevent="onDragEnter(index)"
        @drop.prevent="onDrop(index)"
        data-test-wavescan-loadout-slot>
        <span
          class="inline-flex items-center justify-center w-6 h-11 sm:absolute sm:top-1 sm:left-1 sm:h-7 shrink-0 rounded cursor-grab active:cursor-grabbing text-base-content/50 hover:text-base-content select-none"
          draggable="true"
          :aria-label="`Drag ${tile.name} to reorder`"
          title="Drag to reorder"
          @dragstart="onHandleDragStart(index, tile.id, $event)"
          @dragend="onDragEnd">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="size-4 pointer-events-none"
            aria-hidden="true">
            <path
              d="M7 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM7 10a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM7 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM15 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM15 10a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM15 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
          </svg>
        </span>
        <div class="relative shrink-0">
          <img
            :src="tile.image ?? undefined"
            alt=""
            draggable="false"
            class="size-14 sm:size-20 rounded-xl bg-base-300 object-cover" />
          <span
            class="absolute -bottom-1 -right-1 badge badge-neutral badge-xs font-mono"
            title="Cost">
            C{{ tile.cost }}
          </span>
        </div>
        <div class="flex flex-col gap-0.5 min-w-0 flex-1 sm:items-center">
          <span
            class="text-[.65rem] font-bold uppercase tracking-wider"
            :class="index === 0 ? 'text-warning' : 'opacity-50'"
            data-test-wavescan-loadout-slot-label>
            {{ index === 0 ? "Main echo" : `Slot ${index + 1}` }}
          </span>
          <span
            class="text-sm font-bold leading-tight line-clamp-2 break-words"
            :title="tile.name"
            data-test-wavescan-loadout-echo-name>
            {{ tile.name }}
          </span>
          <span class="text-xs opacity-70 flex items-center gap-1 sm:justify-center">
            <img v-if="tile.setIcon" :src="tile.setIcon" alt="" class="size-4" />
            {{ tile.setName }}
          </span>
          <span class="text-xs opacity-60">{{ tile.stat }}</span>
          <span v-if="tile.chip" class="text-xs font-semibold" :class="tile.chipClass">
            {{ tile.chip }}
          </span>
          <button
            v-if="index !== 0"
            type="button"
            class="btn btn-outline btn-warning btn-xs self-start sm:self-center mt-1"
            @click="emit('reorder', index, 0)"
            data-test-wavescan-loadout-make-main>
            Make main
          </button>
        </div>
        <div class="flex sm:flex-row flex-col gap-1 shrink-0 sm:mt-auto">
          <button
            type="button"
            class="btn btn-ghost btn-sm btn-square"
            :disabled="index === 0"
            :aria-label="`Move ${tile.name} earlier`"
            @click="emit('reorder', index, index - 1)"
            data-test-wavescan-loadout-up>
            <svg aria-hidden="true" class="size-4 sm:-rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6" /></svg>
          </button>
          <button
            type="button"
            class="btn btn-ghost btn-sm btn-square"
            :disabled="index === tiles.length - 1"
            :aria-label="`Move ${tile.name} later`"
            @click="emit('reorder', index, index + 1)"
            data-test-wavescan-loadout-down>
            <svg aria-hidden="true" class="size-4 sm:-rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6" /></svg>
          </button>
        </div>
      </li>
      <li
        v-for="slot in emptySlots"
        :key="`empty-${slot}`"
        class="flex sm:flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-base-300 p-3 min-h-14 text-xs opacity-60">
        <span class="font-bold uppercase tracking-wider">Slot {{ slot }}</span>
        <span>stays empty</span>
      </li>
    </ol>

    <ul v-if="notes.length" class="flex flex-col gap-1">
      <li
        v-for="note in notes"
        :key="note.text"
        class="text-sm flex gap-2 items-start"
        :class="noteClass[note.tone]"
        data-test-wavescan-loadout-note>
        <span class="size-1.5 rounded-full bg-current mt-2 shrink-0" aria-hidden="true"></span>
        <span>{{ note.text }}</span>
      </li>
    </ul>
  </article>
</template>

<script setup lang="ts">
/**
 * One character's scanned loadout in the Wavescan import review: the echoes
 * in slot order (slot 1 = main echo), reorderable by dragging the handle
 * (same `useDragReorder` as rotations) or with the buttons. Display only —
 * the parent owns the order and applies it.
 */
import { computed, useId } from "vue";
import { setDragPreview, useDragReorder } from "../composables/useDragReorder";

export type WavescanLoadoutTile = {
  id: string;
  name: string;
  image: string | null;
  cost: number;
  setName: string;
  setIcon: string | null;
  stat: string;
  chip: string | null;
  chipClass?: string;
};

export type WavescanLoadoutNote = {
  text: string;
  tone: "info" | "success" | "warning" | "error";
};

const props = defineProps<{
  title: string;
  portrait: string | null;
  isNew: boolean;
  tiles: WavescanLoadoutTile[];
  included: boolean;
  toggleLabel: string;
  toggleDisabled: boolean;
  /** The character's current loadout (Add mode only), or null to hide it. */
  current: { id: string; name: string; image: string | null }[] | null;
  /** Rover entries to pick from when the wearer is the main character. */
  roverOptions: { value: string; label: string }[] | null;
  roverValue: string | null;
  notes: WavescanLoadoutNote[];
}>();

const emit = defineEmits<{
  reorder: [from: number, to: number];
  "update:included": [included: boolean];
  "update:rover": [key: string | null];
}>();

const roverSelectId = `wavescan-rover-${useId()}`;

const noteClass: Record<WavescanLoadoutNote["tone"], string> = {
  info: "opacity-80",
  success: "text-success",
  warning: "text-warning",
  error: "text-error",
};

const costLine = computed(() => {
  const costs = props.tiles.map((tile) => tile.cost);
  const total = costs.reduce((sum, cost) => sum + cost, 0);
  return `${costs.length} ${costs.length === 1 ? "echo" : "echoes"} · ${costs.join("-") || "—"} · cost ${total}/12`;
});

const emptySlots = computed(() =>
  Array.from({ length: Math.max(0, 5 - props.tiles.length) }, (_, i) => props.tiles.length + i + 1),
);

const { dragIndex, dropIndex, onDragStart, onDragEnter, onDragOver, onDrop, onDragEnd } =
  useDragReorder((from, to) => emit("reorder", from, to));

function onHandleDragStart(index: number, id: string, event: DragEvent) {
  // Must set dataTransfer during dragstart on the draggable node (esp. Safari/Firefox)
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", id);
  }
  setDragPreview(
    event,
    (event.currentTarget as HTMLElement | null)?.closest<HTMLElement>("[data-test-wavescan-loadout-slot]"),
  );
  onDragStart(index);
}
</script>
