<template>
  <div class="team-buffs-workspace">
    <div
      class="team-buffs-workspace__header flex flex-wrap items-center justify-between gap-4 mb-4 rounded-lg bg-base-200 p-1 pl-3">
      <h3 class="text-sm font-semibold">Team Buffs</h3>
      <button
        type="button"
        class="btn btn-sm"
        @click="handleResetAll"
        data-test-team-buffs-workspace-reset>
        Reset all
      </button>
    </div>

    <div class="bg-base-200 rounded-xl p-3 flex flex-col gap-3 mb-3">
      <div class="flex flex-wrap items-center gap-2">
        <label class="input input-bordered input-sm flex-1 min-w-[10rem] flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-3.5 opacity-50" fill="none">
            <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" stroke-width="2" />
            <path d="M20 20l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
          <input
            v-model="query"
            type="search"
            :placeholder="`Search all ${totalBuffCount} buffs…`"
            class="grow"
            data-test-team-buffs-workspace-search />
        </label>
        <label class="flex items-center gap-2 text-xs cursor-pointer shrink-0 opacity-70 hover:opacity-100">
          <input
            v-model="hideUnused"
            type="checkbox"
            class="toggle toggle-primary toggle-xs"
            data-test-team-buffs-hide-unused />
          Hide unused
        </label>
      </div>

      <div class="border-t border-base-300 pt-2">
        <div class="text-[.65rem] font-bold uppercase tracking-wider opacity-50 mb-2">Team Contribution</div>
        <div class="flex flex-wrap gap-5">
          <div v-for="tile in contributionTiles" :key="tile.label" class="flex flex-col gap-0.5">
            <span class="text-lg font-bold font-mono leading-none" data-test-team-buffs-contribution-value>{{
              tile.value
            }}</span>
            <span class="text-[.66rem] opacity-50">{{ tile.label }}</span>
          </div>
        </div>
      </div>

      <div class="border-t border-base-300 pt-2">
        <div class="text-[.65rem] font-bold uppercase tracking-wider opacity-50 mb-2">
          Active buffs
          <span class="font-mono normal-case tracking-normal opacity-70">({{ activeTrayEntries.length }})</span>
        </div>
        <p v-if="!activeTrayEntries.length" class="text-xs opacity-50">
          Nothing enabled yet — buffs you turn on below show up here.
        </p>
        <div v-else class="flex flex-wrap gap-1.5" data-test-team-buffs-active-tray>
          <div
            v-for="entry in activeTrayEntries"
            :key="entry.key"
            class="btn btn-xs btn-primary gap-1.5 h-auto max-w-full flex-wrap justify-start text-left py-1 !pr-1">
            <button type="button" class="flex flex-wrap items-center gap-1.5 min-w-0" @click="jumpTo(entry.key)">
              {{ entry.label }}
              <span v-for="c in entry.contributions" :key="c.label" class="font-mono"
                >+{{ formatPct(c.value) }} {{ c.label }}</span
              >
            </button>
            <button
              type="button"
              class="opacity-70 hover:opacity-100 shrink-0 px-1"
              :aria-label="`Remove ${entry.label}`"
              :data-test-team-buffs-tray-remove="entry.key"
              @click="disableBuff(entry.key)">
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>

    <p v-if="query && !anySearchMatch" class="text-sm opacity-50 text-center py-8">No buffs match "{{ query }}".</p>

    <!-- Teammate 1 -->
    <div class="bg-base-200 border border-base-300 rounded-xl mb-3">
      <div
        class="p-3 flex items-center gap-3"
        :class="{ 'cursor-pointer': selectedCharacter1 }"
        @click="selectedCharacter1 && (openTeam1 = !openTeam1)">
        <AppHoverZoomAvatar
          class="team-buffs-workspace__avatar shrink-0"
          :class="{
            'border-amber-300': partyMember1Rarity === 5,
            'border-violet-600': partyMember1Rarity === 4,
          }"
          :image="selectedCharacter1 ? getCharacterImage(selectedCharacter1) : null"
          :title="selectedCharacter1 ? 'Change team member' : 'Choose a team member'"
          data-test-team-buffs-slot-avatar="1"
          @click.stop="openPartyMember1Browser" />
        <span class="text-sm font-medium truncate" data-test-team-buffs-slot-name="1">{{
          partyMember1DisplayName || "None"
        }}</span>
        <span v-if="section1.length && activeCount(char1Buffs)" class="badge badge-sm badge-primary font-mono">{{
          activeCount(char1Buffs)
        }}</span>
        <button v-if="selectedCharacter1" type="button" class="btn btn-xs btn-ghost" @click.stop="clearCharacter1">
          Clear
        </button>
        <button
          v-if="selectedCharacter1"
          type="button"
          class="btn btn-xs btn-ghost btn-square ml-auto shrink-0"
          :aria-expanded="openTeam1"
          data-test-team-buffs-section="team1"
          @click.stop="openTeam1 = !openTeam1">
          <svg
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048"
            class="size-2.5 opacity-60 fill-current transition-transform"
            :class="{ 'rotate-180': openTeam1 }" aria-hidden="true">
            <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z" />
          </svg>
        </button>
      </div>

      <div
        v-if="selectedCharacter1"
        class="team-buffs-workspace__collapse"
        :class="{ 'team-buffs-workspace__collapse--open': openTeam1 }">
        <div class="team-buffs-workspace__collapse-inner">
          <p v-if="!char1Buffs.length" class="px-3 pb-3 text-xs opacity-50">
            No buffs found for {{ partyMember1DisplayName }}.
          </p>
          <div v-else class="flex flex-col gap-1 px-2 pb-2">
            <BuffRow
              v-for="def in section1"
              :key="def.key"
              :ref="(el) => setRowRef(def.key, el)"
              :def="def"
              :enabled="isBuffEnabled(def)"
              :stacks="stacksFor(def.key)"
              :refinement="refinementFor(def.key)"
              :base-attr-value="baseAttrValueFor(def.key)"
              :contribution="contributionLabel(def)"
              @toggle="toggleBuff(def)"
              @set-stacks="setStacks(def, $event)"
              @set-max-stacks="setMaxStacksFor(def)"
              @set-refinement="setRefinementFor(def, $event)"
              @set-base-attr-value="setBaseAttrValueFor(def, $event)" />
          </div>
        </div>
      </div>

      <!-- Kept outside the toggle row above: the "Use character" button
      inside this dialog is a DOM descendant of wherever this tag sits, and a
      click there bubbles like any other — nested inside the row, it would
      also trigger that row's own click-to-toggle handler right after
      picking a character, collapsing the section that click was meant to
      populate. -->
      <WorkspaceCharacterBrowser
        :character="character"
        ref="partyMemberBrowser1Ref"
        @character-browser:chosen-character="handlePartyMember1Chosen" />
    </div>

    <!-- Teammate 2 -->
    <div class="bg-base-200 border border-base-300 rounded-xl mb-3">
      <div
        class="p-3 flex items-center gap-3"
        :class="{ 'cursor-pointer': selectedCharacter2 }"
        @click="selectedCharacter2 && (openTeam2 = !openTeam2)">
        <AppHoverZoomAvatar
          class="team-buffs-workspace__avatar shrink-0"
          :class="{
            'border-amber-300': partyMember2Rarity === 5,
            'border-violet-600': partyMember2Rarity === 4,
          }"
          :image="selectedCharacter2 ? getCharacterImage(selectedCharacter2) : null"
          :title="selectedCharacter2 ? 'Change team member' : 'Choose a team member'"
          data-test-team-buffs-slot-avatar="2"
          @click.stop="openPartyMember2Browser" />
        <span class="text-sm font-medium truncate" data-test-team-buffs-slot-name="2">{{
          partyMember2DisplayName || "None"
        }}</span>
        <span v-if="section2.length && activeCount(char2Buffs)" class="badge badge-sm badge-primary font-mono">{{
          activeCount(char2Buffs)
        }}</span>
        <button v-if="selectedCharacter2" type="button" class="btn btn-xs btn-ghost" @click.stop="clearCharacter2">
          Clear
        </button>
        <button
          v-if="selectedCharacter2"
          type="button"
          class="btn btn-xs btn-ghost btn-square ml-auto shrink-0"
          :aria-expanded="openTeam2"
          data-test-team-buffs-section="team2"
          @click.stop="openTeam2 = !openTeam2">
          <svg
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048"
            class="size-2.5 opacity-60 fill-current transition-transform"
            :class="{ 'rotate-180': openTeam2 }" aria-hidden="true">
            <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z" />
          </svg>
        </button>
      </div>

      <div
        v-if="selectedCharacter2"
        class="team-buffs-workspace__collapse"
        :class="{ 'team-buffs-workspace__collapse--open': openTeam2 }">
        <div class="team-buffs-workspace__collapse-inner">
          <p v-if="!char2Buffs.length" class="px-3 pb-3 text-xs opacity-50">
            No buffs found for {{ partyMember2DisplayName }}.
          </p>
          <div v-else class="flex flex-col gap-1 px-2 pb-2">
            <BuffRow
              v-for="def in section2"
              :key="def.key"
              :ref="(el) => setRowRef(def.key, el)"
              :def="def"
              :enabled="isBuffEnabled(def)"
              :stacks="stacksFor(def.key)"
              :refinement="refinementFor(def.key)"
              :base-attr-value="baseAttrValueFor(def.key)"
              :contribution="contributionLabel(def)"
              @toggle="toggleBuff(def)"
              @set-stacks="setStacks(def, $event)"
              @set-max-stacks="setMaxStacksFor(def)"
              @set-refinement="setRefinementFor(def, $event)"
              @set-base-attr-value="setBaseAttrValueFor(def, $event)" />
          </div>
        </div>
      </div>

      <!-- Kept outside the toggle row above — see the matching comment on
      Teammate 1's browser instance. -->
      <WorkspaceCharacterBrowser
        :character="character"
        ref="partyMemberBrowser2Ref"
        @character-browser:chosen-character="handlePartyMember2Chosen" />
    </div>

    <!-- Echo Buffs -->
    <div class="bg-base-200 border border-base-300 rounded-xl mb-3 overflow-hidden">
      <button
        type="button"
        class="w-full flex items-center gap-3 p-3 text-left"
        :aria-expanded="openEcho"
        data-test-team-buffs-section="echo"
        @click="openEcho = !openEcho">
        <span class="flex-1 min-w-0 flex items-center gap-2 text-sm font-semibold">
          Echo Buffs
          <span v-if="activeCount(echoBuffList)" class="badge badge-sm badge-primary font-mono">{{
            activeCount(echoBuffList)
          }}</span>
        </span>
        <span
          v-if="activeCount(echoBuffList)"
          class="btn btn-xs btn-ghost"
          @click.stop="clearSectionBuffs(echoBuffList)">
          Clear
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048"
          class="size-2.5 shrink-0 opacity-60 fill-current transition-transform"
          :class="{ 'rotate-180': openEcho }" aria-hidden="true">
          <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z" />
        </svg>
      </button>
      <div class="team-buffs-workspace__collapse" :class="{ 'team-buffs-workspace__collapse--open': openEcho }">
        <div class="team-buffs-workspace__collapse-inner">
          <div class="flex flex-col gap-1 px-2 pb-2">
            <BuffRow
              v-for="def in sectionEcho"
              :key="def.key"
              :ref="(el) => setRowRef(def.key, el)"
              :def="def"
              :enabled="isBuffEnabled(def)"
              :stacks="stacksFor(def.key)"
              :refinement="refinementFor(def.key)"
              :base-attr-value="baseAttrValueFor(def.key)"
              :contribution="contributionLabel(def)"
              @toggle="toggleBuff(def)"
              @set-stacks="setStacks(def, $event)"
              @set-max-stacks="setMaxStacksFor(def)"
              @set-refinement="setRefinementFor(def, $event)"
              @set-base-attr-value="setBaseAttrValueFor(def, $event)" />
          </div>
        </div>
      </div>
    </div>

    <!-- Weapon Buffs -->
    <div class="bg-base-200 border border-base-300 rounded-xl mb-3 overflow-hidden">
      <button
        type="button"
        class="w-full flex items-center gap-3 p-3 text-left"
        :aria-expanded="openWeapon"
        data-test-team-buffs-section="weapon"
        @click="openWeapon = !openWeapon">
        <span class="flex-1 min-w-0 flex items-center gap-2 text-sm font-semibold">
          Weapon Buffs
          <span v-if="activeCount(weaponTeamBuffList)" class="badge badge-sm badge-primary font-mono">{{
            activeCount(weaponTeamBuffList)
          }}</span>
        </span>
        <span
          v-if="activeCount(weaponTeamBuffList)"
          class="btn btn-xs btn-ghost"
          @click.stop="clearSectionBuffs(weaponTeamBuffList)">
          Clear
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048"
          class="size-2.5 shrink-0 opacity-60 fill-current transition-transform"
          :class="{ 'rotate-180': openWeapon }" aria-hidden="true">
          <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z" />
        </svg>
      </button>
      <div class="team-buffs-workspace__collapse" :class="{ 'team-buffs-workspace__collapse--open': openWeapon }">
        <div class="team-buffs-workspace__collapse-inner">
          <div class="flex flex-col gap-1 px-2 pb-2">
            <BuffRow
              v-for="def in sectionWeapon"
              :key="def.key"
              :ref="(el) => setRowRef(def.key, el)"
              :def="def"
              :enabled="isBuffEnabled(def)"
              :stacks="stacksFor(def.key)"
              :refinement="refinementFor(def.key)"
              :base-attr-value="baseAttrValueFor(def.key)"
              :contribution="contributionLabel(def)"
              @toggle="toggleBuff(def)"
              @set-stacks="setStacks(def, $event)"
              @set-max-stacks="setMaxStacksFor(def)"
              @set-refinement="setRefinementFor(def, $event)"
              @set-base-attr-value="setBaseAttrValueFor(def, $event)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { buffsByCharacter, allEchoBuffs, allWeaponTeamBuffs } from "../buffs/index.ts";
