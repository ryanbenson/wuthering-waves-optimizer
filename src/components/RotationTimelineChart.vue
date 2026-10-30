<template>
  <div ref="root" class="rotation-chart grid gap-2" data-test-rotation-timeline-chart>
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div class="text-xs opacity-60">{{ view === "pace" ? paceCaption : detailedCaption }}</div>
      <div class="join" role="group" aria-label="Chart view">
        <button
          v-for="option in VIEWS"
          :key="option.id"
          type="button"
          class="btn btn-xs join-item"
          :class="{ 'btn-active btn-primary': view === option.id }"
          :aria-pressed="view === option.id"
          :data-test-rotation-chart-view="option.id"
          @click="view = option.id">
          {{ option.label }}
        </button>
      </div>
    </div>

    <!-- Pace: the running damage total over game time, with what you were
         doing as a band under it. -->
    <svg
      v-if="view === 'pace'"
      class="rotation-chart__svg"
      :width="width"
      :height="pace.height"
      :viewBox="`0 0 ${width} ${pace.height}`"
      role="img"
      aria-label="Running damage total over the rotation's game time"
      data-test-rotation-pace-chart>
      <g class="rotation-chart__axis">
        <template v-for="line in pace.gridlines" :key="line.value">
          <line :x1="pace.left" :x2="width - pace.right" :y1="line.y" :y2="line.y" />
          <text :x="pace.left - 6" :y="line.y + 4" text-anchor="end">{{ line.label }}</text>
        </template>
      </g>
      <path class="rotation-chart__area" :d="pace.area" />
      <path class="rotation-chart__line" :d="pace.line" />
      <line
        v-if="crosshair !== null"
        class="rotation-chart__crosshair"
        :x1="crosshair"
        :x2="crosshair"
        :y1="pace.top"
        :y2="pace.bandY + pace.bandH" />
      <rect
        class="rotation-chart__hit"
        :x="pace.left"
        :y="pace.top"
        :width="Math.max(0, width - pace.left - pace.right)"
        :height="pace.bottom - pace.top"
        @pointerdown="onPacePointer"
        @pointermove="onPacePointer"
        @pointerleave="onLeave" />
      <g v-for="label in pace.labels" :key="label.id" class="rotation-chart__no-hit">
        <circle class="rotation-chart__dot" :cx="label.px" :cy="label.py" r="4.5" :style="{ fill: label.color }" />
        <text class="rotation-chart__label" :x="label.tx" :y="label.ty" :text-anchor="label.anchor">
          {{ label.text }}
        </text>
      </g>
      <text class="rotation-chart__axis-text" :x="pace.left - 6" :y="pace.bandY + 11" text-anchor="end">Doing</text>
      <template v-for="mark in pace.band" :key="mark.block.id">
        <circle
          v-if="mark.round"
          class="rotation-chart__mark rotation-chart__dot"
          :class="{ 'rotation-chart__mark--missing': mark.block.missing }"
          :cx="mark.x"
          :cy="pace.bandY + pace.bandH / 2"
          r="5"
          :style="{ fill: mark.color }"
          v-bind="markAttrs(mark.block)"
          v-on="markEvents(mark.block)" />
        <rect
          v-else
          class="rotation-chart__mark"
          :x="mark.x"
          :y="pace.bandY"
          :width="mark.w"
          :height="pace.bandH"
          rx="3"
          :style="{ fill: mark.color }"
          v-bind="markAttrs(mark.block)"
          v-on="markEvents(mark.block)" />
      </template>
      <g class="rotation-chart__axis">
        <text v-for="tick in pace.ticks" :key="tick.t" :x="tick.x" :y="pace.tickY" text-anchor="middle">
          {{ tick.t }}s
        </text>
      </g>
    </svg>

    <!-- Detailed: what you did and for how long on top, each action's damage
         as a bar under it. Actions that take no field time sit past the end. -->
    <svg
      v-else
      class="rotation-chart__svg"
      :width="width"
      :height="detailed.height"
      :viewBox="`0 0 ${width} ${detailed.height}`"
      role="img"
      aria-label="Actions on a time axis above a bar per action showing its damage"
      data-test-rotation-detailed-chart>
      <line
        class="rotation-chart__baseline"
        :x1="detailed.left"
        :x2="width - detailed.right"
        :y1="detailed.barBase"
        :y2="detailed.barBase" />
      <line
        v-if="detailed.pinX !== null"
        class="rotation-chart__divider"
        :x1="detailed.pinX"
        :x2="detailed.pinX"
        :y1="detailed.rowY - 4"
        :y2="detailed.barBase" />
      <g v-for="item in detailed.items" :key="item.block.id">
        <path
          v-if="item.diamond"
          class="rotation-chart__mark"
          :class="{ 'rotation-chart__mark--missing': item.block.missing }"
          :d="`M${item.cx} ${detailed.rowY + 5} l9 10 l-9 10 l-9 -10 Z`"
          :style="{ fill: item.color }"
          v-bind="markAttrs(item.block)"
          v-on="markEvents(item.block)" />
        <template v-else>
          <rect
            class="rotation-chart__mark rotation-chart__block"
            :x="item.x"
            :y="detailed.rowY"
            :width="item.w"
            :height="detailed.rowH"
            rx="4"
            :style="{ '--mark-color': item.color }"
            v-bind="markAttrs(item.block)"
            v-on="markEvents(item.block)" />
          <rect
            class="rotation-chart__no-hit"
            :x="item.x"
            :y="detailed.rowY"
            :width="item.w"
            height="4"
            rx="2"
            :style="{ fill: item.color }" />
          <path
            v-if="item.cut"
            class="rotation-chart__notch rotation-chart__no-hit"
            :d="`M${item.x + item.w - 8} ${detailed.rowY} H${item.x + item.w} V${detailed.rowY + 8} Z`"
            data-test-rotation-chart-notch />
          <rect
            v-if="item.block.end === 'swap'"
            class="rotation-chart__swap rotation-chart__no-hit"
            :x="item.x + item.w - 1"
            :y="detailed.rowY - 5"
            width="2"
            :height="detailed.rowH + 5" />
          <text
            v-if="item.text"
            class="rotation-chart__label rotation-chart__no-hit"
            :x="item.cx"
            :y="detailed.rowY + detailed.rowH / 2 + 6"
            text-anchor="middle">
            {{ item.text }}
          </text>
        </template>
        <rect
          class="rotation-chart__mark"
          :class="{ 'rotation-chart__mark--faded': !item.block.isDamage }"
          :x="item.cx - item.barW / 2"
          :y="item.barY"
          :width="item.barW"
          :height="detailed.barBase - item.barY"
          rx="3"
          :style="{ fill: item.color }"
          v-bind="markAttrs(item.block, false)"
          v-on="markEvents(item.block)" />
        <text
          v-if="item.valueText"
          class="rotation-chart__value rotation-chart__no-hit"
          :x="item.cx"
          :y="item.barY - 5"
          text-anchor="middle">
          {{ item.valueText }}
        </text>
      </g>
      <g class="rotation-chart__axis">
        <text v-for="tick in detailed.ticks" :key="tick.t" :x="tick.x" :y="detailed.tickY" text-anchor="middle">
          {{ tick.t }}s
        </text>
        <text v-if="detailed.pinX !== null" :x="detailed.pinCenter" :y="detailed.tickY" text-anchor="middle">
          no time
        </text>
      </g>
    </svg>

    <RotationChartReadout :item="active" hint="Hover or tap the chart for details." @select="emit('select', $event)" />

    <div class="flex flex-wrap gap-x-3 gap-y-1 text-[11px] opacity-80" data-test-rotation-timeline-legend>
      <span v-for="kind in presentKinds" :key="kind" class="inline-flex items-center gap-1">
        <span class="rotation-chart__swatch" :style="{ background: kindColor(kind) }"></span>{{ ACTION_KIND_LABELS[kind] }}
      </span>
      <template v-if="view === 'pace'">
        <span v-if="present.instant" class="inline-flex items-center gap-1">
          <span class="rotation-chart__swatch rotation-chart__swatch--dot"></span>No field time (dot)
        </span>
      </template>
      <template v-else>
        <span v-if="present.cut" class="inline-flex items-center gap-1">
          <span class="rotation-chart__swatch rotation-chart__swatch--cut"></span>Ended early
        </span>
        <span v-if="present.swap" class="inline-flex items-center gap-1">
          <span class="rotation-chart__swatch rotation-chart__swatch--swap"></span>Swap out
        </span>
      </template>
      <span v-if="present.missing" class="inline-flex items-center gap-1">
        <span class="rotation-chart__swatch rotation-chart__mark--missing"></span>No frame data
      </span>
    </div>

    <div class="grid gap-1 mt-1">
      <div class="text-xs opacity-60">Field time vs damage, by kind of action</div>
      <RotationShareBars :rows="shareRows" group-label="Kind" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
  ACTION_KINDS,
  ACTION_KIND_LABELS,
  damageAt,
  sharesBy,
  type ActionKind,
  type StripBlock,
  type TimelineStrip,
} from "../calculator/rotationTimelineStrip";
import { useElementWidth } from "../composables/useElementWidth";
import { describeBlock, useRotationChartReadout } from "../composables/useRotationChartReadout";
import {
  chartLabel,
  compactNumber,
  fitText,
  fullNumber,
  niceMax,
  secondTicks,
  secondsToFrames,
  secondsText,
  stepPath,
  textWidth,
} from "../utils/rotationChart";
import RotationChartReadout from "./RotationChartReadout.vue";
import RotationShareBars, { type ShareBarRow } from "./RotationShareBars.vue";

