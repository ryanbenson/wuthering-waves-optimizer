<template>
  <div class="bg-base-200 rounded-xl p-4 flex flex-col gap-3" data-test-optimizer-workspace-tradeoff>
    <div class="flex items-center justify-between gap-2">
      <div class="text-xs font-bold uppercase tracking-wider opacity-50">Damage vs Energy Regen</div>
      <button type="button" class="btn btn-xs btn-neutral" @click="visible = !visible">
        {{ visible ? "Hide" : "Show" }}
      </button>
    </div>
    <div v-show="visible" class="relative h-72">
      <canvas ref="chartCanvas"></canvas>
      <span ref="primaryProbe" class="text-primary hidden"></span>
    </div>
    <!-- HTML tooltip on <body>: the canvas one is clipped at the chart's edge when several dots overlap. -->
    <Teleport to="body">
      <div
        ref="tooltipEl"
        class="fixed z-50 pointer-events-none gap-x-6 gap-y-2 rounded-lg border border-base-300 bg-base-100 p-2 text-xs font-mono text-base-content shadow-lg"
        style="display: none"
        data-test-optimizer-workspace-tradeoff-tooltip></div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useCharacterStore } from "../../stores/character";
import { getCuratedSubstatWeights } from "../../characters/substatPriorities";
import { getTooltipStatLines, placeTooltip } from "./optimizerTradeoffTooltip";
import { statWithDelta } from "../../utils/statDelta";
import { buildTradeoffPoints, type TradeoffPoint, type TradeoffRow } from "./optimizerTradeoffPoints";

defineOptions({ name: "OptimizerWorkspaceTradeoffChart" });

const props = defineProps<{
  character: string;
  rows: TradeoffRow[];
  characterElement?: string | null;
  selectedIndex: number;
  // eslint-disable-next-line no-unused-vars
  formatValue: (value: number) => string;
}>();
const emit = defineEmits<{ select: [index: number] }>();

const visible = ref(true);
const chartCanvas = ref<HTMLCanvasElement | null>(null);
const primaryProbe = ref<HTMLElement | null>(null);
const tooltipEl = ref<HTMLElement | null>(null);
// Last mouse position over the chart, in window coordinates (the tooltip follows the
// pointer, not the dot, so the gap to it is the same on every side).
let mouse = { x: 0, y: 0 };
const trackMouse = (e: MouseEvent) => (mouse = { x: e.clientX, y: e.clientY });

function hideTooltip() {
  if (tooltipEl.value) tooltipEl.value.style.display = "none";
}

const characterStore = useCharacterStore();
const points = computed(() => buildTradeoffPoints(props.rows));
// The stats worth showing for this character: its substat weights (curated, or
// the user's own in the app); null falls back to a default list.
const tooltipLines = computed(() => {
  const own = (characterStore.characters as any)?.[props.character]?.substatWeights;
  const hasWeights = !!getCuratedSubstatWeights(props.character) || !!own;
  return getTooltipStatLines(
    hasWeights ? characterStore.getCharacterSubstatWeights(props.character) : null,
    props.characterElement,
  );
});
const minEr = computed<number | null>(() => {
  const stats = (characterStore.characters as any)?.[props.character]?.optimizer?.minStats;
  const m = Array.isArray(stats) ? stats.find((s: any) => s.stat === "energyRegen") : null;
  const v = m ? parseFloat(m.minValue) : NaN;
  return Number.isFinite(v) && v > 0 ? v : null;
});

const ER_AXIS_FLOOR = 95;

// Chart.js grace pads 10% of the data range each side; only step in when that would dip under the floor.
function xAxisMin(pts: TradeoffPoint[]): number | undefined {
  const xs = pts.map((p) => p.x).concat(minEr.value ?? []);
  if (!xs.length) return undefined;
  const lo = Math.min(...xs);
  const padded = lo - (Math.max(...xs) - lo) * 0.1;
  return padded < ER_AXIS_FLOOR ? ER_AXIS_FLOOR : undefined;
}

