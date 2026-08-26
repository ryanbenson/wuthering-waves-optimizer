<template>
  <template v-if="isOpen">
    <div
      class="echo-edit-panel-scrim"
      data-test-echo-edit-panel-scrim
      @click="emit('close')"></div>
    <div
      ref="panelEl"
      class="echo-edit-panel flex flex-col focus:outline-none"
      :class="{ 'echo-edit-panel--inventory': context === 'inventory' }"
      data-test-echo-edit-panel
      tabindex="-1"
      @keydown.esc="emit('close')">
      <div class="echo-edit-panel__handle" aria-hidden="true"></div>

      <div class="flex items-start gap-3 px-4 py-3 border-b border-base-300 shrink-0">
        <div
          class="echo-edit-panel__avatar rounded-full border border-solid neutral-content size-12 bg-cover cursor-pointer shrink-0"
          :class="rankBorderClass"
          :style="{ backgroundImage: `url(${echoImage})` }"
          @click="openEchoPicker"></div>
        <div class="flex-1 min-w-0">
          <div class="font-bold text-sm truncate">{{ echoName ?? "No echo selected" }}</div>
          <div v-if="hasSubStats" class="flex items-center gap-1.5 flex-wrap mt-0.5">
            <span class="badge badge-xs text-nowrap" :class="critValueBadgeClass">
              CV {{ formattedCritValue }}%
            </span>
            <span v-if="SHOW_ROLL_VALUE_BADGE" class="badge badge-xs text-nowrap" :class="rollValueBadgeClass">
              RV {{ echoRollValue }}%
            </span>
            <span
              v-if="substatScore"
              class="badge badge-xs text-nowrap"
              :class="substatScoreBadgeClass"
              v-tooltip="'Substat Score — this echo\'s rolls weighted for this character'">
              {{ substatScore.grade }} {{ Math.round(substatScore.percent) }}%{{ substatScore.provisional ? "*" : "" }}
            </span>
            <span
              v-else
              class="badge badge-xs text-nowrap"
              :class="echoRatingBadgeClass"
              v-tooltip="'Echo Rating — overall substat roll quality'">
              {{ echoRating.grade }} {{ Math.round(echoRating.percent) }}%{{ echoRating.provisional ? "*" : "" }}
            </span>
          </div>
          <div class="flex items-center gap-2 mt-1.5">
            <button
              type="button"
              class="btn btn-xs"
              data-test-echo-edit-find
              @click="openEchoPicker">
              Find
            </button>
            <button
              v-if="context === 'build'"
              type="button"
              class="btn btn-xs btn-ghost"
              data-test-echo-edit-browse
              @click="emit('open-echoes-browser')">
              Browse
            </button>
          </div>
          <div v-if="echoSets.length" class="flex items-center gap-1.5 mt-1.5">
            <button
              v-for="s in echoSets"
              :key="s"
              type="button"
              class="size-5 rounded-full shrink-0"
              :class="{ 'ring-2 ring-primary': isSetSelected(s) }"
              :aria-pressed="isSetSelected(s)"
              :aria-label="s"
              @click="handleChooseEchoSet(s)">
              <img :src="getEchoSetIcon(s)" :class="s" />
            </button>
          </div>
        </div>
        <button
          type="button"
          class="btn btn-sm btn-circle btn-ghost"
          aria-label="Close"
          data-test-echo-edit-panel-close
          @click="emit('close')">
          <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-width="1.8" d="M5 5l14 14M19 5 5 19" />
          </svg>
        </button>
      </div>

      <div class="px-4 pt-3 shrink-0">
        <div class="text-xs font-semibold uppercase tracking-wide opacity-60 mb-1">Rank</div>
        <div class="flex gap-1">
          <button
            v-for="r in [2, 3, 4, 5]"
            :key="r"
            type="button"
            class="btn btn-xs"
            :class="String(rank) === String(r) ? 'btn-primary' : 'btn-ghost'"
            :aria-pressed="String(rank) === String(r)"
            :data-test-echo-edit-rank="r"
            @click="rank = r">
            {{ r }}★
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        <div class="echo-edit-panel__locked-row flex items-center gap-2" data-test-echo-edit-cost-row>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-3.5 shrink-0 opacity-60"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            v-tooltip="'Set by which echo you picked'">
            <rect x="5" y="11" width="14" height="9" rx="2" stroke-width="1.8" />
            <path d="M8 11V8a4 4 0 018 0v3" stroke-width="1.8" />
          </svg>
          <span class="badge badge-sm font-mono">Cost {{ type ?? "—" }}</span>
          <span v-if="freeStatType" class="badge badge-sm badge-ghost font-mono">
            {{ freeStatLabel }} +{{ freeStatValue }}
          </span>
        </div>

        <div>
          <div class="text-xs font-semibold uppercase tracking-wide opacity-60 mb-1">Main stat</div>
          <AppRichSelect
            v-model="stat"
            :options="mainStatOptions"
            :disabled="!type"
            placeholder="Select stat"
            aria-label="Main stat"
            data-test="echo-edit-main-stat" />
        </div>

        <div>
          <div class="text-xs font-semibold uppercase tracking-wide opacity-60 mb-1">Substats</div>
          <div class="flex flex-col gap-2">
            <div
              v-for="(slot, i) in slots"
              :key="i"
              class="echo-edit-panel__slot"
              :class="{ 'echo-edit-panel__slot--empty': !isSlotFilled(i) }"
              :data-test-echo-edit-slot="i">
              <div class="flex items-center gap-2">
                <span class="echo-edit-panel__slot-index">{{ i + 1 }}</span>
                <AppRichSelect
                  class="flex-1 min-w-0"
                  :model-value="slot.type.value === 'none' ? null : slot.type.value"
                  :options="substatOptions"
                  allow-empty
                  empty-label="Choose substat"
                  placeholder="Choose substat"
                  :aria-label="`Substat ${i + 1} type`"
                  :data-test="`echo-edit-slot-type-${i}`"
                  @update:model-value="(v) => assignSlot(i, v as string | null)" />
              </div>
              <div v-if="isSlotFilled(i)" class="mt-2">
                <EchoSubstatSlider
                  :id="`echo-substat-${i}`"
                  :values="getSubStatRange(slot.type.value)"
                  :model-value="slot.value.value"
                  :unit="slot.type.value.includes('FLAT') ? '' : '%'"
                  :aria-label="`Substat ${i + 1} value`"
                  :data-test-echo-edit-slot-value="i"
                  @update:model-value="(v) => (slot.value.value = v)" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

  <dialog :id="pickerModalId" class="modal" @close="isPickerOpen = false">
    <form method="dialog" class="modal-backdrop" @click="closeEchoChooser">
      <button>close</button>
    </form>
    <div v-if="isPickerOpen" class="modal-box max-w-5xl">
      <form method="dialog" @click="closeEchoChooser">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <div class="py-4">
        <EchoSetFilterSelect v-model="echoSetFilter" />
      </div>
      <div class="echoes__list grid grid-cols-1 md:grid-cols-4 gap-4">
        <template v-if="!allEchoesListFiltered.length">
          <div class="echoes__list--empty py-12 text-center w-full col-span-2">No echoes found</div>
        </template>
        <template v-else>
          <div
            v-for="echoesToChoose in allEchoesListFiltered"
            :key="echoesToChoose.key"
            class="card card-bordered card-compact bg-base-100 shadow mb-2 cursor-pointer"
            :data-test-echo-picker-option="echoesToChoose.key"
            @click="chooseMainEcho(echoesToChoose.key)">
            <div class="card-body items-center">
              <div
                class="echo__item__image rounded-full border border-solid neutral-content size-20 mb-2 bg-cover cursor-pointer mx-auto lg:m-0"
                :style="{ backgroundImage: `url(${echoesToChoose.image})` }"></div>
              <h2 class="card-title text-center text-lg">{{ echoesToChoose.name }}</h2>
              <h3 class="text-sm">{{ echoesToChoose.class }}</h3>
              <div class="echo__item__set-selection flex gap-3 justify-center sm:justify-start flex-wrap">
                <div
                  v-for="echoSetItem in echoesToChoose.sets"
                  :key="echoSetItem"
                  class="size-8 rounded-full cursor-pointer echo__item__set-selection--icon">
                  <img :src="getEchoSetIcon(echoSetItem)" :class="echoSetItem" />
                </div>
              </div>
              <button type="button" class="btn btn-sm btn-primary" @click="chooseMainEcho(echoesToChoose.key)">
                Use echo
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from "vue";
import { useEchoEditFields, type EchoEditTarget } from "../composables/useEchoEditFields";
import { getSubstatFamily } from "../echoes/substatFamilies";
import { subStats, getReadableSubStatLabel, SHOW_ROLL_VALUE_BADGE } from "../echoes/stats";
import { useEchoCardStats, type EchoCardStatsProps } from "../composables/useEchoCardStats";
import { useEchoRating, type EchoRatingProps } from "../composables/useEchoRating";
import { mainEchoesData } from "../echoes/index.ts";
import AppRichSelect from "./AppRichSelect.vue";
import EchoSetFilterSelect from "./EchoSetFilterSelect.vue";
import EchoSubstatSlider from "./EchoSubstatSlider.vue";

