<template>
  <AppChooserModal
    ref="modalRef"
    title="Browse weapons"
    close-test-attr="data-test-workspace-weapon-browser-close"
    @close="reset">
    <template #toolbar>
      <AppFilterPanel
        panel-key="workspace-weapons"
        :active-count="activeFilterCount"
        :clear-disabled="!activeFilterCount"
        @clear="resetFilters">
        <template #bar>
          <input
            v-model="search"
            type="search"
            placeholder="Search weapons…"
            class="input input-bordered input-sm flex-1 min-w-40"
            aria-label="Search weapons"
            data-test-workspace-weapon-browser-search />
          <select
            v-model="sortBy"
            class="select select-bordered select-sm"
            aria-label="Sort weapons"
            data-test-workspace-weapon-browser-sort>
            <option value="impact">Sort: Damage impact</option>
            <option value="rarity">Sort: Rarity</option>
            <option value="name">Sort: Name</option>
          </select>
        </template>

        <div class="flex flex-wrap items-center gap-3">
          <div class="flex items-center gap-1.5">
            <span class="text-xs font-medium opacity-60">Rarity</span>
            <div class="flex gap-1">
              <button
                v-for="r in [5, 4, 3, 2, 1]"
                :key="r"
                type="button"
                class="btn btn-sm"
                :class="rarityFilter === r ? 'btn-active' : ''"
                :data-test-workspace-weapon-browser-filter-rarity="r"
                @click="toggleRarityFilter(r)">
                {{ r }}✦
              </button>
            </div>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="text-xs font-medium opacity-60">Main stat</span>
            <div class="min-w-[10rem]">
              <AppRichSelect
                v-model="mainStatFilter"
                :options="mainStatFilterOptions"
                allow-empty
                empty-label="Any main stat"
                aria-label="Filter by weapon main stat"
                data-test="workspace-weapon-browser-main-stat" />
            </div>
          </div>
        </div>
      </AppFilterPanel>

      <div class="flex items-center justify-between gap-2 mt-2">
        <span class="text-xs opacity-60" data-test-workspace-weapon-browser-count>
          {{ weaponsSorted.length }}
          {{ weaponsSorted.length === 1 ? "weapon" : "weapons" }}
        </span>
        <span v-if="impactsLoading" class="text-xs opacity-60">
          Estimating damage impact…
        </span>
      </div>
    </template>

    <div
      v-if="!weaponsSorted.length"
      class="py-12 text-center w-full opacity-60"
      data-test-workspace-weapon-browser-empty>
      No weapons found
    </div>
    <div
      v-else
      class="flex flex-col gap-2"
      data-test-workspace-weapon-browser-list>
      <div
        v-for="weaponRow in weaponsSorted"
        :key="weaponRow.key"
        class="card card-bordered card-compact bg-base-200 shadow hover:bg-base-300 transition-colors"
        :class="{ 'border-l-4 border-l-primary': weaponRow.key === currentWeapon }"
        :data-test-workspace-weapon-browser-row="weaponRow.key">
        <div class="card-body flex-row items-center gap-3 py-2">
          <button
            type="button"
            class="flex items-center gap-3 flex-1 min-w-0 text-left"
            :data-test-workspace-weapon-browser-preview="weaponRow.key"
            @click="openPreview(weaponRow.key)">
            <div
              class="rounded-full border-2 bg-cover bg-center size-11 shrink-0"
              :class="rarityBorderClasses(weaponRow.rarity)"
              :style="{
                backgroundImage: `url(${WEAPON_IMAGE_BASE}/${weaponRow.key}.png)`,
              }"></div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-semibold text-sm">{{ weaponRow.name }}</span>
                <span class="text-xs" :class="rarityTextClasses(weaponRow.rarity)">
                  {{ "★".repeat(weaponRow.rarity) }}
                </span>
                <span
                  v-if="weaponRow.key === signatureWeapon"
                  class="badge badge-sm badge-primary">
                  Signature
                </span>
              </div>
              <div v-if="weaponRow.mainStat" class="text-xs opacity-60 mt-0.5">
                {{ getWeaponMainStatLabel(weaponRow.mainStat) }}
              </div>
            </div>
          </button>

          <div class="flex items-center gap-2 shrink-0">
            <span
              v-if="weaponRow.key === currentWeapon"
              class="badge badge-primary">
              Equipped
            </span>
            <span
              v-else-if="impactByKey[weaponRow.key]"
              class="badge"
              :class="impactBadgeClasses(impactByKey[weaponRow.key])">
              {{ formatImpact(impactByKey[weaponRow.key]) }}
            </span>
            <button
              v-if="weaponRow.key !== currentWeapon"
              type="button"
              class="btn btn-primary btn-sm"
              :data-test-workspace-weapon-browser-equip="weaponRow.key"
              @click="chooseWeapon(weaponRow.key)">
              Equip
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppChooserModal>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useCharacterStore } from "../../stores/character";
import { useInventoryStore } from "../../stores/inventory";
import {
  estimateWeaponSwapImpactBatch,
  type WeaponImpactRange,
  type WeaponSwapCandidate,
} from "../../weapons/weaponImpact";
import { getWeaponMainStatLabel } from "../../weapons/weapons";
import AppChooserModal from "../AppChooserModal.vue";
import AppFilterPanel from "../AppFilterPanel.vue";
import AppRichSelect, { type AppRichSelectOption } from "../AppRichSelect.vue";

