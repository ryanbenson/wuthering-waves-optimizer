<template>
  <div class="data-input">
    <div class="weapon__basic-info">
      <div class="weapon__left flex flex-col gap-2">
        <div
          class="weapon__selection__image"
          :style="weaponImageStyles"
          :class="{
            'border-amber-300': weaponRarity === '5' || weaponRarity === 5,
            'border-violet-600': weaponRarity === '4' || weaponRarity === 4,
            'border-blue-500': weaponRarity === '3' || weaponRarity === 3,
            'border-green-500': weaponRarity === '2' || weaponRarity === 2,
            'border-gray-500': weaponRarity === '1' || weaponRarity === 1,
          }"></div>
        <button
          @click="openWeaponBrowser"
          class="btn btn-sm btn--weapon--find"
          data-test-weapon-open-browser>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            class="size-4">
            <path
              d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
              fill="#FFFFFF" />
          </svg>
          Find
        </button>
      </div>
      <div class="weapon__basic-data">
        <div class="mb-2">
          <select
            name="weapon"
            v-model="weapon"
            class="select select-bordered select-sm"
            data-test-weapon-select>
            <option :value="null">Choose a weapon</option>
            <optgroup label="5 Star">
              <option
                v-for="weap in weaponsList.five"
                :key="weap.key"
                :value="weap.key">
                {{ weap.name }}
              </option>
            </optgroup>
            <optgroup label="4 Star">
              <option
                v-for="weap in weaponsList.four"
                :key="weap.key"
                :value="weap.key">
                {{ weap.name }}
              </option>
            </optgroup>
            <optgroup label="3 Star">
              <option
                v-for="weap in weaponsList.three"
                :key="weap.key"
                :value="weap.key">
                {{ weap.name }}
              </option>
            </optgroup>
            <optgroup label="2 Star">
              <option
                v-for="weap in weaponsList.two"
                :key="weap.key"
                :value="weap.key">
                {{ weap.name }}
              </option>
            </optgroup>
            <optgroup label="1 Star">
              <option
                v-for="weap in weaponsList.one"
                :key="weap.key"
                :value="weap.key">
                {{ weap.name }}
              </option>
            </optgroup>
          </select>
        </div>
        <div class="mb-2">
          <select
            name="weaponLevel"
            v-model="weaponLevel"
            class="select select-bordered select-sm">
            <option v-for="lvl in weaponLevelOptions" :key="lvl" :value="lvl">
              {{ lvl }}
            </option>
          </select>
          <label for="weaponLevel" class="ml-2">Weapon Level</label>
        </div>
        <div class="">
          <select
            name="refinement"
            v-model="refinement"
            class="select select-bordered select-sm">
            <option
              v-for="lvl in weaponRefinementLevels"
              :key="lvl"
              :value="lvl">
              {{ lvl }}
            </option>
          </select>
          <label for="weaponLevel" class="ml-2">Refinement</label>
        </div>
      </div>
    </div>
    <div v-if="weapon" class="p-2" data-test-weapon-basic-stats>
      <div class="card card-bordered card-compact bg-base-100 shadow mb-2">
        <div class="card-body">
          <div class="weapon__stats flex gap-6 items-center">
            <div
              v-if="weaponAttack"
              class="weapon__stat flex gap-2 items-center">
              <span>
                <img
                  src="https://ryanbenson.github.io/wuthering-waves-assets/images/atk.png" />
              </span>
              <span class="font-bold">ATK:</span>
              <span>{{ weaponAttack }}</span>
            </div>
            <div
              v-if="weaponModifierLabel && weaponModifierValue"
              class="weapon__stat flex gap-2 items-center">
              <span>
                <img v-if="weaponModifierImage" :src="weaponModifierImage" />
              </span>
              <span class="font-bold">{{ weaponModifierLabel }}:</span>
              <span>{{ weaponModifierValue }}</span>
            </div>
          </div>
          <div
            v-if="weaponDescription"
            class="weapon__desc"
            v-html="weaponDescription"></div>
        </div>
      </div>
      <div
        v-if="hasWeaponPassive"
        class="weapon__passives"
        :key="weapon"
        data-test-weapon-passives>
        <CalculatorWeaponsPassive
          v-for="weaponPassive in weaponPassives"
          class="weapon__passive"
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
          @updated-weapon-stats="
            handleUpdatedWeaponStats
          "></CalculatorWeaponsPassive>
      </div>
    </div>
  </div>
  <CalculatorWeaponBrowser
    :key="character"
    :character="character"
    :weapons-list="weaponsList"
    ref="weaponBrowserRef"
    @weapon-browser:chosen-weapon="handleChosenWeapon" />
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { getWeaponsByType, getWeaponByName } from "../weapons/weapons";
import CalculatorWeaponsPassive from "./CalculatorWeaponsPassive.vue";
import CalculatorWeaponBrowser from "./CalculatorWeaponBrowser.vue";
import { useCharacterStore } from "../stores/character";
import { subStatLabelMap } from "../echoes/stats";

