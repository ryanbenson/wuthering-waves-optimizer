<template>
  <div class="flex flex-col gap-10" data-test-guides-hub>
    <header class="flex flex-col gap-3 max-w-2xl">
      <h1 class="text-3xl sm:text-4xl font-extrabold text-base-content">Guides</h1>
      <label class="form-control">
        <span class="label-text pb-1.5">Search every guide</span>
        <input
          v-model="query"
          type="search"
          class="input input-bordered w-full"
          placeholder="Try &quot;Wavescan&quot; or &quot;minimum stats&quot;"
          data-test-guides-search />
      </label>
    </header>

    <section v-if="isSearching" class="flex flex-col gap-2 max-w-3xl" aria-live="polite">
      <p v-if="!results.length" class="leading-relaxed" data-test-guides-no-results>
        No guides match “{{ query.trim() }}”. Try another word, or
        <a href="https://discord.gg/pDKjxNjJWW" target="_blank" rel="noopener noreferrer" class="link link-primary">ask in the Discord</a>.
      </p>
      <RouterLink
        v-for="entry in results"
        :key="entry.to"
        :to="entry.to"
        class="guides__entry flex items-center justify-between gap-3 min-h-11 px-3 py-2 bg-base-200 border border-base-content/10 rounded-lg hover:border-primary/60 transition-colors text-base-content/80"
        data-test-guides-result>
        <span class="flex flex-col gap-0.5 min-w-0">
          <span class="font-semibold text-base-content">{{ entry.title }}</span>
          <span class="text-sm">{{ entry.summary }}</span>
        </span>
        <GuideChevron />
      </RouterLink>
    </section>

    <template v-else>
      <section class="flex flex-col gap-4">
        <h2 class="text-2xl font-bold">New here? Start with these three</h2>
        <ol class="grid gap-4 md:grid-cols-3 list-none m-0 p-0" data-test-guides-start-path>
          <li v-for="(step, index) in GUIDE_START_PATH" :key="step.to" class="min-w-0">
            <RouterLink
              :to="step.to"
              class="guides__entry flex flex-col h-full bg-base-200 text-base-content/80 rounded-2xl overflow-hidden border border-base-content/10 hover:border-primary/60 transition-colors">
              <span class="block h-40 overflow-hidden bg-base-300">
                <img
                  :src="guideImageUrl(step.image.file)"
                  :alt="step.image.alt"
                  loading="lazy"
                  decoding="async"
                  class="block w-full h-full object-cover object-left-top" />
              </span>
              <span class="flex flex-col gap-1.5 p-4">
                <span class="font-extrabold text-primary">{{ index + 1 }}</span>
                <span class="flex items-center justify-between gap-2 text-lg font-bold text-base-content">
                  {{ step.title }}
                  <GuideChevron />
                </span>
                <span class="text-sm leading-relaxed">{{ step.summary }}</span>
              </span>
            </RouterLink>
          </li>
        </ol>
      </section>

      <div class="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        <section
          v-for="category in categories"
          :key="category.id"
          class="flex flex-col gap-1.5 min-w-0"
          :data-test-guides-category="category.id">
          <h2 class="text-lg font-bold pb-1.5">{{ category.label }}</h2>
          <RouterLink
            v-for="entry in category.entries"
            :key="entry.to"
            :to="entry.to"
            class="guides__entry flex items-center justify-between gap-2 min-h-11 px-3 py-2 bg-base-200 border border-base-content/10 rounded-lg hover:border-primary/60 transition-colors font-medium text-base-content"
            data-test-guides-entry>
            {{ entry.title }}
            <GuideChevron />
          </RouterLink>
        </section>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useDocumentTitle } from "../../composables/useDocumentTitle";
import {
  GUIDE_CATEGORIES,
  GUIDE_HUB_ENTRIES,
  GUIDE_START_PATH,
  searchGuideEntries,
} from "../../content/guides";
import { guideImageUrl } from "../../content/guides/images";
import GuideChevron from "../guides/GuideChevron.vue";

useDocumentTitle(
  "Guides — Wuthering Waves Calculator & Optimizer",
  "Step-by-step guides for the Wuthering Waves Calculator & Optimizer: scan your echoes, set up a character, find your best loadout, and understand the numbers.",
);

const query = ref("");
const isSearching = computed(() => query.value.trim().length > 0);
const results = computed(() => searchGuideEntries(query.value));
const categories = GUIDE_CATEGORIES.map((category) => ({
  ...category,
  entries: GUIDE_HUB_ENTRIES.filter((entry) => entry.category === category.id),
}));
</script>

<style scoped>
/* The global a:hover colour would tint the cards' text. */
.guides__entry:hover {
  color: inherit;
}
</style>
