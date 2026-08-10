<template>
  <div class="build-card" data-test-build-card>
    <div class="build-card__grid grid grid-cols-1 xl:grid-cols-12 gap-4">
      <div class="build-card__identity xl:col-span-4">
        <CalculatorCharacterCard
          v-if="characterBasic"
          :name="characterBasic.name"
          :name-key="character"
          :rarity="characterBasic.rarity"
          :element="characterBasic.element"
          :weapon="characterBasicWeaponType">
          <div class="build-card__level text-sm opacity-70 mb-2">
            Lv. {{ characterLevel }}
          </div>
          <div
            class="build-card__talents flex flex-wrap gap-2 justify-center mb-2"
            data-test-build-card-talents>
            <span
              v-for="talent in talentBadges"
              :key="talent.key"
              class="badge badge-outline">
              {{ talent.label }} {{ talent.level }}
            </span>
          </div>
          <div class="build-card__resonance text-sm" data-test-build-card-resonance>
            Resonance Chains:
            <span class="text-primary font-bold">{{ resonanceChainCount }} / 6</span>
          </div>
        </CalculatorCharacterCard>

        <CalculatorWeaponCard
          v-if="weaponInfo"
          class="mt-2"
          :name="weaponInfo.name"
          :name-key="weaponKey ?? ''"
          :rarity="weaponInfo.rarity">
          <div class="text-sm opacity-70" data-test-build-card-refinement>
            Refinement {{ weaponRefinement }}
          </div>
        </CalculatorWeaponCard>
      </div>

      <div class="build-card__stats xl:col-span-8">
        <CalculatorStats
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
          :tune-break-boost="tuneBreakBoost" />
      </div>
    </div>

    <div
      class="build-card__echoes grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mt-4"
      data-test-build-card-echoes>
      <CalculatorEchoCard
        v-for="(echo, index) in echoSlots"
        :key="index"
        compact
        hide-inventory
        v-bind="echo" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useCharacterStore } from "../stores/character";
import { getWeaponByName } from "../weapons/weapons";
import CalculatorCharacterCard from "./CalculatorCharacterCard.vue";
import CalculatorWeaponCard from "./CalculatorWeaponCard.vue";
import CalculatorEchoCard from "./CalculatorEchoCard.vue";
import CalculatorStats from "./CalculatorStats.vue";

interface ChosenCharRef {
  value?: {
    basic?: {
      name: string;
      rarity: number;
      element: string;
      weapon: string;
    };
  };
}

const props = defineProps<{
  character: string;
  characterLevel: string;
  weaponAtk: number;
  chosenChar: ChosenCharRef | null;
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
}>();

const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);

const characterData = computed(
  () =>
    (characters.value[props.character] ?? {}) as Record<string, any>,
);
const characterBasic = computed(() => props.chosenChar?.value?.basic ?? null);
// Character modules store the weapon *type* in the plural, folder-name form
// (e.g. "Swords", used to load `src/weapons/Swords/...`), but
// CalculatorCharacterCard's weapon icon map is keyed by the singular form
// (e.g. "Sword").
const characterBasicWeaponType = computed(
  () => characterBasic.value?.weapon?.replace(/s$/, "") ?? "",
);

const talentBadges = computed(() => {
  const talents = characterData.value.talents ?? {};
  return [
    { key: "basic", label: "Basic", level: talents.basic ?? 10 },
    { key: "skill", label: "Skill", level: talents.skill ?? 10 },
    { key: "forte", label: "Forte", level: talents.forte ?? 10 },
    { key: "liberation", label: "Liberation", level: talents.liberation ?? 10 },
    { key: "intro", label: "Intro", level: talents.intro ?? 10 },
  ];
});

const resonanceChainCount = computed(
  () =>
    Object.values(characterData.value.resonanceChains ?? {}).filter(
      (chain: any) => chain?.isEnabled,
    ).length,
);

const echoSlots = computed(() => {
  // Stored as a Record<number, EchoSlot> (keys "0"-"4"), not an array.
  const echoes = Object.values(characterData.value.echoes ?? {}) as any[];
  return echoes.length ? echoes : Array.from({ length: 5 }, () => ({}));
});

const weaponKey = computed(() => characterData.value.weapon ?? null);
const weaponRefinement = computed(
  () => characterData.value.weapons?.[weaponKey.value ?? ""]?.refinement ?? "1",
);

const weaponInfo = ref<{ name: string; rarity: number | string } | null>(null);

watch(
  () => [weaponKey.value, characterBasic.value?.weapon] as const,
  async ([nextWeaponKey, weaponType]) => {
    if (!nextWeaponKey || !weaponType) {
      weaponInfo.value = null;
      return;
    }
    const weaponModule = await getWeaponByName(weaponType, nextWeaponKey);
    weaponInfo.value = weaponModule?.info
      ? { name: weaponModule.info.name, rarity: weaponModule.info.rarity }
      : null;
  },
  { immediate: true },
);
</script>
