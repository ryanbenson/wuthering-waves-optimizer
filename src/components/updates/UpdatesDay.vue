<template>
  <article class="updates-day grid gap-x-4 gap-y-1 sm:grid-cols-[7rem_1rem_minmax(0,1fr)]" :data-test-updates-day="entry.date">
    <h3 class="font-bold text-sm text-base-content sm:text-right sm:pt-3 leading-snug">{{ entry.dateLabel }}</h3>
    <div class="updates-day__spine hidden sm:flex justify-center" aria-hidden="true">
      <span class="relative mt-4 size-3 rounded-full bg-primary ring-4 ring-base-100"></span>
    </div>
    <ul class="flex flex-col gap-2 list-none m-0 p-0 min-w-0">
      <li
        v-for="(item, index) in entry.items"
        :key="index"
        class="flex flex-col gap-1.5 bg-base-200 rounded-xl px-4 py-3 text-sm leading-relaxed">
        <span
          v-if="entry.itemDetails?.[index]?.tag"
          class="self-start text-xs font-bold px-2 py-0.5 rounded-full"
          :class="TAGS[entry.itemDetails[index].tag].classes"
          data-test-updates-tag>
          {{ TAGS[entry.itemDetails[index].tag].label }}
        </span>
        <span>{{ item }}</span>
        <GuideScreenshot
          v-if="entry.itemDetails?.[index]?.image"
          :image="entry.itemDetails[index].image"
          class="max-w-lg mt-1" />
      </li>
    </ul>
  </article>
</template>

<script setup lang="ts">
import GuideScreenshot from "../guides/GuideScreenshot.vue";
import type { UpdateEntry, UpdateTag } from "../../content/updates";

defineProps<{ entry: UpdateEntry }>();

const TAGS: Record<UpdateTag, { label: string; classes: string }> = {
  feature: { label: "New feature", classes: "bg-primary/20 text-base-content" },
  content: { label: "New content", classes: "bg-success/20 text-base-content" },
  labs: { label: "Labs", classes: "bg-accent/20 text-base-content" },
  fix: { label: "Fix", classes: "bg-warning/20 text-base-content" },
};
</script>

<style scoped>
.updates-day__spine {
  position: relative;
}
.updates-day__spine::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: -0.75rem;
  width: 2px;
  background: oklch(var(--bc) / 0.14);
}
</style>
