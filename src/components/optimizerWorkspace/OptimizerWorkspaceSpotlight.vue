<template>
  <div class="bg-base-200 rounded-xl p-4 flex flex-col gap-4" data-test-optimizer-workspace-spotlight>
    <div class="flex flex-wrap items-center justify-between gap-2">
      <span class="badge" :class="rank === 0 ? 'badge-primary' : ''">
        Loadout #{{ rank + 1 }}{{ rank === 0 ? " · Best overall" : "" }}
      </span>
      <button
        class="btn btn-primary btn-sm"
        @click="equipLoadout"
        data-test-optimizer-workspace-equip-btn>
        Equip loadout
      </button>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
      <CalculatorOptimizerResultLoadoutEcho
        v-for="echo in sortedLoadout"
        :key="String((echo as any).echoId)"
        :rank="(echo as any).rank"
        :type="(echo as any).type"
        :echo-id="(echo as any).echoId"
        :echo-set="(echo as any).echoSet"
        :stat="(echo as any).stat"
        :echo="(echo as any).echo"
        :echo-sub-stats-type-1="(echo as any).echoSubStatsType1"
        :echo-sub-stats-value-1="(echo as any).echoSubStatsValue1"
        :echo-sub-stats-type-2="(echo as any).echoSubStatsType2"
        :echo-sub-stats-value-2="(echo as any).echoSubStatsValue2"
        :echo-sub-stats-type-3="(echo as any).echoSubStatsType3"
        :echo-sub-stats-value-3="(echo as any).echoSubStatsValue3"
        :echo-sub-stats-type-4="(echo as any).echoSubStatsType4"
        :echo-sub-stats-value-4="(echo as any).echoSubStatsValue4"
        :echo-sub-stats-type-5="(echo as any).echoSubStatsType5"
        :echo-sub-stats-value-5="(echo as any).echoSubStatsValue5"
        :hide-inventory="true"
        class="w-full"></CalculatorOptimizerResultLoadoutEcho>
    </div>

    <div class="divider my-0"></div>

    <div class="grid gap-4 lg:grid-cols-2">
      <div v-if="contextTargetType === 'Attack'" class="flex flex-col gap-2">
        <div class="text-xs font-bold uppercase tracking-wider opacity-50">
          {{ attackLabel }}
        </div>
        <CalculatorOptimizerResultDamage
          v-if="attackInfo"
          :attack-info="attackInfo"
          :attack-label="attackLabel"
          :all-damages="allDamages"
          :target-value="targetValue"></CalculatorOptimizerResultDamage>
      </div>
      <div v-if="contextTargetType === 'Rotation'" class="flex flex-col gap-2">
        <div class="flex items-center justify-between gap-2">
          <div
            class="text-xs font-bold uppercase tracking-wider opacity-50"
            data-test-optimizer-workspace-rotation-name>
            {{ rotationName }}
          </div>
          <button
            type="button"
            class="btn btn-xs btn-neutral"
            @click="showRotationDetails = !showRotationDetails">
            {{ showRotationDetails ? "Hide" : "Show" }} Details
          </button>
        </div>
        <CalculatorOptimizerResultRotationDamage
          :character="character"
          :rotation="rotationPayload"
          :all-damages="allDamages"
          :rotation-id="rotationId ?? ''"
          hide-toggle
          v-model="showRotationDetails"></CalculatorOptimizerResultRotationDamage>
      </div>

      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between gap-2">
          <div class="text-xs font-bold uppercase tracking-wider opacity-50">
            Character stats &middot; highlights
          </div>
          <button
            type="button"
            class="btn btn-xs btn-neutral"
            @click="showFullStats = !showFullStats">
            {{ showFullStats ? "Hide" : "Show" }} Details
          </button>
        </div>
        <OptimizerWorkspaceResultHighlights
          :final-stats="finalStats"
          :total-atk="totalAtk"
          :total-hp="totalHp"
          :total-def="totalDef"
          :total-crit-rate="totalCritRate"
          :total-crit-dmg="totalCritDmg"
          :energy-regen="energyRegen"></OptimizerWorkspaceResultHighlights>
        <CalculatorOptimizerResultStats
          v-if="showFullStats"
          :character-element="characterElement"
          :final-stats="finalStats"
          :total-atk="totalAtk"
          :total-hp="totalHp"
          :total-def="totalDef"
          :total-crit-rate="totalCritRate"
          :total-crit-dmg="totalCritDmg"
          :energy-regen="energyRegen"
          :target-value="targetValue"></CalculatorOptimizerResultStats>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import CalculatorOptimizerResultLoadoutEcho from "../CalculatorOptimizerResultLoadoutEcho.vue";
