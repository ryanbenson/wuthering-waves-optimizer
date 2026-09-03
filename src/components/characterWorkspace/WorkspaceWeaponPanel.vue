<template>
  <div class="flex flex-col gap-4">
    <div
      class="weapon__header flex flex-wrap items-center justify-between gap-4 mb-4 rounded-lg bg-base-200 p-1 pl-3">
      <h3 class="text-sm font-semibold">Weapon</h3>
      <div class="flex flex-wrap gap-2">
        <button
          v-if="hasWeaponPassive"
          type="button"
          class="btn btn-xs"
          data-test-workspace-weapon-enable-all
          @click="enableAllWeapons">
          Enable all
        </button>
        <button
          v-if="hasWeaponPassive"
          type="button"
          class="btn btn-xs"
          data-test-workspace-weapon-max-all
          @click="maxAllWeapons">
          Max all
        </button>
        <button
          type="button"
          class="btn btn-xs"
          data-test-workspace-weapon-browse
          @click="openBrowser">
          Browse weapons
        </button>
      </div>
    </div>

    <div class="grid gap-4 lg:grid-cols-[1fr_18rem]">
      <div v-if="weapon && chosenWeapon" class="flex flex-col gap-2">
        <div
          class="weapon__identity flex flex-wrap items-center gap-6 bg-base-200 rounded-xl p-4"
          data-test-workspace-weapon-equipped>
          <div class="flex items-center gap-3 min-w-[12rem]">
            <div
              class="rounded-full border-2 bg-cover bg-center size-16 shrink-0"
              :class="rarityBorderClasses(weaponRarity)"
              :style="weaponImageStyles"></div>
            <div class="min-w-0">
              <div class="flex items-baseline gap-1.5">
                <h4 class="font-bold text-lg leading-tight truncate">
                  {{ chosenWeapon.info?.name }}
                </h4>
                <span
                  class="text-xs font-semibold"
                  :class="rarityTextClasses(weaponRarity)">
                  {{ weaponRarity }}★
                </span>
              </div>
              <div class="flex gap-2 flex-wrap mt-1">
                <span v-if="weaponAttack" class="badge badge-ghost badge-sm">
                  ATK {{ weaponAttack }}
                </span>
                <span
                  v-if="weaponModifierLabel && weaponModifierValue"
                  class="badge badge-ghost badge-sm">
                  {{ weaponModifierLabel }} {{ weaponModifierValue }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex items-start gap-4 flex-wrap">
            <div>
              <div
                class="text-[.65rem] font-bold uppercase tracking-wider opacity-50 mb-1">
                Level
              </div>
              <div
                class="flex items-center gap-0 bg-base-300 rounded-lg overflow-hidden">
                <button
                  type="button"
                  class="btn btn-ghost btn-xs btn-square"
                  :disabled="weaponLevelIndex <= 0"
                  data-test-workspace-weapon-level-dec
                  @click="stepWeaponLevel(-1)">
                  −
                </button>
                <span
                  class="w-12 text-center font-mono text-sm"
                  data-test-workspace-weapon-level-value>
                  {{ weaponLevel }}
                </span>
                <button
                  type="button"
                  class="btn btn-ghost btn-xs btn-square"
                  :disabled="weaponLevelIndex >= weaponLevelOptions.length - 1"
                  data-test-workspace-weapon-level-inc
                  @click="stepWeaponLevel(1)">
                  +
                </button>
              </div>
            </div>
            <div>
              <div
                class="text-[.65rem] font-bold uppercase tracking-wider opacity-50 mb-1">
                Refinement
              </div>
              <div
                class="flex items-center gap-0 bg-base-300 rounded-lg overflow-hidden">
                <button
                  type="button"
                  class="btn btn-ghost btn-xs btn-square"
                  :disabled="refinementIndex <= 0"
                  data-test-workspace-weapon-refinement-dec
                  @click="stepRefinement(-1)">
                  −
                </button>
                <span
                  class="w-10 text-center font-mono text-sm"
                  data-test-workspace-weapon-refinement-value>
                  R{{ refinement }}
                </span>
                <button
                  type="button"
                  class="btn btn-ghost btn-xs btn-square"
                  :disabled="
                    refinementIndex >= weaponRefinementLevels.length - 1
                  "
                  data-test-workspace-weapon-refinement-inc
                  @click="stepRefinement(1)">
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <p
          v-if="chosenWeapon.info?.description"
          class="text-xs italic opacity-60 px-1">
          {{ chosenWeapon.info.description }}
        </p>

        <div
          v-if="hasWeaponPassive"
          class="flex flex-col gap-2"
          :key="weapon"
          data-test-workspace-weapon-passives>
          <span class="text-sm font-medium">
            Passive — {{ chosenWeapon.info?.passiveName }}
          </span>
          <CalculatorWeaponsPassive
            v-for="weaponPassive in weaponPassives"
            :key="weaponPassive.key"
            :character="character"
            :passive-key="weaponPassive.key"
            :has-stacks="weaponPassive.hasStacks"
            :modifier="weaponPassive.modifier"
            :modifier-by-refinement="weaponPassive.modifierByRefinement"
            :min-stacks="weaponPassive.minStacks"
            :max-stacks="weaponPassive.maxStacks"
            :always-enabled="weaponPassive.alwaysEnabled"
            :details="weaponPassive.details"
            :refinement="refinement"
            @updated-weapon-stats="handleUpdatedWeaponStats" />
        </div>
      </div>
      <div v-else class="text-sm opacity-60" data-test-workspace-weapon-empty>
        No weapon equipped yet — choose one below.
      </div>

      <div v-if="recommendedEntries.length" class="flex flex-col gap-3">
        <h4 class="text-sm font-medium">
          Recommended{{ characterName ? ` for ${characterName}` : "" }}
        </h4>
        <div class="flex flex-col gap-2">
          <div
            v-for="entry in recommendedEntries"
            :key="entry.key"
            class="card card-bordered card-compact bg-base-100 shadow"
            :data-test-workspace-weapon-recommended="entry.key">
            <div class="card-body flex-row items-center gap-3 py-2">
              <div
                class="rounded-full border-2 bg-cover bg-center size-10 shrink-0"
                :class="rarityBorderClasses(entry.rarity)"
                :style="{
                  backgroundImage: `url(${WEAPON_IMAGE_BASE}/${entry.key}.png)`,
                }"></div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span class="text-sm font-semibold truncate">
                    {{ entry.name }}
                  </span>
                  <span
                    class="badge badge-xs"
                    :class="
                      entry.key === signatureWeapon
                        ? 'badge-primary'
                        : 'badge-ghost'
                    ">
                    {{ entry.label }}
                  </span>
                </div>
                <span
                  v-if="impactByKey[entry.key]"
                  class="badge badge-xs mt-1"
                  :class="impactBadgeClasses(impactByKey[entry.key])">
                  {{ formatImpact(impactByKey[entry.key]) }}
                </span>
                <span
                  v-else-if="impactsLoading"
                  class="badge badge-xs badge-ghost mt-1">
                  …
                </span>
              </div>
              <button
                type="button"
                class="btn btn-primary btn-xs shrink-0"
                :data-test-workspace-weapon-recommended-equip="entry.key"
                @click="equipWeapon(entry.key)">
                Equip
              </button>
            </div>
          </div>
        </div>
        <p class="text-[.65rem] opacity-40">
          Estimated dmg/% assumes every weapon buff is enabled at max stacks,
          with your echoes, team and rotation unchanged. Treat it as "is this
          worth switching?" — not a guarantee.
        </p>
      </div>
    </div>

    <WorkspaceWeaponBrowser
      ref="browserRef"
      :character="character"
      :weapon-type="weaponType"
      :weapons-list="weaponsList"
      :signature-weapon="signatureWeapon"
      :current-weapon="weapon"
      @weapon-browser:chosen-weapon="equipWeapon"
      @weapon-browser:preview="openPreview" />
    <WorkspaceWeaponPreview
      ref="previewRef"
      :character="character"
      :weapon-type="weaponType"
      @weapon-preview:equip="equipWeapon" />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { getWeaponsByType, getWeaponByName } from "../../weapons/weapons";
