<template>
  <div
    class="build-card-forte flex flex-col items-center justify-between h-full py-3"
    data-test-build-card-talents>
    <div
      v-for="col in columns"
      :key="col.key"
      class="build-card-forte__row flex flex-col items-center gap-1.5"
      :title="`${col.label} Lv. ${col.level}`">
      <div class="build-card-forte__icon flex items-center justify-center rounded-lg">
        <svg viewBox="0 0 24 24" class="build-card-forte__icon-svg" fill="currentColor">
          <path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6z" />
        </svg>
      </div>
      <span class="badge badge-primary badge-sm font-bold" data-test-build-card-talent-level>
        {{ col.level }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  talents: {
    basic?: number;
    skill?: number;
    forte?: number;
    liberation?: number;
    intro?: number;
  };
}>();

// Top-to-bottom order matches the issue spec: normal, skill, liberation,
// forte circuit, intro.
const columns = computed(() => [
  { key: "basic", label: "Normal Attack", level: props.talents.basic ?? 10 },
  { key: "skill", label: "Resonance Skill", level: props.talents.skill ?? 10 },
  { key: "liberation", label: "Resonance Liberation", level: props.talents.liberation ?? 10 },
  { key: "forte", label: "Forte Circuit", level: props.talents.forte ?? 10 },
  { key: "intro", label: "Intro Skill", level: props.talents.intro ?? 10 },
]);
</script>

<style scoped lang="scss">
.build-card-forte__icon {
  border-radius: 9999px;
  border: 1px solid oklch(var(--p) / 0.7);
  background: oklch(var(--p) / 0.15);
  box-shadow: 0 0 8px 1px oklch(var(--p) / 0.3);
  width: 2.75rem;
  height: 2.75rem;
}

.build-card-forte__icon-svg {
  width: 1.5rem;
  height: 1.5rem;
  opacity: 0.9;
}
</style>