const props = defineProps<{ strip: TimelineStrip }>();

const emit = defineEmits<{ select: [id: string] }>();

const VIEWS = [
  { id: "pace", label: "Pace" },
  { id: "detailed", label: "Detailed" },
] as const;
type View = (typeof VIEWS)[number]["id"];
const view = ref<View>("pace");

const paceCaption = "Damage so far over the rotation's game time. Steep stretches are your burst.";
const detailedCaption = "What you did and for how long, with each action's damage under it.";

const root = ref<HTMLElement | null>(null);
const width = useElementWidth(root);
const narrow = computed(() => width.value < 480);

/** Kind colors come from CSS variables so light and dark get their own steps. */
function kindColor(kind: ActionKind): string {
  return `var(--rotation-kind-${kind})`;
}

function colorOf(block: StripBlock): string {
  return block.missing ? "var(--rotation-missing)" : kindColor(block.kind);
}

const total = computed(() => Math.max(1, props.strip.totalFrames));
const finalDamage = computed(() => props.strip.cumulative[props.strip.cumulative.length - 1]?.value ?? 0);

// ---------- Pace ----------
const pace = computed(() => {
  const left = 40;
  const right = 10;
  const top = 12;
  const plotH = narrow.value ? 130 : 170;
  const bottom = top + plotH;
  const bandY = bottom + 8;
  const bandH = 14;
  const tickY = bandY + bandH + 15;
  const innerW = Math.max(1, width.value - left - right);
  const x = (frame: number) => left + (frame / total.value) * innerW;
  const yMax = niceMax(finalDamage.value);
  const y = (value: number) => bottom - (value / yMax) * plotH;

  const line = stepPath(props.strip.cumulative, x, y, total.value);
  const area = `${line} V${bottom} H${x(0).toFixed(1)} Z`;
  const gridlines = [0, yMax / 2, yMax].map((value) => ({ value, y: y(value), label: compactNumber(value) }));

  // The three biggest hits get a name where they land. Labels on the right
  // half hang above-left of the point, where the rising line has already
  // passed; labels on the left half sit below-right, inside the filled area.
  const biggest = props.strip.blocks
    .filter((block) => block.isDamage && block.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);
  const labels = biggest
    .map((block) => {
      const px = x(block.landingFrame);
      const py = y(damageAt(props.strip, block.landingFrame));
      const onRight = px > left + innerW * 0.55;
      const room = onRight ? px - 8 - left : width.value - right - px - 8;
      return {
        id: block.id,
        px,
        py,
        color: colorOf(block),
        anchor: onRight ? "end" : "start",
        tx: onRight ? px - 8 : px + 8,
        ty: onRight ? py - 8 : py + 16,
        text: fitText(`${chartLabel(block.label)} +${compactNumber(block.value)}`, room),
      };
    })
    .sort((a, b) => a.ty - b.ty);
  // Push overlapping labels apart, then keep them inside the plot.
  for (let i = 1; i < labels.length; i++) {
    labels[i].ty = Math.max(labels[i].ty, labels[i - 1].ty + 14);
  }
  for (const label of labels) label.ty = Math.min(Math.max(label.ty, top + 10), bottom - 4);

  const band = props.strip.blocks.map((block) => {
    const round = block.frames === 0;
    const x0 = x(round ? block.landingFrame : block.startFrame);
    // No mark is narrower than 6px, so short actions stay tappable.
    return { block, round, x: round ? x0 : x0 + 0.5, w: Math.max(6, x(block.startFrame + block.frames) - x0 - 1), color: colorOf(block) };
  });

  return {
    left,
    right,
    top,
    bottom,
    bandY,
    bandH,
    tickY,
    height: tickY + 4,
    x,
    innerW,
    line,
    area,
    gridlines,
    labels: labels.filter((label) => label.text),
    band,
    ticks: secondTicks(total.value, innerW).map((t) => ({ t, x: x(secondsToFrames(t)) })),
  };
});