import {
  estimateWeaponSwapImpactBatch,
  type WeaponImpactRange,
  type WeaponSwapCandidate,
} from "../../weapons/weaponImpact";
import CalculatorWeaponsPassive from "../CalculatorWeaponsPassive.vue";
import WorkspaceWeaponBrowser from "./WorkspaceWeaponBrowser.vue";
import WorkspaceWeaponPreview from "./WorkspaceWeaponPreview.vue";
import { useCharacterStore } from "../../stores/character";
import { useInventoryStore } from "../../stores/inventory";
import { subStatLabelMap } from "../../echoes/stats";
import { displayInt, displayPercentage } from "../../utils/numbers";
import { aggregateWeaponPassiveStats } from "../../weapons/weaponPassives";

const WEAPON_IMAGE_BASE =
  "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons";

type WeaponListBuckets = {
  five: Array<{ key: string; name: string; [k: string]: unknown }>;
  four: Array<{ key: string; name: string; [k: string]: unknown }>;
  three: Array<{ key: string; name: string; [k: string]: unknown }>;
  two: Array<{ key: string; name: string; [k: string]: unknown }>;
  one: Array<{ key: string; name: string; [k: string]: unknown }>;
};

type ChosenWeapon = {
  info?: {
    name?: string;
    description?: string;
    maxLevel?: string;
    weaponLevelOverride?: string[];
    passiveData?: unknown[];
    passiveName?: string;
    rarity?: string | number;
    image?: string;
  };
  data?: Record<
    string,
    { attack?: number; modifier?: string; modifierValue?: number }
  >;
  getWeaponDataByLevel: (level: string) => {
    attack: number;
    modifier: string | null;
    modifierValue: number | null;
  };
};