defineOptions({ name: "CalculatorEchoEditPanel" });

const props = defineProps<{
  context: "build" | "inventory";
  echoId: string | null;
  character?: string;
  index?: number;
  isOpen: boolean;
}>();

const emit = defineEmits<{
  close: [];
  "open-echoes-browser": [];
}>();

const target = computed<EchoEditTarget>(() =>
  props.context === "build"
    ? { context: "build", character: props.character ?? "", index: props.index ?? 0 }
    : { context: "inventory", echoId: props.echoId },
);

// Focus the panel on open so Escape (bound via @keydown.esc on this element)
// actually has something to bubble from.
const panelEl = ref<HTMLElement | null>(null);
watch(
  () => props.isOpen,
  async (open) => {
    if (!open) return;
    await nextTick();
    panelEl.value?.focus();
  },
);

// The panel's own content scrolls independently of the page behind it —
// without this, a tall page (the inventory grid, or the build strip) keeps
// its own scrollbar active at the same time, which reads as two scrollbars
// fighting for the same edge of the screen. Restores whatever value was
// there before (not a hardcoded "auto") so this doesn't fight
// AppLayout.vue's own route-based body-scroll rule on close.
let previousBodyOverflow: string | null = null;
watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    } else if (previousBodyOverflow !== null) {
      document.body.style.overflow = previousBodyOverflow;
      previousBodyOverflow = null;
    }
  },
);
onUnmounted(() => {
  if (previousBodyOverflow !== null) {
    document.body.style.overflow = previousBodyOverflow;
  }
});