import { allCharactersList, getCharacterRosterDisplayName } from "../characters/characters.ts";
import AppHoverZoomAvatar from "./AppHoverZoomAvatar.vue";
import WorkspaceCharacterBrowser from "./characterWorkspace/WorkspaceCharacterBrowser.vue";
import BuffRow from "./teamBuffsWorkspace/TeamBuffsWorkspaceRow.vue";
import { useCharacterStore } from "../stores/character";
import {
  resolveTeamBuffInstance,
  aggregateTeamBuffStats,
  categorizeBuffModifier,
  getModifierLabel,
  type PartyBuffModifier,
} from "../buffs/teamBuffs";
import { buffIsUsed, buffMatchesSearch } from "../buffs/buffFilters";
import { useFilterPanelOpen } from "../composables/useFilterPanelOpen";

export interface PartyBuffDef {
  key: string;
  name: string;
  details: string;
  imageUrl?: string;
  hasStacks: boolean;
  modifiers: PartyBuffModifier[];
  minStacks: number;
  maxStacks: number;
  alwaysEnabled: boolean;
  inputBase?: boolean;
  modifierBasedOn?: string | null;
  hasRefinements?: boolean;
}

interface Props {
  character: string;
}
const props = defineProps<Props>();

const emit = defineEmits<{
  "updated-team-buffs": [payload: Record<string, unknown>];
}>();

