<template>
  <details ref="progressDetailsEl" class="dropdown dropdown-end">
    <summary
      class="btn btn-xs btn-ghost gap-1.5 rounded-full list-none"
      data-test-workspace-progress-trigger>
      <svg viewBox="0 0 24 24" class="size-4 -rotate-90" aria-hidden="true">
        <circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" stroke-width="3" class="opacity-20" />
        <circle
          cx="12"
          cy="12"
          r="9.5"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          class="text-primary"
          :stroke-dasharray="RING_CIRCUMFERENCE"
          :stroke-dashoffset="ringOffset" />
      </svg>
      <span class="font-mono text-xs">{{ completedCount }} / {{ criteria.length }} set up</span>
    </summary>
    <div class="dropdown-content z-20 mt-2 w-72 rounded-box bg-base-100 p-3 shadow-lg border border-base-300">
      <h4 class="text-sm font-semibold mb-1">Build Progress</h4>
      <p class="text-xs opacity-60 mb-2">
        Auto-detected per build. Override anything that doesn't apply.
      </p>
      <label
        v-for="item in criteria"
        :key="item.key"
        class="flex items-start gap-2 py-2 border-t border-base-300 first:border-t-0 cursor-pointer">
        <input
          type="checkbox"
          class="checkbox checkbox-sm mt-0.5"
          :checked="item.value"
          :data-test-workspace-progress-check="item.key"
          @change="toggle(item.key, ($event.target as HTMLInputElement).checked)" />
        <span class="min-w-0">
          <span class="block text-sm font-medium">{{ item.label }}</span>
          <span class="block text-xs opacity-60">{{ item.hint }}</span>
        </span>
      </label>
    </div>
  </details>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useCharacterStore } from "../../stores/character";

interface Props {
  character: string;
}

const props = defineProps<Props>();
const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);

// Native <details>/<summary> has no built-in "close on outside click"
// behavior — see CalculatorLiveResultBar.vue's settingsDetailsEl for the
// same pattern.
const progressDetailsEl = ref<HTMLDetailsElement | null>(null);
function onDocumentPointerDown(event: PointerEvent) {
  const el = progressDetailsEl.value;
  if (!el || !el.open) return;
  if (event.target instanceof Node && el.contains(event.target)) return;
  el.open = false;
}
onMounted(() => {
  document.addEventListener("pointerdown", onDocumentPointerDown, true);
});
onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", onDocumentPointerDown, true);
});

const RING_CIRCUMFERENCE = 2 * Math.PI * 9.5;

const currentCharacter = computed(
  () => (characters.value[props.character] ?? {}) as Record<string, unknown>,
);

const overrides = computed(
  () => (currentCharacter.value.progressOverrides ?? {}) as Record<string, boolean>,
);

const echoSlotsFilled = computed((): number => {
  const echoes = (currentCharacter.value.echoes ?? {}) as Record<
    number,
    { echoId?: string | null; echo?: string | null } | undefined
  >;
  let count = 0;
  for (let i = 0; i < 5; i++) {
    const slot = echoes[i];
    if (slot?.echoId || slot?.echo) {
      count += 1;
    }
  }
  return count;
});

const autoDetected = computed(() => {
  const teamBuffs = (currentCharacter.value.teamBuffs ?? {}) as {
    selectedCharacter1?: string | null;
    selectedCharacter2?: string | null;
  };
  return {
    weapon: Boolean((currentCharacter.value as { weapon?: string | null }).weapon),
    echoes: echoSlotsFilled.value === 5,
    party: Boolean(teamBuffs.selectedCharacter1 || teamBuffs.selectedCharacter2),
  };
});

const criteria = computed(() => [
  {
    key: "weapon",
    label: "Weapon chosen",
    hint: autoDetected.value.weapon ? "Weapon assigned" : "No weapon assigned yet",
    value: overrides.value.weapon ?? autoDetected.value.weapon,
  },
  {
    key: "echoes",
    label: "Echoes equipped",
    hint: `${echoSlotsFilled.value} / 5 slots filled`,
    value: overrides.value.echoes ?? autoDetected.value.echoes,
  },
  {
    key: "party",
    label: "Party set up",
    hint: autoDetected.value.party
      ? "Teammates added"
      : "No teammates added — mark complete for solo",
    value: overrides.value.party ?? autoDetected.value.party,
  },
]);

const completedCount = computed(
  () => criteria.value.filter((item) => item.value).length,
);

const ringOffset = computed(
  () => RING_CIRCUMFERENCE * (1 - completedCount.value / criteria.value.length),
);

function toggle(key: string, checked: boolean) {
  characterStore.setCharacterData(props.character, {
    progressOverrides: { [key]: checked },
  });
}
</script>
