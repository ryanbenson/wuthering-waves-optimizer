<template>
  <div class="card card-bordered card-compact bg-base-100 shadow" :data-test-echo-set-bonus-slot="fieldKey">
    <div class="card-body">
      <div v-if="isOverrideEnabled">
        <div class="text-[11px] font-semibold uppercase tracking-wide opacity-60 mb-1.5">
          {{ slotLabel }}
        </div>
        <AppRichSelect
          v-model="pickerModel"
          :options="selectOptions"
          searchable
          variant="ghost"
          :allow-empty="allowEmpty"
          empty-label="None"
          :aria-label="`Choose ${slotLabel}`"
          data-test-echo-set-bonus-picker />
      </div>
      <div v-else class="flex items-center gap-2.5">
        <img
          v-if="setIcon"
          :src="setIcon"
          class="size-10 rounded-full border-2 border-base-300 bg-base-200 object-contain p-1 shrink-0" />
        <div
          v-else
          class="size-10 rounded-full border-2 border-dashed border-base-300 flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-4 opacity-40">
            <path
              d="M12 2 3 7v10l9 5 9-5V7l-9-5z"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6" />
          </svg>
        </div>
        <div class="min-w-0">
          <div v-if="tierBadge" class="badge badge-ghost badge-sm uppercase tracking-wide">
            {{ tierBadge }}
          </div>
          <div class="font-bold text-sm truncate">{{ setName || slotLabel }}</div>
        </div>
      </div>

      <template v-if="setName">
        <div class="divider my-2"></div>
        <CalculatorEchoSetPassive
          v-for="passive in setPassives"
          :key="String(passive.key)"
          :character="character"
          :has-stacks="Boolean(passive.hasStacks)"
          :modifier="passive.modifier as string | undefined"
          :modifier-value="Number(passive.modifierValue) || 0"
          :min-stacks="Number(passive.minStacks) || 0"
          :max-stacks="Number(passive.maxStacks) || 0"
          :details="String(passive.details ?? '')"
          :always-enabled="Boolean(passive.alwaysEnabled)"
          :modifiers="(passive.modifiers ?? []) as unknown[]"
          :passive-key="String(passive.key ?? '')"
          @updated-echo-passive-stats="handleUpdatedEchoPassiveStats"></CalculatorEchoSetPassive>
      </template>
      <template v-else>
        <p class="text-xs opacity-60 mt-3 mb-0">No bonus active yet.</p>
        <p class="text-[11px] opacity-50 mt-0.5 mb-0">
          {{ isOverrideEnabled ? "Choose a set above." : "Equip echoes to see this bonus." }}
        </p>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
// v3-only redesign of CalculatorEchoesSetBonusOnePiece/One/Two.vue (see
// docs/adr/0028) — those three legacy components stay byte-identical and
// still render when the liveResultBar flag is off. This single generic
// component replaces all three: they differed only in which candidate-set
// list / effects map / allow-empty behavior they used, so those differences
// are just props here instead of three near-duplicate files.
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { useCharacterStore } from "../stores/character";
import CalculatorEchoSetPassive from "./CalculatorEchoSetPassive.vue";
import AppRichSelect, { type AppRichSelectOption, type AppRichSelectValue } from "./AppRichSelect.vue";
import { getEchoSetIconByType } from "../echoes/stats";
import { getEchoSetKeyFromBonusLabel } from "../echoes/sets";
import { aggregateEchoSetPassiveStats } from "../echoes/echoSetPassives";

type SetBonusEntry = {
  name?: string;
  passives?: Array<Record<string, unknown> & { key: string }>;
};

const props = withDefaults(
  defineProps<{
    character: string;
    fieldKey: "setBonusOnePiece" | "setBonusOne" | "setBonusTwo";
    candidateSets: string[];
    effectsMap: Record<string, SetBonusEntry>;
    allowEmpty?: boolean;
    slotLabel: string;
    isOverrideEnabled?: boolean;
  }>(),
  { allowEmpty: false, isOverrideEnabled: false },
);

const emit = defineEmits<{
  "update-stats": [stats: Record<string, number | string>];
}>();

const characterStore = useCharacterStore();

type PassiveBuffPayload = { key: string; stats: Record<string, unknown> };
const passiveData = ref<PassiveBuffPayload[]>([]);

const currentCharacter = computed(
  () => (characterStore.characters?.[props.character] ?? {}) as Record<string, any>,
);

const type = computed({
  get(): string {
    return currentCharacter.value.echoSetBonus?.[props.fieldKey] ?? "";
  },
  set(value: string | number | null) {
    void characterStore.setCharacterData(props.character, {
      echoSetBonus: { [props.fieldKey]: value == null || value === "" ? null : String(value) },
    });
  },
});

/** Bridges "" <-> null so AppRichSelect's allow-empty "None" option round-trips. */
const pickerModel = computed<AppRichSelectValue>({
  get: () => type.value || null,
  set: (value) => {
    type.value = value;
  },
});

const setName = computed(() => (type.value ? props.effectsMap[type.value]?.name ?? "" : ""));
const setPassives = computed(() => props.effectsMap[type.value]?.passives ?? []);

const setKey = computed(() => (type.value ? getEchoSetKeyFromBonusLabel(type.value) : null));
const setIcon = computed(() => (setKey.value ? getEchoSetIconByType(setKey.value) : null));
const tierBadge = computed(() => {
  const match = type.value.match(/(\d+) Set$/);
  return match ? `${match[1]}pc` : null;
});

/**
 * Rebuilt locally (rather than reusing utils/richSelectOptions'
 * buildEchoSetSelectOptions) because that helper expects short set-type
 * keys ("FreezingFrost"); candidateSets here are full bonus labels
 * ("Freezing Frost 5 Set"), so its icon lookup would silently miss.
 */
const selectOptions = computed((): AppRichSelectOption[] =>
  [...props.candidateSets].sort().map((label) => {
    const key = getEchoSetKeyFromBonusLabel(label);
    return { value: label, label, image: key ? getEchoSetIconByType(key) : null };
  }),
);

const buffsFormatted = computed(
  () => aggregateEchoSetPassiveStats(passiveData.value) as Record<string, number | string>,
);

function updatedStats() {
  emit("update-stats", buffsFormatted.value);
}

function handleUpdatedEchoPassiveStats(data: PassiveBuffPayload) {
  const buffIndex = passiveData.value.findIndex((buff) => buff.key === data.key);
  if (buffIndex === -1) passiveData.value.push(data);
  else passiveData.value[buffIndex] = data;
  updatedStats();
}

watch(type, () => {
  updatedStats();
}, { immediate: true });

onBeforeUnmount(() => {
  passiveData.value = [];
});
</script>
