<template>
  <!-- `echo__item` is what tests count to find the 5 slots. -->
  <div
    class="echo__item build-card-echo"
    :class="`build-card-echo--${variant}`"
    :data-test-build-card-echo="variant">
    <!-- Columns layout: art banner left, full-name substats, grade column right -->
    <template v-if="variant === 'card'">
      <div class="build-card-echo__banner">
        <img v-if="echoImage" :src="echoImage" alt="" class="build-card-echo__banner-img" />
        <div class="build-card-echo__banner-scrim"></div>
        <div class="build-card-echo__tags">
          <img v-if="setIcon" :src="setIcon" alt="" :class="echoSet" class="size-6" />
          <span v-if="hasEcho" class="build-card-echo__cost">{{ type }}C</span>
        </div>
        <div v-if="echoName" class="build-card-echo__identity">
          <div class="build-card-echo__name">{{ echoName }}</div>
          <div v-if="mainStatValue" class="build-card-echo__main">
            <img :src="getSubStatIconByType(stat)" alt="" class="size-4" />
            <span class="build-card-echo__main-label">{{ getReadableSubStatLabel(stat) }}</span>
            <span class="build-card-echo__main-value">{{ mainStatValue }}%</span>
          </div>
        </div>
      </div>
      <div class="build-card-echo__substats" data-test-build-card-echo-substats>
        <div v-for="sub in substats" :key="sub.index" class="build-card-echo__substat" :class="{ 'is-dim': !sub.counts }">
          <img :src="sub.icon" alt="" class="build-card-echo__substat-icon" />
          <span class="build-card-echo__substat-label">{{ sub.label }}</span>
          <span class="build-card-echo__substat-value" :class="sub.colorClass">{{ sub.display }}</span>
        </div>
      </div>
      <div class="build-card-echo__grade-col">
        <template v-if="hasSubStats">
          <span v-if="substatScore" class="build-card-echo__grade" :style="{ color: gradeColor }" data-test-build-card-echo-grade>{{ substatScore.grade }}</span>
          <span v-if="substatScore" class="build-card-echo__grade-pct">{{ scorePercentText }}</span>
          <span class="build-card-echo__cv-label">CV</span>
          <span class="build-card-echo__cv">{{ formattedCritValue }}</span>
        </template>
      </div>
    </template>

    <!-- Hero layout: a narrow column with roll-quality bars -->
    <template v-else-if="variant === 'column'">
      <div class="build-card-echo__header">
        <img v-if="echoImage" :src="echoImage" alt="" class="build-card-echo__header-img" />
        <div class="build-card-echo__header-scrim"></div>
        <div v-if="hasSubStats" class="build-card-echo__header-score">
          <span v-if="substatScore" class="build-card-echo__grade" :style="{ color: gradeColor }" data-test-build-card-echo-grade>
            {{ substatScore.grade }}
            <span class="build-card-echo__grade-pct-inline">{{ scorePercentText }}</span>
          </span>
          <span class="build-card-echo__cv-inline">CV {{ formattedCritValue }}</span>
        </div>
        <div class="build-card-echo__tags build-card-echo__tags--right">
          <span v-if="hasEcho" class="build-card-echo__cost">{{ type }}C</span>
          <img v-if="setIcon" :src="setIcon" alt="" :class="echoSet" class="size-5" />
        </div>
        <div v-if="echoName" class="build-card-echo__name build-card-echo__name--header">{{ echoName }}</div>
      </div>
      <div class="build-card-echo__body">
        <div v-if="mainStatValue" class="build-card-echo__main build-card-echo__main--row">
          <img :src="getSubStatIconByType(stat)" alt="" class="size-[18px]" />
          <span class="build-card-echo__main-label">{{ shortLabel(stat) }}</span>
          <span class="build-card-echo__main-value">{{ mainStatValue }}%</span>
        </div>
        <div class="build-card-echo__substats" data-test-build-card-echo-substats>
          <div v-for="sub in substats" :key="sub.index" class="build-card-echo__bar-row" :class="{ 'is-dim': !sub.counts }">
            <div class="build-card-echo__substat">
              <img :src="sub.icon" alt="" class="build-card-echo__substat-icon" />
              <span class="build-card-echo__substat-label">{{ sub.shortLabel }}</span>
              <span class="build-card-echo__substat-value" :class="sub.colorClass">{{ sub.display }}</span>
            </div>
            <div class="build-card-echo__bar"><div class="build-card-echo__bar-fill" :style="{ width: `${sub.rollPercent}%`, background: sub.tierColor }"></div></div>
          </div>
        </div>
      </div>
    </template>

    <!-- Showcase layout: one compact table row -->
    <template v-else>
      <div class="build-card-echo__thumb">
        <img v-if="echoImage" :src="echoImage" alt="" class="w-full h-full object-contain" />
        <img v-if="setIcon" :src="setIcon" alt="" :class="echoSet" class="build-card-echo__thumb-set" />
      </div>
      <div class="build-card-echo__row-identity">
        <div class="build-card-echo__name build-card-echo__name--row">{{ echoName ?? "Empty slot" }}</div>
        <div v-if="hasEcho" class="build-card-echo__row-meta">
          Cost {{ type }}<template v-if="hasSubStats"> · CV <span class="build-card-echo__cv">{{ formattedCritValue }}</span></template>
        </div>
      </div>
      <div class="build-card-echo__main build-card-echo__main--compact">
        <template v-if="mainStatValue">
          <img :src="getSubStatIconByType(stat)" alt="" class="size-[18px]" />
          <span class="build-card-echo__main-value">{{ mainStatValue }}%</span>
          <span class="build-card-echo__main-label">{{ shortLabel(stat) }}</span>
        </template>
      </div>
      <div class="build-card-echo__chips" data-test-build-card-echo-substats>
        <div
          v-for="sub in substats"
          :key="sub.index"
          class="build-card-echo__chip"
          :class="{ 'is-dim': !sub.counts }"
          :title="sub.label">
          <img :src="sub.icon" :alt="sub.label" class="build-card-echo__substat-icon" />
          <span class="build-card-echo__substat-value" :class="sub.colorClass">{{ sub.display }}</span>
        </div>
      </div>
      <div class="build-card-echo__row-grade">
        <template v-if="substatScore && hasSubStats">
          <span class="build-card-echo__grade" :style="{ color: gradeColor }" data-test-build-card-echo-grade>{{ substatScore.grade }}</span>
          <span class="build-card-echo__grade-pct">{{ scorePercentText }}</span>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { getEchoSetIconByType } from "../../echoes/stats";
