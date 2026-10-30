<template>
  <div data-test-rotation-timeline-strip>
    <div class="text-xs opacity-60 mb-2">
      Damage over the rotation's game time — each block spans the time an action takes and its height is the damage;
      the line is the running total.
    </div>
    <div class="timeline-strip">
      <button
        v-for="block in blocks"
        :key="block.id"
        type="button"
        class="timeline-strip__block"
        :class="[
          `timeline-strip__block--end-${block.end}`,
          {
            'timeline-strip__block--instant': block.frames === 0,
            'timeline-strip__block--missing': block.missing,
          },
        ]"
        :style="block.style"
        :title="block.title"
        :aria-label="block.title"
        :data-test-rotation-timeline-block="block.id"
        :data-end="block.end"
        @click="emit('select', block.id)"></button>
      <svg
        v-if="cumulativePath"
        class="timeline-strip__total"
        viewBox="0 0 1000 100"
        preserveAspectRatio="none"
        aria-hidden="true">
        <path :d="cumulativePath" vector-effect="non-scaling-stroke" />
      </svg>
    </div>
    <div class="flex justify-between text-[11px] opacity-60 font-mono mt-1">
      <span v-for="tick in ticks" :key="tick">{{ tick }}s</span>
    </div>
    <div class="flex flex-wrap gap-x-3 gap-y-1 text-[11px] opacity-70 mt-1" data-test-rotation-timeline-legend>
      <span v-for="slot in slotLegend" :key="slot.slot" class="inline-flex items-center gap-1">
        <span class="timeline-strip__swatch" :class="`timeline-strip__slot-${slot.slot}`"></span>{{ slot.name }}
      </span>
      <span v-if="present.cut" class="inline-flex items-center gap-1">
        <span class="timeline-strip__swatch timeline-strip__swatch--cut"></span>Cancelled early
      </span>
      <span v-if="present.swap" class="inline-flex items-center gap-1">
        <span class="timeline-strip__swatch timeline-strip__swatch--swap"></span>Swap out
      </span>
      <span v-if="present.instant" class="inline-flex items-center gap-1">
        <span class="timeline-strip__swatch timeline-strip__swatch--instant"></span>Off-field / no field time
      </span>
      <span v-if="present.missing" class="inline-flex items-center gap-1">
        <span class="timeline-strip__swatch timeline-strip__block--missing"></span>No frame data
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ACTION_END_LABELS, framesToSeconds } from "../calculator/rotationTiming";
import type { TimelineStrip } from "../calculator/rotationTimelineStrip";

const props = defineProps<{
  strip: TimelineStrip;
  /** Team rotations: each slot's character name, which colors its blocks. */
  slotNames?: Array<string | null>;
}>();

const emit = defineEmits<{ select: [id: string] }>();

const total = computed(() => Math.max(1, props.strip.totalFrames));

function pct(frames: number): number {
  return (frames / total.value) * 100;
}

function seconds(frames: number): string {
  return framesToSeconds(frames).toFixed(2);
}

const blocks = computed(() =>
  props.strip.blocks.map((block) => {
    const heightPct = props.strip.maxValue > 0 ? Math.max(4, (block.value / props.strip.maxValue) * 100) : 4;
    // Off-field and zero-length actions sit where their damage lands, as a
    // thin marker, not at a start they share with the next action.
    const at = block.frames === 0 ? block.landingFrame : block.startFrame;
    const timeText =
      block.frames === 0 ? `at ${seconds(at)}s` : `${seconds(block.startFrame)}s–${seconds(block.startFrame + block.frames)}s`;
    const parts = [block.label, timeText, Math.round(block.value).toLocaleString()];
    if (block.missing) parts.push("no frame data");
    else if (block.frames > 0) parts.push(ACTION_END_LABELS[block.end]);
    return {
      ...block,
      title: parts.join(" · "),
      style: {
        left: `${pct(at)}%`,
        width: block.frames === 0 ? undefined : `${pct(block.frames)}%`,
        height: `${heightPct}%`,
        ...slotColor(block.slot),
      },
    };
  }),
);

function slotColor(slot: number | null): Record<string, string> {
  return slot == null ? {} : { "--strip-color": `var(--strip-slot-${slot})` };
}

