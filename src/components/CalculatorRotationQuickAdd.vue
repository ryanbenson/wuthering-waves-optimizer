<template>
  <div class="rotation__quick-add mt-2" data-test-rotation-quick-add>
    <div class="rotation__quick-add__row flex gap-2 relative">
      <input
        v-model="queryValue"
        type="text"
        class="input input-bordered input-sm flex-1"
        placeholder="Type an action name, press Enter to add…"
        autocomplete="off"
        data-test-rotation-quick-add-input
        @keydown.enter.prevent="onEnter"
        @keydown.esc="queryValue = ''" />
      <button
        type="button"
        class="btn btn-sm btn-neutral"
        data-test-rotation-quick-add-paste-toggle
        @click="showPaste = !showPaste">
        {{ showPaste ? "Hide paste" : "Paste rotation" }}
      </button>
      <ul
        v-if="suggestions.length"
        class="rotation__quick-add__suggest menu bg-base-200 rounded-box shadow"
        data-test-rotation-quick-add-suggestions>
        <li v-for="s in suggestions" :key="s.key">
          <a href="#" @click.prevent="chooseSuggestion(s)">
            {{ s.label }}
            <span class="opacity-50 text-xs">{{ formatGroup(s.group) }}</span>
          </a>
        </li>
      </ul>
    </div>

    <div v-if="showPaste" class="rotation__quick-add__paste mt-3 flex flex-col gap-2" data-test-rotation-quick-add-paste>
      <label for="rotation-quick-add-paste-textarea" class="text-xs opacity-70">
        One action name per line — a trailing "x2"/"×2" sets that line's hit count.
      </label>
      <textarea
        id="rotation-quick-add-paste-textarea"
        v-model="pasteText"
        class="textarea textarea-bordered textarea-sm"
        rows="4"
        placeholder="Intro Skill&#10;Resonance Skill&#10;Heavy Attack x2"
        data-test-rotation-quick-add-textarea></textarea>
      <div v-if="pasteResults.length" class="flex flex-col gap-1">
        <div
          v-for="(line, i) in pasteResults"
          :key="i"
          class="flex items-center gap-2 text-sm"
          :data-test-rotation-quick-add-paste-line="i">
          <span
            class="badge badge-xs"
            :class="{
              'badge-success': line.status === 'matched',
              'badge-warning': line.status === 'ambiguous',
              'badge-ghost': line.status === 'unmatched',
            }"></span>
          <span class="flex-1 truncate" :title="line.raw">{{ line.raw }}</span>
          <span v-if="line.status === 'matched'" class="opacity-70 text-xs whitespace-nowrap">
            → {{ line.candidates[0].label }}
          </span>
          <select
            v-else-if="line.status === 'ambiguous'"
            v-model="resolvedByLine[i]"
            class="select select-bordered select-xs"
            :data-test-rotation-quick-add-paste-pick="i">
            <option :value="null" disabled>Pick one…</option>
            <option v-for="c in line.candidates" :key="c.key" :value="c.key">{{ c.label }}</option>
          </select>
          <span v-else class="opacity-50 text-xs whitespace-nowrap">no match — skipped</span>
        </div>
      </div>
      <button
        type="button"
        class="btn btn-primary btn-sm self-start"
        :disabled="!canAddPasted"
        data-test-rotation-quick-add-submit
        @click="addPasted">
        Add {{ pastedMatchedCount }} action{{ pastedMatchedCount === 1 ? "" : "s" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
  matchActionLines,
  rankActionMatches,
  type LineMatchResult,
  type MatchableAction,
  type MatchCandidate,
} from "../utils/actionTextMatch";

const props = defineProps<{
  actions: MatchableAction[];
}>();

const emit = defineEmits<{
  "add-actions": [payload: Array<{ key: string; type: string; count: number }>];
}>();

const GROUP_DISPLAY_LABELS: Record<string, string> = {
  basic: "Basic",
  skill: "Skill",
  forteCircuit: "Forte Circuit",
  liberation: "Liberation",
  intro: "Intro",
  outro: "Outro",
  tuneBreak: "Tune Break",
};

function formatGroup(group?: string): string {
  if (!group) return "";
  return GROUP_DISPLAY_LABELS[group] ?? group;
}

const queryValue = ref("");

const suggestions = computed<MatchCandidate[]>(() => {
  if (!queryValue.value.trim()) return [];
  return rankActionMatches(queryValue.value, props.actions)
    .filter((c) => c.score > 0.3)
    .slice(0, 6);
});

function chooseSuggestion(candidate: MatchCandidate) {
  emit("add-actions", [{ key: candidate.key, type: candidate.group ?? "basic", count: 1 }]);
  queryValue.value = "";
}

function onEnter() {
  const top = suggestions.value[0];
  if (top) {
    chooseSuggestion(top);
  }
}

const showPaste = ref(false);
const pasteText = ref("");
const resolvedByLine = ref<Record<number, string | null>>({});

const pasteResults = computed<LineMatchResult[]>(() => matchActionLines(pasteText.value, props.actions));

watch(pasteResults, () => {
  resolvedByLine.value = {};
});

type ResolvedEntry = { key: string; group?: string; count: number };

const pastedResolvedEntries = computed<ResolvedEntry[]>(() => {
  const entries: ResolvedEntry[] = [];
  pasteResults.value.forEach((line, i) => {
    if (line.status === "matched") {
      entries.push({ key: line.candidates[0].key, group: line.candidates[0].group, count: line.count });
      return;
    }
    if (line.status === "ambiguous") {
      const chosenKey = resolvedByLine.value[i];
      const chosen = chosenKey ? line.candidates.find((c) => c.key === chosenKey) : null;
      if (chosen) {
        entries.push({ key: chosen.key, group: chosen.group, count: line.count });
      }
    }
  });
  return entries;
});

const pastedMatchedCount = computed(() => pastedResolvedEntries.value.length);

const ambiguousUnresolvedCount = computed(
  () =>
    pasteResults.value.filter((line, i) => line.status === "ambiguous" && !resolvedByLine.value[i]).length,
);

const canAddPasted = computed(
  () => pastedMatchedCount.value > 0 && ambiguousUnresolvedCount.value === 0,
);

function addPasted() {
  if (!canAddPasted.value) return;
  emit(
    "add-actions",
    pastedResolvedEntries.value.map((entry) => ({ key: entry.key, type: entry.group ?? "basic", count: entry.count })),
  );
  pasteText.value = "";
  resolvedByLine.value = {};
  showPaste.value = false;
}
</script>

<style scoped lang="scss">
.rotation__quick-add__suggest {
  position: absolute;
  top: calc(100% + 0.25rem);
  left: 0;
  right: 5.5rem;
  z-index: 10;
  max-height: 14rem;
  overflow-y: auto;
}
</style>
