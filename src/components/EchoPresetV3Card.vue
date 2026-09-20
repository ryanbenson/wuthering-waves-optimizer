<template>
  <div
    class="presetEchoes card card-bordered card-compact bg-base-100 shadow mb-2"
    data-test-echo-preset-card>
    <div class="card-body gap-3">
      <div class="min-w-0">
        <h2 class="card-title truncate">{{ name }}</h2>
        <p v-if="author" class="text-xs opacity-60">by {{ author }}</p>
        <p v-if="description" class="text-sm opacity-80 mt-1 whitespace-pre-line">{{ description }}</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-x-6 gap-y-3">
        <div class="flex flex-col gap-3 min-w-0">
          <div class="flex flex-col gap-1 text-xs">
            <template v-if="echoSets.length">
              <div v-for="set in echoSets" :key="set.key" class="flex items-center gap-1">
                <img :src="set.icon" alt="" class="size-5 shrink-0" />
                <span class="whitespace-nowrap">{{ set.count }}pc {{ set.label }}</span>
              </div>
            </template>
            <span v-else class="opacity-60">No echo sets</span>
          </div>
          <div class="flex gap-1.5">
            <div
              v-for="(echo, i) in resolvedEchoes"
              :key="i"
              class="echo__item__image rounded-full border border-solid neutral-content size-11 shrink-0 bg-cover"
              :class="[rankBorderClass(echo), { 'echo__item__image--empty': !echo?.echo }]"
              :style="{ backgroundImage: `url(${echoImage(echo)})` }"
              v-tooltip="echo?.echo ? getEchoName(echo) : 'Empty slot'"></div>
          </div>
        </div>

        <div class="flex flex-col gap-3 min-w-0">
          <div
            v-if="preview?.stats"
            class="grid grid-cols-3 gap-x-3 gap-y-1.5 text-xs"
            data-test-echo-preset-stats>
            <div v-for="stat in statRows" :key="stat.label" class="flex items-center gap-1" v-tooltip="stat.label">
              <img :src="stat.icon" class="size-4" alt="" />
              <span>{{ stat.value }}</span>
            </div>
          </div>
          <div v-else-if="loading && effectiveCharacter" class="flex items-center gap-2 text-xs opacity-60">
            <span class="loading loading-spinner loading-xs"></span>
            Loading stats…
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <span class="badge text-nowrap" :class="critValueBadgeClass" v-tooltip="'Total Crit Value'">
              CV {{ formattedCritValue }}%
            </span>
            <span
              v-if="buildScoreRollup"
              class="badge text-nowrap"
              :class="buildScoreBadgeClass"
              v-tooltip="'Build Score — average substat score for this character'">
              {{ buildScoreRollup.grade }} {{ Math.round(buildScoreRollup.percent) }}%{{ buildScoreRollup.provisional ? "*" : "" }}
            </span>
            <template v-if="showImpact">
              <span
                v-if="loading"
                class="loading loading-spinner loading-xs"
                data-test-echo-preset-impact-loading></span>
              <span
                v-else-if="preview?.impact"
                class="badge text-nowrap"
                :class="preview.impact.pct >= 0 ? 'badge-success' : 'badge-error'"
                v-tooltip="'Damage change vs. your current echoes'"
                data-test-echo-preset-impact>
                {{ formatImpact(preview.impact) }}
              </span>
            </template>
          </div>

        </div>
      </div>
      <div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <div class="actions flex flex-wrap items-center gap-2">
            <template v-if="!hideActions">
              <button
                class="btn btn-sm btn-primary"
                :disabled="isApplying"
                data-test-echo-preset-apply
                @click="emit('apply')">
                <span v-if="isApplying" class="loading loading-spinner loading-xs"></span>
                {{ isApplying ? "Applying..." : "Apply preset" }}
              </button>
              <button
                v-if="deletable"
                class="btn btn-sm btn-error btn-outline"
                :disabled="isApplying"
                @click.stop="emit('delete')">
                Delete preset
              </button>
            </template>
            <slot></slot>
          </div>
        <div class="flex items-center gap-2 ml-auto">
          <slot name="aside"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { getEchoData } from "../echoes/index";
