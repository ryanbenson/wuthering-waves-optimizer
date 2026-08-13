<template>
  <div class="build-card" data-test-build-card>
    <div class="build-card__toolbar flex flex-wrap justify-between items-end gap-4 mb-4">
      <div class="build-card__profile-fields flex flex-wrap items-end gap-2">
        <label class="form-control">
          <div class="label py-1">
            <span class="label-text text-xs">Username (optional)</span>
          </div>
          <input
            v-model="buildCardUsername"
            type="text"
            class="input input-bordered input-sm w-40"
            placeholder="Username"
            data-test-build-card-username-input />
        </label>
        <label class="form-control">
          <div class="label py-1">
            <span class="label-text text-xs">UID (optional)</span>
          </div>
          <input
            v-model="buildCardUid"
            type="text"
            class="input input-bordered input-sm w-32"
            placeholder="UID"
            data-test-build-card-uid-input />
        </label>
        <button
          type="button"
          class="btn btn-sm"
          @click="triggerBackgroundUpload"
          data-test-build-card-background-trigger>
          Upload Background
        </button>
        <button
          v-if="buildCardBackground"
          type="button"
          class="btn btn-sm btn-ghost"
          @click="resetBackground"
          data-test-build-card-background-reset>
          Reset Background
        </button>
        <input
          ref="backgroundFileInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="onBackgroundFileChange"
          data-test-build-card-background-input />
      </div>
      <div class="flex gap-2">
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
    </div>

    <div
      ref="viewportRef"
      class="build-card__viewport"
      :style="{ height: `${scaledHeight}px` }">
      <div
        ref="cardRef"
        class="build-card__canvas bg-base-100 bg-cover bg-center"
        :style="{
          transform: `scale(${scale})`,
          backgroundImage: buildCardBackground
            ? `url(${buildCardBackground})`
            : undefined,
        }">
        <div class="build-card__grid grid grid-cols-12 gap-4">
          <div class="build-card__identity-panel col-span-4 h-full">
            <div class="build-card__identity relative h-full w-full rounded-lg overflow-hidden bg-base-300">
              <CalculatorBuildCardPortraitUpload
                variant="cover"
                :character="character"
                :current-portrait="characterData.customPortrait"
                :default-portrait-url="defaultPortraitUrl" />
              <div class="build-card__identity-scrim absolute inset-0 pointer-events-none"></div>

              <div class="absolute top-4 left-4 max-w-[65%] pointer-events-none">
                <template v-if="characterBasic">
                  <h2
                    class="text-2xl font-bold leading-tight text-white"
                    :class="{
                      'text-amber-300': characterBasic.rarity === 5,
                      'text-violet-600': characterBasic.rarity === 4,
                    }">
                    {{ characterBasic.name }}
                  </h2>
                  <div
                    class="flex gap-0.5 mt-1"
                    :class="{
                      'text-amber-300': characterBasic.rarity === 5,
                      'text-violet-600': characterBasic.rarity === 4,
                    }"
                    aria-hidden="true">
                    <svg
                      v-for="n in characterBasic.rarity"
                      :key="n"
                      viewBox="0 0 24 24"
                      class="size-3.5"
                      fill="currentColor">
                      <path
                        d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.86L12 17.77l-6.18 3.23L7 14.14 2 9.27l7.1-1.01z" />
                    </svg>
                  </div>
                  <div class="text-sm text-white opacity-80 mt-1">Lv. {{ characterLevel }}</div>
                </template>

                <div
                  class="build-card__resonance flex flex-col items-start gap-5 mt-4"
                  data-test-build-card-resonance>
                  <div
                    v-for="(chain, idx) in resonanceChainNodes"
                    :key="chain.key ?? idx"
                    class="build-card__resonance-node flex items-center justify-center rounded-full overflow-hidden"
                    :class="
                      chain.isEnabled
                        ? 'build-card__resonance-node--active'
                        : 'build-card__resonance-node--inactive'
                    "
                    :title="chain.name">
                    <img
                      v-if="chain.icon"
                      :src="chain.icon"
                      class="w-full h-full object-cover" />
                    <svg
                      v-else
                      viewBox="0 0 24 24"
                      class="size-6"
                      fill="currentColor">
                      <path
                        d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div class="absolute top-4 right-4 pointer-events-none">
                <CalculatorBuildCardForte
                  :talents="characterData.talents ?? {}"
                  :icons="forteIcons" />
              </div>

              <div
                v-if="buildCardUsername || buildCardUid"
                class="build-card__profile absolute bottom-4 left-4 text-white leading-tight pointer-events-none"
                data-test-build-card-profile>
                <div v-if="buildCardUsername" class="text-lg font-semibold">
                  {{ buildCardUsername }}
                </div>
                <div v-if="buildCardUid" class="text-base opacity-70">
                  UID {{ buildCardUid }}
                </div>
              </div>
            </div>
          </div>

          <div class="build-card__middle col-span-3 h-full flex flex-col gap-4">
            <div class="build-card__weapon h-[200px] shrink-0">
              <CalculatorBuildCardWeaponPanel
                v-if="weaponInfo"
                :name="weaponInfo.name"
                :image="weaponImage"
                :rarity="weaponInfo.rarity"
                :level="weaponLevel"
                :refinement="weaponRefinement"
                :attack="weaponAtk"
                :modifier-label="weaponModifierLabel"
                :modifier-image="weaponModifierImage"
                :modifier-value="weaponModifierValue" />
              <div
                v-else
                class="w-full h-full rounded-lg bg-base-200 flex items-center justify-center text-sm opacity-50">
                No weapon selected
              </div>
            </div>
            <div class="build-card__stats flex-1 min-h-0 overflow-hidden">
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
                :tune-break-boost="tuneBreakBoost"
                :element-filter="characterBasic?.element" />
            </div>
            <div
              v-if="echoSetSummary.length"
              class="build-card__echo-sets shrink-0 flex flex-wrap justify-center gap-2 mb-6"
              data-test-build-card-echo-sets>
              <div
                v-for="set in echoSetSummary"
                :key="set.key"
                class="flex items-center gap-2 rounded-lg bg-base-200 px-3 py-2">
                <img :src="set.icon" class="size-7" />
                <span class="text-base font-semibold">{{ set.count }}pc {{ set.label }}</span>
              </div>
            </div>
          </div>

          <div
            class="build-card__echoes col-span-5 h-full flex flex-col justify-center gap-6"
            data-test-build-card-echoes>
            <CalculatorBuildCardEchoCard
              v-for="(echo, index) in echoSlots"
              :key="index"
              class="shrink-0"
              style="height: 185px"
              v-bind="echo" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";