const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);
const { setCharacterData } = characterStore;

const currentCharacter = computed(
  () => characters.value[props.character] ?? ({} as Record<string, unknown>),
);

const buffsByCharacterIndex = buffsByCharacter as Record<string, PartyBuffDef[]>;
const echoBuffList = allEchoBuffs as PartyBuffDef[];
// Weapon team buffs don't carry their own `hasRefinements` field — the
// legacy page hardcodes `:has-refinements="true"` for the whole weapon
// section instead (CalculatorPartyBuffs.vue). Mirror that here rather than
// mutating the shared `allWeaponTeamBuffs` singleton in place.
const weaponTeamBuffList = (allWeaponTeamBuffs as PartyBuffDef[]).map((def) => ({
  ...def,
  hasRefinements: true,
}));

const selectedCharacter1 = computed({
  get() {
    return (
      (currentCharacter.value as { teamBuffs?: { selectedCharacter1?: string | null } })
        ?.teamBuffs?.selectedCharacter1 ?? null
    );
  },
  set(value: string | null) {
    void setCharacterData(props.character, { teamBuffs: { selectedCharacter1: value } });
  },
});

const selectedCharacter2 = computed({
  get() {
    return (
      (currentCharacter.value as { teamBuffs?: { selectedCharacter2?: string | null } })
        ?.teamBuffs?.selectedCharacter2 ?? null
    );
  },
  set(value: string | null) {
    void setCharacterData(props.character, { teamBuffs: { selectedCharacter2: value } });
  },
});