const props = withDefaults(
  defineProps<{
    character: string;
    characterName?: string;
    weaponType?: string;
    signatureWeapon?: string;
    suggestedWeapons?: Array<{ key: string; label?: string }>;
  }>(),
  { weaponType: "", suggestedWeapons: () => [] },
);

const emit = defineEmits<{
  "update-weapon": [
    payload: {
      attack: number;
      modifier: string | null;
      modifierValue: number | null;
      weaponPassiveStats: Record<string, unknown>;
      weaponPassiveDefs: unknown[];
      refinement: string;
    },
  ];
}>();

const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);
const { setCharacterData } = characterStore;
const inventoryStore = useInventoryStore();
const { echoes: inventoryEchoes } = storeToRefs(inventoryStore);

const chosenWeapon = ref<ChosenWeapon | null>(null);
const weaponPassiveData = ref<
  Array<{
    key?: string;
    stat?: string;
    value: number;
    stacks: number;
    valueBeforeStacks: number;
  }>
>([]);
const weaponsList = ref<WeaponListBuckets>({
  five: [],
  four: [],
  three: [],
  two: [],
  one: [],
});
const browserRef = ref<InstanceType<typeof WorkspaceWeaponBrowser> | null>(
  null,
);
const previewRef = ref<InstanceType<typeof WorkspaceWeaponPreview> | null>(
  null,
);

const currentCharacter = computed(
  () => characters.value[props.character] ?? ({} as Record<string, unknown>),
);

const weapon = computed({
  get() {
    return (
      (currentCharacter.value as { weapon?: string | null }).weapon ?? null
    );
  },
  set(value: string | null) {
    void setCharacterData(props.character, { weapon: value });
  },
});

const weaponLevelOptions = computed((): string[] => {
  const defaultOption = [
    "1",
    "20",
    "20+",
    "40",
    "40+",
    "50",
    "50+",
    "60",
    "60+",
    "70",
    "70+",
    "80",
    "80+",
    "90",
  ];
  return chosenWeapon.value?.info?.weaponLevelOverride ?? defaultOption;
});