type WeaponListBuckets = {
  five: Array<{ key: string; name: string; [k: string]: unknown }>;
  four: Array<{ key: string; name: string; [k: string]: unknown }>;
  three: Array<{ key: string; name: string; [k: string]: unknown }>;
  two: Array<{ key: string; name: string; [k: string]: unknown }>;
  one: Array<{ key: string; name: string; [k: string]: unknown }>;
};

type WeaponPassiveEmit = Record<string, unknown> & {
  key?: string;
  stat?: string;
  value: number;
  stacks?: number;
  valueBeforeStacks?: number;
  modifier?: string;
  modifySpecificTalents?: string[];
  modifierValueCalculated?: number;
};

type ChosenWeapon = {
  info?: {
    maxLevel?: string;
    weaponLevelOverride?: string[];
    passiveData?: unknown[];
    description?: string;
    rarity?: string | number;
    image?: string;
  };
  data?: Record<string, { attack?: number; modifier?: string; modifierValue?: number }>;
  getWeaponDataByLevel: (level: string) => {
    attack: number;
    modifier: string | null;
    modifierValue: number | null;
  };
};

const props = withDefaults(
  defineProps<{
    character: string;
    weaponType?: string;
  }>(),
  { weaponType: "" },
);

const emit = defineEmits<{
  "update-weapon": [
    payload: {
      attack: number;
      modifier: string | null;
      modifierValue: number | null;
      weaponPassiveStats: Record<string, unknown>;
    },
  ];
}>();

const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);
const { setCharacterData } = characterStore;

const chosenWeapon = ref<ChosenWeapon | null>(null);
const weaponPassiveData = ref<WeaponPassiveEmit[]>([]);
function normalizeWeaponsList(raw: unknown): WeaponListBuckets {
  if (raw && typeof raw === "object" && "five" in (raw as object)) {
    return raw as WeaponListBuckets;
  }
  return { five: [], four: [], three: [], two: [], one: [] };
}

const weaponsList = ref<WeaponListBuckets>(normalizeWeaponsList([]));

const weaponBrowserRef = ref<InstanceType<typeof CalculatorWeaponBrowser> | null>(
  null,
);

const currentCharacter = computed(
  () => characters.value[props.character] ?? ({} as Record<string, unknown>),
);

const weapon = computed({
  get() {
    return (currentCharacter.value as { weapon?: string | null }).weapon ?? null;
  },
  set(value: string | null) {
    void setCharacterData(props.character, { weapon: value });
  },
});

const weaponLevel = computed({
  get() {
    let defaultMaxLevel = "90";
    const cw = chosenWeapon.value;
    if (cw?.info?.maxLevel) {
      defaultMaxLevel = cw.info.maxLevel;
    }
    const w = weapon.value;
    if (!w) {
      return defaultMaxLevel;
    }
    const wl = (
      currentCharacter.value as {
        weapons?: Record<string, { weaponLevel?: string }>;
      }
    )?.weapons?.[w]?.weaponLevel;
    return wl ?? defaultMaxLevel;
  },
  set(value: string) {
    const w = weapon.value;
    if (!w) {
      return;
    }
    void setCharacterData(props.character, {
      weapons: {
        [w]: { weaponLevel: value },
      },
    });
  },
});

const refinement = computed({
  get() {
    const w = weapon.value;
    if (!w) {
      return "1";
    }
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
    if (!w) {
      return;
    }
    void setCharacterData(props.character, {
      weapons: {
        [w]: { refinement: value },
      },
    });
  },
});