const char1Buffs = computed(() =>
  selectedCharacter1.value ? (buffsByCharacterIndex[selectedCharacter1.value] ?? []) : [],
);
const char2Buffs = computed(() =>
  selectedCharacter2.value ? (buffsByCharacterIndex[selectedCharacter2.value] ?? []) : [],
);

/**
 * `talentData` is intentionally always empty here — mirrors
 * CalculatorPartyBuffs.vue exactly (see resolveTeamBuffInstance's
 * docstring). Any `Talent`-modifier team buff always resolves against
 * level "10" as a result; that's a pre-existing quirk, preserved on
 * purpose so this workspace produces numbers identical to the legacy page.
 */
const talentData: Record<string, string> = {};

interface StoredBuffEntry {
  isEnabled?: boolean;
  stacks?: number;
  refinement?: string | number;
  baseAttrValue?: number;
}

const storedBuffsMap = computed(
  () =>
    ((currentCharacter.value as { teamBuffs?: { buffs?: Record<string, StoredBuffEntry> } })
      ?.teamBuffs?.buffs ?? {}) as Record<string, StoredBuffEntry>,
);

function buffConfig(key: string): StoredBuffEntry {
  return storedBuffsMap.value[key] ?? {};
}

function isBuffEnabled(def: PartyBuffDef): boolean {
  return def.alwaysEnabled ? true : Boolean(buffConfig(def.key).isEnabled);
}

