<template>
  <div class="join flex-wrap justify-center">
    <button
      type="button"
      class="join-item btn btn-sm"
      :disabled="page <= 1"
      aria-label="First page"
      @click="goToPage(1)">
      ««
    </button>
    <button
      type="button"
      class="join-item btn btn-sm"
      :disabled="page <= 1"
      aria-label="Previous page"
      @click="goToPage(page - 1)">
      «
    </button>
    <button
      v-for="pageNum in visiblePages"
      :key="pageNum"
      type="button"
      class="join-item btn btn-sm"
      :class="{ 'btn-active': pageNum === page }"
      :aria-label="`Page ${pageNum}`"
      :aria-current="pageNum === page ? 'page' : undefined"
      @click="goToPage(pageNum)">
      {{ pageNum }}
    </button>
    <button
      type="button"
      class="join-item btn btn-sm"
      :disabled="page >= totalPages"
      aria-label="Next page"
      @click="goToPage(page + 1)">
      »
    </button>
    <button
      type="button"
      class="join-item btn btn-sm"
      :disabled="page >= totalPages"
      aria-label="Last page"
      @click="goToPage(totalPages)">
      »»
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const page = defineModel<number>({ required: true });

const props = withDefaults(
  defineProps<{
    totalPages: number;
    /** Max numbered page buttons shown around the current page. */
    maxVisible?: number;
  }>(),
  { maxVisible: 5 },
);

const visiblePages = computed(() => {
  const total = Math.max(1, props.totalPages);
  const current = Math.min(Math.max(1, page.value), total);
  const maxVisible = Math.max(1, props.maxVisible);

  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  let start = Math.max(1, current - Math.floor(maxVisible / 2));
  let end = start + maxVisible - 1;
  if (end > total) {
    end = total;
    start = end - maxVisible + 1;
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

function goToPage(nextPage: number) {
  const total = Math.max(1, props.totalPages);
  page.value = Math.min(Math.max(1, nextPage), total);
}
</script>
