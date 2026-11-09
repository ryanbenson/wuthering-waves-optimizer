<template>
  <div class="flex" :style="{ gap: `${Math.round(size / 6)}px`, color }" aria-hidden="true">
    <svg v-for="n in count" :key="n" viewBox="0 0 24 24" :width="size" :height="size" fill="currentColor">
      <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.86L12 17.77l-6.18 3.23L7 14.14 2 9.27l7.1-1.01z" />
    </svg>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ count: number; size?: number; color?: string }>(), {
  size: 18,
  color: "var(--card-gold)",
});
</script>
