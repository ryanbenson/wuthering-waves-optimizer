<template>
  <div class="rotation-buff-overrides mt-3 border-t border-base-content/10 pt-3">
    <div class="flex items-center justify-between gap-2 mb-2">
      <span class="text-sm font-medium opacity-90">Build buff overrides</span>
      <button
        v-if="hasAnyOverride"
        type="button"
        class="btn btn-ghost btn-xs"
        @click="clearOverrides">
        Reset to character defaults
      </button>
    </div>
    <p class="text-xs opacity-70 mb-3">
      Toggle buffs for this action only. Uses
      {{ performerDisplayName }}'s saved build as the base.
    </p>
    <p
      v-if="!canApplyOverrides"
      class="text-xs text-warning mb-2">
      Teammate uses manual rotation stats; buff overrides apply only with "Use
      saved build" in Party → Rotation damage stats.
    </p>

    <div class="collapse collapse-arrow bg-base-200/40 mb-2">
      <input type="checkbox" />
      <div class="collapse-title text-sm font-medium py-2 min-h-0">
        Self buffs
        <span
          v-if="selfOverrideCount"
          class="badge badge-xs badge-primary ml-1">
          {{ selfOverrideCount }}
        </span>
      </div>
      <div class="collapse-content">
        <div
          v-for="buff in selfBuffDefinitions"
          :key="buff.key"
          class="flex flex-wrap items-center gap-2 py-1 text-sm border-b border-base-content/5 last:border-0">
          <label class="label cursor-pointer gap-2 py-0 min-h-0 flex-1">
            <input
              type="checkbox"
              class="checkbox checkbox-xs"
              :checked="getEffectiveEnabled('selfBuffs', buff.key, buff)"
              :disabled="buff.alwaysEnabled"
              @change="
                onToggle('selfBuffs', buff.key, buff, ($event.target as HTMLInputElement).checked)
              " />
            <span
              class="label-text"
              :class="{ 'cursor-help underline decoration-dotted decoration-base-content/40': buff.details }"
              v-tooltip="buffTooltip(buff)">{{ buff.name }}</span>
          </label>
          <div
            v-if="showSelfBuffStacks(buff)"
            class="flex items-center gap-1"
            @click.stop>
            <span class="text-xs opacity-70">Stacks</span>
            <input
              type="number"
              class="input input-bordered input-xs w-14"
              :min="getSelfBuffStackLimits(buff).effectiveMinStacks"
              :max="getSelfBuffStackLimits(buff).effectiveMaxStacks"
              :value="getEffectiveStacks('selfBuffs', buff.key, buff)"
              @input="
                onStacksInput(
                  'selfBuffs',
                  buff.key,
                  buff,
                  ($event.target as HTMLInputElement).value,
                )
              " />
            <span class="text-xs italic opacity-60">
              (Max {{ getSelfBuffStackLimits(buff).effectiveMaxStacks }})
            </span>
          </div>
        </div>
        <p
          v-if="!selfBuffDefinitions.length"
          class="text-xs opacity-60 py-2">
          No self buffs for this character.
        </p>
      </div>
    </div>

    <div class="collapse collapse-arrow bg-base-200/40 mb-2">
      <input type="checkbox" />
      <div class="collapse-title text-sm font-medium py-2 min-h-0">
        Resonance chains
        <span
          v-if="chainOverrideCount"
          class="badge badge-xs badge-primary ml-1">
          {{ chainOverrideCount }}
        </span>
      </div>
      <div class="collapse-content">
        <div
          v-for="chain in resonanceChainDefinitions"
          :key="chain.key"
          class="flex flex-wrap items-center gap-2 py-1 text-sm border-b border-base-content/5 last:border-0">
          <label class="label cursor-pointer gap-2 py-0 min-h-0 flex-1">
            <input
              type="checkbox"
              class="checkbox checkbox-xs"
              :checked="
                getEffectiveEnabled('resonanceChains', chain.key, chain)
              "
              :disabled="chain.alwaysEnabled"
              @change="
                onToggle(
                  'resonanceChains',
                  chain.key,
                  chain,
                  ($event.target as HTMLInputElement).checked,
                )
              " />
            <span
              class="label-text"
              :class="{ 'cursor-help underline decoration-dotted decoration-base-content/40': chain.details }"
              v-tooltip="buffTooltip(chain)">{{ chain.name }}</span>
          </label>
          <div
            v-if="
              chain.hasStacks &&
              getEffectiveEnabled('resonanceChains', chain.key, chain)
            "
            class="flex items-center gap-1"
            @click.stop>
            <span class="text-xs opacity-70">Stacks</span>
            <input
              type="number"
              class="input input-bordered input-xs w-14"
              :min="chain.minStacks ?? 0"
              :max="chain.maxStacks ?? 99"
              :value="
                getEffectiveStacks('resonanceChains', chain.key, chain)
              "
              @input="
                onStacksInput(
                  'resonanceChains',
                  chain.key,
                  chain,
                  ($event.target as HTMLInputElement).value,
                )
              " />
          </div>
        </div>
        <p
          v-if="!resonanceChainDefinitions.length"
          class="text-xs opacity-60 py-2">
          No resonance chains for this character.
        </p>
      </div>
    </div>

    <div class="collapse collapse-arrow bg-base-200/40 mb-2">
      <input type="checkbox" />
      <div class="collapse-title text-sm font-medium py-2 min-h-0">
        Weapon passives
        <span
          v-if="weaponOverrideCount"
          class="badge badge-xs badge-primary ml-1">
          {{ weaponOverrideCount }}
        </span>
      </div>
      <div class="collapse-content">
        <div
          v-for="passive in weaponPassiveDefinitions"
          :key="passive.key"
          class="flex flex-wrap items-center gap-2 py-1 text-sm border-b border-base-content/5 last:border-0">
          <label class="label cursor-pointer gap-2 py-0 min-h-0 flex-1">
            <input
              type="checkbox"
              class="checkbox checkbox-xs"
              :checked="
                getEffectiveEnabled('weaponPassives', passive.key, passive)
              "
              @change="
                onToggle(
                  'weaponPassives',
                  passive.key,
                  passive,
                  ($event.target as HTMLInputElement).checked,
                )
              " />
            <span
              class="label-text"
              :class="{ 'cursor-help underline decoration-dotted decoration-base-content/40': passive.details }"
              v-tooltip="buffTooltip(passive)">{{ passive.label }}</span>
          </label>
          <div
            v-if="
              passive.hasStacks &&
              getEffectiveEnabled('weaponPassives', passive.key, passive)
            "
            class="flex items-center gap-1"
            @click.stop>
            <span class="text-xs opacity-70">Stacks</span>
            <input
              type="number"
              class="input input-bordered input-xs w-14"
              :min="passive.minStacks ?? 0"
              :max="passive.maxStacks ?? 99"
              :value="
                getEffectiveStacks('weaponPassives', passive.key, passive)
              "
              @input="
                onStacksInput(
                  'weaponPassives',
                  passive.key,
                  passive,
                  ($event.target as HTMLInputElement).value,
                )
              " />
          </div>
        </div>
        <p
          v-if="!weaponPassiveDefinitions.length"
          class="text-xs opacity-60 py-2">
          No weapon equipped or no passives.
        </p>
      </div>
    </div>

    <div class="collapse collapse-arrow bg-base-200/40 mb-2">
      <input type="checkbox" />
      <div class="collapse-title text-sm font-medium py-2 min-h-0">
        Echo set passives
        <span
          v-if="echoSetOverrideCount"
          class="badge badge-xs badge-primary ml-1">
          {{ echoSetOverrideCount }}
        </span>
      </div>
      <div class="collapse-content">
        <div
          v-for="passive in echoSetPassiveDefinitions"
          :key="passive.key"
          class="flex flex-wrap items-center gap-2 py-1 text-sm border-b border-base-content/5 last:border-0">
          <label class="label cursor-pointer gap-2 py-0 min-h-0 flex-1">
            <input
              type="checkbox"
              class="checkbox checkbox-xs"
              :checked="
                getEffectiveEnabled('echoSetPassives', passive.key, passive)
              "
              @change="
                onToggle(
                  'echoSetPassives',
                  passive.key,
                  passive,
                  ($event.target as HTMLInputElement).checked,
                )
              " />
            <span
              class="label-text"
              :class="{ 'cursor-help underline decoration-dotted decoration-base-content/40': passive.details }"
              v-tooltip="buffTooltip(passive)">
              <span class="opacity-70 text-xs">{{ passive.setLabel }}</span>
              {{ passive.name }}
            </span>
          </label>
          <div
            v-if="
              passive.hasStacks &&
              getEffectiveEnabled('echoSetPassives', passive.key, passive)
            "
            class="flex items-center gap-1"
            @click.stop>
            <span class="text-xs opacity-70">Stacks</span>
            <input
              type="number"
              class="input input-bordered input-xs w-14"
              :min="passive.minStacks ?? 0"
              :max="passive.maxStacks ?? 99"
              :value="
                getEffectiveStacks('echoSetPassives', passive.key, passive)
              "
              @input="
                onStacksInput(
                  'echoSetPassives',
                  passive.key,
                  passive,
                  ($event.target as HTMLInputElement).value,
                )
              " />
          </div>
        </div>
        <p
          v-if="!echoSetPassiveDefinitions.length"
          class="text-xs opacity-60 py-2">
          No echo set passives configured for this build.
        </p>
      </div>
    </div>

    <div
      v-if="mainEchoDefinition"
      class="rounded-lg bg-base-200/40 p-3">
      <div class="text-sm font-medium mb-2">Main echo buff</div>
      <div class="flex flex-wrap items-center gap-2 text-sm">
        <label class="label cursor-pointer gap-2 py-0 min-h-0 flex-1">
          <input
            type="checkbox"
            class="checkbox checkbox-xs"
            :checked="mainEchoEffectiveEnabled"
            @change="
              onMainEchoToggle(($event.target as HTMLInputElement).checked)
            " />
          <span
            class="label-text"
            :class="{ 'cursor-help underline decoration-dotted decoration-base-content/40': mainEchoDefinition.details }"
            v-tooltip="buffTooltip(mainEchoDefinition)">{{ mainEchoDefinition.name }}</span>
        </label>
        <div
          v-if="mainEchoDefinition.hasStacks && mainEchoEffectiveEnabled"
          class="flex items-center gap-1"
          @click.stop>
          <span class="text-xs opacity-70">Stacks</span>
          <input
            type="number"
            class="input input-bordered input-xs w-14"
            :min="mainEchoDefinition.minStacks ?? 0"
            :max="mainEchoDefinition.maxStacks ?? 99"
            :value="mainEchoEffectiveStacks"
            @input="onMainEchoStacksInput(($event.target as HTMLInputElement).value)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import {
  getCharByName,
  getCharacterRosterDisplayName,
} from "../characters/characters";
import { getWeaponByName } from "../weapons/weapons";
import { getEchoData } from "../echoes";
import { filterBuffsForStance, resolveActiveStance } from "../calculator/stances";
import {
  getResolvedEchoSetPassiveDefinitions,
  getRotationPerformerConfig,
  resolveEquippedWeaponFromStore,
  type TeamBuffsState,
} from "../calculator/rotationPerformer";
import { useInventoryStore } from "../stores/inventory";
import type { EchoObject } from "../echoes/stats";
import {
  mergeBuffConfigWithOverrides,
  type BuffOverrideEntry,
  type RotationActionBuffOverrides,
} from "../calculator/rotationBuffOverrides";
import {
  clampSelfBuffStacks,
  getEffectiveSelfBuffStackLimits,
} from "../calculator/effectiveSelfBuffStacks";
import { useCharacterStore } from "../stores/character";