import { getSubstatRollTier, useEchoCardStats } from "../../composables/useEchoCardStats";
import { useEchoRating } from "../../composables/useEchoRating";
import { useCharacterStore } from "../../stores/character";
import { getGradeColor, getShortSubstatLabel, ROLL_TIER_COLORS } from "../../buildCard/theme";

const props = withDefaults(
  defineProps<{
    variant?: "card" | "column" | "row";
    rank?: number | string;
    type?: string;
    echo?: string;
    echoId?: string;
    echoSet?: string;
    stat?: string;
    echoSubStatsType1?: string;
    echoSubStatsValue1?: number | string;
    echoSubStatsType2?: string;
    echoSubStatsValue2?: number | string;
    echoSubStatsType3?: string;
    echoSubStatsValue3?: number | string;
    echoSubStatsType4?: string;
    echoSubStatsValue4?: number | string;
    echoSubStatsType5?: string;
    echoSubStatsValue5?: number | string;
    characterId?: string | null;
  }>(),
  {
    variant: "card",
    rank: "",
    type: "",
    echo: "",
    echoId: "",
    echoSet: "",
    stat: "",
    echoSubStatsType1: "",
    echoSubStatsValue1: "",
    echoSubStatsType2: "",
    echoSubStatsValue2: "",
    echoSubStatsType3: "",
    echoSubStatsValue3: "",
    echoSubStatsType4: "",
    echoSubStatsValue4: "",
    echoSubStatsType5: "",
    echoSubStatsValue5: "",
    characterId: null,
  },
);

const {
  mainStatValue,
  echoName,
  echoImage,
  hasSubStats,
  echoSubStatsValue1Display,
  echoSubStatsValue2Display,
  echoSubStatsValue3Display,
  echoSubStatsValue4Display,
  echoSubStatsValue5Display,
  echoSubStatsValue1Color,
  echoSubStatsValue2Color,
  echoSubStatsValue3Color,
  echoSubStatsValue4Color,
  echoSubStatsValue5Color,
  formattedCritValue,
  getReadableSubStatLabel,
  getSubStatIconByType,
} = useEchoCardStats(props as any);

const { substatScore } = useEchoRating(props as any);
const characterStore = useCharacterStore();

const hasEcho = computed(() => Boolean(props.echo));
const setIcon = computed(() =>
  props.echoSet && props.echoSet !== "none" ? getEchoSetIconByType(props.echoSet) : null,
);
const gradeColor = computed(() => getGradeColor(substatScore.value?.color));
const scorePercentText = computed(() =>
  substatScore.value
    ? `${Math.round(substatScore.value.percent)}%${substatScore.value.provisional ? "*" : ""}`
    : "",
);