const weaponLevelOptions = computed(() => {
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
  if (chosenWeapon.value?.info?.weaponLevelOverride) {
    return chosenWeapon.value.info.weaponLevelOverride;
  }
  return defaultOption;
});

const weaponRefinementLevels = ["1", "2", "3", "4", "5"] as const;

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
    [k: string]: unknown;
  }>;
});

const hasWeaponPassive = computed(
  () => weaponPassives.value && weaponPassives.value.length > 0,
);

const weaponDescription = computed(
  () => chosenWeapon.value?.info?.description ?? null,
);

const weaponRarity = computed(
  () => chosenWeapon.value?.info?.rarity ?? 5,
);

const buffsFormatted = computed(() => {
  const finalBuffData: Record<string, unknown> = {};
  let modifySpecificTalents: WeaponPassiveEmit[] = [];
  const allBuffs = [...weaponPassiveData.value];
  if (weapon.value === "Stringmaster") {
    const allElementPassive = allBuffs.find(
      (passive) => passive.key === "StringmasterAllElementAttributeBonus",
    );
    const stringmasterBuffs: Record<string, unknown> = {};
    if (allElementPassive?.stat !== undefined) {
      stringmasterBuffs[allElementPassive.stat as string] = allElementPassive.value;
    }
    const firstStringmasterPassive = weaponPassiveData.value.find(
      (passive) => passive.key === "StringmasterATK1",
    );
    const secondStringmasterPassive = weaponPassiveData.value.find(
      (passive) => passive.key === "StringmasterATK2",
    );
    if (!firstStringmasterPassive) {
      return stringmasterBuffs;
    }
    const firstPassiveValuePreStacks = firstStringmasterPassive.valueBeforeStacks ?? 0;
    const firstPassiveStacks = firstStringmasterPassive.stacks ?? 0;
    const secondPassiveValue = secondStringmasterPassive?.value ?? 0;
    const finalStringmasterPassiveValue =
      (firstPassiveValuePreStacks + secondPassiveValue) * firstPassiveStacks;
    const atkStat = firstStringmasterPassive.stat as string;
    stringmasterBuffs[atkStat] = finalStringmasterPassiveValue;
    return stringmasterBuffs;
  }
  allBuffs.forEach((buffInstance) => {
    const stat = buffInstance.stat;
    const value = buffInstance.value;
    if (stat === "modifySpecificTalents") {
      modifySpecificTalents = modifySpecificTalents.concat(
        value as unknown as WeaponPassiveEmit[],
      );
    } else if (stat) {
      finalBuffData[stat] =
        ((finalBuffData[stat] as number) || 0) + (value as number);
    }
  });
  if (modifySpecificTalents.length > 0) {
    const specificTalentBuffs: Record<string, number> = {};
    modifySpecificTalents.forEach((buffInstance) => {
      const talentKeys = buffInstance?.modifySpecificTalents ?? [];
      talentKeys.forEach((talent) => {
        let talentName = talent;
        if (buffInstance?.modifier) {
          talentName = `${talentName}:${buffInstance.modifier}`;
        }
        specificTalentBuffs[talentName] =
          (specificTalentBuffs[talentName] || 0) +
          (buffInstance.modifierValueCalculated ?? 0);
      });
    });
    finalBuffData.specificTalentBuffs = specificTalentBuffs;
  }
  return finalBuffData;
});

const weaponStatsData = computed(() => {
  if (!weapon.value || !weaponLevel.value || !chosenWeapon.value) {
    return null;
  }
  return chosenWeapon.value.data?.[weaponLevel.value] ?? null;
});

const weaponAttack = computed(() => {
  if (!weaponStatsData.value) {
    return null;
  }
  return weaponStatsData.value?.attack ?? null;
});

const weaponModifier = computed(() => {
  if (!weaponStatsData.value) {
    return null;
  }
  return weaponStatsData.value?.modifier ?? null;
});

const weaponModifierLabel = computed(() => {
  if (!weaponModifier.value) {
    return null;
  }
  return (
    (subStatLabelMap as Record<string, string | undefined>)[weaponModifier.value] ??
    null
  );
});

