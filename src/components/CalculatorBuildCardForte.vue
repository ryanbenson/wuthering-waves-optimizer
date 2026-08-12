<template>
  <div class="build-card-forte flex flex-col items-center gap-5" data-test-build-card-talents>
    <div
      v-for="col in columns"
      :key="col.key"
      class="build-card-forte__row flex flex-col items-center gap-1"
      :title="`${col.label} Lv. ${col.level}`">
      <div class="build-card-forte__icon flex items-center justify-center rounded-full overflow-hidden shrink-0">
        <img v-if="col.icon" :src="col.icon" class="w-full h-full object-cover" />
        <svg
          v-else
          viewBox="0 0 24 24"
          class="build-card-forte__icon-svg"
          fill="currentColor">
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
  icons?: {
    basic?: string;
    skill?: string;
    liberation?: string;
    forte?: string;
    intro?: string;
  };
}>();

// Top-to-bottom order matches the issue spec: normal, skill, liberation,
// forte circuit, intro.
const columns = computed(() => [
  { key: "basic", label: "Normal Attack", level: props.talents.basic ?? 10, icon: props.icons?.basic },
  { key: "skill", label: "Resonance Skill", level: props.talents.skill ?? 10, icon: props.icons?.skill },
  {
    key: "liberation",
    label: "Resonance Liberation",
    level: props.talents.liberation ?? 10,
    icon: props.icons?.liberation,
  },
  { key: "forte", label: "Forte Circuit", level: props.talents.forte ?? 10, icon: props.icons?.forte },
  { key: "intro", label: "Intro Skill", level: props.talents.intro ?? 10, icon: props.icons?.intro },
]);
</script>

<style scoped lang="scss">
.build-card-forte__icon {
  border: 1px solid oklch(var(--bc) / 0.4);
  background: rgba(0, 0, 0, 0.35);
  color: white;
  width: 3rem;
  height: 3rem;
}

.build-card-forte__icon-svg {
  width: 1.5rem;
  height: 1.5rem;
  opacity: 0.9;
}
</style>
