<template>
  <div class="flex flex-col gap-9">
    <section
      v-for="section in sections"
      :id="section.id"
      :key="section.id"
      class="guide-section flex flex-col gap-4"
      :data-test-guide-section="section.id">
      <h2 class="text-2xl font-bold">{{ section.heading }}</h2>
      <template v-for="(block, index) in section.blocks" :key="index">
        <p v-if="block.type === 'text'" class="text-base leading-relaxed max-w-3xl">
          <GuideInlineText :text="block.text" />
        </p>
        <p
          v-else-if="block.type === 'note'"
          class="text-base leading-relaxed bg-base-200 rounded-xl px-4 py-3"
          data-test-guide-note>
          <GuideInlineText :text="block.text" />
        </p>
        <ol v-else-if="block.type === 'steps'" class="flex flex-col gap-3 list-none m-0 p-0">
          <li v-for="(item, itemIndex) in block.items" :key="item.title" class="flex gap-3">
            <span class="flex items-center justify-center size-8 shrink-0 rounded-full bg-primary/15 text-primary font-extrabold">
              {{ itemIndex + 1 }}
            </span>
            <p class="text-base leading-relaxed min-w-0 pt-0.5">
              <strong class="font-semibold text-base-content">{{ item.title }}.</strong>
              {{ " " }}<GuideInlineText :text="item.text" />
            </p>
          </li>
        </ol>
        <GuideScreenshot
          v-else-if="block.type === 'image'"
          :image="block.image"
          :markers="block.markers"
          :caption="block.caption" />
        <component
          :is="followsMarkers(section.blocks, index) ? 'ol' : 'ul'"
          v-else
          class="grid gap-x-7 gap-y-3 md:grid-cols-2 list-none m-0 p-0">
          <li v-for="(item, itemIndex) in block.items" :key="item.title" class="flex gap-3 min-w-0">
            <span
              v-if="followsMarkers(section.blocks, index)"
              class="flex items-center justify-center size-7 shrink-0 rounded-full bg-secondary text-secondary-content text-sm font-extrabold">
              {{ itemIndex + 1 }}
            </span>
            <p class="text-base leading-relaxed min-w-0">
              <strong class="font-semibold text-base-content">{{ item.title }}.</strong>
              {{ " " }}<GuideInlineText :text="item.text" />
            </p>
          </li>
        </component>
      </template>
    </section>
  </div>
</template>

<script setup lang="ts">
import GuideInlineText from "./GuideInlineText.vue";
import GuideScreenshot from "./GuideScreenshot.vue";
import type { GuideBlock, GuideSection } from "../../content/guides/types";

defineProps<{ sections: GuideSection[] }>();

/** A keyed list explains the numbered markers on the image right before it. */
function followsMarkers(blocks: GuideBlock[], index: number): boolean {
  const previous = blocks[index - 1];
  return previous?.type === "image" && Boolean(previous.markers?.length);
}
</script>

<style scoped>
.guide-section {
  scroll-margin-top: calc(var(--nav-h, 0px) + 1rem);
}
</style>