import { getEchoCritValue, getEchoSetIconByType, getEchoSetLabelByType } from "../echoes/stats";
import { getSetBonusThreshold } from "../echoes/sets";
import { getBadgeClass } from "../composables/useEchoCardStats";
import { getRatingBadgeClasses } from "../composables/useEchoRating";
import { getSubstatScoreGrade, getGradeForSubstatScorePercent } from "../echoes/rating";
import { resolveCharacterEchoes, resolveTeamEnemyConfig } from "../calculator/buildCharacterContext";
import { estimateEchoPresetPreview, type EchoImpactDelta, type EchoPresetPreview } from "../echoes/echoImpact";
import { useInventoryStore } from "../stores/inventory";
import { useCharacterStore } from "../stores/character";
import { useSettingsStore } from "../stores/settings";
import { displayInt, displayPercentage } from "../utils/numbers";

defineOptions({ name: "EchoPresetV3Card" });

const props = withDefaults(
  defineProps<{
    /**
     * Character to score/preview against. Optional: the inventory page has no
     * character context, so it passes whoever has the preset equipped (or
     * nothing, which hides the stats and build score).
     */
    character?: string | null;
    name: string;
    description?: string;
    author?: string;
    /** 5-slot pointer map: `{ [i]: { echoId } }` for saved presets, inline echo data for prebuilt ones. */
    slots: Record<number, any>;
    isApplying?: boolean;
    deletable?: boolean;
    /** Damage-diff badge; the inventory page has no "current build" to diff against. */
    showImpact?: boolean;
    /** Hide the built-in Apply/Delete buttons (callers supply their own via the default slot). */
    hideActions?: boolean;
  }>(),
  {
    character: null,
    description: "",
    author: "",
    isApplying: false,
    deletable: false,
    showImpact: true,
    hideActions: false,
  },
);

const emit = defineEmits<{ apply: []; delete: [] }>();

const ASSET_BASE = "https://ryanbenson.github.io/wuthering-waves-assets/images";
const DEFAULT_ECHO_IMAGE = `${ASSET_BASE}/echoes/monsters.png`;

const inventoryStore = useInventoryStore();
const characterStore = useCharacterStore();
const settingsStore = useSettingsStore() as any;
const { echoes: inventoryEchoes } = storeToRefs(inventoryStore) as any;
const { characters } = storeToRefs(characterStore) as any;

const resolvedEchoes = computed(() => resolveCharacterEchoes(props.slots, inventoryEchoes.value ?? []));

function echoImage(echo: any): string {
  if (!echo?.echo) return DEFAULT_ECHO_IMAGE;
  return (getEchoData(echo.echo) as { image?: string } | null)?.image ?? DEFAULT_ECHO_IMAGE;
}
function getEchoName(echo: any): string {
  return (getEchoData(echo.echo) as { name?: string } | null)?.name ?? echo.echo;
}
function rankBorderClass(echo: any) {
  const rank = Number(echo?.rank ?? 5);
  return {
    "border-amber-300": rank === 5,
    "border-violet-600": rank === 4,
    "border-blue-500": rank === 3,
    "border-green-500": rank === 2,
  };
}

const totalCv = computed(() =>
  resolvedEchoes.value.reduce((sum, echo) => sum + (echo?.echo ? getEchoCritValue(echo) : 0), 0),
);
const formattedCritValue = computed(() => {
  const rounded = Number(totalCv.value.toFixed(1));
  return Number.isInteger(rounded) ? rounded : rounded.toFixed(1);
});
const critValueBadgeClass = computed(() => getBadgeClass(totalCv.value / 5, 42, "cv"));