const {
  echo,
  echoSet,
  rank,
  stat,
  type,
  slots,
  freeStatType,
  freeStatValue,
  freeStatLabel,
  mainStatOptions,
  echoName,
  echoImage,
  echoSets,
  getEchoSetIcon,
  getSubStatRange,
  handleChooseEchoSet,
  isSetSelected,
} = useEchoEditFields(() => target.value);

// Same getter-passthrough approach as CalculatorEchoTile.vue — reuses the
// exact CV/RV/rating math CalculatorEchoCard.vue already uses rather than
// duplicating it, tracking live edits off useEchoEditFields' own refs.
const cardStatsSource: EchoCardStatsProps & EchoRatingProps = {
  get rank() { return rank.value; },
  get type() { return String(type.value ?? ""); },
  get echo() { return echo.value ?? ""; },
  get stat() { return stat.value ?? ""; },
  get echoSubStatsType1() { return slots[0].type.value; },
  get echoSubStatsValue1() { return slots[0].value.value; },
  get echoSubStatsType2() { return slots[1].type.value; },
  get echoSubStatsValue2() { return slots[1].value.value; },
  get echoSubStatsType3() { return slots[2].type.value; },
  get echoSubStatsValue3() { return slots[2].value.value; },
  get echoSubStatsType4() { return slots[3].type.value; },
  get echoSubStatsValue4() { return slots[3].value.value; },
  get echoSubStatsType5() { return slots[4].type.value; },
  get echoSubStatsValue5() { return slots[4].value.value; },
  // No natural "owning character" in inventory context, same as
  // InventoryEchoesBrowser.vue's own CalculatorEchoCard usage — falls back
  // to the unweighted Echo Rating grade below.
  get characterId() { return props.context === "build" ? (props.character ?? null) : null; },
};
const { hasSubStats, formattedCritValue, critValueBadgeClass, echoRollValue, rollValueBadgeClass } =
  useEchoCardStats(cardStatsSource);
const { echoRating, echoRatingBadgeClass, substatScore, substatScoreBadgeClass } =
  useEchoRating(cardStatsSource);

const FAMILY_LABELS: Record<string, string> = {
  crit: "Crit",
  dmg: "DMG Bonus",
  util: "Utility",
  flat: "Flat / %",
};

const substatOptions = subStats.map((key) => ({
  value: key,
  label: getReadableSubStatLabel(key),
  group: FAMILY_LABELS[getSubstatFamily(key)],
}));

function isSlotFilled(i: number) {
  const t = slots[i].type.value;
  return Boolean(t) && t !== "none";
}

function assignSlot(i: number, statKey: string | null) {
  if (!statKey) {
    slots[i].type.value = "none";
    slots[i].value.value = 0;
    return;
  }
  const range = getSubStatRange(statKey);
  slots[i].type.value = statKey;
  slots[i].value.value = range[Math.floor(range.length / 2)];
}

