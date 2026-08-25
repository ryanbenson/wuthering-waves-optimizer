<template>
  <div class="live-result-detail flex flex-col" data-test-live-result-detail>
    <div
      class="flex items-center justify-between gap-2 px-4 py-2 border-b border-base-300 shrink-0">
      <h4 class="font-bold text-sm">Full breakdown</h4>
      <div class="flex items-center gap-1">
        <button
          type="button"
          class="btn btn-xs btn-circle"
          :class="{ 'btn-primary': isPinned }"
          :aria-pressed="isPinned"
          v-tooltip="
            isPinned
              ? 'Pinned — stays open across reloads'
              : 'Pin — keep this open across reloads'
          "
          data-test-live-result-detail-pin
          @click="emit('toggle-pin')">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.8"
              d="M12 2v6M8.5 8h7l1.5 5h-10l1.5-5Z" />
            <path
              stroke-linecap="round"
              stroke-width="1.8"
              d="M12 13v9" />
          </svg>
        </button>
        <button
          type="button"
          class="btn btn-xs btn-circle btn-ghost"
          aria-label="Close"
          data-test-live-result-detail-close
          @click="emit('close')">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-width="1.8"
              d="M5 5l14 14M19 5 5 19" />
          </svg>
        </button>
      </div>
    </div>
    <div
      v-if="isPinned"
      class="text-xs text-primary bg-primary/10 px-4 py-1.5 shrink-0">
      Pinned — stays open while you switch tabs and after a reload.
    </div>
    <div class="flex-1 overflow-y-auto p-2">
      <CalculatorStats
        :key="character + weaponAtk"
        :character="character"
        :character-level="characterLevel"
        :weapon-atk="weaponAtk"
        :total-atk="totalAtk"
        :total-atk-percent="totalAtkPercent"
        :total-atk-flat="totalAtkFlat"
        :total-hp="totalHp"
        :total-hp-percent="totalHpPercent"
        :total-hp-flat="totalHpFlat"
        :total-def="totalDef"
        :total-def-percent="totalDefPercent"
        :total-def-flat="totalDefFlat"
        :total-crit-rate="totalCritRate"
        :total-crit-dmg="totalCritDmg"
        :energy-regen="energyRegen"
        :basic-attack-dmg-bonus="basicAttackDmgBonus"
        :heavy-attack-dmg-bonus="heavyAttackDmgBonus"
        :resonance-skill-dmg-bonus="resonanceSkillDmgBonus"
        :resonance-liberation-dmg-bonus="resonanceLiberationDmgBonus"
        :glacio="glacio"
        :fusion="fusion"
        :electro="electro"
        :aero="aero"
        :spectro="spectro"
        :havoc="havoc"
        :healing-bonus="healingBonus"
        :tune-break-boost="tuneBreakBoost"
        @stat-selected="emit('stat-selected', $event)"></CalculatorStats>
      <CalculatorDamages
        :key="characterBuildKey"
        :character="character"
        :all-damages="allDamages"
        :rotations-list="rotationsList"
        :chosen-char="chosenChar"
        :chosen-echo-name="mainEcho"
        :is-missing-spectro-data="isMissingSpectroData"
        :is-missing-aero-erosion-data="isMissingAeroErosionData"
        :char-buffs-data="charBuffsData"
        :char-resonance-chains-data="charResonanceChainsData"
        @selected-attack="
          (...args) => emit('selected-attack', ...args)
        "></CalculatorDamages>
    </div>
  </div>
</template>

<script setup lang="ts">
import CalculatorStats from "./CalculatorStats.vue";
import CalculatorDamages from "./CalculatorDamages.vue";

defineOptions({ name: "CalculatorLiveResultDetail" });

defineProps<{
  character: string;
  characterLevel: string;
  characterBuildKey: string | number;
  weaponAtk: number;
  totalAtk: number;
  totalAtkPercent: number;
  totalAtkFlat: number;
  totalHp: number;
  totalHpPercent: number;
  totalHpFlat: number;
  totalDef: number;
  totalDefPercent: number;
  totalDefFlat: number;
  totalCritRate: number;
  totalCritDmg: number;
  energyRegen: number;
  basicAttackDmgBonus: number;
  heavyAttackDmgBonus: number;
  resonanceSkillDmgBonus: number;
  resonanceLiberationDmgBonus: number;
  glacio: number;
  fusion: number;
  electro: number;
  aero: number;
  spectro: number;
  havoc: number;
  healingBonus: number;
  tuneBreakBoost: number;
  allDamages: Record<string, any>;
  rotationsList: any[];
  chosenChar: Record<string, any>;
  mainEcho?: string | null;
  isMissingSpectroData?: boolean;
  isMissingAeroErosionData?: boolean;
  charBuffsData: Record<string, any>;
  charResonanceChainsData: Record<string, any>;
  isPinned: boolean;
}>();

const emit = defineEmits<{
  "toggle-pin": [];
  close: [];
  "stat-selected": [stat: string];
  "selected-attack": [attackKey: string, damage: Record<string, any>, label: string];
}>();
</script>

<style scoped>
.live-result-detail {
  flex: 0 0 380px;
  min-width: 0;
  border-left: 1px solid oklch(var(--b3));
  background: oklch(var(--b1));
}

@media (max-width: 768px) {
  .live-result-detail {
    flex: none;
    width: 100%;
    border-left: none;
    border-top: 1px solid oklch(var(--b3));
    max-height: 70vh;
  }
}
</style>