function initChart() {
  const canvas = chartCanvas.value;
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx) return;
  Chart.getChart(canvas)?.destroy();
  hideTooltip();
  // Computed colours follow the active DaisyUI theme (light/dark) via CSS.
  const text = getComputedStyle(canvas).color;
  const primary = primaryProbe.value ? getComputedStyle(primaryProbe.value).color : text;
  const gray = "rgba(128,128,128,0.55)";
  const grid = "rgba(128,128,128,0.15)";
  const sel = props.selectedIndex;
  const pts = points.value;
  const lines = tooltipLines.value;
  const currentStats = pts.find((p) => p.isCurrent)?.stats ?? null;
  const isSel = (p: TradeoffPoint) => p.index === sel && !p.isCurrent;
  const labelled = (p: TradeoffPoint) => p.isCurrent || p.index === sel;
  const dotColor = (p: TradeoffPoint) => (isSel(p) ? primary : p.isCurrent ? text : gray);

  // Every row is VALUE (+/-DELTA) vs the current set; the current set shows plain values.
  const tooltipRows = (p: TradeoffPoint) => {
    const compareTo = p.isCurrent ? null : currentStats;
    const dmgDelta = p.isCurrent ? null : p.deltaPercent;
    return [
      {
        label: "Dmg",
        text: props.formatValue(p.y),
        delta: dmgDelta,
        deltaText: dmgDelta === null ? null : `${dmgDelta >= 0 ? "+" : ""}${dmgDelta.toFixed(1)}%`,
      },
      ...lines.map((line) => ({ label: line.label, ...statWithDelta(line, p.stats[line.key] ?? 0, compareTo?.[line.key]) })),
    ];
  };

  const renderTooltip = ({ tooltip }: { tooltip: any }) => {
    const el = tooltipEl.value;
    if (!el) return;
    if (!tooltip.opacity || !tooltip.dataPoints?.length) return hideTooltip();
    const entries: TradeoffPoint[] = tooltip.dataPoints.map((d: { dataIndex: number }) => pts[d.dataIndex]);
    el.replaceChildren(
      ...entries.map((p) => {
        const block = document.createElement("div");
        const title = document.createElement("div");
        title.className = "font-bold";
        title.textContent = p.isCurrent ? "Current" : `#${p.index + 1}`;
        block.append(title);
        for (const row of tooltipRows(p)) {
          const line = document.createElement("div");
          line.append(`${row.label}: ${row.text}`);
          if (row.deltaText !== null && row.delta !== null) {
            const delta = document.createElement("span");
            delta.className = row.delta >= 0 ? "text-success" : "text-error";
            delta.textContent = ` (${row.deltaText})`;
            line.append(delta);
          }
          block.append(line);
        }
        return block;
      }),
    );
    // Measure at the window's top-left so the width isn't squeezed by the previous position;
    // up to 3 entries side by side, fewer when that's wider than the window.
    el.style.display = "grid";
    el.style.left = "0px";
    el.style.top = "0px";
    for (let cols = Math.min(entries.length, 3); cols >= 1; cols--) {
      el.style.gridTemplateColumns = `repeat(${cols}, max-content)`;
      if (el.offsetWidth <= window.innerWidth - 16) break;
    }
    const { left, top } = placeTooltip(
      mouse,
      { width: el.offsetWidth, height: el.offsetHeight },
      { width: window.innerWidth, height: window.innerHeight },
    );
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
  };

  const minLine = {
    id: "minErLine",
    afterDatasetsDraw(chart: Chart) {
      if (minEr.value === null) return;
      const { ctx, chartArea, scales } = chart;
      const x = scales.x.getPixelForValue(minEr.value);
      if (x < chartArea.left || x > chartArea.right) return;
      ctx.save();
      ctx.strokeStyle = text;
      ctx.fillStyle = text;
      ctx.globalAlpha = 0.6;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(x, chartArea.top);
      ctx.lineTo(x, chartArea.bottom);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = "11px sans-serif";
      ctx.fillText("min", x + 4, chartArea.top + 11);
      ctx.restore();
    },
  };

  new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [
        {
          data: pts as any,
          pointStyle: pts.map((p) => (p.isCurrent ? "rectRot" : "circle")),
          pointRadius: pts.map((p) => (p.isCurrent ? 8 : isSel(p) ? 7 : 3)),
          pointHoverRadius: pts.map((p) => (p.isCurrent ? 9 : isSel(p) ? 8 : 5)),
          backgroundColor: pts.map(dotColor),
          borderColor: pts.map(dotColor),
          datalabels: {
            display: (c: any) => labelled(pts[c.dataIndex]),
            formatter: (_v: unknown, c: any) =>
              pts[c.dataIndex].isCurrent ? "Current" : `#${pts[c.dataIndex].index + 1}`,
            color: text,
            align: "top",
            offset: 6,
            font: { weight: "bold" },
          },
        } as any,
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      onClick: (_e, els) => {
        if (els.length) emit("select", pts[els[0].index].index);
      },
      onHover: (e, els) => {
        const t = e.native?.target as HTMLElement | undefined;
        if (t) t.style.cursor = els.length ? "pointer" : "default";
      },
      scales: {
        x: {
          // Room around the points, and keep the min ER line on screen even when every
          // loadout is above it. ER can't go below 100%, so the axis stops at 95%.
          suggestedMin: minEr.value ?? undefined,
          grace: "10%",
          min: xAxisMin(pts),
          title: { display: true, text: "Energy Regen (%)", color: text },
          ticks: { color: text, callback: (v) => `${Math.round(Number(v))}%` },
          grid: { color: grid },
        },
        y: {
          grace: "10%",
          title: { display: true, text: "Damage", color: text },
          ticks: { color: text, callback: (v) => props.formatValue(Number(v)) },
          grid: { color: grid },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false, external: renderTooltip },
      },
    },
    plugins: [ChartDataLabels, minLine],
  });
}

watch([points, () => props.selectedIndex, minEr, tooltipLines], initChart, { flush: "post" });
// The canvas is sized 0 while hidden; rebuild once shown again.
watch(visible, (v) => v && nextTick(initChart));
onMounted(() => {
  // Before initChart, so this runs ahead of Chart.js's own mousemove handler.
  chartCanvas.value?.addEventListener("mousemove", trackMouse);
  initChart();
});
onBeforeUnmount(() => {
  chartCanvas.value?.removeEventListener("mousemove", trackMouse);
  hideTooltip();
  if (chartCanvas.value) Chart.getChart(chartCanvas.value)?.destroy();
});
</script>