// The legend only names what's on the strip.
const present = computed(() => {
  const timed = props.strip.blocks.filter((block) => block.frames > 0);
  return {
    cut: timed.some((block) => ["cancel", "dash", "jump"].includes(block.end)),
    swap: timed.some((block) => block.end === "swap"),
    instant: props.strip.blocks.some((block) => block.frames === 0 && !block.missing),
    missing: props.strip.blocks.some((block) => block.missing),
  };
});

const slotLegend = computed(() =>
  (props.slotNames ?? [])
    .map((name, slot) => ({ name, slot }))
    .filter((entry): entry is { name: string; slot: number } => !!entry.name),
);

// A step line: flat until each landing, then up by its damage.
const cumulativePath = computed(() => {
  const points = props.strip.cumulative;
  const top = points[points.length - 1]?.value ?? 0;
  if (top <= 0) return "";
  const x = (frame: number) => ((frame / total.value) * 1000).toFixed(1);
  const y = (value: number) => (100 - (value / top) * 100).toFixed(1);
  let d = `M0 100`;
  for (const point of points.slice(1)) {
    d += ` H${x(point.frame)} V${y(point.value)}`;
  }
  return `${d} H1000`;
});

const ticks = computed(() => {
  const end = framesToSeconds(total.value);
  return [0, end / 4, end / 2, (end * 3) / 4, end].map((value) => value.toFixed(value === 0 ? 0 : 1));
});
</script>

<style scoped lang="scss">
.timeline-strip {
  --strip-slot-0: oklch(var(--p) / 0.55);
  --strip-slot-1: oklch(var(--s) / 0.55);
  --strip-slot-2: oklch(var(--a) / 0.55);
  position: relative;
  height: 4rem;
  border-bottom: 1px solid oklch(var(--bc) / 0.2);
}
.timeline-strip__block {
  position: absolute;
  bottom: 0;
  min-width: 3px;
  padding: 0;
  border: none;
  // A hairline gap so back-to-back actions read as separate blocks.
  box-shadow: inset -1px 0 0 oklch(var(--b1));
  border-radius: 0.125rem 0.125rem 0 0;
  background: var(--strip-color, oklch(var(--p) / 0.55));
  cursor: pointer;
  transition: filter 0.15s ease;
  &:hover,
  &:focus-visible {
    filter: brightness(1.25) saturate(1.2);
    outline: none;
    z-index: 1;
  }
}
// Cancelled early (cancel, dash, jump): the top right corner is cut off.
.timeline-strip__block--end-cancel,
.timeline-strip__block--end-dash,
.timeline-strip__block--end-jump {
  clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%);
}
// Swap out: a bar at the right edge that rises above the block.
.timeline-strip__block--end-swap::after {
  content: "";
  position: absolute;
  right: -1px;
  bottom: 0;
  height: calc(100% + 6px);
  width: 2px;
  background: oklch(var(--bc) / 0.75);
}
.timeline-strip__block--instant {
  width: 3px;
  transform: translateX(-50%);
  background: oklch(var(--bc) / 0.45);
  border-radius: 1px;
  box-shadow: none;
}
.timeline-strip__block--missing {
  background: repeating-linear-gradient(
    -45deg,
    oklch(var(--wa) / 0.7) 0 3px,
    oklch(var(--wa) / 0.25) 3px 6px
  );
}
.timeline-strip__total {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible;
  path {
    fill: none;
    stroke: oklch(var(--bc) / 0.6);
    stroke-width: 1.5;
  }
}
.timeline-strip__swatch {
  display: inline-block;
  width: 0.75rem;
  height: 0.625rem;
  border-radius: 1px;
  background: oklch(var(--p) / 0.55);
}
.timeline-strip__slot-0 {
  background: oklch(var(--p) / 0.55);
}
.timeline-strip__slot-1 {
  background: oklch(var(--s) / 0.55);
}
.timeline-strip__slot-2 {
  background: oklch(var(--a) / 0.55);
}
.timeline-strip__swatch--cut {
  clip-path: polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 0 100%);
}
.timeline-strip__swatch--swap {
  box-shadow: inset -2px 0 0 oklch(var(--bc) / 0.75);
}
.timeline-strip__swatch--instant {
  width: 3px;
  background: oklch(var(--bc) / 0.45);
}
</style>
