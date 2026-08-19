<template>
  <div v-if="team" data-test-team-rotation-summary-page>
    <div class="flex items-center justify-between gap-2 mb-4 flex-wrap">
      <button
        type="button"
        class="btn btn-ghost btn-sm"
        data-test-team-rotation-summary-back
        @click="emit('back')">
        ← Back to Team
      </button>
      <h2 class="text-xl font-semibold truncate">{{ team.name }}</h2>
      <div class="flex -space-x-2">
        <div
          v-for="(characterId, idx) in team.characterIds"
          v-show="characterId"
          :key="idx"
          class="size-10 rounded-full border-2 border-base-200 bg-cover bg-center"
          :style="characterId ? { backgroundImage: `url(${characterImage(characterId)})` } : {}"></div>
      </div>
    </div>

    <div
      class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6"
      data-test-team-rotation-summary-stats>
      <div class="card bg-base-200 p-3">
        <div class="text-xs opacity-70 mb-1">Total DMG</div>
        <div class="text-sm">Normal: {{ displayDamage(result.total.normalDamage ?? 0).toLocaleString() }}</div>
        <div class="text-sm">Average: {{ displayDamage(result.total.avgDamage ?? 0).toLocaleString() }}</div>
        <div class="text-sm">Crit: {{ displayDamage(result.total.critDamage ?? 0).toLocaleString() }}</div>
      </div>
      <div class="card bg-base-200 p-3" data-test-team-rotation-summary-dps>
        <div class="text-xs opacity-70 mb-1">Average DPS</div>
        <div class="text-sm">Normal: {{ displayDamage(result.dps.normal).toLocaleString() }}</div>
        <div class="text-sm">Average: {{ displayDamage(result.dps.avg).toLocaleString() }}</div>
        <div class="text-sm">Crit: {{ displayDamage(result.dps.crit).toLocaleString() }}</div>
      </div>
      <div class="card bg-base-200 p-3" data-test-team-rotation-summary-strongest-hit>
        <div class="text-xs opacity-70 mb-1">Strongest Hit</div>
        <div class="text-sm">Normal: {{ displayDamage(strongestHit.normal).toLocaleString() }}</div>
        <div class="text-sm">Average: {{ displayDamage(strongestHit.avg).toLocaleString() }}</div>
        <div class="text-sm">Crit: {{ displayDamage(strongestHit.crit).toLocaleString() }}</div>
        <div v-if="strongestHit.strongestAction" class="text-xs opacity-60 mt-1 truncate">
          {{ displayName(strongestHit.strongestAction.characterId) }} —
          {{ strongestHit.strongestAction.attack.label }}
        </div>
      </div>
      <div v-if="result.total.healing" class="card bg-base-200 p-3">
        <div class="text-xs opacity-70 mb-1">Total Healing</div>
        <div class="text-sm">{{ displayDamage(result.total.healing).toLocaleString() }}</div>
      </div>
      <div v-if="result.total.shield" class="card bg-base-200 p-3">
        <div class="text-xs opacity-70 mb-1">Total Shield</div>
        <div class="text-sm">{{ displayDamage(result.total.shield).toLocaleString() }}</div>
      </div>
    </div>

    <div class="flex items-center justify-end gap-2 mb-2">
      <span class="text-xs opacity-70">Chart damage:</span>
      <div class="join" data-test-team-rotation-summary-chart-metric>
        <button
          v-for="option in CHART_DAMAGE_METRIC_OPTIONS"
          :key="option.value"
          type="button"
          class="btn btn-xs join-item"
          :class="{ 'btn-primary': damageMetric === option.value }"
          :data-test-team-rotation-summary-chart-metric-option="option.value"
          @click="damageMetric = option.value">
          {{ option.label }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      <div class="card bg-base-200 p-4">
        <h3 class="font-semibold mb-2">Damage Over Time</h3>
        <TeamRotationTimelineChart :points="timeline" :duration="team.duration" />
      </div>
      <div class="card bg-base-200 p-4">
        <h3 class="font-semibold mb-2">Damage Over Time by Character</h3>
        <TeamRotationCharacterTimelineChart :points="timeline" :metric="damageMetric" />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      <div class="card bg-base-200 p-4">
        <h3 class="font-semibold mb-2">Damage by Character</h3>
        <TeamRotationDamageChart :per-character="result.perCharacter" :metric="damageMetric" />
      </div>
      <div class="card bg-base-200 p-4">
        <h3 class="font-semibold mb-2">Cumulative Damage by Character</h3>
        <TeamRotationCumulativeDamageChart :points="timeline" :metric="damageMetric" />
      </div>
    </div>

    <div
      class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      data-test-team-rotation-summary-characters>
      <template v-for="slot in [0, 1, 2]" :key="slot">
        <div
          v-if="team.characterIds[slot]"
          class="card bg-base-100 p-4"
          :data-test-team-rotation-summary-character="slot">
          <div class="flex items-center gap-3 mb-3">
            <div
              class="size-12 rounded-full bg-cover bg-center border shrink-0"
              :style="{ backgroundImage: `url(${characterImage(team.characterIds[slot]!)})` }"></div>
            <div class="font-semibold truncate">{{ displayName(team.characterIds[slot]!) }}</div>
          </div>

          <CalculatorWeaponCard
            v-if="weaponInfoForSlot[slot]"
            class="mb-3"
            :name="weaponInfoForSlot[slot]!.name"
            :name-key="weaponInfoForSlot[slot]!.nameKey"
            :rarity="weaponInfoForSlot[slot]!.rarity">
            <div class="text-sm opacity-70">
              Refinement {{ weaponInfoForSlot[slot]!.refinement }}
            </div>
          </CalculatorWeaponCard>

          <div v-if="slotStats[slot]" class="grid grid-cols-3 gap-x-2 gap-y-1 text-sm">
            <div class="flex items-center gap-1" data-test-team-rotation-summary-slot-stat="hp">
              <img src="https://ryanbenson.github.io/wuthering-waves-assets/images/hp.png" class="size-4" />
              <span>{{ displayInt(slotStats[slot]!.totalHp) }}</span>
            </div>
            <div class="flex items-center gap-1" data-test-team-rotation-summary-slot-stat="def">
              <img src="https://ryanbenson.github.io/wuthering-waves-assets/images/def.png" class="size-4" />
              <span>{{ displayInt(slotStats[slot]!.totalDef) }}</span>
            </div>
            <div class="flex items-center gap-1" data-test-team-rotation-summary-slot-stat="atk">
              <img src="https://ryanbenson.github.io/wuthering-waves-assets/images/atk.png" class="size-4" />
              <span>{{ displayInt(slotStats[slot]!.totalAtk) }}</span>
            </div>
            <div class="flex items-center gap-1" data-test-team-rotation-summary-slot-stat="critRate">
              <img src="https://ryanbenson.github.io/wuthering-waves-assets/images/critrate.png" class="size-4" />
              <span>{{ displayPercentage(slotStats[slot]!.critRate) }}</span>
            </div>
            <div class="flex items-center gap-1" data-test-team-rotation-summary-slot-stat="critDMG">
              <img src="https://ryanbenson.github.io/wuthering-waves-assets/images/critdamage.png" class="size-4" />
              <span>{{ displayPercentage(slotStats[slot]!.critDMG) }}</span>
            </div>
            <div class="flex items-center gap-1" data-test-team-rotation-summary-slot-stat="energyRegen">
              <img src="https://ryanbenson.github.io/wuthering-waves-assets/images/energyregen.png" class="size-4" />
              <span>{{ displayPercentage(slotStats[slot]!.energyRegen) }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>

    <div class="card bg-base-200 p-4" data-test-team-rotation-summary-enemy>
      <h3 class="font-semibold mb-2">Enemy</h3>
      <div class="flex items-center gap-4">
        <figure
          v-if="selectedEnemyEntry"
          class="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-base-300">
          <img :src="selectedEnemyEntry.imageUrl" :alt="selectedEnemyEntry.name" class="w-full h-full object-cover" />
        </figure>
        <div class="text-sm">
          <div v-if="selectedEnemyEntry" class="font-semibold">{{ selectedEnemyEntry.name }}</div>
          <div>Lv {{ team.enemyConfig?.enemyLevel ?? 90 }}</div>
          <div>{{ Math.round((team.enemyConfig?.enemyResist ?? 0.1) * 100) }}% Resist</div>
          <div>{{ team.enemyConfig?.enemyType ?? "Calamity" }}</div>
          <div v-if="team.enemyConfig?.havocBaneStacks">
            Havoc Bane Stacks: {{ team.enemyConfig.havocBaneStacks }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useTeamRotationsStore } from "../stores/teamRotations";
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";
import { useSettingsStore } from "../stores/settings";
import { getCharacterRosterDisplayName } from "../characters/characters";
import { getWeaponByName } from "../weapons/weapons";
import enemiesCatalog, { type Enemy } from "../enemies/index";
import { displayDamage, displayInt, displayPercentage } from "../utils/numbers";
import {
  CHART_DAMAGE_METRIC_OPTIONS,
  resolveChartDamageMetric,
  type ChartDamageMetric,
} from "../utils/chartPreferences";
import {
  buildCharacterCalculationContext,
  type CharacterCalculationContext,
  type TeamEnemyConfig,
} from "../calculator/buildCharacterContext";
import {
  calcTeamRotationDamage,
  calcStrongestHit,
  calcRotationTimeline,
  type TeamRotationActionResult,
  type TeamRotationCharacterResult,
  type TimelinePoint,
} from "../calculator/teamRotation";
import CalculatorWeaponCard from "./CalculatorWeaponCard.vue";
import TeamRotationTimelineChart from "./TeamRotationTimelineChart.vue";
import TeamRotationCharacterTimelineChart from "./TeamRotationCharacterTimelineChart.vue";
import TeamRotationDamageChart from "./TeamRotationDamageChart.vue";
import TeamRotationCumulativeDamageChart from "./TeamRotationCumulativeDamageChart.vue";

const props = defineProps<{ teamId: string }>();
const emit = defineEmits<{ back: [] }>();

const teamRotationsStore = useTeamRotationsStore();
const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);
const inventoryStore = useInventoryStore();
const { echoes: inventoryEchoes } = storeToRefs(inventoryStore);
const settingsStore = useSettingsStore();
const { config } = storeToRefs(settingsStore);

const damageMetric = ref<ChartDamageMetric>(
  resolveChartDamageMetric((config.value as { chartDamageMetric?: ChartDamageMetric })?.chartDamageMetric),
);

const team = computed(() => teamRotationsStore.getTeamById(props.teamId));

function displayName(characterId: string) {
  return getCharacterRosterDisplayName(characterId);
}

function characterImage(characterId: string) {
  return `https://ryanbenson.github.io/wuthering-waves-assets/images/${characterId}.png`;
}

const slotContexts = ref<Record<number, CharacterCalculationContext | null>>({});
const result = ref<{
  perCharacter: Record<string, TeamRotationCharacterResult>;
  actionResults: TeamRotationActionResult[];
  total: { normalDamage: number | null; avgDamage: number | null; critDamage: number | null; healing: number | null; shield: number | null };
  dps: { normal: number; avg: number; crit: number };
}>({
  perCharacter: {},
  actionResults: [],
  total: { normalDamage: 0, avgDamage: 0, critDamage: 0, healing: 0, shield: 0 },
  dps: { normal: 0, avg: 0, crit: 0 },
});

const strongestHit = computed(() => calcStrongestHit(result.value.actionResults));
const timeline = computed<TimelinePoint[]>(() =>
  calcRotationTimeline(result.value.actionResults, team.value?.duration ?? null),
);

const slotStats = computed(() => {
  const stats: Record<number, { totalHp: number; totalDef: number; totalAtk: number; critRate: number; critDMG: number; energyRegen: number } | null> = {};
  for (const slot of [0, 1, 2]) {
    const ctx = slotContexts.value[slot];
    stats[slot] = ctx
      ? {
          totalHp: ctx.finalStats.totalHp,
          totalDef: ctx.finalStats.totalDef,
          totalAtk: ctx.finalStats.totalAtk,
          critRate: ctx.finalStats.critRate,
          critDMG: ctx.finalStats.critDMG,
          energyRegen: ctx.finalStats.energyRegen * 100,
        }
      : null;
  }
  return stats;
});

interface WeaponSummary {
  name: string;
  nameKey: string;
  rarity: number | string;
  refinement: string;
}

const weaponInfoForSlot = ref<Record<number, WeaponSummary | null>>({});

const selectedEnemyEntry = computed((): Enemy | null => {
  const key = team.value?.enemyConfig?.enemyBrowserKey;
  if (!key) return null;
  return enemiesCatalog[key] ?? null;
});

let computeToken = 0;

async function recompute() {
  const t = team.value;
  if (!t) return;
  const token = ++computeToken;

  const enemyConfig: TeamEnemyConfig = { ...t.enemyConfig };

  const nextContexts: Record<number, CharacterCalculationContext | null> = {};
  await Promise.all(
    [0, 1, 2].map(async (slot) => {
      const characterId = t.characterIds[slot];
      nextContexts[slot] = characterId
        ? await buildCharacterCalculationContext(characterId, characters.value, enemyConfig, inventoryEchoes.value)
        : null;
    }),
  );
  if (token !== computeToken) return;
  slotContexts.value = nextContexts;

  const nextWeaponInfo: Record<number, WeaponSummary | null> = {};
  await Promise.all(
    [0, 1, 2].map(async (slot) => {
      const characterId = t.characterIds[slot];
      const weaponKey = characterId ? characters.value[characterId]?.weapon : null;
      const weaponType = (nextContexts[slot]?.chosenChar as { basic?: { weapon?: string } } | undefined)
        ?.basic?.weapon;
      if (!characterId || !weaponKey || !weaponType) {
        nextWeaponInfo[slot] = null;
        return;
      }
      const weaponModule = await getWeaponByName(weaponType, weaponKey);
      nextWeaponInfo[slot] = weaponModule?.info
        ? {
            name: weaponModule.info.name,
            nameKey: weaponKey,
            rarity: weaponModule.info.rarity,
            refinement: characters.value[characterId]?.weapons?.[weaponKey]?.refinement ?? "1",
          }
        : null;
    }),
  );
  if (token !== computeToken) return;
  weaponInfoForSlot.value = nextWeaponInfo;

  const nextResult = await calcTeamRotationDamage(
    {
      name: t.name,
      characterIds: t.characterIds,
      actions: t.actions,
      duration: t.duration,
    },
    characters.value,
    enemyConfig,
    inventoryEchoes.value,
  );
  if (token !== computeToken) return;
  result.value = nextResult;
}

watch(team, () => void recompute(), { deep: true, immediate: true });
</script>
