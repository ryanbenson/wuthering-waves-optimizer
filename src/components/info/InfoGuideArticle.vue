<template>
  <div v-if="guide" class="flex flex-wrap gap-x-10 gap-y-6 items-start" data-test-guide-article>
    <nav aria-label="In this guide" class="guide-article__toc flex flex-col" data-test-guide-toc>
      <RouterLink to="/info/guides" class="link link-primary font-semibold pb-3 no-underline" data-test-guide-all>
        All guides
      </RouterLink>
      <RouterLink
        v-for="section in guide.sections"
        :key="section.id"
        :to="{ hash: `#${section.id}` }"
        class="flex items-center min-h-9 text-base-content/80 hover:text-base-content">
        {{ section.heading }}
      </RouterLink>
    </nav>
    <div class="guide-article__main flex flex-col gap-8">
      <header class="flex flex-col gap-3 max-w-3xl">
        <h1 class="text-3xl sm:text-4xl leading-tight font-extrabold text-base-content">{{ guide.title }}</h1>
        <p class="text-lg leading-relaxed">{{ guide.summary }}</p>
        <div v-if="guide.action" class="pt-1">
          <RouterLink :to="guide.action.to" class="btn btn-primary" data-test-guide-action>
            {{ guide.action.label }}
          </RouterLink>
        </div>
      </header>
      <GuideContent :sections="guide.sections" />
    </div>
  </div>
  <div v-else class="flex flex-col gap-3" data-test-guide-not-found>
    <h1 class="text-2xl font-bold">We couldn't find that guide</h1>
    <p>It may have moved. <RouterLink to="/info/guides" class="link link-primary">See all guides</RouterLink>.</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useDocumentTitle } from "../../composables/useDocumentTitle";
import { getGuide } from "../../content/guides";
import GuideContent from "../guides/GuideContent.vue";

const route = useRoute();
const guide = computed(() => getGuide(String(route.params.slug)));

useDocumentTitle(
  () => `${guide.value?.title ?? "Guides"} — Wuthering Waves Calculator & Optimizer`,
  () => guide.value?.summary ?? "Guides for the Wuthering Waves Calculator & Optimizer.",
);
</script>

<style scoped>
.guide-article__toc {
  flex: 1 1 200px;
}
.guide-article__main {
  flex: 999 1 560px;
  min-width: 0;
}
</style>