type BuffDef = {
  key: string;
  name?: string;
  label?: string;
  setLabel?: string;
  details?: string;
  alwaysEnabled?: boolean;
  hasStacks?: boolean;
  minStacks?: number;
  maxStacks?: number;
};

function buffTooltip(entry: { details?: string } | null | undefined) {
  const details = entry?.details?.trim();
  if (!details) {
    return undefined;
  }
  return { content: details, html: true };
}

type OverrideCategory =
  | "selfBuffs"
  | "resonanceChains"
  | "weaponPassives"
  | "echoSetPassives";

const props = defineProps<{
  performerCharacterKey: string;
  activeCharacterKey: string;
  buffOverrides?: RotationActionBuffOverrides | null;
}>();

const emit = defineEmits<{
  "update:buff-overrides": [value: RotationActionBuffOverrides | null];
}>();

const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);

const localOverrides = ref<RotationActionBuffOverrides>({});
const characterDefinitions = ref<Record<string, unknown>>({});
const weaponPassiveDefinitions = ref<BuffDef[]>([]);
const echoSetPassiveDefinitions = ref<BuffDef[]>([]);

const performerDisplayName = computed(() =>
  getCharacterRosterDisplayName(props.performerCharacterKey),
);

const performerStore = computed(
  () =>
    (characters.value[props.performerCharacterKey] ?? {}) as {
      buffs?: Record<string, BuffOverrideEntry>;
      resonanceChains?: Record<string, BuffOverrideEntry>;
      weaponPassives?: Record<string, BuffOverrideEntry>;
      echoSetPassives?: Record<string, BuffOverrideEntry>;
      mainEcho?: { echo?: string; isEnabled?: boolean; stacks?: number };
      activeStance?: string;
      weapons?: Record<
        string,
        { weapon?: string; weaponLevel?: string; refinement?: string }
      >;
      talents?: Record<string, string | number>;
    },
);

