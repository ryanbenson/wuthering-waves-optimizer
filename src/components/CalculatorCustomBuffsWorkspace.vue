<template>
  <div class="custom-buffs-workspace">
    <div
      class="custom-buffs-workspace__header flex flex-wrap items-center justify-between gap-4 mb-4 rounded-lg bg-base-200 p-1 pl-3">
      <h3 class="text-sm font-semibold">Custom Buffs</h3>
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="btn btn-sm"
          @click="handleReset"
          data-test-custom-buffs-workspace-reset>
          Reset all
        </button>
      </div>
    </div>

    <div class="bg-base-200 rounded-xl p-3 flex flex-col gap-3 mb-3">
      <div class="flex flex-wrap items-center gap-2">
        <div class="join">
          <span class="join-item btn btn-sm btn-disabled no-animation gap-1.5 !text-base-content">
            <img
              v-if="characterElement"
              :src="getSubStatIconByType(characterElement)"
              class="size-3.5"
              alt="" />
            {{ characterElement || "No element" }}
          </span>
        </div>
        <label class="input input-bordered input-sm flex-1 min-w-[10rem] flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-3.5 opacity-50" fill="none">
            <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" stroke-width="2" />
            <path d="M20 20l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
          <input
            v-model="query"
            type="search"
            placeholder="Search all 35 buffs…"
            class="grow"
            data-test-custom-buffs-workspace-search />
        </label>
      </div>

      <div class="border-t border-base-300 pt-2">
        <div class="text-[.65rem] font-bold uppercase tracking-wider opacity-50 mb-2">
          Active overrides
          <span class="font-mono normal-case tracking-normal opacity-70">({{ activeFields.length }})</span>
        </div>
        <p v-if="!activeFields.length" class="text-xs opacity-50">
          Nothing set yet — values you enter below show up here.
        </p>
        <div v-else class="flex flex-wrap gap-1.5">
          <button
            v-for="f in activeFields"
            :key="f.key"
            type="button"
            class="btn btn-xs btn-primary gap-1.5"
            @click="jumpTo(f)">
            {{ f.trayLabel }}
            <span class="font-mono">{{ formatValue(f) }}</span>
            <span
              class="opacity-70 hover:opacity-100"
              @click.stop="setValue(f.key, 0)"
              :aria-label="`Clear ${f.trayLabel}`">
              ✕
            </span>
          </button>
        </div>
      </div>
    </div>

    <p v-if="query && !visibleSections.length" class="text-sm opacity-50 text-center py-8">
      No buffs match "{{ query }}".
    </p>

    <div
      v-for="section in visibleSections"
      :key="section.id"
      :ref="(el) => setSectionRef(section.id, el)"
      class="bg-base-200 rounded-xl mb-3 overflow-hidden">
      <button
        type="button"
        class="w-full flex items-center gap-3 p-3 text-left"
        :aria-expanded="isSectionOpen(section.id)"
        @click="toggleSection(section.id)">
        <span class="flex items-center justify-center size-7 rounded-lg bg-base-100 opacity-70 shrink-0" v-html="section.icon"></span>
        <span class="flex-1 min-w-0">
          <span class="flex items-center gap-2 text-sm font-semibold">
            {{ section.title }}
            <span v-if="section.activeCount" class="badge badge-sm badge-primary font-mono">{{ section.activeCount }}</span>
          </span>
          <span v-if="section.sub" class="block text-xs opacity-50 mt-0.5">{{ section.sub }}</span>
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048"
          class="size-2.5 shrink-0 opacity-60 fill-current transition-transform"
          :class="{ 'rotate-180': isSectionOpen(section.id) }" aria-hidden="true">
          <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z" />
        </svg>
      </button>

      <div class="custom-buffs-workspace__collapse" :class="{ 'custom-buffs-workspace__collapse--open': isSectionOpen(section.id) }">
        <div class="custom-buffs-workspace__collapse-inner">
          <div class="grid gap-1.5 sm:grid-cols-2 px-3 pb-3">
            <div
              v-for="f in section.shownFields"
              :key="f.key"
              :ref="(el) => setRowRef(f.key, el)"
              class="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors"
              :class="[
                f.isActive ? 'bg-primary/10' : 'hover:bg-base-100',
                f.dimmed ? 'opacity-50' : '',
              ]">
              <img v-if="f.icon" :src="f.icon" :class="f.iconClass" class="size-3.5 shrink-0" alt="" />
              <span v-else class="size-1.5 rounded-full shrink-0 bg-base-content/30"></span>
              <span class="flex-1 min-w-0 text-xs leading-tight">
                {{ f.label }}
                <small v-if="f.small" class="block opacity-50 text-[.65rem]">{{ f.small }}</small>
              </span>
              <span class="flex items-center gap-1 shrink-0">
                <template v-if="f.flatKey">
                  <span class="text-[.6rem] font-bold uppercase opacity-40">Flat</span>
                  <input
                    type="number"
                    :value="getValue(f.flatKey) || ''"
                    @input="setValue(f.flatKey!, ($event.target as HTMLInputElement).value)"
                    placeholder="0"
                    class="input input-xs input-bordered w-[4.5rem] text-right font-mono"
                    :data-test-custom-buff="f.flatKey" />
                  <span class="text-[.6rem] font-bold uppercase opacity-40 ml-0.5">%</span>
                </template>
                <input
                  type="number"
                  :value="getValue(f.key) || ''"
                  @input="setValue(f.key, ($event.target as HTMLInputElement).value)"
                  placeholder="0"
                  class="input input-xs input-bordered text-right font-mono"
                  :class="f.flatKey ? 'w-16' : 'w-20'"
                  :data-test-custom-buff="f.key" />
                <span v-if="!f.flatKey && f.unit" class="text-[.6rem] font-bold uppercase opacity-40">{{ f.unit }}</span>
              </span>
            </div>
          </div>

          <div v-if="section.elementAware && section.hiddenByElementCount && !query" class="px-3 pb-3 -mt-1">
            <label class="flex items-center gap-2 text-xs cursor-pointer w-fit opacity-70 hover:opacity-100">
              <input
                type="checkbox"
                class="toggle toggle-primary toggle-xs"
                :checked="revealAll.has(section.id)"
                @change="toggleReveal(section.id)" />
              Show all elements
              <span class="opacity-60">({{ section.hiddenByElementCount }} hidden — not {{ characterElement || "set" }})</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from "vue";
