<template>
  <div ref="root" class="rotation-chart grid gap-2" data-test-team-rotation-lanes-chart>
    <div class="text-xs opacity-60">
      Who is on field over the rotation's game time, one row per character. Rings are off-field hits; the line under
      the rows is the team's damage so far.
    </div>

    <svg
      class="lanes-chart__svg"
      :width="width"
      :height="layout.height"
      :viewBox="`0 0 ${width} ${layout.height}`"
      role="img"
      aria-label="One row per character showing when each is on field, their off-field hits, and the team's running damage">
      <g v-for="lane in layout.lanes" :key="lane.slot">
        <rect
          class="lanes-chart__lane"
          :x="layout.left"
          :y="lane.y"
          :width="layout.innerW"
          :height="layout.laneH"
          rx="6" />
        <template v-if="narrow">
          <text class="lanes-chart__name" :x="layout.left" :y="lane.titleY">
            {{ lane.name }}<tspan class="lanes-chart__muted"> · {{ lane.shareText }}</tspan>
          </text>
        </template>
        <template v-else>
          <text class="lanes-chart__name" :x="layout.left - 8" :y="lane.y + layout.laneH / 2 + 4" text-anchor="end">
            {{ lane.name }}
          </text>
          <text class="lanes-chart__share" :x="width - layout.right + 8" :y="lane.y + layout.laneH / 2 - 2">
            {{ lane.valueText }}
          </text>
          <text class="lanes-chart__muted" :x="width - layout.right + 8" :y="lane.y + layout.laneH / 2 + 11">
            {{ lane.shareText }}
          </text>
        </template>
      </g>

      <line
        v-for="swap in layout.swaps"
        :key="swap"
        class="lanes-chart__swap-line"
        :x1="swap"
        :x2="swap"
        :y1="layout.lanesTop - 2"
        :y2="layout.lanesBottom + 2" />

      <template v-for="mark in layout.marks" :key="mark.block.id">
        <circle
          v-if="mark.ring"
          class="rotation-chart__mark lanes-chart__ring"
          :cx="mark.x"
          :cy="mark.cy"
          :r="mark.r"
          :style="{ stroke: mark.color }"
          v-bind="markAttrs(mark.block)"
          v-on="markEvents(mark.block)" />
        <template v-else>
          <rect
            class="rotation-chart__mark"
            :class="{ 'lanes-chart__missing': mark.block.missing }"
            :x="mark.x"
            :y="mark.y"
            :width="mark.w"
            :height="mark.h"
            rx="3"
            :style="{ fill: mark.color }"
            v-bind="markAttrs(mark.block)"
            v-on="markEvents(mark.block)" />
          <path
            v-if="mark.cut"
            class="lanes-chart__notch"
            :d="`M${mark.x + mark.w - 7} ${mark.y} H${mark.x + mark.w} V${mark.y + 7} Z`"
            data-test-rotation-chart-notch />
        </template>
      </template>

      <text
        v-for="label in layout.stintLabels"
        :key="label.key"
        class="lanes-chart__stint-label"
        :x="label.x"
        :y="label.y"
        text-anchor="middle">
        {{ label.text }}
      </text>

      <g class="lanes-chart__axis">
        <line :x1="layout.left" :x2="width - layout.right" :y1="layout.totalBottom" :y2="layout.totalBottom" />
      </g>
      <path class="lanes-chart__total-area" :d="layout.totalArea" />
      <path class="lanes-chart__total-line" :d="layout.totalLine" />
      <text
        v-if="narrow"
        class="lanes-chart__muted"
        :x="layout.left"
        :y="layout.totalTop - 6">
        Team damage so far · {{ layout.finalText }}
      </text>
      <template v-else>
        <text class="lanes-chart__muted" :x="layout.left - 8" :y="layout.totalTop + 10" text-anchor="end">
          Team total
        </text>
        <text class="lanes-chart__share" :x="width - layout.right + 8" :y="layout.totalTop + 10">
          {{ layout.finalText }}
        </text>
      </template>
      <line
        v-if="crosshair !== null"
        class="lanes-chart__crosshair"
        :x1="crosshair"
        :x2="crosshair"
        :y1="layout.lanesTop"
        :y2="layout.totalBottom" />
      <rect
        class="lanes-chart__hit"
        :x="layout.left"
        :y="layout.totalTop"
        :width="layout.innerW"
        :height="layout.totalBottom - layout.totalTop"
        @pointerdown="onTotalPointer"
        @pointermove="onTotalPointer"
        @pointerleave="onLeave" />
      <g class="lanes-chart__axis">
        <text v-for="tick in layout.ticks" :key="tick.t" :x="tick.x" :y="layout.tickY" text-anchor="middle">
          {{ tick.t }}s
        </text>
      </g>
    </svg>

    <RotationChartReadout :item="active" hint="Hover or tap the chart for details." @select="emit('select', $event)" />

    <div class="flex flex-wrap gap-x-3 gap-y-1 text-[11px] opacity-80" data-test-rotation-timeline-legend>
      <span v-for="lane in layout.lanes" :key="lane.slot" class="inline-flex items-center gap-1">
        <span class="lanes-chart__swatch" :style="{ background: lane.color }"></span>{{ lane.name }}
      </span>
      <span v-if="present.ring" class="inline-flex items-center gap-1">
        <span class="lanes-chart__swatch lanes-chart__swatch--ring"></span>Off-field hit (sized by damage)
      </span>
      <span v-if="present.cut" class="inline-flex items-center gap-1">
        <span class="lanes-chart__swatch lanes-chart__swatch--cut"></span>Ended early
      </span>
      <span v-if="present.missing" class="inline-flex items-center gap-1">
        <span class="lanes-chart__swatch lanes-chart__missing"></span>No frame data
      </span>
    </div>

    <div class="grid gap-1 mt-1">
      <div class="text-xs opacity-60">Field time vs damage, by character</div>
      <RotationShareBars :rows="shareRows" group-label="Character" />
    </div>

    <div v-if="stintRows.length" class="grid gap-1 mt-1">
      <div class="text-xs opacity-60">Turns on field, with the damage the whole team did during each</div>
      <div class="overflow-x-auto">
        <table class="table table-xs" data-test-team-rotation-stints>
          <thead>
            <tr>
              <th>#</th>
              <th>On field</th>
              <th class="hidden sm:table-cell">Actions</th>
              <th class="text-right">From – to</th>
              <th class="text-right">Damage</th>
              <th class="text-right">DPS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in shownStints" :key="row.index" data-test-team-rotation-stint>
              <td class="font-mono">{{ row.index }}</td>
              <td class="whitespace-nowrap">
                <span class="lanes-chart__swatch mr-1.5" :style="{ background: row.color }"></span>{{ row.name }}
              </td>
              <td class="hidden sm:table-cell">{{ row.actions }}</td>
              <td class="text-right font-mono whitespace-nowrap">{{ row.span }}</td>
              <td class="text-right font-mono">{{ row.damage }}</td>
              <td class="text-right font-mono">{{ row.dps }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <button
        v-if="stintRows.length > STINTS_SHOWN"
        type="button"
        class="btn btn-ghost btn-xs w-fit"
        data-test-team-rotation-stints-toggle
        @click="showAllStints = !showAllStints">
        {{ showAllStints ? "Show fewer" : `Show all ${stintRows.length} turns` }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { framesToSeconds } from "../calculator/rotationTiming";
import {
  buildStints,
  damageAt,
  sharesBy,
  type StripBlock,
  type TimelineStrip,
} from "../calculator/rotationTimelineStrip";
import { useElementWidth } from "../composables/useElementWidth";
import { describeBlock, useRotationChartReadout } from "../composables/useRotationChartReadout";
import { palette } from "../utils/chartColors";
import {
  chartLabel,
  compactNumber,
  fitText,
  fullNumber,
  niceMax,
  secondTicks,
  secondsText,
  secondsToFrames,
  stepPath,
  textWidth,
} from "../utils/rotationChart";
import RotationChartReadout from "./RotationChartReadout.vue";
import RotationShareBars, { type ShareBarRow } from "./RotationShareBars.vue";

const props = defineProps<{
  strip: TimelineStrip;
  /** Each slot's character name; also decides which rows show. */
  slotNames: Array<string | null>;
}>();

const emit = defineEmits<{ select: [id: string] }>();

const STINTS_SHOWN = 8;

const root = ref<HTMLElement | null>(null);
const width = useElementWidth(root);
const narrow = computed(() => width.value < 480);

/** The same per-slot colors as the team summary page's charts. */
function slotColor(slot: number | null): string {
  return palette[(slot ?? 0) % palette.length];
}

function slotName(slot: number | null): string {
  return (slot != null && props.slotNames[slot]) || `Slot ${(slot ?? 0) + 1}`;
}

const total = computed(() => Math.max(1, props.strip.totalFrames));
const stints = computed(() => buildStints(props.strip));
const shares = computed(() => sharesBy(props.strip, (block) => block.slot ?? 0, [0, 1, 2]));
const teamDamage = computed(() => shares.value.reduce((sum, row) => sum + row.value, 0));

const layout = computed(() => {
  const isNarrow = narrow.value;
  const left = isNarrow ? 4 : 96;
  // Room for a ring at the very end.
  const right = isNarrow ? 10 : 84;
  const laneH = isNarrow ? 30 : 38;
  const innerW = Math.max(1, width.value - left - right);
  const x = (frame: number) => left + (frame / total.value) * innerW;

  const slots = [0, 1, 2].filter(
    (slot) => props.slotNames[slot] || props.strip.blocks.some((block) => block.slot === slot),
  );
  let cursor = 4;
  const laneY = new Map<number, number>();
  const lanes = slots.map((slot) => {
    const titleY = cursor + 11;
    if (isNarrow) cursor += 16;
    const y = cursor;
    laneY.set(slot, y);
    cursor += laneH + 6;
    const value = shares.value.find((row) => row.key === slot)?.value ?? 0;
    const pct = teamDamage.value > 0 ? Math.round((value / teamDamage.value) * 100) : 0;
    return {
      slot,
      y,
      titleY,
      color: slotColor(slot),
      name: isNarrow ? slotName(slot) : fitText(slotName(slot), left - 12) || slotName(slot).slice(0, 2),
      valueText: compactNumber(value),
      shareText: `${pct}% of damage`,
    };
  });
  const lanesTop = 4 + (isNarrow ? 16 : 0);
  const lanesBottom = cursor - 6;
  const laneOf = (block: StripBlock) => laneY.get(block.slot ?? 0) ?? lanesTop;

  const offValues = props.strip.blocks.filter((block) => block.frames === 0).map((block) => block.value);
  const maxOff = Math.max(1, ...offValues);
  const marks = props.strip.blocks.map((block) => {
    const top = laneOf(block);
    const color = block.missing ? "var(--rotation-missing)" : slotColor(block.slot);
    if (block.frames === 0 && !block.missing) {
      // Off-field hits: rings sized by damage, in their character's row.
      return { block, ring: true, x: x(block.landingFrame), cy: top + laneH / 2, r: 4 + 3 * (block.value / maxOff), color, y: 0, w: 0, h: 0, cut: false };
    }
    const x0 = x(block.startFrame) + 0.5;
    return {
      block,
      ring: false,
      x: x0,
      // No mark is narrower than 6px, so short actions stay tappable.
      w: Math.max(6, x(block.startFrame + block.frames) - x0 - 1),
      y: top + 3,
      h: laneH - 6,
      cy: 0,
      r: 0,
      color,
      cut: ["cancel", "dash", "jump"].includes(block.end),
    };
  });

  // One label per turn on field: its biggest action, plus how many more,
  // since single actions are usually too short to name in place.
  const stintLabels = stints.value.flatMap((stint, index) => {
    const w = x(stint.endFrame) - x(stint.startFrame) - 6;
    const biggest = stint.blocks.reduce((best, block) => (block.value > best.value ? block : best));
    const more = stint.blocks.length > 1 ? ` +${stint.blocks.length - 1}` : "";
    const name = chartLabel(biggest.label);
    const full = `${name}${more}`;
    const text = textWidth(full) <= w ? full : fitText(name, w);
    if (!text) return [];
    return [{ key: index, x: (x(stint.startFrame) + x(stint.endFrame)) / 2, y: (laneY.get(stint.slot ?? 0) ?? 0) + laneH / 2 + 4, text }];
  });

  // On a phone the total's title sits on its own line above the area.
  const totalTop = lanesBottom + (isNarrow ? 26 : 12);
  const totalBottom = totalTop + (isNarrow ? 44 : 56);
  const finalValue = damageAt(props.strip, Number.POSITIVE_INFINITY);
  const yMax = niceMax(finalValue);
  const y = (value: number) => totalBottom - (value / yMax) * (totalBottom - totalTop);
  const totalLine = stepPath(props.strip.cumulative, x, y, total.value);
  const tickY = totalBottom + 15;

  return {
    left,
    right,
    innerW,
    laneH,
    x,
    lanes,
    lanesTop,
    lanesBottom,
    marks,
    swaps: stints.value.slice(1).map((stint) => x(stint.startFrame)),
    stintLabels,
    totalTop,
    totalBottom,
    totalLine,
    totalArea: `${totalLine} V${totalBottom} H${x(0).toFixed(1)} Z`,
    finalText: compactNumber(finalValue),
    tickY,
    height: tickY + 4,
    ticks: secondTicks(total.value, innerW).map((t) => ({ t, x: x(secondsToFrames(t)) })),
  };
});

// ---------- Hover and tap ----------
const { active, clear, markAttrs, markEvents } = useRotationChartReadout(
  (block) => describeBlock(block, slotName(block.slot)),
  (id) => emit("select", id),
);
const crosshair = ref<number | null>(null);

watch(
  () => props.strip,
  () => {
    active.value = null;
    crosshair.value = null;
  },
);

function onTotalPointer(event: PointerEvent) {
  const svg = (event.currentTarget as SVGElement).ownerSVGElement;
  if (!svg) return;
  const px = event.clientX - svg.getBoundingClientRect().left;
  const { left, innerW } = layout.value;
  const frame = Math.min(total.value, Math.max(0, ((px - left) / innerW) * total.value));
  crosshair.value = layout.value.x(frame);
  const stint = stints.value.find((entry) => frame >= entry.startFrame && frame < entry.endFrame);
  active.value = {
    title: secondsText(frame),
    detail: `${fullNumber(damageAt(props.strip, frame))} team damage so far${stint ? ` · ${slotName(stint.slot)} on field` : ""}`,
  };
}

function onLeave(event: PointerEvent) {
  clear(event);
  if (event.pointerType === "mouse") crosshair.value = null;
}

// ---------- Legend, shares and turns ----------
const present = computed(() => ({
  ring: props.strip.blocks.some((block) => block.frames === 0 && !block.missing),
  cut: props.strip.blocks.some((block) => block.frames > 0 && ["cancel", "dash", "jump"].includes(block.end)),
  missing: props.strip.blocks.some((block) => block.missing),
}));

const shareRows = computed<ShareBarRow[]>(() =>
  shares.value.map((row) => ({
    key: String(row.key),
    name: slotName(row.key),
    color: slotColor(row.key),
    frames: row.frames,
    value: row.value,
  })),
);

const stintRows = computed(() =>
  stints.value.map((stint, index) => {
    const seconds = framesToSeconds(stint.endFrame - stint.startFrame);
    return {
      index: index + 1,
      name: slotName(stint.slot),
      color: slotColor(stint.slot),
      actions: stint.blocks.map((block) => block.label).join(", "),
      span: `${framesToSeconds(stint.startFrame).toFixed(1)}–${framesToSeconds(stint.endFrame).toFixed(1)}s`,
      damage: fullNumber(stint.value),
      dps: seconds > 0 ? fullNumber(stint.value / seconds) : "—",
    };
  }),
);

const showAllStints = ref(false);
const shownStints = computed(() => (showAllStints.value ? stintRows.value : stintRows.value.slice(0, STINTS_SHOWN)));
</script>

<style scoped lang="scss">
.rotation-chart {
  --rotation-missing: oklch(var(--wa) / 0.8);
}
.lanes-chart__svg {
  display: block;
  max-width: 100%;
  overflow: visible;
  touch-action: pan-y;
  text {
    font-size: 11px;
  }
}
.lanes-chart__lane {
  fill: oklch(var(--bc) / 0.06);
}
.lanes-chart__name {
  fill: oklch(var(--bc));
  font-weight: 600;
}
.lanes-chart__share {
  fill: oklch(var(--bc));
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.lanes-chart__muted {
  fill: oklch(var(--bc) / 0.6);
  font-weight: 400;
}
.lanes-chart__swap-line {
  stroke: oklch(var(--bc) / 0.35);
  stroke-dasharray: 2 3;
  pointer-events: none;
}
// Labels inside the slot colors: near-black reads on all three.
.lanes-chart__stint-label {
  fill: #0b0b0b;
  font-weight: 600;
  pointer-events: none;
}
.lanes-chart__ring {
  fill: oklch(var(--b1));
  stroke-width: 2.5;
}
.lanes-chart__notch {
  fill: oklch(var(--b1));
  pointer-events: none;
}
.lanes-chart__missing {
  fill: oklch(var(--wa) / 0.8);
  background: repeating-linear-gradient(-45deg, oklch(var(--wa) / 0.8) 0 3px, oklch(var(--wa) / 0.3) 3px 6px);
}
.lanes-chart__axis {
  line {
    stroke: oklch(var(--bc) / 0.2);
  }
  text {
    fill: oklch(var(--bc) / 0.55);
    font-variant-numeric: tabular-nums;
  }
}
.lanes-chart__total-area {
  fill: oklch(var(--bc) / 0.08);
  pointer-events: none;
}
.lanes-chart__total-line {
  fill: none;
  stroke: oklch(var(--bc) / 0.7);
  stroke-width: 2;
  pointer-events: none;
}
.lanes-chart__crosshair {
  stroke: oklch(var(--bc) / 0.5);
  stroke-dasharray: 3 3;
  pointer-events: none;
}
.lanes-chart__hit {
  fill: transparent;
  cursor: crosshair;
}
.rotation-chart__mark {
  cursor: pointer;
  outline: none;
  &:hover,
  &:focus-visible {
    filter: brightness(1.15);
    stroke: oklch(var(--bc));
    stroke-width: 1.5;
  }
}
.lanes-chart__swatch {
  display: inline-block;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 3px;
  vertical-align: -1px;
}
.lanes-chart__swatch--ring {
  border-radius: 50%;
  border: 2px solid oklch(var(--bc) / 0.7);
}
.lanes-chart__swatch--cut {
  background: oklch(var(--bc) / 0.45);
  clip-path: polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%);
}
</style>