const teamBuffs = computed(
  () =>
    ((characters.value[props.activeCharacterKey] ?? {}) as { teamBuffs?: TeamBuffsState })
      .teamBuffs ?? {},
);

const canApplyOverrides = computed(() => {
  if (props.performerCharacterKey === props.activeCharacterKey) {
    return true;
  }
  const config = getRotationPerformerConfig(
    props.performerCharacterKey,
    teamBuffs.value,
  );
  return config.useSavedBuild !== false;
});

const activeStance = computed(() => {
  const stances =
    (characterDefinitions.value?.basic as { stances?: unknown })?.stances ?? [];
  return (
    resolveActiveStance(
      stances as never,
      performerStore.value.activeStance,
      performerStore.value.buffs,
    ) ?? undefined
  );
});

const selfBuffDefinitions = computed((): BuffDef[] => {
  const buffs = (characterDefinitions.value?.buffs ?? []) as BuffDef[];
  return filterBuffsForStance(buffs as never, activeStance.value) as BuffDef[];
});

const resonanceChainDefinitions = computed((): BuffDef[] => {
  const chains = (characterDefinitions.value?.resonanceChains ?? []) as BuffDef[];
  return filterBuffsForStance(chains as never, activeStance.value) as BuffDef[];
});

const mainEchoDefinition = computed(() => {
  const echoKey = performerStore.value.mainEcho?.echo;
  if (!echoKey) {
    return null;
  }
  const data = getEchoData(echoKey);
  if (!data) {
    return null;
  }
  return {
    name: data.name,
    details: data.details,
    hasStacks: data.hasStacks,
    minStacks: data.minStacks ?? 0,
    maxStacks: data.maxStacks ?? 0,
  };
});