const WEAPON_IMAGE_BASE =
  "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons";

type WeaponListEntry = { key: string; name: string; mainStat?: string };
type WeaponRow = { key: string; name: string; rarity: number; mainStat?: string };

const props = defineProps<{
  character: string;
  weaponType?: string;
  weaponsList: {
    five?: WeaponListEntry[];
    four?: WeaponListEntry[];
    three?: WeaponListEntry[];
    two?: WeaponListEntry[];
    one?: WeaponListEntry[];
  };
  signatureWeapon?: string;
  currentWeapon?: string | null;
}>();

const emit = defineEmits<{
  "weapon-browser:chosen-weapon": [key: string];
  "weapon-browser:preview": [key: string];
}>();

const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);
const inventoryStore = useInventoryStore();
const { echoes: inventoryEchoes } = storeToRefs(inventoryStore);

const modalRef = ref<InstanceType<typeof AppChooserModal> | null>(null);
const search = ref("");
const rarityFilter = ref<number | null>(null);
const mainStatFilter = ref<string | null>(null);
const sortBy = ref<"impact" | "rarity" | "name">("impact");
const impactByKey = ref<Record<string, WeaponImpactRange | null>>({});
const impactsLoading = ref(false);

const weaponsAll = computed((): WeaponRow[] => [
  ...(props.weaponsList?.five ?? []).map((w) => ({ ...w, rarity: 5 })),
  ...(props.weaponsList?.four ?? []).map((w) => ({ ...w, rarity: 4 })),
  ...(props.weaponsList?.three ?? []).map((w) => ({ ...w, rarity: 3 })),
  ...(props.weaponsList?.two ?? []).map((w) => ({ ...w, rarity: 2 })),
  ...(props.weaponsList?.one ?? []).map((w) => ({ ...w, rarity: 1 })),
]);

