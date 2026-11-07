<template>
  <figure class="m-0 flex flex-col gap-2 min-w-0">
    <div
      class="relative overflow-hidden rounded-xl border border-base-content/10 bg-base-300"
      :style="{ aspectRatio: `${image.width} / ${image.height}` }"
      data-test-guide-screenshot>
      <!-- Dark captures on purpose: they sit in this neutral frame in every theme (ADR 0053). -->
      <img
        v-if="!failed"
        :src="guideImageUrl(image.file)"
        :alt="image.alt"
        :width="image.width"
        :height="image.height"
        :loading="eager ? 'eager' : 'lazy'"
        decoding="async"
        class="block w-full h-full"
        @error="failed = true" />
      <p v-else class="flex items-center justify-center h-full p-4 text-sm text-center" data-test-guide-screenshot-fallback>
        {{ image.alt }}
      </p>
      <span
        v-for="(marker, index) in markers"
        :key="index"
        class="absolute flex items-center justify-center size-6 sm:size-8 -ml-3 -mt-3 sm:-ml-4 sm:-mt-4 rounded-full bg-secondary text-secondary-content text-xs sm:text-sm font-extrabold ring-2 ring-base-300"
        :style="{ left: `${marker.x}%`, top: `${marker.y}%` }"
        data-test-guide-marker>
        {{ index + 1 }}
      </span>
    </div>
    <figcaption v-if="$slots.default || caption" class="text-sm leading-relaxed">
      <slot>{{ caption }}</slot>
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { guideImageUrl } from "../../content/guides/images";
import type { GuideImage, GuideImageMarker } from "../../content/guides/types";

const props = defineProps<{
  image: GuideImage;
  markers?: GuideImageMarker[];
  caption?: string;
  /** For the first image on a page, which shouldn't wait for lazy loading. */
  eager?: boolean;
}>();

// A missing file shows its description, so a page never has a broken image.
const failed = ref(false);
watch(
  () => props.image.file,
  () => {
    failed.value = false;
  },
);
</script>