import { useSettingsStore } from "../stores/settings";
import { getWeaponByName } from "../weapons/weapons";
import { useToast } from "../composables/useToast";
import {
  subStatIconMap,
  subStatLabelMap,
  getEchoSetIconByType,
  getEchoSetLabelByType,
} from "../echoes/stats";
import { compressImageToDataUrl } from "../utils/imageCompression";
import {
  copyCardImageToClipboard,
  downloadCardImage,
  EXPORT_HEIGHT,
  EXPORT_WIDTH,
  isClipboardImageWriteSupported,
} from "../utils/exportCardImage";
import CalculatorBuildCardPortraitUpload from "./CalculatorBuildCardPortraitUpload.vue";
import CalculatorBuildCardWeaponPanel from "./CalculatorBuildCardWeaponPanel.vue";
import CalculatorBuildCardForte from "./CalculatorBuildCardForte.vue";
import CalculatorBuildCardEchoCard from "./CalculatorBuildCardEchoCard.vue";
import CalculatorStats from "./CalculatorStats.vue";

interface ChosenCharRef {
  value?: {
    basic?: {
      name: string;
      rarity: number;
      element: string;
      weapon: string;
      image?: string;
    };
    resonanceChains?: Array<{ key: string; name?: string; icon?: string }>;
    basicAttacks?: { icon?: string };
    skillAttacks?: { icon?: string };
    liberationAttacks?: { icon?: string };
    forteCircuitAttacks?: { icon?: string };
    introAttacks?: { icon?: string };
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
const inventoryStore = useInventoryStore();
const settingsStore = useSettingsStore();
const { characters } = storeToRefs(characterStore);
const { config } = storeToRefs(settingsStore);

// Player identity/branding for the card (username, UID, background image)
// is shared across every character's build card, not tied to one build, so
// it lives in the settings store's general `config` bag rather than on the
// per-character state in `characterStore`.
const buildCardUsername = computed({
  get: () => config.value?.buildCard?.username ?? "",
  set: (value: string) =>
    settingsStore.addToConfig({ buildCard: { username: value } }),
});
const buildCardUid = computed({
  get: () => config.value?.buildCard?.uid ?? "",
  set: (value: string) =>
    settingsStore.addToConfig({ buildCard: { uid: value } }),
});
const buildCardBackground = computed(
  () => config.value?.buildCard?.background ?? null,
);

const backgroundFileInput = ref<HTMLInputElement | null>(null);

function triggerBackgroundUpload() {
  backgroundFileInput.value?.click();
}

function onBackgroundFileChange(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    void handleBackgroundFile(file);
  }
  if (backgroundFileInput.value) {
    backgroundFileInput.value.value = "";
  }
}

async function handleBackgroundFile(file: File) {
  if (!file.type.startsWith("image/")) {
    showToast("Please choose an image file", "error");
    return;
  }

  const objectUrl = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    try {
      const dataUrl = compressImageToDataUrl(img, {
        maxDimension: 1600,
        quality: 0.75,
      });
      settingsStore.addToConfig({ buildCard: { background: dataUrl } });
      showToast("Background updated", "success");
    } catch {
      showToast("Failed to process image", "error");
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  };
  img.onerror = () => {
    showToast("Failed to load image", "error");
    URL.revokeObjectURL(objectUrl);
  };
  img.src = objectUrl;
}

function resetBackground() {
  settingsStore.addToConfig({ buildCard: { background: null } });
  showToast("Background reset", "success");
}

const characterData = computed(
  () => (characters.value[props.character] ?? {}) as Record<string, any>,
);
const characterBasic = computed(() => props.chosenChar?.value?.basic ?? null);

const defaultPortraitUrl = computed(
  () =>
    characterBasic.value?.image ||
    `https://ryanbenson.github.io/wuthering-waves-assets/images/${props.character}.png`,
);

const forteIcons = computed(() => ({
  basic: props.chosenChar?.value?.basicAttacks?.icon,
  skill: props.chosenChar?.value?.skillAttacks?.icon,
  liberation: props.chosenChar?.value?.liberationAttacks?.icon,
  forte: props.chosenChar?.value?.forteCircuitAttacks?.icon,
  intro: props.chosenChar?.value?.introAttacks?.icon,
}));

const resonanceChainNodes = computed(() => {
  const chains = props.chosenChar?.value?.resonanceChains ?? [];
  const enabledMap = characterData.value.resonanceChains ?? {};
  return chains.map((chain) => ({
    key: chain.key,
    name: chain.name,
    icon: chain.icon,
    isEnabled: Boolean(enabledMap[chain.key]?.isEnabled),
  }));
});

const echoSlots = computed(() => {
  // Stored as a Record<number, { echoId, ...null stat fields }> (keys
  // "0"-"4") — a slot only points at an echoId. The actual echo/type/rank/
  // stat/echoSet/substats live on the matching item in the inventory store
  // (see CalculatorEcho.vue's currentEcho/inventoryStore.getEchoById
  // pattern), so each slot must be resolved through there to render.
  const slots = characterData.value.echoes ?? {};
  return Array.from({ length: 5 }, (_, i) => {
    const slot = slots[i] ?? {};
    const inventoryEcho = slot.echoId
      ? inventoryStore.getEchoById(slot.echoId)
      : null;
    return inventoryEcho ?? slot;
  });
});

// Tallies equipped echoes by set key and surfaces every set with 2+ pieces
// equipped (game set bonuses come in 2pc/5pc tiers), so the card can show
// e.g. "2pc Molten Rift" / "5pc Molten Rift" — informational (what's
// equipped), not a re-derivation of `getSetBonusEffects`'s "which 2 bonus
// slots actually apply" selection logic used for damage calculation.
const echoSetSummary = computed(() => {
  const counts: Record<string, number> = {};
  for (const echo of echoSlots.value as Array<{ echoSet?: string }>) {
    const key = echo?.echoSet;
    if (key && key !== "none") {
      counts[key] = (counts[key] ?? 0) + 1;
    }
  }
  return Object.entries(counts)
    .filter(([, count]) => count >= 2)
    .sort(([, a], [, b]) => b - a)
    .map(([key, count]) => ({
      key,
      count,
      label: getEchoSetLabelByType(key),
      icon: getEchoSetIconByType(key),
    }));
});

const weaponKey = computed(() => characterData.value.weapon ?? null);
const weaponRefinement = computed(
  () => characterData.value.weapons?.[weaponKey.value ?? ""]?.refinement ?? "1",
);

const weaponModule = ref<{
  info?: {
    name: string;
    rarity: number | string;
    image?: string;
    maxLevel?: string;
  };
  data?: Record<
    string,
    { attack?: number; modifier?: string; modifierValue?: number }
  >;
} | null>(null);

watch(
  () => [weaponKey.value, characterBasic.value?.weapon] as const,
  async ([nextWeaponKey, weaponType]) => {
    if (!nextWeaponKey || !weaponType) {
      weaponModule.value = null;
      return;
    }
    weaponModule.value = await getWeaponByName(weaponType, nextWeaponKey);
  },
  { immediate: true },
);

const weaponInfo = computed(() => weaponModule.value?.info ?? null);
const weaponImage = computed(() => weaponModule.value?.info?.image ?? null);
const weaponLevel = computed(
  () =>
    characterData.value.weapons?.[weaponKey.value ?? ""]?.weaponLevel ??
    weaponModule.value?.info?.maxLevel ??
    "90",
);
const weaponLevelStats = computed(() => {
  if (!weaponModule.value || !weaponLevel.value) {
    return null;
  }
  return weaponModule.value.data?.[weaponLevel.value] ?? null;
});
const weaponModifierKey = computed(() => weaponLevelStats.value?.modifier ?? null);
const weaponModifierValue = computed(
  () => weaponLevelStats.value?.modifierValue ?? null,
);
const weaponModifierLabel = computed(() =>
  weaponModifierKey.value
    ? (subStatLabelMap[weaponModifierKey.value] ?? null)
    : null,
);
const weaponModifierImage = computed(() =>
  weaponModifierKey.value
    ? (subStatIconMap[weaponModifierKey.value] ?? null)
    : null,
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

// html-to-image clones the live node (including its inline `transform:
// scale(...)` used to shrink the fixed 1920x1080 canvas to fit the preview
// pane), so capturing while scaled down bakes that shrink into the output.
// Reset to scale(1) for the capture, then restore the preview scale.
async function withUnscaledCard<T>(fn: () => Promise<T>): Promise<T> {
  const previousScale = scale.value;
  scale.value = 1;
  await nextTick();
  try {
    return await fn();
  } finally {
    scale.value = previousScale;
  }
}

async function handleCopy() {
  if (!cardRef.value) return;
  isExporting.value = true;
  try {
    await withUnscaledCard(() => copyCardImageToClipboard(cardRef.value!));
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
    await withUnscaledCard(() =>
      downloadCardImage(cardRef.value!, `${props.character}-build-card.png`),
    );
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
  padding: 0;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: top left;
  display: flex;
  flex-direction: column;
}

.build-card__grid {
  flex: 1 1 auto;
  min-height: 0;
  display: grid;
  grid-template-rows: 100%;
}

.build-card__identity-scrim {
  background: linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.75) 0%,
    rgba(0, 0, 0, 0.1) 35%,
    rgba(0, 0, 0, 0.35) 100%
  );
}

.build-card__resonance-node {
  width: 3rem;
  height: 3rem;
  border: 1px solid oklch(var(--bc) / 0.4);
  background: rgba(0, 0, 0, 0.35);
  color: white;
}

.build-card__resonance-node--active {
  border-color: oklch(var(--p) / 0.9);
  background: oklch(var(--p) / 0.35);
  box-shadow: 0 0 8px 1px oklch(var(--p) / 0.4);
}

.build-card__resonance-node--inactive {
  opacity: 0.5;
}

// CalculatorStats.vue is shared with the single-character Calculator page,
// so its own base font-size can't change without affecting that page too —
// :deep() overrides it only within this build card's usage.
.build-card__stats :deep(.calculator__stats td) {
  font-size: 19px;
  padding: 0.6rem 0.5rem;
}

.build-card__stats :deep(.calculator__stats img) {
  width: 1.5rem;
  height: 1.5rem;
}
</style>
