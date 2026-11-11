<template>
  <div class="build-card" data-test-build-card>
    <div
      class="build-card__header flex flex-wrap items-center justify-between gap-4 mb-4 rounded-lg bg-base-200 p-1 pl-3">
      <h3 class="text-sm font-semibold">Build Card</h3>
      <div class="flex flex-wrap gap-2">
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

    <AppFilterPanel
      panel-key="build-card-customize"
      class="mb-4"
      label="Customize"
      :active-count="customizationActiveCount"
      :clear-disabled="!customizationActiveCount"
      @clear="handleClearCustomization">
      <template #bar>
        <span id="build-card-layout-label" class="text-sm font-medium">Card layout</span>
        <div
          class="join"
          role="group"
          aria-labelledby="build-card-layout-label"
          data-test-build-card-layout-picker>
          <button
            v-for="option in BUILD_CARD_LAYOUTS"
            :key="option.id"
            type="button"
            class="btn btn-sm join-item gap-2"
            :class="{ 'btn-active btn-primary': option.id === buildCardLayout }"
            :aria-pressed="option.id === buildCardLayout"
            :title="option.description"
            :data-test-build-card-layout-option="option.id"
            @click="buildCardLayout = option.id">
            <BuildCardLayoutIcon :layout="option.id" />
            {{ option.label }}
          </button>
        </div>
        <span class="text-xs text-base-content/70" data-test-build-card-layout-description>
          {{ activeLayoutDescription }}
        </span>
      </template>
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
      <div class="build-card__art-fields flex flex-wrap items-start gap-6 mt-4">
        <BuildCardArtPicker
          legend="Character art (click the art on the card to upload your own)"
          test-id="character"
          :options="characterArtOptions"
          :selected-id="characterArtSelectedId"
          @select="selectCharacterArt" />
        <div class="flex flex-col gap-2">
          <BuildCardArtPicker
            legend="Background (this character only)"
            test-id="background"
            :options="backgroundOptions"
            :selected-id="backgroundSelectedId"
            @select="selectBackground" />
          <label class="form-control w-64">
            <div class="label py-1">
              <span class="label-text text-xs">Background opacity ({{ backgroundOpacity }}%)</span>
            </div>
            <input
              v-model.number="backgroundOpacity"
              type="range"
              class="range range-sm"
              min="0"
              max="100"
              step="5"
              data-test-build-card-background-opacity />
          </label>
        </div>
      </div>
      <label
        v-if="buildCardLayout !== 'columns' && hasChosenBackground"
        class="label cursor-pointer justify-start gap-2 mt-2"
        data-test-build-card-show-art>
        <input v-model="showArtOverBackground" type="checkbox" class="checkbox checkbox-sm" />
        <span class="label-text">Show the character art over your background</span>
      </label>
    </AppFilterPanel>

    <div
      ref="viewportRef"
      class="build-card__viewport"
      :style="{ height: `${scaledHeight}px` }">
      <div
        ref="cardRef"
        class="build-card__canvas"
        :data-test-build-card-canvas="buildCardLayout"
        :style="{
          transform: `scale(${scale})`,
          ...buildCardPrimaryColorStyle,
          '--card-accent': cardAccent,
        }">
        <BuildCardBackdrop
          :url="cardView.backdrop.url"
          :blurred="cardView.backdrop.blurred"
          :transform="cardView.backdrop.transform"
          :opacity="cardView.backdrop.opacity" />
        <component :is="layoutComponent" :card="cardView" />
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
import { computeBuildOnlyStats } from "../calculator/buildOnlyStats";
import { filterBuffsForStance, resolveActiveStance } from "../calculator/stances";
import { useToast } from "../composables/useToast";
import { useTeamSubstatScoreRollup } from "../composables/useTeamSubstatScoreRollup";
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
import { type ImageTransform } from "../utils/imageTransform";
import { getEchoCritValue } from "../composables/useEchoCardStats";
import {
  BUILD_CARD_LAYOUTS,
  resolveBuildCardLayout,
  type BuildCardLayoutId,
} from "../buildCard/layouts";
import {
  ART_SOURCE_DEFAULT,
  ART_SOURCE_UPLOAD,
  BACKGROUND_OPACITY_DEFAULT,
  getBuildCardArtOptions,
  resolveArtSource,
  resolveBackgroundOpacity,
} from "../buildCard/arts";
import { resolveCharacterBackground } from "../buildCard/background";
import { buildCardStatRows } from "../buildCard/statRows";
import { getElementAccent, getElementIcon } from "../buildCard/theme";
import type { BuildCardView } from "../buildCard/view";
import CalculatorBuildCardImageAdjustPanel from "./CalculatorBuildCardImageAdjustPanel.vue";
import AppFilterPanel from "./AppFilterPanel.vue";
import BuildCardArtPicker, {
  type BuildCardArtPickerOption,
} from "./buildCard/BuildCardArtPicker.vue";
import BuildCardBackdrop from "./buildCard/BuildCardBackdrop.vue";
import BuildCardLayoutColumns from "./buildCard/BuildCardLayoutColumns.vue";
import BuildCardLayoutIcon from "./buildCard/BuildCardLayoutIcon.vue";
import BuildCardLayoutHero from "./buildCard/BuildCardLayoutHero.vue";
import BuildCardLayoutShowcase from "./buildCard/BuildCardLayoutShowcase.vue";

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