function countCategoryOverrides(
  category: OverrideCategory,
  definitions: BuffDef[],
): number {
  const overrides = localOverrides.value[category];
  if (!overrides) {
    return 0;
  }
  if (overrides.__disableAll) {
    return definitions.length;
  }
  return Object.keys(overrides).filter((k) => k !== "__disableAll").length;
}

const selfOverrideCount = computed(() =>
  countCategoryOverrides("selfBuffs", selfBuffDefinitions.value),
);
const chainOverrideCount = computed(() =>
  countCategoryOverrides("resonanceChains", resonanceChainDefinitions.value),
);
const weaponOverrideCount = computed(() =>
  countCategoryOverrides("weaponPassives", weaponPassiveDefinitions.value),
);
const echoSetOverrideCount = computed(() =>
  countCategoryOverrides("echoSetPassives", echoSetPassiveDefinitions.value),
);

const hasAnyOverride = computed(() => {
  return (
    selfOverrideCount.value > 0 ||
    chainOverrideCount.value > 0 ||
    weaponOverrideCount.value > 0 ||
    echoSetOverrideCount.value > 0 ||
    localOverrides.value.mainEcho !== undefined
  );
});

function storeConfigFor(category: OverrideCategory) {
  if (category === "selfBuffs") {
    return performerStore.value.buffs ?? {};
  }
  if (category === "resonanceChains") {
    return performerStore.value.resonanceChains ?? {};
  }
  if (category === "echoSetPassives") {
    return performerStore.value.echoSetPassives ?? {};
  }
  return performerStore.value.weaponPassives ?? {};
}