function setBuffField(key: string, field: keyof StoredBuffEntry, value: unknown) {
  void setCharacterData(props.character, {
    teamBuffs: { buffs: { [key]: { [field]: value } } },
  });
}

// Enabled/stacks/refinement/baseAttrValue are deliberately independent —
// matching CalculatorPartyBuff.vue exactly. Checking a stacking buff does
// NOT jump its stacks to max (a user reports the stacks they actually saw
// in-game); the Max button is the explicit shortcut for that.
function toggleBuff(def: PartyBuffDef) {
  if (def.alwaysEnabled) return;
  setBuffField(def.key, "isEnabled", !isBuffEnabled(def));
}

function disableBuff(key: string) {
  setBuffField(key, "isEnabled", false);
}

function stacksFor(key: string): number {
  return buffConfig(key).stacks ?? 0;
}

function setStacks(def: PartyBuffDef, raw: string | number) {
  const v = Math.max(def.minStacks ?? 0, Math.min(def.maxStacks ?? 0, Number(raw) || 0));
  setBuffField(def.key, "stacks", v);
}

function setMaxStacksFor(def: PartyBuffDef) {
  setBuffField(def.key, "stacks", def.maxStacks);
}

function refinementFor(key: string): string {
  const r = buffConfig(key).refinement;
  return r != null ? String(r) : "1";
}

function setRefinementFor(def: PartyBuffDef, value: string) {
  setBuffField(def.key, "refinement", value);
}

function baseAttrValueFor(key: string): number {
  return buffConfig(key).baseAttrValue ?? 0;
}

function setBaseAttrValueFor(def: PartyBuffDef, raw: string | number) {
  setBuffField(def.key, "baseAttrValue", Number(raw) || 0);
}

function resolveDef(def: PartyBuffDef) {
  return resolveTeamBuffInstance(
    {
      key: def.key,
      alwaysEnabled: def.alwaysEnabled,
      hasStacks: def.hasStacks,
      hasRefinements: def.hasRefinements,
      inputBase: def.inputBase,
      modifierBasedOn: def.modifierBasedOn,
      modifiers: def.modifiers,
    },
    {
      isEnabled: isBuffEnabled(def),
      stacks: stacksFor(def.key),
      refinement: refinementFor(def.key),
      baseAttrValue: baseAttrValueFor(def.key),
    },
    props.character,
    talentData,
    storedBuffsMap.value as Record<string, { isEnabled?: boolean }>,
  );
}