const weaponLevel = computed({
  get() {
    const defaultMaxLevel = chosenWeapon.value?.info?.maxLevel ?? "90";
    const w = weapon.value;
    if (!w) return defaultMaxLevel;
    return (
      (
        currentCharacter.value as {
          weapons?: Record<string, { weaponLevel?: string }>;
        }
      )?.weapons?.[w]?.weaponLevel ?? defaultMaxLevel
    );
  },
  set(value: string) {
    const w = weapon.value;
    if (!w) return;
    void setCharacterData(props.character, {
      weapons: { [w]: { weaponLevel: value } },
    });
  },
});

const weaponLevelIndex = computed(() => {
  const index = weaponLevelOptions.value.indexOf(weaponLevel.value);
  return index === -1 ? weaponLevelOptions.value.length - 1 : index;
});

function stepWeaponLevel(direction: 1 | -1) {
  const nextIndex = weaponLevelIndex.value + direction;
  const level = weaponLevelOptions.value[nextIndex];
  if (level) {
    weaponLevel.value = level;
  }
}

const weaponRefinementLevels = ["1", "2", "3", "4", "5"] as const;

const refinement = computed({
  get() {
    const w = weapon.value;
    if (!w) return "1";
    return (
      (
        currentCharacter.value as {
          weapons?: Record<string, { refinement?: string }>;
        }
      )?.weapons?.[w]?.refinement ?? "1"
    );
  },
  set(value: string) {
    const w = weapon.value;
    if (!w) return;
    void setCharacterData(props.character, {
      weapons: { [w]: { refinement: value } },
    });
  },
});

const refinementIndex = computed(() =>
  weaponRefinementLevels.indexOf(
    refinement.value as (typeof weaponRefinementLevels)[number],
  ),
);

function stepRefinement(direction: 1 | -1) {
  const nextIndex = refinementIndex.value + direction;
  const level = weaponRefinementLevels[nextIndex];
  if (level) {
    refinement.value = level;
  }
}

const weaponPassives = computed(() => {
  const passives = chosenWeapon.value?.info?.passiveData ?? [];
  return JSON.parse(JSON.stringify(passives)) as Array<{
    key: string;
    hasStacks?: boolean;
    modifier?: string;
    modifierByRefinement?: Record<string, number>;
    minStacks?: number;
    maxStacks?: number;
    alwaysEnabled?: boolean;
    details?: string;
  }>;
});

const hasWeaponPassive = computed(() => weaponPassives.value.length > 0);

const weaponRarity = computed(() =>
  Number(chosenWeapon.value?.info?.rarity ?? 5),
);

const weaponStatsData = computed(() => {
  if (!weapon.value || !weaponLevel.value || !chosenWeapon.value) return null;
  return chosenWeapon.value.data?.[weaponLevel.value] ?? null;
});

const weaponAttack = computed(() => weaponStatsData.value?.attack ?? null);
const weaponModifier = computed(() => weaponStatsData.value?.modifier ?? null);
const weaponModifierLabel = computed(() =>
  weaponModifier.value
    ? ((subStatLabelMap as Record<string, string | undefined>)[
        weaponModifier.value
      ] ?? null)
    : null,
);
const weaponModifierValue = computed(() => {
  const value = weaponStatsData.value?.modifierValue ?? null;
  if (!value) return null;
  return displayPercentage(value * 100);
});

const weaponImageStyles = computed(() => ({
  backgroundImage: chosenWeapon.value?.info?.image
    ? `url(${chosenWeapon.value.info.image})`
    : `url(${WEAPON_IMAGE_BASE}/${weapon.value}.png)`,
}));

function rarityBorderClasses(rarity: number | string | undefined) {
  const r = Number(rarity);
  return {
    "border-amber-300": r === 5,
    "border-violet-600": r === 4,
    "border-blue-500": r === 3,
    "border-green-500": r === 2,
    "border-gray-500": r === 1,
  };
}

function rarityTextClasses(rarity: number | string | undefined) {
  const r = Number(rarity);
  return {
    "text-amber-400": r === 5,
    "text-violet-500": r === 4,
    "text-blue-400": r === 3,
    "text-green-500": r === 2,
    "text-gray-400": r === 1,
  };
}