function getStoreEntry(
  category: OverrideCategory,
  key: string,
): BuffOverrideEntry {
  return storeConfigFor(category)[key] ?? {};
}

function getMergedCategoryConfig(category: OverrideCategory) {
  const store = storeConfigFor(category);
  const cat = localOverrides.value[category];
  if (cat?.__disableAll) {
    return mergeBuffConfigWithOverrides(store, {}, true);
  }
  return mergeBuffConfigWithOverrides(store, cat ?? {}, false);
}

function getSelfBuffStackLimits(buff: BuffDef) {
  return getEffectiveSelfBuffStackLimits({
    character: props.performerCharacterKey,
    buffKey: buff.key,
    baseMaxStacks: buff.maxStacks,
    baseMinStacks: buff.minStacks,
    buffsConfig: getMergedCategoryConfig("selfBuffs"),
    resonanceChainsConfig: getMergedCategoryConfig("resonanceChains"),
  });
}

function showSelfBuffStacks(buff: BuffDef): boolean {
  if (!buff.hasStacks || !getEffectiveEnabled("selfBuffs", buff.key, buff)) {
    return false;
  }
  const limits = getSelfBuffStackLimits(buff);
  return !limits.stacksDisabled && limits.effectiveMaxStacks > 0;
}

function getRawEffectiveStacks(
  category: OverrideCategory,
  key: string,
  def: BuffDef,
): number {
  const cat = localOverrides.value[category];
  const override = cat?.__disableAll ? cat.__disableAll : cat?.[key];
  if (override?.stacks !== undefined) {
    return override.stacks;
  }
  const fromStore = getStoreEntry(category, key).stacks;
  if (fromStore !== undefined) {
    return fromStore;
  }
  return def.minStacks ?? 0;
}

function getEffectiveEnabled(
  category: OverrideCategory,
  key: string,
  def: BuffDef,
): boolean {
  const cat = localOverrides.value[category];
  if (cat?.__disableAll) {
    return false;
  }
  const override = cat?.[key];
  if (override?.isEnabled !== undefined) {
    return override.isEnabled;
  }
  if (def.alwaysEnabled) {
    return true;
  }
  return getStoreEntry(category, key).isEnabled ?? false;
}

function getEffectiveStacks(
  category: OverrideCategory,
  key: string,
  def: BuffDef,
): number {
  const raw = getRawEffectiveStacks(category, key, def);
  if (category !== "selfBuffs") {
    return raw;
  }
  return clampSelfBuffStacks(
    {
      character: props.performerCharacterKey,
      buffKey: key,
      baseMaxStacks: def.maxStacks,
      baseMinStacks: def.minStacks,
      buffsConfig: getMergedCategoryConfig("selfBuffs"),
      resonanceChainsConfig: getMergedCategoryConfig("resonanceChains"),
    },
    raw,
  );
}

function normalizeSelfBuffStacksAfterChainChange() {
  let changed = false;
  for (const buff of selfBuffDefinitions.value) {
    if (!buff.hasStacks) {
      continue;
    }
    const limits = getSelfBuffStackLimits(buff);
    const raw = getRawEffectiveStacks("selfBuffs", buff.key, buff);
    const clamped = limits.stacksDisabled
      ? 0
      : Math.max(
          limits.effectiveMinStacks,
          Math.min(limits.effectiveMaxStacks, raw),
        );
    if (raw === clamped) {
      continue;
    }
    if (!localOverrides.value.selfBuffs) {
      localOverrides.value.selfBuffs = {};
    }
    const cat = localOverrides.value.selfBuffs;
    const existing = cat[buff.key] ?? {};
    cat[buff.key] = {
      ...existing,
      isEnabled:
        existing.isEnabled ??
        getStoreEntry("selfBuffs", buff.key).isEnabled ??
        false,
      stacks: clamped,
    };
    changed = true;
  }
  if (changed) {
    emitOverrides();
  }
}