import { useCharacterStore } from "../stores/character";
import {
  normalizeCustomBuffs,
  type CustomBuffKey,
} from "../calculator/customBuffs";
import { getSubStatIconByType } from "../echoes/stats";
import { useFilterPanelOpen } from "../composables/useFilterPanelOpen";

interface StoreCharacterSlice {
  customBuffs?: Partial<Record<CustomBuffKey, number>>;
}

interface Props {
  character: string;
  characterElement?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "custom-buffs-updated": [data: Record<string, number>];
}>();

const characterStore = useCharacterStore();

const currentCharacter = computed((): StoreCharacterSlice => {
  const raw = characterStore.characters[props.character];
  return (raw as StoreCharacterSlice | undefined) ?? {};
});

/**
 * Coerces to a finite number, defaulting to 0 — see the identical helper
 * (and its rationale) in CalculatorCustomBuffs.vue.
 */
function toNum(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function getValue(key: CustomBuffKey): number {
  return toNum(currentCharacter.value.customBuffs?.[key] ?? 0);
}

function setValue(key: CustomBuffKey, value: unknown) {
  characterStore.setCharacterData(props.character, {
    customBuffs: { [key]: toNum(value) },
  });
}

const ELEMENTS = ["Glacio", "Fusion", "Electro", "Aero", "Spectro", "Havoc"] as const;

interface FieldDef {
  key: CustomBuffKey;
  label: string;
  unit?: "%";
  flatKey?: CustomBuffKey;
  element?: (typeof ELEMENTS)[number];
  small?: string;
  fallbackIcon?: (typeof ELEMENTS)[number];
}

interface SectionDef {
  id: string;
  title: string;
  icon: string;
  sub?: string;
  elementAware?: boolean;
  fields: FieldDef[];
}

const ICONS = {
  core: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M2 13V8.5M6 13V3M10 13V6M14 13V9.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  bolt: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8.6 1.5 3 9h3.6L6.8 14.5 13 6.5H9.2L8.6 1.5Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>',
  sword: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M2.5 13.5 9 7M11 4.5 13.5 2M9 7l2 2 3.5-3.5-2-2L9 7Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round"/><path d="M2.5 13.5 4 12" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
  element: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5.6" stroke="currentColor" stroke-width="1.4"/><circle cx="8" cy="8" r="1.6" fill="currentColor"/></svg>',
  amplify: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 1.5 9.4 6H14l-3.7 2.7L11.6 13 8 10.4 4.4 13l1.3-4.3L2 6h4.6L8 1.5Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>',
  shield: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 1.5 13.5 3.4V7.7C13.5 11 11.2 13.4 8 14.5 4.8 13.4 2.5 11 2.5 7.7V3.4L8 1.5Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M6 8.2 7.5 9.8 10.4 6.6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  infinity: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M4.6 5.6a2.6 2.6 0 1 0 0 5.2c1.5 0 2.6-1.3 3.4-2.6.8 1.3 1.9 2.6 3.4 2.6a2.6 2.6 0 1 0 0-5.2c-1.5 0-2.6 1.3-3.4 2.6-.8-1.3-1.9-2.6-3.4-2.6Z" stroke="currentColor" stroke-width="1.4"/></svg>',
};

const SECTIONS: SectionDef[] = [
  {
    id: "core",
    title: "Core Stats",
    icon: ICONS.core,
    fields: [
      { key: "ATK", label: "Attack", unit: "%", flatKey: "ATK_FLAT" },
      { key: "HP", label: "HP", unit: "%", flatKey: "HP_FLAT" },
      { key: "DEF", label: "Defense", unit: "%", flatKey: "DEF_FLAT" },
    ],
  },
  {
    id: "crit",
    title: "Crit & Support",
    icon: ICONS.bolt,
    fields: [
      { key: "CritRate", label: "Crit Rate", unit: "%" },
      { key: "CritDMG", label: "Crit DMG", unit: "%" },
      { key: "EnergyRegen", label: "Energy Regen", unit: "%" },
      { key: "HealingBonus", label: "Healing Bonus", unit: "%" },
    ],
  },
  {
    id: "dmgtype",
    title: "Damage Type Bonus",
    icon: ICONS.sword,
    fields: [
      { key: "BasicAttackDMGBonus", label: "Basic Attack DMG", unit: "%" },
      { key: "HeavyAttackDMGBonus", label: "Heavy Attack DMG", unit: "%" },
      { key: "ResonanceSkillDMGBonus", label: "Resonance Skill DMG", unit: "%" },
      { key: "ResonanceLiberationDMGBonus", label: "Resonance Liberation DMG", unit: "%" },
      { key: "EchoDMGBonus", label: "Echo DMG", unit: "%" },
      { key: "CoordinatedDMGBonus", label: "Coordinated Attack DMG", unit: "%" },
      { key: "TuneBreakDMGBonus", label: "Tune Break DMG", unit: "%" },
    ],
  },
  {
    id: "elemental",
    title: "Elemental DMG Bonus",
    icon: ICONS.element,
    elementAware: true,
    fields: ELEMENTS.map((el) => ({
      key: el as CustomBuffKey,
      label: `${el} DMG`,
      unit: "%" as const,
      element: el,
    })),
  },
  {
    id: "amplify",
    title: "Damage Amplify",
    icon: ICONS.amplify,
    elementAware: true,
    fields: [
      { key: "DamageAmplify", label: "DMG Amplify", small: "applies to all damage", unit: "%" },
      { key: "DamageAmplifyGlacioChafe", label: "Glacio Chafe Amplify", unit: "%", element: "Glacio", fallbackIcon: "Glacio" },
      { key: "DamageAmplifyFusionBurst", label: "Fusion Burst Amplify", unit: "%", element: "Fusion", fallbackIcon: "Fusion" },
      { key: "DamageAmplifyElectroFlare", label: "Electro Flare Amplify", unit: "%", element: "Electro", fallbackIcon: "Electro" },
      { key: "DamageAmplifyAeroErosion", label: "Aero Erosion Amplify", unit: "%", element: "Aero", fallbackIcon: "Aero" },
      { key: "DamageAmplifySpectroFrazzle", label: "Spectro Frazzle Amplify", unit: "%", element: "Spectro", fallbackIcon: "Spectro" },
    ],
  },
  {
    id: "debuff",
    title: "Enemy Debuffs",
    icon: ICONS.shield,
    fields: [
      { key: "ResistShred", label: "RES Shred", unit: "%" },
      { key: "ResistIgnore", label: "RES Ignore", unit: "%" },
      { key: "DefIgnore", label: "DEF Ignore", unit: "%" },
      { key: "DefReduction", label: "DEF Reduction", unit: "%" },
    ],
  },
  {
    id: "advanced",
    title: "Advanced Multipliers",
    icon: ICONS.infinity,
    fields: [
      { key: "SpecialMultiplier", label: "Vulnerability", unit: "%" },
      { key: "TotalDamage", label: "Total DMG", unit: "%" },
    ],
  },
];

/**
 * Deliberately doesn't defer to `getReadableSubStatLabel` — that map bakes
 * a "%" into the paired stats' own name (`ATK` -> "ATK%") to disambiguate
 * them from their `_FLAT` counterpart in echo-substat contexts. Here the
 * Flat/% pair already has its own visual split (see the template's `Flat`
 * / `%` input-group labels), so reusing it would double up the "%" once a
 * " (flat)"/" %" suffix is appended for the tray. Every field keeps one
 * clean, unsuffixed label as its single source of truth instead.
 */
function labelFor(f: FieldDef): string {
  return f.label;
}

function iconFor(f: FieldDef): string | undefined {
  return getSubStatIconByType(f.key) ?? (f.fallbackIcon ? getSubStatIconByType(f.fallbackIcon) : undefined);
}

const ALL_FIELDS: FieldDef[] = SECTIONS.flatMap((s) => s.fields);

const query = ref("");
const revealAll = reactive(new Set<string>());

const sectionOpenRefs = Object.fromEntries(
  SECTIONS.map((s) => [s.id, useFilterPanelOpen(`custom-buffs-${s.id}`)]),
);

function isSectionOpen(id: string): boolean {
  return sectionOpenRefs[id]?.value ?? true;
}
function toggleSection(id: string) {
  const open = sectionOpenRefs[id];
  if (open) open.value = !open.value;
}
function toggleReveal(id: string) {
  revealAll.has(id) ? revealAll.delete(id) : revealAll.add(id);
}

function matchesQuery(f: FieldDef, q: string): boolean {
  if (!q) return true;
  const hay = `${f.label} ${f.small ?? ""} ${f.key}`.toLowerCase();
  return hay.includes(q);
}

const visibleSections = computed(() => {
  const q = query.value.trim().toLowerCase();

  return SECTIONS.map((section) => {
    const activeCount = section.fields.filter(
      (f) => getValue(f.key) || (f.flatKey && getValue(f.flatKey)),
    ).length;

    let candidateFields = section.fields;
    let hiddenByElementCount = 0;
    if (section.elementAware && !revealAll.has(section.id)) {
      const relevant = section.fields.filter((f) => !f.element || f.element === props.characterElement);
      hiddenByElementCount = section.fields.length - relevant.length;
      candidateFields = relevant;
    }

    const matched = candidateFields.filter((f) => matchesQuery(f, q));
    // While searching, also surface matches hidden behind the element filter.
    const extra =
      q && section.elementAware && !revealAll.has(section.id)
        ? section.fields.filter((f) => !candidateFields.includes(f) && matchesQuery(f, q))
        : [];

    const shownFields = [...matched, ...extra].map((f) => ({
      ...f,
      label: labelFor(f),
      icon: iconFor(f),
      iconClass: f.element ? `${f.element.toLowerCase()}--active` : undefined,
      dimmed: extra.includes(f),
      isActive: !!(getValue(f.key) || (f.flatKey && getValue(f.flatKey))),
    }));

    return { ...section, activeCount, hiddenByElementCount, shownFields };
  }).filter((section) => !query.value.trim() || section.shownFields.length > 0);
});

const activeFields = computed(() => {
  const out: { key: CustomBuffKey; trayLabel: string; isPercent: boolean }[] = [];
  for (const f of ALL_FIELDS) {
    const label = labelFor(f);
    if (getValue(f.key)) out.push({ key: f.key, trayLabel: f.flatKey ? `${label} %` : label, isPercent: true });
    if (f.flatKey && getValue(f.flatKey)) out.push({ key: f.flatKey, trayLabel: `${label} (flat)`, isPercent: false });
  }
  return out;
});

function formatValue(f: { key: CustomBuffKey; isPercent: boolean }): string {
  return `${getValue(f.key)}${f.isPercent ? "%" : ""}`;
}

const sectionRefs: Record<string, HTMLElement> = {};
const rowRefs: Record<string, HTMLElement> = {};
function setSectionRef(id: string, el: unknown) {
  if (el) sectionRefs[id] = el as HTMLElement;
}
function setRowRef(key: string, el: unknown) {
  if (el) rowRefs[key] = el as HTMLElement;
}

async function jumpTo(f: { key: CustomBuffKey }) {
  const field = ALL_FIELDS.find((x) => x.key === f.key || x.flatKey === f.key);
  const section = field && SECTIONS.find((s) => s.fields.includes(field));
  if (!section) return;

  const open = sectionOpenRefs[section.id];
  if (open) open.value = true;
  if (section.elementAware && field!.element && field!.element !== props.characterElement) {
    revealAll.add(section.id);
  }
  await nextTick();
  rowRefs[f.key]?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function handleReset() {
  for (const f of ALL_FIELDS) {
    setValue(f.key, 0);
    if (f.flatKey) setValue(f.flatKey, 0);
  }
}

watch(
  () => currentCharacter.value.customBuffs,
  (raw) => {
    emit("custom-buffs-updated", normalizeCustomBuffs(raw));
  },
  { deep: true, immediate: true },
);
</script>

<style scoped>
.custom-buffs-workspace__collapse {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.2s ease;
}
.custom-buffs-workspace__collapse--open {
  grid-template-rows: 1fr;
}
.custom-buffs-workspace__collapse-inner {
  overflow: hidden;
  min-height: 0;
}
</style>