async function updateWeaponStats() {
  if (weapon.value && chosenWeapon.value) {
    const { attack, modifier, modifierValue } =
      chosenWeapon.value.getWeaponDataByLevel(weaponLevel.value);
    emit("update-weapon", {
      attack,
      modifier,
      modifierValue,
      weaponPassiveStats: aggregateWeaponPassiveStats(
        weapon.value,
        weaponPassiveData.value,
      ),
      weaponPassiveDefs: weaponPassives.value,
      refinement: refinement.value,
    });
  } else {
    emit("update-weapon", {
      attack: 0,
      modifier: null,
      modifierValue: null,
      weaponPassiveStats: {},
      weaponPassiveDefs: [],
      refinement: "1",
    });
  }
}

async function handleUpdatedWeaponStats(data: {
  key?: string;
  stat?: string;
  value: number;
  stacks: number;
  valueBeforeStacks: number;
}) {
  const index = weaponPassiveData.value.findIndex(
    (buff) => buff.key === data.key,
  );
  if (index === -1) {
    weaponPassiveData.value.push(data);
  } else {
    weaponPassiveData.value[index] = data;
  }
  await updateWeaponStats();
}

async function weaponChanged() {
  weaponPassiveData.value = [];
  if (!props.weaponType) return;
  if (!weapon.value) {
    chosenWeapon.value = null;
    await updateWeaponStats();
    return;
  }
  try {
    chosenWeapon.value = (await getWeaponByName(
      props.weaponType,
      weapon.value,
    )) as ChosenWeapon;
    await updateWeaponStats();
  } catch {
    chosenWeapon.value = null;
  }
}

function normalizeWeaponsList(raw: unknown): WeaponListBuckets {
  if (raw && typeof raw === "object" && "five" in (raw as object)) {
    return raw as WeaponListBuckets;
  }
  return { five: [], four: [], three: [], two: [], one: [] };
}

async function updateWeapons() {
  weaponsList.value = normalizeWeaponsList(getWeaponsByType(props.weaponType));
  await weaponChanged();
}

async function enableAllWeapons() {
  if (!weapon.value) return;
  const updates: Record<string, { isEnabled: boolean }> = {};
  for (const passive of weaponPassives.value) {
    updates[passive.key] = { isEnabled: true };
  }
  await setCharacterData(props.character, { weaponPassives: updates });
}

async function maxAllWeapons() {
  if (!weapon.value) return;
  const updates: Record<string, { isEnabled: boolean; stacks?: number }> = {};
  for (const passive of weaponPassives.value) {
    const update: { isEnabled: boolean; stacks?: number } = { isEnabled: true };
    if (passive.hasStacks) update.stacks = Number(passive.maxStacks) || 0;
    updates[passive.key] = update;
  }
  await setCharacterData(props.character, { weaponPassives: updates });
}

function equipWeapon(key: string) {
  weapon.value = key;
}

function openBrowser() {
  browserRef.value?.triggerOpenModal();
}

function openPreview(key: string) {
  previewRef.value?.triggerOpenModal(key);
}

// --- Recommended rail + damage impact ---

const recommendedEntries = computed(() => {
  const entries: Array<{
    key: string;
    label: string;
    name: string;
    rarity: number;
  }> = [];
  const seen = new Set<string>();
  const allWeapons = [
    ...weaponsList.value.five,
    ...weaponsList.value.four,
    ...weaponsList.value.three,
    ...weaponsList.value.two,
    ...weaponsList.value.one,
  ];
  const lookupName = (key: string) =>
    allWeapons.find((w) => w.key === key)?.name ?? key;
  const lookupRarity = (key: string): number => {
    if (weaponsList.value.five.some((w) => w.key === key)) return 5;
    if (weaponsList.value.four.some((w) => w.key === key)) return 4;
    if (weaponsList.value.three.some((w) => w.key === key)) return 3;
    if (weaponsList.value.two.some((w) => w.key === key)) return 2;
    if (weaponsList.value.one.some((w) => w.key === key)) return 1;
    return 5;
  };

  if (props.signatureWeapon && props.signatureWeapon !== weapon.value) {
    entries.push({
      key: props.signatureWeapon,
      label: "Signature",
      name: lookupName(props.signatureWeapon),
      rarity: lookupRarity(props.signatureWeapon),
    });
    seen.add(props.signatureWeapon);
  }
  for (const suggestion of props.suggestedWeapons ?? []) {
    if (
      !suggestion?.key ||
      seen.has(suggestion.key) ||
      suggestion.key === weapon.value
    )
      continue;
    entries.push({
      key: suggestion.key,
      label: suggestion.label || "Recommended",
      name: lookupName(suggestion.key),
      rarity: lookupRarity(suggestion.key),
    });
    seen.add(suggestion.key);
  }
  return entries;
});