const mainEchoEffectiveEnabled = computed(() => {
  const override = localOverrides.value.mainEcho;
  if (override?.isEnabled !== undefined) {
    return override.isEnabled;
  }
  return performerStore.value.mainEcho?.isEnabled ?? false;
});

const mainEchoEffectiveStacks = computed(() => {
  const override = localOverrides.value.mainEcho;
  if (override?.stacks !== undefined) {
    return override.stacks;
  }
  return performerStore.value.mainEcho?.stacks ?? 0;
});

function emitOverrides() {
  const cleaned: RotationActionBuffOverrides = {};
  if (localOverrides.value.selfBuffs) {
    cleaned.selfBuffs = { ...localOverrides.value.selfBuffs };
  }
  if (localOverrides.value.resonanceChains) {
    cleaned.resonanceChains = { ...localOverrides.value.resonanceChains };
  }
  if (localOverrides.value.weaponPassives) {
    cleaned.weaponPassives = { ...localOverrides.value.weaponPassives };
  }
  if (localOverrides.value.echoSetPassives) {
    cleaned.echoSetPassives = { ...localOverrides.value.echoSetPassives };
  }
  if (localOverrides.value.mainEcho !== undefined) {
    cleaned.mainEcho = { ...localOverrides.value.mainEcho };
  }
  const hasContent =
    (cleaned.selfBuffs && Object.keys(cleaned.selfBuffs).length > 0) ||
    (cleaned.resonanceChains &&
      Object.keys(cleaned.resonanceChains).length > 0) ||
    (cleaned.weaponPassives &&
      Object.keys(cleaned.weaponPassives).length > 0) ||
    (cleaned.echoSetPassives &&
      Object.keys(cleaned.echoSetPassives).length > 0) ||
    cleaned.mainEcho !== undefined;
  emit("update:buff-overrides", hasContent ? cleaned : null);
}

function setCategoryEntry(
  category: OverrideCategory,
  key: string,
  entry: BuffOverrideEntry,
) {
  if (!localOverrides.value[category]) {
    localOverrides.value[category] = {};
  }
  const cat = localOverrides.value[category]!;
  delete cat.__disableAll;
  cat[key] = entry;
  emitOverrides();
}

function onToggle(
  category: OverrideCategory,
  key: string,
  def: BuffDef,
  enabled: boolean,
) {
  setCategoryEntry(category, key, {
    isEnabled: enabled,
    stacks: getEffectiveStacks(category, key, def),
  });
  if (category === "resonanceChains") {
    normalizeSelfBuffStacksAfterChainChange();
  }
}

function onStacksInput(
  category: OverrideCategory,
  key: string,
  def: BuffDef,
  raw: string,
) {
  let stacks = Number(raw);
  if (Number.isNaN(stacks)) {
    stacks = def.minStacks ?? 0;
  }
  if (category === "selfBuffs") {
    const limits = getSelfBuffStackLimits(def);
    stacks = limits.stacksDisabled
      ? 0
      : Math.max(
          limits.effectiveMinStacks,
          Math.min(limits.effectiveMaxStacks, stacks),
        );
  } else {
    const max = def.maxStacks ?? 99;
    const min = def.minStacks ?? 0;
    stacks = Math.max(min, Math.min(max, stacks));
  }
  setCategoryEntry(category, key, {
    isEnabled: getEffectiveEnabled(category, key, def),
    stacks,
  });
}

function onMainEchoToggle(enabled: boolean) {
  localOverrides.value.mainEcho = {
    isEnabled: enabled,
    stacks: mainEchoEffectiveStacks.value,
  };
  emitOverrides();
}