// ---------- Detailed ----------
const detailed = computed(() => {
  const left = 8;
  const right = 8;
  const rowY = 10;
  const rowH = 30;
  const barTop = rowY + rowH + 26;
  const barBase = barTop + (narrow.value ? 90 : 110);
  const tickY = barBase + 15;
  const innerW = Math.max(1, width.value - left - right);
  const timed = props.strip.blocks.filter((block) => block.frames > 0);
  const instants = props.strip.blocks.filter((block) => block.frames === 0);
  const fieldEnd = Math.max(1, ...timed.map((block) => block.startFrame + block.frames));
  const pinRoom = instants.length ? Math.min(20 + instants.length * 24, innerW * 0.35) : 0;
  const x = (frame: number) => left + (frame / fieldEnd) * (innerW - pinRoom);
  const yMax = niceMax(props.strip.maxValue);
  const barY = (value: number) => barBase - (value / yMax) * (barBase - barTop);
  const pinX = instants.length ? x(fieldEnd) + 4 : null;
  const pinStep = instants.length ? (pinRoom - 12) / instants.length : 0;

  const items = props.strip.blocks.map((block) => {
    const color = colorOf(block);
    if (block.frames === 0) {
      const cx = x(fieldEnd) + 12 + pinStep * (instants.indexOf(block) + 0.5);
      const barW = Math.max(6, Math.min(14, pinStep - 4));
      return {
        block,
        color,
        diamond: true,
        cx,
        x: cx,
        w: 0,
        barW,
        barY: barY(block.value),
        cut: false,
        text: "",
        valueText: pinStep >= textWidth(compactNumber(block.value)) + 2 ? compactNumber(block.value) : "",
      };
    }
    const x0 = x(block.startFrame) + 1;
    const w = Math.max(6, x(block.startFrame + block.frames) - x0 - 1);
    const valueText = compactNumber(block.value);
    return {
      block,
      color,
      diamond: false,
      cx: x0 + w / 2,
      x: x0,
      w,
      barW: Math.max(6, Math.min(w - 6, 40)),
      barY: barY(block.value),
      cut: ["cancel", "dash", "jump"].includes(block.end),
      // A label cut to a few letters says nothing; the readout names it.
      text: blockLabel(chartLabel(block.label), w - 8),
      valueText: w >= textWidth(valueText) + 4 ? valueText : "",
    };
  });

  return {
    left,
    right,
    rowY,
    rowH,
    barBase,
    tickY,
    height: tickY + 4,
    items,
    pinX,
    pinCenter: pinX === null ? 0 : pinX + (width.value - right - pinX) / 2,
    ticks: secondTicks(fieldEnd, innerW - pinRoom).map((t) => ({ t, x: x(secondsToFrames(t)) })),
  };
});