import CalculatorOptimizerResultDamage from "../CalculatorOptimizerResultDamage.vue";
import CalculatorOptimizerResultRotationDamage, {
  type RotationPayload,
} from "../CalculatorOptimizerResultRotationDamage.vue";
import CalculatorOptimizerResultStats from "../CalculatorOptimizerResultStats.vue";
import OptimizerWorkspaceResultHighlights from "./OptimizerWorkspaceResultHighlights.vue";
import { sortLoadoutForDisplay } from "./optimizerLoadoutSort";
import { buildCharacterBuffUpdatesFromOptimizer } from "../../calculator/syncOptimizerBuffs";
import { useCharacterStore } from "../../stores/character";
import { useInventoryStore } from "../../stores/inventory";

defineOptions({ name: "OptimizerWorkspaceSpotlight" });

const props = withDefaults(
  defineProps<{
    character: string;
    rank: number;
    targetType: string;
    targetValue: string;
    loadout?: unknown[];
    context?: Record<string, unknown>;
    characterElement: string;
    allDamages?: unknown;
    totalAtk: number;
    totalHp: number;
    totalDef: number;
    totalCritRate: number;
    totalCritDmg: number;
    energyRegen: number;
  }>(),
  {
    loadout: () => [],
    context: () => ({}),
    allDamages: () => [],
  },
);

const characterStore = useCharacterStore();
const inventoryStore = useInventoryStore();
const showFullStats = ref(false);
const showRotationDetails = ref(false);

const sortedLoadout = computed(() => sortLoadoutForDisplay(props.loadout as any[]));

const context = computed(() => props.context ?? {});
const contextTargetType = computed(() => context.value.targetType as string | undefined);

const attackLabel = computed(() => {
  if (contextTargetType.value !== "Attack") return undefined;
  const attacks = context.value.attacks as Array<{ label?: string }> | undefined;
  return attacks?.[0]?.label;
});

type AttackResultRow = Record<string, unknown> & { damage: Record<string, unknown> };

const attackInfo = computed((): AttackResultRow | undefined => {
  if (contextTargetType.value !== "Attack") return undefined;
  const attacks = context.value.attacks as AttackResultRow[] | undefined;
  return attacks?.[0];
});

const rotationName = computed(
  () =>
    (context.value.rotation as { name?: string } | undefined)?.name ??
    (context.value.attacks as { name?: string } | undefined)?.name ??
    null,
);

const rotationId = computed(
  () =>
    (context.value.rotation as { id?: string } | undefined)?.id ??
    (context.value.attacks as { id?: string } | undefined)?.id ??
    null,
);

const rotationPayload = computed((): RotationPayload => {
  const r = context.value.rotation as RotationPayload | undefined;
  return r ?? { attacks: [], damageAggregation: {} };
});

const finalStats = computed(
  () => (context.value.finalStats ?? {}) as Record<string, number> & { totalCritDMG?: number },
);

async function equipLoadout() {
  const echoIds = props.loadout.map(
    (echo) => (echo as { echoId?: string } | undefined)?.echoId,
  );

  characterStore.applyEchoLoadout(props.character, {
    echoIds,
    presetId: null,
    fillSlots: props.loadout.length,
  });

  const characterData = characterStore.characters[props.character] ?? {};
  const buffUpdates = buildCharacterBuffUpdatesFromOptimizer(
    characterData,
    props.loadout as Array<{ echo?: string; echoId?: string }>,
    (echoId) => inventoryStore.getEchoById(echoId)?.echo,
  );
  if (buffUpdates.mainEcho || buffUpdates.echoSetPassives) {
    await characterStore.setCharacterData(props.character, buffUpdates);
  }
}
</script>