/** Only the stats this character's own weapon pool actually offers. */
const mainStatFilterOptions = computed((): AppRichSelectOption[] => {
  const stats = [...new Set(weaponsAll.value.map((w) => w.mainStat).filter(Boolean))];
  return stats
    .map((stat) => ({
      value: stat as string,
      label: getWeaponMainStatLabel(stat as string),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
});

const activeFilterCount = computed(() => {
  let count = 0;
  if (search.value.trim()) count += 1;
  if (rarityFilter.value !== null) count += 1;
  if (mainStatFilter.value) count += 1;
  return count;
});

const weaponsFiltered = computed(() => {
  let list = weaponsAll.value;
  if (rarityFilter.value !== null) {
    list = list.filter((w) => w.rarity === rarityFilter.value);
  }
  if (mainStatFilter.value) {
    list = list.filter((w) => w.mainStat === mainStatFilter.value);
  }
  if (search.value.trim()) {
    const needle = search.value.trim().toLowerCase();
    list = list.filter((w) => w.name.toLowerCase().includes(needle));
  }
  return list;
});

const weaponsSorted = computed(() => {
  const list = [...weaponsFiltered.value];
  if (sortBy.value === "name") {
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }
  if (sortBy.value === "rarity") {
    return list.sort((a, b) => b.rarity - a.rarity || a.name.localeCompare(b.name));
  }
  // "impact": the currently-equipped weapon isn't in impactByKey (comparing
  // it to itself is trivially 0), but it should still sort at its real
  // rank — 0% — not fall to the bottom with genuine failures/unknowns.
  // Only a weapon we truly have no number for (still loading, or nothing to
  // compare against) sorts after everything we do have a number for.
  const effectiveImpactPct = (row: WeaponRow): number | null => {
    if (row.key === props.currentWeapon) return 0;
    return impactByKey.value[row.key]?.fullyBuffedPct ?? null;
  };
  return list.sort((a, b) => {
    const impactA = effectiveImpactPct(a);
    const impactB = effectiveImpactPct(b);
    if (impactA == null && impactB == null) return a.name.localeCompare(b.name);
    if (impactA == null) return 1;
    if (impactB == null) return -1;
    return impactB - impactA;
  });
});

function rarityBorderClasses(rarity: number) {
  return {
    "border-amber-300": rarity === 5,
    "border-violet-600": rarity === 4,
    "border-blue-500": rarity === 3,
    "border-green-500": rarity === 2,
    "border-gray-500": rarity === 1,
  };
}

function rarityTextClasses(rarity: number) {
  return {
    "text-amber-400": rarity === 5,
    "text-violet-500": rarity === 4,
    "text-blue-400": rarity === 3,
    "text-green-500": rarity === 2,
    "text-gray-400": rarity === 1,
  };
}

function formatImpact(range: WeaponImpactRange | null | undefined): string {
  if (!range) return "";
  const sign = range.fullyBuffedDelta >= 0 ? "+" : "";
  return `${sign}${Math.round(range.fullyBuffedDelta).toLocaleString()} · ${sign}${(range.fullyBuffedPct * 100).toFixed(1)}%`;
}

function impactBadgeClasses(range: WeaponImpactRange | null | undefined) {
  if (!range) return "badge-ghost";
  return range.fullyBuffedPct >= 0 ? "badge-success" : "badge-error";
}

const enemyConfig = computed(() => {
  const data = characters.value[props.character] ?? {};
  return {
    enemyLevel: data.enemyLevel ?? 90,
    enemyResist: data.enemyResist ?? 0.1,
    enemyType: data.enemyType ?? "Calamity",
  };
});

/**
 * Computed once when the modal opens (not reactively per keystroke) — a
 * full weapon-type list can be 20-40+ entries, each needing its own
 * headless context rebuild.
 */
async function loadImpacts() {
  const candidates: WeaponSwapCandidate[] = weaponsAll.value
    .filter((w) => w.key !== props.currentWeapon)
    .map((w) => ({ weaponKey: w.key }));
  if (!candidates.length) return;
  impactsLoading.value = true;
  try {
    const results = await estimateWeaponSwapImpactBatch(
      props.character,
      characters.value,
      candidates,
      enemyConfig.value,
      inventoryEchoes.value,
    );
    const next: Record<string, WeaponImpactRange | null> = {};
    for (const [key, range] of results.entries()) {
      next[key] = range;
    }
    impactByKey.value = next;
  } finally {
    impactsLoading.value = false;
  }
}

async function triggerOpenModal() {
  await modalRef.value?.triggerOpenModal();
  void loadImpacts();
}

function triggerCloseModal() {
  modalRef.value?.triggerCloseModal();
}

defineExpose({ triggerOpenModal, triggerCloseModal });

function reset() {
  search.value = "";
  resetFilters();
}

function resetFilters() {
  rarityFilter.value = null;
  mainStatFilter.value = null;
}

function toggleRarityFilter(rarity: number) {
  rarityFilter.value = rarityFilter.value === rarity ? null : rarity;
}

function chooseWeapon(key: string) {
  emit("weapon-browser:chosen-weapon", key);
  reset();
  triggerCloseModal();
}

function openPreview(key: string) {
  if (key === props.currentWeapon) return;
  emit("weapon-browser:preview", key);
  reset();
  triggerCloseModal();
}
</script>