// Player identity for the card (username, UID) and the layout are shared
// across every character's build card, not tied to one build, so they live
// in the settings store's general `config` bag. Background settings belong
// to each character (see below).
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

// Layout choice (ADR 0056): one preference for every card, like the
// username/UID above. Anything unrecognised falls back to Columns.
const buildCardLayout = computed<BuildCardLayoutId>({
  get: () => resolveBuildCardLayout(config.value?.buildCard?.layout),
  set: (value) => settingsStore.addToConfig({ buildCard: { layout: value } }),
});
const activeLayoutDescription = computed(
  () => BUILD_CARD_LAYOUTS.find((option) => option.id === buildCardLayout.value)?.description ?? "",
);
const layoutComponent = computed(
  () =>
    ({
      columns: BuildCardLayoutColumns,
      hero: BuildCardLayoutHero,
      showcase: BuildCardLayoutShowcase,
    })[buildCardLayout.value],
);

const characterData = computed(
  () => (characters.value[props.character] ?? {}) as Record<string, any>,
);

// Background settings are per character (src/buildCard/background.ts), so
// a background uploaded for one character doesn't show on every card. The
// old shared upload (config.buildCard.background) still fills in for any
// character without its own upload.
const backgroundSettings = computed(() =>
  resolveCharacterBackground(characterData.value, config.value?.buildCard),
);
const buildCardBackground = computed(() => backgroundSettings.value.upload);
const buildCardBackgroundTransform = computed({
  get: () => backgroundSettings.value.transform,
  set: (value: Partial<ImageTransform> | null) => {
    if (backgroundSettings.value.uploadIsShared) {
      settingsStore.addToConfig({ buildCard: { backgroundTransform: value } });
    } else {
      characterStore.setCharacterData(props.character, {
        buildCardBackgroundTransform: value,
      });
    }
  },
});
// Applies to whichever background is showing: default, curated or upload.
const backgroundOpacity = computed({
  get: () => backgroundSettings.value.opacity,
  set: (value: number) =>
    characterStore.setCharacterData(props.character, {
      buildCardBackgroundOpacity: resolveBackgroundOpacity(value),
    }),
});
const showArtOverBackground = computed({
  get: () => backgroundSettings.value.showArtOverBackground,
  set: (value: boolean) =>
    characterStore.setCharacterData(props.character, {
      buildCardShowArtOverBackground: value,
    }),
});

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
      characterStore.setCharacterData(props.character, {
        buildCardBackground: dataUrl,
        buildCardBackgroundTransform: null,
        buildCardBackgroundSource: ART_SOURCE_UPLOAD,
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

// Removes this character's upload. If the card is showing the old shared
// upload instead, that one is removed, which clears it from every card
// still using it (the only way to delete it).
function resetBackground() {
  if (backgroundSettings.value.uploadIsShared) {
    settingsStore.addToConfig({
      buildCard: { background: null, backgroundTransform: null },
    });
  }
  clearCharacterBackground();
  showToast("Background reset", "success");
}

function clearCharacterBackground() {
  characterStore.setCharacterData(props.character, {
    buildCardBackground: null,
    buildCardBackgroundTransform: null,
    buildCardBackgroundSource: null,
  });
}
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

const customizationActiveCount = computed(() => {
  let count = 0;
  if (buildCardUsername.value) count += 1;
  if (buildCardUid.value) count += 1;
  if (hasChosenBackground.value) count += 1;
  if (customPrimaryColor.value) count += 1;
  if (buildCardLayout.value !== BUILD_CARD_LAYOUTS[0].id) count += 1;
  if (backgroundOpacity.value !== BACKGROUND_OPACITY_DEFAULT) count += 1;
  return count;
});

function handleClearCustomization() {
  buildCardUsername.value = "";
  buildCardUid.value = "";
  settingsStore.addToConfig({
    buildCard: { background: null, backgroundTransform: null, layout: null },
  });
  characterStore.setCharacterData(props.character, {
    buildCardPrimaryColor: null,
    buildCardArtSource: null,
    buildCardBackground: null,
    buildCardBackgroundTransform: null,
    buildCardBackgroundSource: null,
    buildCardBackgroundOpacity: null,
    buildCardShowArtOverBackground: false,
  });
  showToast("Build card customization reset", "success");
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
    const built = await computeBuildOnlyStats(
      nextCharacter,
      characters.value,
      inventoryStore.echoes,
    );
    buildCardStats.value = built.finalStats;
    buildCardTuneBreakBoost.value = built.tuneBreakBoost;
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

const { rollup: substatScoreRollup } = useTeamSubstatScoreRollup(
  () => props.character,
);

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

// ---------------------------------------------------------------------------
// Art (ADR 0056). Two slots, each showing the default, a curated art
// (src/buildCard/arts.ts) or the player's upload:
//   - character art: per character, beside customPortrait
//   - background: per character too (src/buildCard/background.ts)
const characterArtCurated = computed(() =>
  getBuildCardArtOptions("character", props.character),
);
const backgroundCurated = computed(() =>
  getBuildCardArtOptions("background", props.character),
);

const resolvedCharacterArt = computed(() =>
  resolveArtSource(
    characterData.value.buildCardArtSource,
    characterData.value.customPortrait,
    characterArtCurated.value,
  ),
);
const resolvedBackground = computed(() =>
  resolveArtSource(
    backgroundSettings.value.source,
    buildCardBackground.value,
    backgroundCurated.value,
  ),
);
const hasChosenBackground = computed(() => resolvedBackground.value.kind !== "default");

const characterArtUrl = computed(() =>
  resolvedCharacterArt.value.kind === "default"
    ? defaultPortraitUrl.value
    : resolvedCharacterArt.value.url,
);

const characterArtSelectedId = computed(() => {
  const art = resolvedCharacterArt.value;
  if (art.kind === "curated") return art.art.id;
  return art.kind;
});
const backgroundSelectedId = computed(() => {
  const art = resolvedBackground.value;
  if (art.kind === "curated") return art.art.id;
  return art.kind;
});

const characterArtOptions = computed<BuildCardArtPickerOption[]>(() => [
  { id: ART_SOURCE_DEFAULT, label: "Default", url: defaultPortraitUrl.value },
  ...characterArtCurated.value.map((art) => ({ id: art.id, label: art.label, url: art.url })),
  ...(characterData.value.customPortrait
    ? [{ id: ART_SOURCE_UPLOAD, label: "Your upload", url: characterData.value.customPortrait }]
    : []),
]);
const backgroundOptions = computed<BuildCardArtPickerOption[]>(() => [
  { id: ART_SOURCE_DEFAULT, label: "Blurred art", url: characterArtUrl.value, blurred: true },
  ...backgroundCurated.value.map((art) => ({ id: art.id, label: art.label, url: art.url })),
  ...(buildCardBackground.value
    ? [
        {
          id: ART_SOURCE_UPLOAD,
          label: backgroundSettings.value.uploadIsShared ? "Shared upload" : "Your upload",
          url: buildCardBackground.value,
          title: backgroundSettings.value.uploadIsShared
            ? "Your earlier background, shared by every card. Upload a new one to use it on this character only."
            : undefined,
        },
      ]
    : []),
]);

function selectCharacterArt(id: string) {
  characterStore.setCharacterData(props.character, { buildCardArtSource: id });
}

function selectBackground(id: string) {
  characterStore.setCharacterData(props.character, { buildCardBackgroundSource: id });
}

const cardAccent = computed(
  () => customPrimaryColor.value ?? getElementAccent(characterBasic.value?.element),
);

const totalCritValue = computed(() => {
  const equipped = (echoSlots.value as Array<Record<string, unknown>>).filter(
    (echo) => echo?.echo,
  );
  if (!equipped.length) return null;
  return equipped.reduce((sum, echo) => sum + getEchoCritValue(echo), 0);
});

const cardView = computed<BuildCardView>(() => {
  const characterArt = resolvedCharacterArt.value;
  const background = resolvedBackground.value;
  const credits = [characterArt, background]
    .map((art) => (art.kind === "curated" ? art.art.credit : undefined))
    .filter((credit): credit is string => Boolean(credit));
  return {
    characterId: props.character,
    name: characterBasic.value?.name ?? null,
    rarity: Number(characterBasic.value?.rarity) || 0,
    level: props.characterLevel,
    element: characterBasic.value?.element ?? null,
    elementIcon: getElementIcon(characterBasic.value?.element),
    art: {
      url: characterArtUrl.value,
      uploadUrl: characterArt.kind === "upload" ? characterArt.url : null,
      transform: characterData.value.customPortraitTransform ?? null,
      show: !hasChosenBackground.value || showArtOverBackground.value,
    },
    backdrop:
      background.kind === "default"
        ? {
            url: characterArtUrl.value,
            blurred: true,
            transform: null,
            opacity: backgroundOpacity.value / 100,
          }
        : {
            url: background.url,
            blurred: false,
            // The adjust panel edits the uploaded image's framing only.
            transform:
              background.kind === "upload" ? buildCardBackgroundTransform.value : null,
            opacity: backgroundOpacity.value / 100,
          },
    resonance: resonanceChainNodes.value,
    talents: characterData.value.talents ?? {},
    forteIcons: forteIcons.value,
    weapon: weaponInfo.value
      ? {
          name: weaponInfo.value.name,
          image: weaponImage.value,
          rarity: weaponInfo.value.rarity,
          level: weaponLevel.value,
          refinement: weaponRefinement.value,
          attack: props.weaponAtk ?? null,
          modifierLabel: weaponModifierLabel.value,
          modifierImage: weaponModifierImage.value,
          modifierValue: weaponModifierValue.value,
        }
      : null,
    statRows: buildCardStatRows(
      buildCardStats.value,
      characterBasic.value?.element,
      buildCardTuneBreakBoost.value,
    ),
    echoes: echoSlots.value as Array<Record<string, any>>,
    sets: echoSetSummary.value,
    score: substatScoreRollup.value,
    totalCv: totalCritValue.value,
    username: buildCardUsername.value,
    uid: buildCardUid.value,
    credits,
  };
});

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

// The card is an exported image, so it keeps one dark palette whatever the
// app theme is (ADR 0056). Layout components read these variables;
// --card-accent is set inline from the element or the custom primary color.
.build-card__canvas {
  --card-bg: #0a0e1c;
  --card-ink: #eef2fa;
  --card-muted: rgba(226, 232, 245, 0.7);
  --card-faint: rgba(226, 232, 245, 0.48);
  --card-glass: rgba(9, 13, 26, 0.74);
  --card-border: rgba(255, 255, 255, 0.09);
  --card-hair: rgba(255, 255, 255, 0.07);
  --card-gold: #f3c45a;

  width: 1920px;
  height: 1080px;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  transform-origin: top left;
  color: var(--card-ink);
  background: var(--card-bg);
  font-family: "Figtree", sans-serif;
}
</style>

<style lang="scss">
// Shared by the layout components in ./buildCard/, so not scoped.
.build-card__canvas {
  .build-card-glass {
    background: var(--card-glass);
    border: 1px solid var(--card-border);
    border-radius: 18px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.35);
  }

  .build-card__credit {
    font-size: 13px;
    color: var(--card-faint);
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
  }

  .build-card__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 96px;
    font-size: 15px;
    color: var(--card-faint);
  }
}
</style>