const weaponModifierImage = computed(() => {
  if (!weaponModifier.value) {
    return null;
  }
  switch (weaponModifier.value) {
    case "ATK":
      return "https://ryanbenson.github.io/wuthering-waves-assets/images/atk.png";
    case "DEF":
      return "https://ryanbenson.github.io/wuthering-waves-assets/images/def.png";
    case "HP":
      return "https://ryanbenson.github.io/wuthering-waves-assets/images/hp.png";
    case "CritRate":
      return "https://ryanbenson.github.io/wuthering-waves-assets/images/critrate.png";
    case "CritDMG":
      return "https://ryanbenson.github.io/wuthering-waves-assets/images/critdamage.png";
    case "EnergyRegen":
      return "https://ryanbenson.github.io/wuthering-waves-assets/images/energyregen.png";
    default:
      return null;
  }
});

const weaponModifierValue = computed(() => {
  if (!weaponStatsData.value) {
    return null;
  }
  const modifierValue = weaponStatsData.value?.modifierValue ?? null;
  if (!modifierValue) {
    return null;
  }
  const decimalFormatter = new Intl.NumberFormat("en", {
    style: "decimal",
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  });
  return decimalFormatter.format(modifierValue * 100) + "%";
});

const weaponImageStyles = computed(() => {
  if (!weapon.value || !chosenWeapon.value) {
    return null;
  }
  return {
    backgroundImage: `url(${chosenWeapon.value?.info?.image})`,
  };
});

async function updateWeaponStats() {
  if (weapon.value && chosenWeapon.value) {
    const { attack, modifier, modifierValue } =
      chosenWeapon.value.getWeaponDataByLevel(weaponLevel.value);
    const weaponData = {
      attack,
      modifier,
      modifierValue,
      weaponPassiveStats: { ...buffsFormatted.value },
    };
    emit("update-weapon", weaponData);
  } else {
    emit("update-weapon", {
      attack: 0,
      modifier: null,
      modifierValue: null,
      weaponPassiveStats: {},
    });
  }
}

async function updateWeapons() {
  weaponsList.value = normalizeWeaponsList(getWeaponsByType(props.weaponType));
  weaponPassiveData.value = [];
  chosenWeapon.value = null;
  await updateWeaponStats();
}

async function handleUpdatedWeaponStats(data: Record<string, unknown>) {
  const row = data as WeaponPassiveEmit;
  const buffIndex = weaponPassiveData.value.findIndex((buff) => buff.key === row.key);
  if (buffIndex === -1) {
    weaponPassiveData.value.push(row);
  } else {
    weaponPassiveData.value[buffIndex] = row;
  }
  await updateWeaponStats();
}

async function weaponChanged() {
  weaponPassiveData.value = [];
  if (!props.weaponType) {
    return;
  }
  try {
    if (!weapon.value) {
      await updateWeaponStats();
      return;
    }
    const weaponChosen = (await getWeaponByName(
      props.weaponType,
      weapon.value,
    )) as ChosenWeapon;
    chosenWeapon.value = weaponChosen;
    await updateWeaponStats();
  } catch {
    // Failed to find weapon
  }
}

function openWeaponBrowser() {
  weaponBrowserRef.value?.triggerOpenModal();
}

function handleChosenWeapon(key: string) {
  weapon.value = key;
}

watch(
  weaponLevel,
  async (wl) => {
    if (wl) {
      await updateWeaponStats();
    }
  },
  { immediate: true },
);

watch(
  refinement,
  async (r) => {
    if (r) {
      await updateWeaponStats();
    }
  },
  { immediate: true },
);

watch(
  () => props.weaponType,
  async () => {
    await updateWeapons();
    await weaponChanged();
  },
  { immediate: true },
);

watch(weapon, async () => {
  await weaponChanged();
}, { immediate: true });

onBeforeUnmount(() => {
  weaponPassiveData.value = [];
  chosenWeapon.value = null;
});
</script>

<style scoped lang="scss">
.weapon__selection__image {
  width: 100px;
  height: 100px;
  background-repeat: no-repeat;
  display: block;
  background-size: contain;
  border-radius: 100%;
  border-width: 1px;
  border-style: solid;
}
html[data-theme="light"] {
  .weapon__stat {
    span img {
      filter: contrast(0.25);
    }
  }
}
.weapon__basic-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}
html[data-theme="light"] {
  .btn--weapon--find {
    svg {
      filter: invert(100%);
    }
  }
}
</style>