// Substats this character's Substat Score ignores (weight 0) are dimmed so
// the rolls that matter stand out. With no character weights, nothing dims.
const weights = computed(() =>
  props.characterId ? characterStore.getCharacterSubstatWeights(props.characterId) : null,
);

const displays = [
  echoSubStatsValue1Display,
  echoSubStatsValue2Display,
  echoSubStatsValue3Display,
  echoSubStatsValue4Display,
  echoSubStatsValue5Display,
];
const colors = [
  echoSubStatsValue1Color,
  echoSubStatsValue2Color,
  echoSubStatsValue3Color,
  echoSubStatsValue4Color,
  echoSubStatsValue5Color,
];

const substats = computed(() => {
  const rows = [];
  for (let i = 1; i <= 5; i++) {
    const type = (props as Record<string, any>)[`echoSubStatsType${i}`];
    const value = (props as Record<string, any>)[`echoSubStatsValue${i}`];
    if (!type || type === "none") continue;
    const rolled = getSubstatRollTier(type, value);
    rows.push({
      index: i,
      label: getReadableSubStatLabel(type),
      shortLabel: getShortSubstatLabel(type, getReadableSubStatLabel(type)),
      icon: getSubStatIconByType(type),
      display: displays[i - 1].value,
      colorClass: colors[i - 1].value,
      counts: !weights.value || (weights.value[type] ?? 1) > 0,
      rollPercent: rolled ? rolled.score : 0,
      tierColor: rolled ? ROLL_TIER_COLORS[rolled.tier] : "transparent",
    });
  }
  return rows;
});

function shortLabel(type: string) {
  return getShortSubstatLabel(type, getReadableSubStatLabel(type));
}
</script>

<style scoped lang="scss">
.build-card-echo {
  position: relative;
  overflow: hidden;
  color: var(--card-ink);
  background: var(--card-glass);
  border: 1px solid var(--card-border);
  border-radius: 18px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  font-variant-numeric: tabular-nums;
}

.is-dim {
  opacity: 0.45;
}

.build-card-echo__cost {
  font-size: 12px;
  font-weight: 700;
  line-height: 18px;
  padding: 0 8px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.build-card-echo__name {
  font-weight: 700;
  color: #fff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
}

.build-card-echo__main {
  display: flex;
  align-items: center;
  gap: 6px;
}

.build-card-echo__main-label {
  color: var(--card-muted);
  font-weight: 600;
}

.build-card-echo__main-value {
  color: var(--card-accent);
  font-weight: 800;
}

.build-card-echo__substat {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.build-card-echo__substat-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.build-card-echo__substat-label {
  flex: 1 1 auto;
  min-width: 0;
  white-space: nowrap;
  color: var(--card-muted);
}

.build-card-echo__substat-value {
  flex-shrink: 0;
  font-weight: 800;
}

.build-card-echo__grade {
  font-weight: 800;
  line-height: 1;
}

.build-card-echo__grade-pct {
  color: var(--card-muted);
  font-weight: 600;
}

.build-card-echo__cv {
  color: var(--card-gold);
  font-weight: 700;
}

.build-card-echo__tags {
  position: absolute;
  top: 10px;
  left: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 1;
}

.build-card-echo__tags--right {
  left: auto;
  right: 10px;
}

/* ---- card (Columns layout) ---- */
.build-card-echo--card {
  display: flex;
  align-items: stretch;
}

.build-card-echo__banner {
  position: relative;
  width: 200px;
  flex-shrink: 0;
  overflow: hidden;
  background: linear-gradient(160deg, color-mix(in srgb, var(--card-accent) 16%, transparent), rgba(6, 9, 18, 0.2));
}

.build-card-echo__banner-img {
  position: absolute;
  right: -16px;
  top: -6px;
  width: 150px;
  height: 150px;
  object-fit: contain;
}

.build-card-echo__banner-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(6, 9, 18, 0.88) 0%, rgba(6, 9, 18, 0.25) 75%);
}

.build-card-echo__identity {
  position: absolute;
  left: 12px;
  right: 10px;
  bottom: 12px;
}

.build-card-echo--card .build-card-echo__name {
  font-size: 15px;
  line-height: 1.15;
}

.build-card-echo--card .build-card-echo__main {
  margin-top: 6px;
  font-size: 14px;
}

.build-card-echo--card .build-card-echo__main-value {
  font-size: 17px;
}