const allRelevantDefs = computed(() => [
  ...char1Buffs.value,
  ...char2Buffs.value,
  ...echoBuffList,
  ...weaponTeamBuffList,
]);

const totalBuffCount = computed(() => allRelevantDefs.value.length);

const teamBuffsData = computed(() => aggregateTeamBuffStats(allRelevantDefs.value.map(resolveDef)));

watch(teamBuffsData, (data) => emit("updated-team-buffs", data), { immediate: true });
onBeforeUnmount(() => emit("updated-team-buffs", {}));

function formatPct(v: number): string {
  const p = Math.round(v * 10000) / 100;
  return `${p % 1 === 0 ? p.toFixed(0) : p.toFixed(1)}%`;
}

/**
 * A resolved buff's own numeric outputs as {label, value} pairs — a purely
 * cosmetic per-row and tray readout. Never feeds back into `teamBuffsData`
 * (the value actually passed to the calculator), so a display
 * miscategorization here can't produce a wrong damage/stat number.
 */
function resolvedContributions(def: PartyBuffDef): { label: string; value: number }[] {
  const data = resolveDef(def).data;
  return Object.entries(data)
    .filter((entry): entry is [string, number] => typeof entry[1] === "number" && entry[1] !== 0)
    .map(([key, value]) => ({ label: getModifierLabel(key), value }));
}

function resolvedTotalFor(def: PartyBuffDef): number {
  return resolvedContributions(def).reduce((sum, c) => sum + c.value, 0);
}

function contributionLabel(def: PartyBuffDef): string {
  const total = resolvedTotalFor(def);
  if (!isBuffEnabled(def) || total === 0) return "—";
  return `+${formatPct(total)}`;
}

function activeCount(defs: PartyBuffDef[]): number {
  return defs.filter(isBuffEnabled).length;
}

const contributionTiles = computed(() => {
  const buckets: Record<"atk" | "damage" | "critDMG", number> = { atk: 0, damage: 0, critDMG: 0 };
  Object.entries(teamBuffsData.value).forEach(([key, value]) => {
    if (typeof value !== "number") return;
    const category = categorizeBuffModifier(key);
    if (category === "atk" || category === "damage" || category === "critDMG") {
      buckets[category] += value;
    }
  });
  return [
    { label: "ATK", value: formatPct(buckets.atk) },
    { label: "DMG Bonus", value: formatPct(buckets.damage) },
    { label: "Crit DMG", value: formatPct(buckets.critDMG) },
    { label: "Buffs Active", value: String(allRelevantDefs.value.filter(isBuffEnabled).length) },
  ];
});

const activeTrayEntries = computed(() =>
  allRelevantDefs.value
    .filter(isBuffEnabled)
    .map((def) => ({
      key: def.key,
      label: def.name.replace(/^Sequence Node \d+: /, "").replace(/^Outro( Skill)?:\s*/, ""),
      contributions: resolvedContributions(def),
    })),
);

const hideUnused = computed({
  get() {
    return (
      (currentCharacter.value as { teamBuffs?: { hideUnused?: boolean } })?.teamBuffs?.hideUnused ?? false
    );
  },
  set(value: boolean) {
    void setCharacterData(props.character, { teamBuffs: { hideUnused: value } });
  },
});

function computeSection(defs: PartyBuffDef[], rawQuery: string): PartyBuffDef[] {
  const q = rawQuery.trim();
  return defs.filter((d) => {
    if (hideUnused.value && !buffIsUsed(d, isBuffEnabled(d))) return false;
    return buffMatchesSearch(d, q);
  });
}

const query = ref("");
const section1 = computed(() => computeSection(char1Buffs.value, query.value));
const section2 = computed(() => computeSection(char2Buffs.value, query.value));
const sectionEcho = computed(() => computeSection(echoBuffList, query.value));
const sectionWeapon = computed(() => computeSection(weaponTeamBuffList, query.value));

const anySearchMatch = computed(() => {
  if (!query.value.trim()) return true;
  return [section1.value, section2.value, sectionEcho.value, sectionWeapon.value].some(
    (s) => s.length > 0,
  );
});

