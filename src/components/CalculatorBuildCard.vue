<template>
  <div class="build-card" data-test-build-card>
    <div class="build-card__toolbar flex justify-end gap-2 mb-4">
      <button
        v-if="clipboardSupported"
        type="button"
        class="btn btn-sm btn-primary"
        :disabled="isExporting"
        @click="handleCopy"
        data-test-build-card-copy>
        Copy to Clipboard
      </button>
      <button
        type="button"
        class="btn btn-sm btn-primary"
        :disabled="isExporting"
        @click="handleDownload"
        data-test-build-card-download>
        Download
      </button>
    </div>

    <div
      ref="viewportRef"
      class="build-card__viewport"
      :style="{ height: `${scaledHeight}px` }">
      <div
        ref="cardRef"
        class="build-card__canvas bg-base-100"
        :style="{ transform: `scale(${scale})` }">
        <div class="build-card__grid grid grid-cols-1 xl:grid-cols-12 gap-4">
          <div class="build-card__identity xl:col-span-4">
            <div
              v-if="characterBasic"
              class="card card-bordered card-compact bg-base-100 shadow mb-2">
              <div class="card-body items-center text-center">
                <CalculatorBuildCardPortraitUpload
                  :character="character"
                  :current-portrait="characterData.customPortrait"
                  :default-portrait-url="defaultPortraitUrl" />
                <h2
                  class="card-title"
                  :class="{
                    'text-amber-300': characterBasic.rarity === 5,
                    'text-violet-600': characterBasic.rarity === 4,
                  }">
                  {{ characterBasic.name }}
                </h2>
                <div class="build-card__level text-sm opacity-70">
                  Lv. {{ characterLevel }}
                </div>
                <div class="flex gap-2 items-center">
                  <img
                    v-if="elementImage"
                    :src="elementImage"
                    class="size-6"
                    :class="`${characterBasic.element.toLowerCase()}--active`" />
                  <img
                    v-if="weaponTypeImage"
                    :src="weaponTypeImage"
                    class="size-6" />
                </div>
                <div
                  class="build-card__talents flex flex-wrap gap-2 justify-center mt-2"
                  data-test-build-card-talents>
                  <span
                    v-for="talent in talentBadges"
                    :key="talent.key"
                    class="badge badge-outline">
                    {{ talent.label }} {{ talent.level }}
                  </span>
                </div>
                <div
                  class="build-card__resonance text-sm mt-2"
                  data-test-build-card-resonance>
                  Resonance Chains:
                  <span class="text-primary font-bold"
                    >{{ resonanceChainCount }} / 6</span
                  >
                </div>
              </div>
            </div>

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
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useCharacterStore } from "../stores/character";
import { getWeaponByName } from "../weapons/weapons";
import {
  characterElementsSetImageMap,
  weaponTypesImageMap,
} from "../characters/characters";
import { useToast } from "../composables/useToast";
import {
  copyCardImageToClipboard,
  downloadCardImage,
  EXPORT_HEIGHT,
  EXPORT_WIDTH,
  isClipboardImageWriteSupported,
} from "../utils/exportCardImage";
import CalculatorBuildCardPortraitUpload from "./CalculatorBuildCardPortraitUpload.vue";
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

const { showToast } = useToast();
const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);

const characterData = computed(
  () => (characters.value[props.character] ?? {}) as Record<string, any>,
);
const characterBasic = computed(() => props.chosenChar?.value?.basic ?? null);
// Character modules store the weapon *type* in the plural, folder-name form
// (e.g. "Swords", used to load `src/weapons/Swords/...`), but
// CalculatorCharacterCard's weapon icon map is keyed by the singular form
// (e.g. "Sword").
const characterBasicWeaponType = computed(
  () => characterBasic.value?.weapon?.replace(/s$/, "") ?? "",
);

const elementImage = computed(
  () =>
    characterElementsSetImageMap[characterBasic.value?.element ?? ""] ?? null,
);
const weaponTypeImage = computed(
  () => weaponTypesImageMap[characterBasicWeaponType.value] ?? null,
);
const defaultPortraitUrl = computed(
  () =>
    `https://ryanbenson.github.io/wuthering-waves-assets/images/${props.character}.png`,
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

// The card is built at a fixed 1920x1080 layout size (matching the exported
// image exactly) and visually scaled down to fit the available width, so
// what's captured never depends on the viewer's screen size.
const viewportRef = ref<HTMLElement | null>(null);
const cardRef = ref<HTMLElement | null>(null);
const scale = ref(1);
const scaledHeight = computed(() => EXPORT_HEIGHT * scale.value);
let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  if (viewportRef.value && typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width) {
        scale.value = width / EXPORT_WIDTH;
      }
    });
    resizeObserver.observe(viewportRef.value);
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
});

const clipboardSupported = isClipboardImageWriteSupported();
const isExporting = ref(false);

async function handleCopy() {
  if (!cardRef.value) return;
  isExporting.value = true;
  try {
    await copyCardImageToClipboard(cardRef.value);
    showToast("Build card copied to clipboard", "success");
  } catch {
    showToast("Failed to copy build card image", "error");
  } finally {
    isExporting.value = false;
  }
}

async function handleDownload() {
  if (!cardRef.value) return;
  isExporting.value = true;
  try {
    await downloadCardImage(cardRef.value, `${props.character}-build-card.png`);
    showToast("Build card downloaded", "success");
  } catch {
    showToast("Failed to download build card image", "error");
  } finally {
    isExporting.value = false;
  }
}
</script>

<style lang="scss" scoped>
.build-card__viewport {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.build-card__canvas {
  width: 1920px;
  height: 1080px;
  padding: 2rem;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: top left;
}
</style>