const impactByKey = ref<Record<string, WeaponImpactRange | null>>({});
const impactsLoading = ref(false);

const enemyConfig = computed(() => ({
  enemyLevel:
    (currentCharacter.value as { enemyLevel?: number }).enemyLevel ?? 90,
  enemyResist:
    (currentCharacter.value as { enemyResist?: number }).enemyResist ?? 0.1,
  enemyType:
    (currentCharacter.value as { enemyType?: string }).enemyType ?? "Calamity",
}));

function formatImpact(range: WeaponImpactRange | null | undefined): string {
  if (!range) return "";
  const sign = range.fullyBuffedDelta >= 0 ? "+" : "";
  return `${sign}${displayInt(range.fullyBuffedDelta)} · ${sign}${displayPercentage(range.fullyBuffedPct * 100)}`;
}

function impactBadgeClasses(range: WeaponImpactRange | null | undefined) {
  if (!range) return "badge-ghost";
  return range.fullyBuffedPct >= 0 ? "badge-success" : "badge-error";
}

let impactRequestId = 0;
async function refreshImpacts() {
  const requestId = ++impactRequestId;
  const candidates: WeaponSwapCandidate[] = recommendedEntries.value.map(
    (entry) => ({ weaponKey: entry.key }),
  );
  if (!candidates.length) {
    impactByKey.value = {};
    return;
  }
  impactsLoading.value = true;
  try {
    const results = await estimateWeaponSwapImpactBatch(
      props.character,
      characters.value,
      candidates,
      enemyConfig.value,
      inventoryEchoes.value,
    );
    if (requestId !== impactRequestId) return; // stale response, a newer refresh superseded it
    const next: Record<string, WeaponImpactRange | null> = {};
    for (const [key, range] of results.entries()) {
      next[key] = range;
    }
    impactByKey.value = next;
  } finally {
    if (requestId === impactRequestId) impactsLoading.value = false;
  }
}

watch(
  () => props.weaponType,
  async () => {
    await updateWeapons();
  },
  { immediate: true },
);

watch(weapon, async () => {
  await weaponChanged();
});

watch(weaponLevel, async (level) => {
  if (level) await updateWeaponStats();
});

watch(refinement, async (r) => {
  if (r) await updateWeaponStats();
});

watch(
  () => [
    props.character,
    weapon.value,
    recommendedEntries.value.map((e) => e.key).join(","),
  ],
  () => {
    void refreshImpacts();
  },
  { immediate: true },
);

// The impact numbers depend on the character's whole build (self buffs,
// resonance chains, team buffs, custom buffs, echoes, rotations, enemy
// config) — not just which weapon is equipped. Without this, editing any
// of those after the rail's first computation would leave its badges
// silently stale (frozen against whatever the baseline damage happened to
// be at mount time). Deep-watching the whole character record and
// debouncing catches every such edit without needing to enumerate each
// field individually; the watcher above still fires immediately for the
// character/weapon/recommended-list changes that deserve no delay.
let impactDebounceTimer: ReturnType<typeof setTimeout> | null = null;
watch(
  currentCharacter,
  () => {
    if (impactDebounceTimer) clearTimeout(impactDebounceTimer);
    impactDebounceTimer = setTimeout(() => {
      impactDebounceTimer = null;
      void refreshImpacts();
    }, 500);
  },
  { deep: true },
);

onBeforeUnmount(() => {
  if (impactDebounceTimer) clearTimeout(impactDebounceTimer);
  weaponPassiveData.value = [];
  chosenWeapon.value = null;
});
</script>