const openTeam1 = useFilterPanelOpen("team-buffs-team1");
const openTeam2 = useFilterPanelOpen("team-buffs-team2");
const openEcho = useFilterPanelOpen("team-buffs-echo");
const openWeapon = useFilterPanelOpen("team-buffs-weapon");

function handleResetAll() {
  characterStore.clearAllTeamBuffs(props.character);
}

function clearSectionBuffs(defs: PartyBuffDef[]) {
  characterStore.removeTeamBuffKeys(
    props.character,
    defs.map((d) => d.key),
  );
}

const rowRefs: Record<string, { $el: HTMLElement } | HTMLElement> = {};
function setRowRef(key: string, el: unknown) {
  if (el) rowRefs[key] = el as { $el: HTMLElement } | HTMLElement;
}

async function jumpTo(key: string) {
  type Owner = { open: typeof openTeam1; defs: PartyBuffDef[] };
  let owner: Owner | null = null;
  if (char1Buffs.value.some((d) => d.key === key)) owner = { open: openTeam1, defs: char1Buffs.value };
  else if (char2Buffs.value.some((d) => d.key === key)) owner = { open: openTeam2, defs: char2Buffs.value };
  else if (echoBuffList.some((d) => d.key === key)) owner = { open: openEcho, defs: echoBuffList };
  else if (weaponTeamBuffList.some((d) => d.key === key)) owner = { open: openWeapon, defs: weaponTeamBuffList };
  if (!owner) return;

  owner.open.value = true;
  await nextTick();
  const target = rowRefs[key];
  const el = target && "$el" in target ? target.$el : target;
  el?.scrollIntoView({ behavior: "smooth", block: "center" });
}

// --- Teammate picker: clicking the avatar opens the v3
// WorkspaceCharacterBrowser modal — consistent with the icon-click pattern
// used elsewhere in v3 (weapon panel, party page, Command Bar avatar), and
// replaces the AppRichSelect dropdown this used to pair the avatar with.

const partyMemberBrowser1Ref = ref<{
  triggerOpenModal: () => void;
  triggerCloseModal: () => void;
} | null>(null);
const partyMemberBrowser2Ref = ref<{
  triggerOpenModal: () => void;
  triggerCloseModal: () => void;
} | null>(null);

const partyMember1DisplayName = computed(() =>
  selectedCharacter1.value ? getCharacterRosterDisplayName(selectedCharacter1.value) : "",
);
const partyMember2DisplayName = computed(() =>
  selectedCharacter2.value ? getCharacterRosterDisplayName(selectedCharacter2.value) : "",
);

const partyMember1Rarity = computed(() => {
  const key = selectedCharacter1.value;
  if (!key) return null;
  return allCharactersList.find((c) => c.key === key)?.rarity ?? null;
});
const partyMember2Rarity = computed(() => {
  const key = selectedCharacter2.value;
  if (!key) return null;
  return allCharactersList.find((c) => c.key === key)?.rarity ?? null;
});

function openPartyMember1Browser() {
  partyMemberBrowser1Ref.value?.triggerOpenModal();
}
function openPartyMember2Browser() {
  partyMemberBrowser2Ref.value?.triggerOpenModal();
}
function handlePartyMember1Chosen(nextCharacter: string) {
  selectedCharacter1.value = nextCharacter;
}
function handlePartyMember2Chosen(nextCharacter: string) {
  selectedCharacter2.value = nextCharacter;
}
function clearCharacter1() {
  selectedCharacter1.value = null;
}
function clearCharacter2() {
  selectedCharacter2.value = null;
}

function getCharacterImage(character: string) {
  return `https://ryanbenson.github.io/wuthering-waves-assets/images/${character}.png`;
}
</script>

<style scoped>
.team-buffs-workspace__collapse {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.2s ease;
}
.team-buffs-workspace__collapse--open {
  grid-template-rows: 1fr;
}
.team-buffs-workspace__collapse-inner {
  overflow: hidden;
  min-height: 0;
}
.team-buffs-workspace__avatar {
  position: relative;
  width: 3rem;
  height: 3rem;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  border-radius: 100%;
  border-width: 1px;
  border-style: solid;
  border-color: oklch(var(--bc) / 0.2);
}
</style>