const rankBorderClass = computed(() => ({
  "border-amber-300": String(rank.value) === "5",
  "border-violet-600": String(rank.value) === "4",
  "border-blue-500": String(rank.value) === "3",
  "border-green-500": String(rank.value) === "2",
}));

// -- echo/set picker dialog: unchanged flow, just relocated here so it's
// reachable from the shared panel instead of the old per-slot modal.
const pickerModalId = computed(
  () => `echoEditPickerModal-${props.context}-${props.character ?? ""}-${props.index ?? props.echoId ?? ""}`,
);
const isPickerOpen = ref(false);
const echoSetFilter = ref<string | null>(null);

async function openEchoPicker() {
  isPickerOpen.value = true;
  await nextTick();
  const modalEl = document.getElementById(pickerModalId.value);
  (modalEl as HTMLDialogElement | null)?.showModal();
}

function closeEchoChooser() {
  echoSetFilter.value = null;
  const modalEl = document.getElementById(pickerModalId.value);
  (modalEl as HTMLDialogElement | null)?.close();
  isPickerOpen.value = false;
}

function chooseMainEcho(echoKey: string) {
  echo.value = echoKey;
  if (props.context === "inventory") {
    if (!echoSet.value) echoSet.value = echoSetFilter.value;
  } else if (echoSetFilter.value) {
    echoSet.value = echoSetFilter.value;
  }
  closeEchoChooser();
}

type EchoListEntry = { key: string; name: string; class: string; sets: string[]; image?: string };
const classOrder: Record<string, number> = { Calamity: 0, Overlord: 1, Elite: 2, Common: 3 };
const allEchoesListFiltered = computed((): EchoListEntry[] => {
  let allEchoes = Object.values(mainEchoesData) as EchoListEntry[];
  if (echoSetFilter.value) {
    allEchoes = allEchoes.filter((e) => e.sets.includes(echoSetFilter.value!));
  }
  return [...allEchoes].sort((a, b) => {
    const cmp = classOrder[a.class] - classOrder[b.class];
    return cmp === 0 ? a.name.localeCompare(b.name) : cmp;
  });
});
</script>

<style scoped>
/*
 * Base styling docks as a flex child (build context — the parent supplies
 * a flex row so this actually pushes the build strip aside on desktop).
 * --inventory overrides this to a self-contained fixed panel, since the
 * Inventory page has no equivalent flex ancestor to dock against.
 */
.echo-edit-panel {
  flex: 0 0 380px;
  min-width: 0;
  border-left: 1px solid oklch(var(--b3));
  background: oklch(var(--b1));
}

.echo-edit-panel--inventory {
  /* AppLayout.vue's nav is itself `position: fixed` at z-50, 80px tall
     (its content offsets below it with mt-20) — this needs to clear it the
     same way, not just out-z-index it, or it'd cover the nav instead. */
  position: fixed;
  top: 80px;
  right: 0;
  bottom: 0;
  width: 380px;
  max-width: 100%;
  z-index: 51;
  box-shadow: -12px 0 30px rgba(0, 0, 0, 0.15);
}

.echo-edit-panel-scrim {
  display: none;
}

.echo-edit-panel__handle {
  display: none;
}

.echo-edit-panel__locked-row {
  background: oklch(var(--b2));
  border: 1px dashed oklch(var(--b3));
  border-radius: 0.6rem;
  padding: 0.5rem 0.65rem;
}

.echo-edit-panel__slot {
  border: 1px solid oklch(var(--b3));
  border-radius: 0.6rem;
  padding: 0.5rem 0.6rem;
  background: oklch(var(--b2));
}

.echo-edit-panel__slot--empty {
  border-style: dashed;
  background: transparent;
}

.echo-edit-panel__slot-index {
  width: 1.15rem;
  height: 1.15rem;
  border-radius: 999px;
  background: oklch(var(--b3));
  font-family: ui-monospace, "SFMono-Regular", monospace;
  font-size: 0.65rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .echo-edit-panel-scrim {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 49;
  }

  .echo-edit-panel {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: auto;
    flex: none;
    width: 100%;
    max-height: 80vh;
    border-left: none;
    border-radius: 1rem 1rem 0 0;
    box-shadow: 0 -12px 30px rgba(0, 0, 0, 0.25);
    z-index: 50;
  }

  .echo-edit-panel__handle {
    display: block;
    width: 36px;
    height: 4px;
    border-radius: 2px;
    background: oklch(var(--b3));
    margin: 8px auto 0;
    flex: none;
  }
}
</style>
