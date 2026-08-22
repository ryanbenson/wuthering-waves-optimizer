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
        <CalculatorBuildCardImageAdjustPanel
          v-if="buildCardBackground"
          label="background"
          test-id="background"
          text-label="Adjust background"
          :model-value="buildCardBackgroundTransform"
          @update:model-value="buildCardBackgroundTransform = $event"
          @reset="buildCardBackgroundTransform = null" />
        <input
          ref="backgroundFileInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="onBackgroundFileChange"
          data-test-build-card-background-input />
        <label class="form-control">
          <div class="label py-1">
            <span class="label-text text-xs">Primary Color</span>
          </div>
          <input
            v-model="buildCardPrimaryColor"
            type="color"
            class="w-10 h-9 p-1 rounded-md border border-base-content/20 bg-base-100"
            data-test-build-card-primary-color-input />
        </label>
        <button
          v-if="customPrimaryColor"
          type="button"
          class="btn btn-sm btn-ghost"
          @click="resetPrimaryColor"
          data-test-build-card-primary-color-reset>
          Reset Color
        </button>
        <CalculatorBuildCardImageAdjustPanel
          v-if="characterData.customPortrait"
          label="character art"
          test-id="portrait"
          text-label="Adjust portrait"
          :model-value="portraitTransform"
          @update:model-value="portraitTransform = $event"
          @reset="portraitTransform = null" />
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
        class="build-card__canvas bg-base-100"
        :style="{
          transform: `scale(${scale})`,
          ...buildCardPrimaryColorStyle,
        }">
        <div class="build-card__background-layer absolute inset-0" :style="backgroundLayerStyle"></div>
        <div class="build-card__grid grid grid-cols-12 gap-4">
          <div class="build-card__identity-panel col-span-4 h-full">
            <div class="build-card__identity relative h-full w-full rounded-lg overflow-hidden bg-base-300">
              <CalculatorBuildCardPortraitUpload
                variant="cover"
                :character="character"
                :current-portrait="characterData.customPortrait"
                :default-portrait-url="defaultPortraitUrl"
                :transform="characterData.customPortraitTransform" />
              <div class="build-card__identity-scrim absolute inset-0 pointer-events-none"></div>

              <div class="absolute top-4 left-4 min-w-[88%] max-w-[88%] pointer-events-none">
                <template v-if="characterBasic">
                  <h2
                    class="text-4xl font-bold leading-tight text-white"
                    :class="{
                      'text-amber-300': characterBasic.rarity === 5,
                      'text-violet-600': characterBasic.rarity === 4,
                    }"
                    data-test-build-card-name>
                    {{ characterBasic.name }}
                  </h2>
                  <div
                    class="flex gap-1 mt-1.5"
                    :class="{
                      'text-amber-300': characterBasic.rarity === 5,
                      'text-violet-600': characterBasic.rarity === 4,
                    }"
                    aria-hidden="true">
                    <svg
                      v-for="n in characterBasic.rarity"
                      :key="n"
                      viewBox="0 0 24 24"
                      class="size-5"
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

              <div
                v-if="buildCardUsername || buildCardUid"
                class="build-card__profile absolute bottom-4 left-4 text-white leading-tight pointer-events-none"
                data-test-build-card-profile>
                <div v-if="buildCardUsername" class="text-2xl font-semibold">
                  {{ buildCardUsername }}
                </div>
                <div v-if="buildCardUid" class="text-lg opacity-70 whitespace-nowrap">
                  UID {{ buildCardUid }}
                </div>
              </div>
            </div>
          </div>

          <div class="build-card__middle col-span-4 h-full flex flex-col gap-4">
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
            <div class="build-card__forte shrink-0">
              <CalculatorBuildCardForte
                :talents="characterData.talents ?? {}"
                :icons="forteIcons" />
            </div>
            <div class="build-card__stats flex-1 min-h-0 overflow-hidden">
              <CalculatorStats
                :character="character"
                :character-level="characterLevel"
                :weapon-atk="weaponAtk"
                :total-atk="buildCardStats.totalAtk ?? 0"
                :total-atk-percent="buildCardStats.attackPercent ?? 0"
                :total-atk-flat="buildCardStats.attackFlat ?? 0"
                :total-hp="buildCardStats.totalHp ?? 0"
                :total-hp-percent="buildCardStats.hpPercent ?? 0"
                :total-hp-flat="buildCardStats.hpFlat ?? 0"
                :total-def="buildCardStats.totalDef ?? 0"
                :total-def-percent="buildCardStats.defPercent ?? 0"
                :total-def-flat="buildCardStats.defFlat ?? 0"
                :total-crit-rate="(buildCardStats.critRate ?? 0) / 100"
                :total-crit-dmg="(buildCardStats.critDMG ?? 0) / 100"
                :energy-regen="buildCardStats.energyRegen ?? 0"
                :basic-attack-dmg-bonus="buildCardStats.basicAttackDMGBonus ?? 0"
                :heavy-attack-dmg-bonus="buildCardStats.heavyAttackDMGBonus ?? 0"
                :resonance-skill-dmg-bonus="buildCardStats.resonanceSkillDMGBonus ?? 0"
                :resonance-liberation-dmg-bonus="buildCardStats.resonanceLiberationDMGBonus ?? 0"
                :glacio="buildCardStats.glacio ?? 0"
                :fusion="buildCardStats.fusion ?? 0"
                :electro="buildCardStats.electro ?? 0"
                :aero="buildCardStats.aero ?? 0"
                :spectro="buildCardStats.spectro ?? 0"
                :havoc="buildCardStats.havoc ?? 0"
                :healing-bonus="buildCardStats.healingBonus ?? 0"
                :tune-break-boost="buildCardTuneBreakBoost"
                :element-filter="characterBasic?.element" />
            </div>
            <div
              v-if="echoSetSummary.length"
              class="build-card__echo-sets shrink-0 flex flex-wrap-reverse justify-center gap-2 mb-6"
              data-test-build-card-echo-sets>
              <div
                v-for="set in echoSetSummary"
                :key="set.key"
                class="flex items-center gap-2 rounded-lg bg-base-200 px-3 py-2">
                <img :src="set.icon" class="size-7" />
                <span class="text-base font-semibold whitespace-nowrap">{{ set.count }}pc {{ set.label }}</span>
              </div>
            </div>
          </div>

          <div
            class="build-card__echoes col-span-4 h-full flex flex-col"
            data-test-build-card-echoes>
            <div class="build-card__echoes-list flex-1 min-h-0 flex flex-col justify-center gap-6">
              <CalculatorBuildCardEchoCard
                v-for="(echo, index) in echoSlots"
                :key="index"
                class="shrink-0"
                style="height: 185px"
                v-bind="echo" />
            </div>
            <div class="build-card__watermark shrink-0 text-right" data-test-build-card-watermark>
              WUTHERINGTOOLS.COM
            </div>
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
import { buildCharacterCalculationContext } from "../calculator/buildCharacterContext";
import { computeTotalTuneBreakBoost } from "../calculator/stats";
import { filterBuffsForStance, resolveActiveStance } from "../calculator/stances";
import { useToast } from "../composables/useToast";
import {
  subStatIconMap,
  subStatLabelMap,
  getEchoSetIconByType,
  getEchoSetLabelByType,
} from "../echoes/stats";
import { getSetBonusThreshold } from "../echoes/sets";
import { compressImageToDataUrl } from "../utils/imageCompression";
import { contrastOklchTriple, hexToOklchTriple } from "../utils/color";
import {
  copyCardImageToClipboard,
  downloadCardImage,
  EXPORT_HEIGHT,
  EXPORT_WIDTH,
  isClipboardImageWriteSupported,
} from "../utils/exportCardImage";
import { imageLayerStyle, type ImageTransform } from "../utils/imageTransform";
import CalculatorBuildCardPortraitUpload from "./CalculatorBuildCardPortraitUpload.vue";
import CalculatorBuildCardWeaponPanel from "./CalculatorBuildCardWeaponPanel.vue";
import CalculatorBuildCardForte from "./CalculatorBuildCardForte.vue";
import CalculatorBuildCardEchoCard from "./CalculatorBuildCardEchoCard.vue";
import CalculatorBuildCardImageAdjustPanel from "./CalculatorBuildCardImageAdjustPanel.vue";
import CalculatorStats from "./CalculatorStats.vue";