function blockLabel(label: string, room: number): string {
  const text = fitText(label, room);
  return text === label || text.length >= 7 ? text : "";
}

// ---------- Hover and tap ----------
const { active, clear, markAttrs, markEvents } = useRotationChartReadout(describeBlock, (id) => emit("select", id));
const crosshair = ref<number | null>(null);

watch([view, () => props.strip], () => {
  active.value = null;
  crosshair.value = null;
});

function onPacePointer(event: PointerEvent) {
  const svg = (event.currentTarget as SVGElement).ownerSVGElement;
  if (!svg) return;
  const px = event.clientX - svg.getBoundingClientRect().left;
  const { left, innerW } = pace.value;
  const frame = Math.min(total.value, Math.max(0, ((px - left) / innerW) * total.value));
  crosshair.value = pace.value.x(frame);
  const doing = props.strip.blocks.find(
    (block) => block.frames > 0 && frame >= block.startFrame && frame < block.startFrame + block.frames,
  );
  active.value = {
    title: secondsText(frame),
    detail: `${fullNumber(damageAt(props.strip, frame))} damage so far${doing ? ` · doing ${doing.label}` : ""}`,
  };
}

function onLeave(event: PointerEvent) {
  clear(event);
  if (event.pointerType === "mouse") crosshair.value = null;
}

// ---------- Legend and summary ----------
const presentKinds = computed(() => ACTION_KINDS.filter((kind) => props.strip.blocks.some((block) => block.kind === kind)));

const present = computed(() => {
  const timed = props.strip.blocks.filter((block) => block.frames > 0);
  return {
    cut: timed.some((block) => ["cancel", "dash", "jump"].includes(block.end)),
    swap: timed.some((block) => block.end === "swap"),
    instant: props.strip.blocks.some((block) => block.frames === 0 && !block.missing),
    missing: props.strip.blocks.some((block) => block.missing),
  };
});

