<template>
  <div class="flex flex-col" :class="compact ? 'gap-6' : 'gap-9'">
    <section
      v-for="section in sections"
      :id="compact ? undefined : section.id"
      :key="section.id"
      class="guide-section flex flex-col"
      :class="compact ? 'gap-3' : 'gap-4'"
      :data-test-guide-section="section.id">
      <component
        :is="compact ? 'h3' : 'h2'"
        v-if="!hideHeadings"
        class="font-bold"
        :class="compact ? 'text-lg' : 'text-2xl'">
        {{ section.heading }}
      </component>
      <template v-for="(block, index) in section.blocks" :key="index">
        <p v-if="block.type === 'text'" class="leading-relaxed max-w-3xl">
          <GuideInlineText :text="block.text" />
        </p>
        <p
          v-else-if="block.type === 'note'"
          class="leading-relaxed bg-base-200 rounded-xl px-4 py-3"
          data-test-guide-note>
          <GuideInlineText :text="block.text" />
        </p>
        <ul v-else-if="block.type === 'list'" class="list-disc list-outside pl-5 flex flex-col gap-1.5 m-0 leading-relaxed">
          <li v-for="item in block.items" :key="item"><GuideInlineText :text="item" /></li>
        </ul>
        <ol v-else-if="block.type === 'steps'" class="flex flex-col gap-3 list-none m-0 p-0">
          <li v-for="(item, itemIndex) in block.items" :key="item.title" class="flex gap-3">
            <span
              class="flex items-center justify-center shrink-0 rounded-full bg-primary/15 text-primary font-extrabold"
              :class="compact ? 'size-7 text-sm' : 'size-8'">
              {{ itemIndex + 1 }}
            </span>
            <div class="flex flex-col gap-1 min-w-0 pt-0.5">
              <p class="leading-relaxed">
                <strong class="font-semibold text-base-content">{{ item.title }}{{ item.text ? "." : "" }}</strong>
                <template v-if="item.text">{{ " " }}<GuideInlineText :text="item.text" /></template>
              </p>
              <ul v-if="item.points?.length" class="list-disc list-outside pl-5 flex flex-col gap-1 m-0 leading-relaxed">
                <li v-for="point in item.points" :key="point"><GuideInlineText :text="point" /></li>
              </ul>
            </div>
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
          class="grid gap-x-7 gap-y-3 list-none m-0 p-0"
          :class="{ 'md:grid-cols-2': !compact }">
          <li v-for="(item, itemIndex) in block.items" :key="item.title" class="flex gap-3 min-w-0">
            <span
              v-if="followsMarkers(section.blocks, index)"
              class="flex items-center justify-center size-7 shrink-0 rounded-full bg-secondary text-secondary-content text-sm font-extrabold">
              {{ itemIndex + 1 }}
            </span>
            <p class="leading-relaxed min-w-0">
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

defineProps<{
  sections: GuideSection[];
  /** For narrow places (the drawer, a dialog): smaller headings, one column, no anchors. */
  compact?: boolean;
  /** For a section shown inside something that already titles it. */
  hideHeadings?: boolean;
}>();

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