.build-card-echo--card .build-card-echo__substats {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  padding: 10px 16px;
  font-size: 15px;
}

.build-card-echo--card .build-card-echo__substat-value {
  font-size: 17px;
}

.build-card-echo__grade-col {
  width: 76px;
  flex-shrink: 0;
  border-left: 1px solid var(--card-hair);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.build-card-echo--card .build-card-echo__grade {
  font-size: 34px;
}

.build-card-echo--card .build-card-echo__grade-pct {
  font-size: 14px;
}

.build-card-echo__cv-label {
  margin-top: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--card-faint);
}

.build-card-echo--card .build-card-echo__cv {
  font-size: 15px;
}

/* ---- column (Hero layout) ---- */
.build-card-echo--column {
  display: flex;
  flex-direction: column;
}

.build-card-echo__header {
  position: relative;
  height: 132px;
  flex-shrink: 0;
  overflow: hidden;
  background: linear-gradient(160deg, color-mix(in srgb, var(--card-accent) 16%, transparent), rgba(6, 9, 18, 0.1));
}

.build-card-echo__header-img {
  position: absolute;
  right: -8px;
  top: -4px;
  width: 124px;
  height: 124px;
  object-fit: contain;
}

.build-card-echo__header-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(6, 9, 18, 0.85) 0%, rgba(6, 9, 18, 0.1) 80%),
    linear-gradient(0deg, rgba(6, 9, 18, 0.8) 0%, rgba(6, 9, 18, 0) 50%);
}

.build-card-echo__header-score {
  position: absolute;
  left: 14px;
  top: 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.build-card-echo--column .build-card-echo__grade {
  font-size: 30px;
}

.build-card-echo__grade-pct-inline {
  font-size: 18px;
}

.build-card-echo__cv-inline {
  font-size: 13px;
  font-weight: 700;
  color: var(--card-gold);
}

.build-card-echo__name--header {
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 8px;
  font-size: 14px;
  line-height: 1.15;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.build-card-echo__body {
  padding: 10px 14px 12px;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
}

.build-card-echo__main--row {
  padding-bottom: 8px;
  margin-bottom: 4px;
  border-bottom: 1px solid var(--card-hair);
  font-size: 15px;
}

.build-card-echo__main--row .build-card-echo__main-label {
  flex: 1 1 auto;
}

.build-card-echo__main--row .build-card-echo__main-value {
  font-size: 21px;
}

.build-card-echo--column .build-card-echo__substats {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  flex: 1 1 auto;
  font-size: 13.5px;
}

.build-card-echo__bar-row {
  padding: 4px 0;
}

.build-card-echo--column .build-card-echo__substat-icon {
  width: 15px;
  height: 15px;
}

.build-card-echo--column .build-card-echo__substat {
  gap: 7px;
}

.build-card-echo--column .build-card-echo__substat-value {
  font-size: 16px;
}

.build-card-echo__bar {
  height: 3px;
  margin-top: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.08);
}

.build-card-echo__bar-fill {
  height: 3px;
  border-radius: 2px;
}

/* ---- row (Showcase layout) ---- */
.build-card-echo--row {
  display: grid;
  grid-template-columns: 60px 220px 150px minmax(0, 1fr) 84px;
  align-items: center;
  gap: 14px;
  padding: 8px 14px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  box-shadow: none;
}

.build-card-echo__thumb {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--card-accent) 12%, transparent);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.build-card-echo__thumb-set {
  position: absolute;
  right: -6px;
  bottom: -6px;
  width: 22px;
  height: 22px;
}

.build-card-echo__row-identity {
  min-width: 0;
}

.build-card-echo__name--row {
  font-size: 15px;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: none;
}

.build-card-echo__row-meta {
  margin-top: 3px;
  font-size: 13px;
  color: var(--card-faint);
}

.build-card-echo__main--compact {
  font-size: 13px;
}

.build-card-echo__main--compact .build-card-echo__main-value {
  font-size: 20px;
}

.build-card-echo__chips {
  display: flex;
  gap: 6px;
  min-width: 0;
}

.build-card-echo__chip {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 8px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  font-size: 16px;
}

.build-card-echo__chip .build-card-echo__substat-icon {
  width: 15px;
  height: 15px;
}

.build-card-echo__row-grade {
  text-align: right;
  white-space: nowrap;
}

.build-card-echo--row .build-card-echo__grade {
  font-size: 28px;
}

.build-card-echo--row .build-card-echo__grade-pct {
  margin-left: 6px;
  font-size: 15px;
}
</style>