interface ChosenCharRef {
  value?: {
    basic?: {
      name: string;
      rarity: number;
      element: string;
      weapon: string;
      image?: string;
      stances?: string[];
    };
    resonanceChains?: Array<{ key: string; name?: string; icon?: string; stance?: string }>;
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
const buildCardBackgroundTransform = computed({
  get: () => (config.value?.buildCard?.backgroundTransform ?? null) as Partial<ImageTransform> | null,
  set: (value: ImageTransform | null) =>
    settingsStore.addToConfig({ buildCard: { backgroundTransform: value } }),
});
const backgroundLayerStyle = computed(() =>
  imageLayerStyle(buildCardBackground.value, buildCardBackgroundTransform.value),
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
      // A fresh background starts framed at the default cover/center/100%
      // look — positioning dialed in for the previous image wouldn't mean
      // anything for a differently-cropped one.
      settingsStore.addToConfig({
        buildCard: { background: dataUrl, backgroundTransform: null },
      });
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
  settingsStore.addToConfig({
    buildCard: { background: null, backgroundTransform: null },
  });
  showToast("Background reset", "success");
}

const characterData = computed(
  () => (characters.value[props.character] ?? {}) as Record<string, any>,
);
const characterBasic = computed(() => props.chosenChar?.value?.basic ?? null);

// Like buildCardPrimaryColor above, the character portrait's positioning is
// per-build rather than shared branding, so it lives on the character
// itself alongside customPortrait rather than in the settings store.
const portraitTransform = computed<Partial<ImageTransform> | null>({
  get: () => characterData.value.customPortraitTransform ?? null,
  set: (value) =>
    characterStore.setCharacterData(props.character, {
      customPortraitTransform: value,
    }),
});

// Unlike username/UID/background (shared branding across every card, see
// above), the primary color is a per-build styling choice — different
// characters' cards can want different accent colors — so it's stored on
// the character itself rather than the settings store's shared config.
const DEFAULT_PRIMARY_COLOR = "#4b6bfb";
const customPrimaryColor = computed(
  () => characterData.value.buildCardPrimaryColor ?? null,
);
const buildCardPrimaryColor = computed({
  get: () => customPrimaryColor.value ?? DEFAULT_PRIMARY_COLOR,
  set: (value: string) =>
    characterStore.setCharacterData(props.character, {
      buildCardPrimaryColor: value,
    }),
});
const buildCardPrimaryColorStyle = computed(() => {
  if (!customPrimaryColor.value) return {};
  return {
    "--p": hexToOklchTriple(customPrimaryColor.value),
    "--pc": contrastOklchTriple(customPrimaryColor.value),
  };
});

function resetPrimaryColor() {
  characterStore.setCharacterData(props.character, {
    buildCardPrimaryColor: null,
  });
  showToast("Primary color reset", "success");
}

// The build card represents equipment alone (issue #383): base
// character/weapon/echo stats plus only the weapon passives, echo set
// bonuses, and main-echo buff that are permanently active — never
// conditional buffs, team buffs, custom buffs, or character/resonance-chain
// buffs (those are all situational, not "the build"). This is intentionally
// independent of the Results tab's live totals (which include every
// currently-toggled buff), so it's recomputed here from stored build data
// rather than forwarded from Calculator.vue.
const buildCardStats = ref<Record<string, any>>({});
const buildCardTuneBreakBoost = ref(0);

watch(
  () => [props.character, characterData.value, inventoryStore.echoes] as const,
  async ([nextCharacter]) => {
    if (!nextCharacter) {
      buildCardStats.value = {};
      buildCardTuneBreakBoost.value = 0;
      return;
    }
    const built = await buildCharacterCalculationContext(
      nextCharacter,
      characters.value,
      { enemyLevel: 90, enemyResist: 0.1, enemyType: "Calamity" },
      inventoryStore.echoes,
      { alwaysEnabledOnly: true },
    );
    buildCardStats.value = built.finalStats;
    buildCardTuneBreakBoost.value = computeTotalTuneBreakBoost({
      baseTuneBreakBoost: built.chosenChar?.basic?.tuneBreakBoost ?? 0,
      echoStats: built.echoStats,
    });
  },
  { immediate: true, deep: true },
);

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

// Some characters (e.g. stance-swapping ones) define multiple resonance
// chain entries for the same in-game sequence node — either stance-bound
// variants of one node, or several independently-toggleable effects of one
// node (differentiated only by unique `key`s). The build card shows one
// icon per node, so entries are grouped by their shared "Sequence Node N:"
// name prefix, restricted to whichever entries actually apply for the
// character's current stance, and the node lights up if any entry in its
// group is enabled.
const activeStance = computed(() =>
  resolveActiveStance(
    props.chosenChar?.value?.basic?.stances,
    characterData.value.activeStance,
    characterData.value.buffs,
  ),
);

const resonanceChainNodes = computed(() => {
  const chains = props.chosenChar?.value?.resonanceChains ?? [];
  const enabledMap = characterData.value.resonanceChains ?? {};
  const chainsForStance = filterBuffsForStance(chains, activeStance.value);

  const nodesByNumber = new Map<
    string,
    { key: string; name?: string; icon?: string; isEnabled: boolean }
  >();
  for (const chain of chainsForStance) {
    const nodeNumber = /^Sequence Node (\d+)/.exec(chain.name ?? "")?.[1] ?? chain.key;
    const isEnabled = Boolean(enabledMap[chain.key]?.isEnabled);
    const existing = nodesByNumber.get(nodeNumber);
    if (!existing) {
      nodesByNumber.set(nodeNumber, { key: chain.key, name: chain.name, icon: chain.icon, isEnabled });
    } else if (isEnabled) {
      existing.isEnabled = true;
    }
  }
  return Array.from(nodesByNumber.values());
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

// Tallies equipped echoes by set key and surfaces every set that meets its
// own bonus threshold (usually 2pc/5pc, but some sets — e.g. Lucy's
// exclusive "Shadow of Shattered Dreams" — activate at 1pc, others at 3pc;
// see getSetBonusThreshold), so the card can show e.g. "2pc Molten Rift" or
// "1pc Shadow of Shattered Dreams" — informational (what's equipped), not a
// re-derivation of `getSetBonusEffects`'s "which bonus slots actually
// apply" selection logic used for damage calculation.
const echoSetSummary = computed(() => {
  const counts: Record<string, number> = {};
  for (const echo of echoSlots.value as Array<{ echoSet?: string }>) {
    const key = echo?.echoSet;
    if (key && key !== "none") {
      counts[key] = (counts[key] ?? 0) + 1;
    }
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
  overflow: hidden;
  transform-origin: top left;
  display: flex;
  flex-direction: column;
}

.build-card__background-layer {
  z-index: 0;
  transform-origin: center;
}

.build-card__grid {
  position: relative;
  z-index: 1;
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

.build-card__watermark {
  padding: 0.35rem 0.25rem 0;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: oklch(var(--bc) / 0.4);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
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