function onMainEchoStacksInput(raw: string) {
  const def = mainEchoDefinition.value;
  let stacks = Number(raw);
  if (Number.isNaN(stacks)) {
    stacks = 0;
  }
  if (def) {
    stacks = Math.max(
      def.minStacks ?? 0,
      Math.min(def.maxStacks ?? 99, stacks),
    );
  }
  localOverrides.value.mainEcho = {
    isEnabled: mainEchoEffectiveEnabled.value,
    stacks,
  };
  emitOverrides();
}

function clearOverrides() {
  localOverrides.value = {};
  emit("update:buff-overrides", null);
}

async function loadWeaponPassives() {
  const charStore = characters.value[props.performerCharacterKey] ?? {};
  const chosenChar = characterDefinitions.value;
  weaponPassiveDefinitions.value = [];
  if (!chosenChar || !Object.keys(chosenChar).length) {
    return;
  }
  const resolvedWeapon = resolveEquippedWeaponFromStore(charStore, chosenChar);
  if (!resolvedWeapon) {
    return;
  }
  const chosenWeapon = (await getWeaponByName(
    resolvedWeapon.weaponType,
    resolvedWeapon.weaponName,
  )) as {
    info?: {
      passiveName?: string;
      passiveData?: Array<{
        key?: string;
        hasStacks?: boolean;
        minStacks?: number;
        maxStacks?: number;
        alwaysEnabled?: boolean;
        modifier?: string;
        details?: string;
      }>;
    };
    passives?: Array<{
      key?: string;
      hasStacks?: boolean;
      minStacks?: number;
      maxStacks?: number;
      alwaysEnabled?: boolean;
      modifier?: string;
      details?: string;
    }>;
  };
  const passives =
    chosenWeapon?.info?.passiveData ?? chosenWeapon?.passives ?? [];
  weaponPassiveDefinitions.value = passives.map((p) => ({
    key: String(p.key ?? ""),
    label: String(
      chosenWeapon?.info?.passiveName && passives.length === 1
        ? chosenWeapon.info.passiveName
        : (p.modifier ?? p.key ?? "Passive"),
    ),
    name: String(p.key ?? p.modifier ?? "Passive"),
    details: String(p.details ?? ""),
    alwaysEnabled: p.alwaysEnabled,
    hasStacks: p.hasStacks,
    minStacks: p.minStacks ?? 0,
    maxStacks: p.maxStacks ?? 0,
  }));
}

async function loadDefinitions() {
  characterDefinitions.value = (await getCharByName(
    props.performerCharacterKey,
  )) as Record<string, unknown>;

  await loadWeaponPassives();

  const inventoryStore = useInventoryStore();
  const getEchoById = (echoId: string) =>
    inventoryStore.getEchoById(echoId) as EchoObject | undefined;
  echoSetPassiveDefinitions.value = getResolvedEchoSetPassiveDefinitions(
    characters.value[props.performerCharacterKey] ?? {},
    getEchoById,
  ).map((p) => ({
    key: p.key,
    name: p.name,
    setLabel: p.setLabel,
    details: p.details,
    alwaysEnabled: p.alwaysEnabled,
    hasStacks: p.hasStacks,
    minStacks: p.minStacks,
    maxStacks: p.maxStacks,
  }));
}

watch(
  () => props.buffOverrides,
  (value) => {
    localOverrides.value = value
      ? JSON.parse(JSON.stringify(value))
      : {};
  },
  { immediate: true, deep: true },
);

watch(
  () => props.performerCharacterKey,
  () => {
    void loadDefinitions();
  },
  { immediate: true },
);

watch(
  () => characters.value[props.performerCharacterKey]?.weapon,
  () => {
    void loadWeaponPassives();
  },
);

watch(
  () => characters.value[props.performerCharacterKey]?.weapons,
  () => {
    void loadWeaponPassives();
  },
  { deep: true },
);

watch(
  [
    () => localOverrides.value.resonanceChains,
    () => performerStore.value.resonanceChains,
  ],
  () => {
    normalizeSelfBuffStacksAfterChainChange();
  },
  { deep: true },
);
</script>