const echoSets = computed(() => {
  const counts: Record<string, number> = {};
  for (const echo of resolvedEchoes.value as Array<{ echoSet?: string }>) {
    const key = echo?.echoSet;
    if (key && key !== "none") counts[key] = (counts[key] ?? 0) + 1;
  }
  return Object.entries(counts)
    .filter(([key, count]) => count >= getSetBonusThreshold(key))
    .sort(([, a], [, b]) => b - a)
    .map(([key, count]) => ({
      key,
      count,
      label: getEchoSetLabelByType(key),
      icon: getEchoSetIconByType(key),
    }));
});

// Scored against the character this modal is for (not a derived "equipped
// on" character, unlike the inventory preset card).
// Averages per-echo substat scores over the resolved echoes (inventory-backed
// or inline), same approach as usePresetBuildScore.
const buildScoreRollup = computed(() => {
  if (!props.character) return null;
  const weights = characterStore.getCharacterSubstatWeights(props.character);
  const scores = resolvedEchoes.value
    .filter((echo: any) => echo?.echo)
    .map((echo: any) => getSubstatScoreGrade(echo, weights));
  if (!scores.length) return null;
  const percent = scores.reduce((sum, sc) => sum + sc.percent, 0) / scores.length;
  const provisional = scores.length < 5 || scores.some((sc) => sc.provisional);
  const { grade, color } = getGradeForSubstatScorePercent(percent);
  return { percent, provisional, grade, color };
});
const buildScoreBadgeClass = computed(() =>
  buildScoreRollup.value ? getRatingBadgeClasses(buildScoreRollup.value.color) : [],
);

const preview = ref<EchoPresetPreview | null>(null);
const loading = ref(true);
const effectiveCharacter = computed(() => props.character);
let requestToken = 0;

// Same target/damage type the Live Result Bar shows, so the diff measures the
// number the user is actually watching (see WorkspaceEchoesBrowser.vue).
async function loadPreview() {
  const token = ++requestToken;
  const characterId = props.character;
  if (!characterId) {
    preview.value = null;
    loading.value = false;
    return;
  }
  loading.value = true;
  try {
    const saved = settingsStore.config?.liveResultBarByCharacter?.[characterId];
    const result = await estimateEchoPresetPreview(
      characterId,
      characters.value,
      props.slots,
      resolveTeamEnemyConfig(characters.value[characterId]),
      inventoryEchoes.value ?? [],
      {
        target: saved?.target ?? null,
        damageType: saved?.damageType ?? "Average",
        skipImpact: !props.showImpact,
      },
    );
    if (token === requestToken) preview.value = result;
  } catch {
    if (token === requestToken) preview.value = null;
  } finally {
    if (token === requestToken) loading.value = false;
  }
}

watch(() => [props.character, props.slots], loadPreview, { immediate: true });

const statRows = computed(() => {
  const s = preview.value?.stats;
  if (!s) return [];
  return [
    { label: "HP", icon: `${ASSET_BASE}/hp.png`, value: displayInt(s.totalHp) },
    { label: "ATK", icon: `${ASSET_BASE}/atk.png`, value: displayInt(s.totalAtk) },
    { label: "DEF", icon: `${ASSET_BASE}/def.png`, value: displayInt(s.totalDef) },
    { label: "Crit Rate", icon: `${ASSET_BASE}/critrate.png`, value: displayPercentage(s.critRate) },
    { label: "Crit DMG", icon: `${ASSET_BASE}/critdamage.png`, value: displayPercentage(s.critDMG) },
    { label: "Energy Regen", icon: `${ASSET_BASE}/energyregen.png`, value: displayPercentage(s.energyRegen) },
  ];
});

function formatImpact(delta: EchoImpactDelta): string {
  const sign = delta.delta >= 0 ? "+" : "";
  return `${sign}${Math.round(delta.delta).toLocaleString()} · ${sign}${(delta.pct * 100).toFixed(1)}%`;
}
</script>