const shareRows = computed<ShareBarRow[]>(() =>
  sharesBy(props.strip, (block) => block.kind, ACTION_KINDS).map((row) => ({
    key: row.key,
    name: ACTION_KIND_LABELS[row.key],
    color: kindColor(row.key),
    ink: `var(--rotation-kind-${row.key}-ink, #0b0b0b)`,
    frames: row.frames,
    value: row.value,
  })),
);
</script>

<style lang="scss">
// Kind colors: a validated categorical order (blue, orange, aqua, violet,
// yellow, magenta), with separate steps for dark (the default) and light.
.rotation-chart {
  --rotation-kind-introOutro: #3987e5;
  --rotation-kind-basic: #d95926;
  --rotation-kind-skill: #199e70;
  --rotation-kind-forte: #9085e9;
  --rotation-kind-liberation: #c98500;
  --rotation-kind-echo: #d55181;
  --rotation-kind-other: #898781;
  --rotation-missing: oklch(var(--wa) / 0.8);
}
html[data-theme-style="light"] .rotation-chart {
  --rotation-kind-introOutro: #2a78d6;
  --rotation-kind-basic: #eb6834;
  --rotation-kind-skill: #1baf7a;
  --rotation-kind-forte: #6250d6;
  --rotation-kind-forte-ink: #ffffff;
  --rotation-kind-liberation: #eda100;
  --rotation-kind-echo: #e87ba4;
}
</style>

<style scoped lang="scss">
.rotation-chart__svg {
  display: block;
  max-width: 100%;
  overflow: visible;
  touch-action: pan-y;
  text {
    font-size: 11px;
  }
}
.rotation-chart__axis {
  line {
    stroke: oklch(var(--bc) / 0.12);
  }
  text {
    fill: oklch(var(--bc) / 0.55);
    font-variant-numeric: tabular-nums;
  }
}
.rotation-chart__axis-text {
  fill: oklch(var(--bc) / 0.55);
}
.rotation-chart__area {
  fill: oklch(var(--p) / 0.14);
}
.rotation-chart__line {
  fill: none;
  stroke: oklch(var(--p));
  stroke-width: 2;
  stroke-linejoin: round;
}
.rotation-chart__crosshair {
  stroke: oklch(var(--bc) / 0.5);
  stroke-dasharray: 3 3;
  pointer-events: none;
}
.rotation-chart__hit {
  fill: transparent;
  cursor: crosshair;
}
.rotation-chart__no-hit {
  pointer-events: none;
}
.rotation-chart__dot {
  stroke: oklch(var(--b1));
  stroke-width: 2;
}
// Labels and values wear ink, never the series color, with a halo so they
// stay readable over the line and fills.
.rotation-chart__label,
.rotation-chart__value {
  fill: oklch(var(--bc));
  paint-order: stroke;
  stroke: oklch(var(--b1));
  stroke-width: 3px;
  stroke-linejoin: round;
}
.rotation-chart__value {
  fill: oklch(var(--bc) / 0.75);
  font-variant-numeric: tabular-nums;
}
.rotation-chart__label {
  font-weight: 500;
}
.rotation-chart__mark {
  cursor: pointer;
  outline: none;
  &:hover,
  &:focus-visible {
    filter: brightness(1.2);
    stroke: oklch(var(--bc));
    stroke-width: 1.5;
  }
}
.rotation-chart__block {
  fill: color-mix(in oklab, var(--mark-color) 28%, transparent);
}
.rotation-chart__mark--faded {
  opacity: 0.5;
}
.rotation-chart__mark--missing {
  fill: oklch(var(--wa) / 0.8);
  background: repeating-linear-gradient(-45deg, oklch(var(--wa) / 0.8) 0 3px, oklch(var(--wa) / 0.3) 3px 6px);
}
.rotation-chart__notch {
  fill: oklch(var(--b1));
}
.rotation-chart__swap {
  fill: oklch(var(--bc) / 0.8);
}
.rotation-chart__baseline {
  stroke: oklch(var(--bc) / 0.2);
}
.rotation-chart__divider {
  stroke: oklch(var(--bc) / 0.2);
  stroke-dasharray: 2 3;
}
.rotation-chart__swatch {
  display: inline-block;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 3px;
}
.rotation-chart__swatch--dot {
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
  background: oklch(var(--bc) / 0.6);
}
.rotation-chart__swatch--cut {
  background: oklch(var(--bc) / 0.45);
  clip-path: polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%);
}
.rotation-chart__swatch--swap {
  background: oklch(var(--bc) / 0.25);
  box-shadow: inset -2px 0 0 oklch(var(--bc) / 0.8);
}
</style>
