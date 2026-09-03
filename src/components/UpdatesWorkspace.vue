<template>
  <div ref="rootEl" class="updates-workspace flex flex-col gap-4">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <h1 class="text-2xl font-bold">Updates</h1>
      <div class="flex items-center gap-4">
        <button
          type="button"
          class="text-sm font-semibold text-primary flex items-center gap-1"
          data-test-updates-expand-all
          @click="expandAllSections">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="size-3"><polyline points="7 13 12 18 17 13"></polyline><polyline points="7 6 12 11 17 6"></polyline></svg>
          Expand all
        </button>
        <label class="input input-bordered input-sm flex items-center gap-2 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4 opacity-50"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search updates…"
            class="grow"
            data-test-updates-search />
        </label>
      </div>
    </div>

    <template v-if="isSearching">
      <p v-if="!monthGroups.length" class="text-sm opacity-60" data-test-updates-no-results>
        No updates match “{{ searchQuery }}”.
      </p>
      <div v-for="group in monthGroups" :key="group.key" class="flex flex-col gap-2" :data-test-updates-month="group.key">
        <div class="text-[.65rem] font-bold uppercase tracking-wider opacity-50">
          {{ group.label }}
        </div>
        <div
          v-for="entry in group.entries"
          :key="entry.date"
          class="bg-base-200 rounded-xl p-3"
          :data-test-updates-day="entry.date">
          <div class="font-semibold text-sm mb-1">{{ entry.dateLabel }}</div>
          <ul class="flex flex-col gap-0.5">
            <li v-for="(item, i) in entry.items" :key="i" class="text-sm flex gap-2">
              <span class="opacity-40 mt-1.5 shrink-0" aria-hidden="true">&bull;</span>
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
      </div>
    </template>

    <template v-else>
      <div v-for="group in recentMonths" :key="group.key" class="flex flex-col gap-2">
        <div class="text-[.65rem] font-bold uppercase tracking-wider opacity-50">
          {{ group.label }}
        </div>
        <div
          v-for="entry in group.entries"
          :key="entry.date"
          class="bg-base-200 rounded-xl p-3"
          :data-test-updates-day="entry.date">
          <div class="font-semibold text-sm mb-1">{{ entry.dateLabel }}</div>
          <ul class="flex flex-col gap-0.5">
            <li v-for="(item, i) in entry.items" :key="i" class="text-sm flex gap-2">
              <span class="opacity-40 mt-1.5 shrink-0" aria-hidden="true">&bull;</span>
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
      </div>

      <details v-if="earlierEntries.length" class="bg-base-200 rounded-xl" data-test-updates-earlier>
        <summary class="cursor-pointer p-3 flex items-center justify-between text-sm">
          <span class="opacity-70">{{ earlierLabel }}</span>
          <span class="badge badge-ghost badge-sm font-mono">{{ earlierEntries.length }} updates</span>
        </summary>
        <!-- No `display` utility on this direct child of <details> - an
             explicit `display:flex`/etc. here would out-cascade the native
             `details:not([open]) > *:not(summary) { display: none }` rule
             and leave the content visible even while collapsed. -->
        <div class="p-3 pt-0">
          <div class="flex flex-col gap-2">
            <div
              v-for="entry in earlierEntries"
              :key="entry.date"
              class="bg-base-100 rounded-lg p-3"
              :data-test-updates-day="entry.date">
              <div class="font-semibold text-sm mb-1">{{ entry.dateLabel }}</div>
              <ul class="flex flex-col gap-0.5">
                <li v-for="(item, i) in entry.items" :key="i" class="text-sm flex gap-2">
                  <span class="opacity-40 mt-1.5 shrink-0" aria-hidden="true">&bull;</span>
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </details>
    </template>
  </div>
</template>

<script setup lang="ts">
/**
 * v3.0 Updates page: full-text search + month grouping over the shared
 * changelog data (src/content/updates.ts). Deliberately does NOT do
 * per-entry category tags or "new since last visit" tracking - both were
 * considered and rejected in design review, see
 * docs/adr/0023-updates-page-search-and-grouping-redesign.md.
 *
 * Collapsed months use native <details>/<summary> so their content stays
 * in the DOM (visibility-only toggle) rather than being lazy-rendered -
 * required so nothing is lost to crawlers.
 */
import { computed, ref } from "vue";
import { updateEntries, type UpdateEntry } from "../content/updates";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface MonthGroup {
  key: string; // "YYYY-MM"
  label: string; // "August 2026"
  entries: UpdateEntry[];
}

const rootEl = ref<HTMLElement | null>(null);
const searchQuery = ref("");

const isSearching = computed(() => searchQuery.value.trim().length > 0);

const filteredEntries = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return updateEntries;
  return updateEntries.filter(
    (entry) =>
      entry.dateLabel.toLowerCase().includes(q) ||
      entry.items.some((item) => item.toLowerCase().includes(q)),
  );
});

// updateEntries is newest-first, so grouping in iteration order (a Map
// preserves insertion order) keeps monthGroups newest-first too.
const monthGroups = computed<MonthGroup[]>(() => {
  const groups = new Map<string, MonthGroup>();
  for (const entry of filteredEntries.value) {
    const key = entry.date.slice(0, 7);
    let group = groups.get(key);
    if (!group) {
      const monthIndex = Number(key.slice(5, 7)) - 1;
      const year = key.slice(0, 4);
      group = { key, label: `${MONTH_NAMES[monthIndex]} ${year}`, entries: [] };
      groups.set(key, group);
    }
    group.entries.push(entry);
  }
  return Array.from(groups.values());
});

const recentMonths = computed(() => monthGroups.value.slice(0, 2));
const earlierMonths = computed(() => monthGroups.value.slice(2));
const earlierEntries = computed(() => earlierMonths.value.flatMap((g) => g.entries));
const earlierLabel = computed(() => {
  const oldest = earlierMonths.value[earlierMonths.value.length - 1];
  return oldest ? `Earlier — back to ${oldest.label}` : "Earlier";
});

function expandAllSections() {
  rootEl.value?.querySelectorAll("details").forEach((details) => {
    details.open = true;
  });
}
</script>
