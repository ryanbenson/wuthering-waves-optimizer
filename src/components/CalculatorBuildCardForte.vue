<template>
  <div
    class="build-card-forte w-full flex items-end justify-between gap-2"
    data-test-build-card-talents>
    <div
      v-for="col in columns"
      :key="col.key"
      class="build-card-forte__col flex flex-col items-center flex-1 min-w-0">
      <div class="build-card-forte__stack flex flex-col items-center">
        <template v-for="n in col.minorCount" :key="n">
          <div
            class="build-card-forte__node build-card-forte__node--minor flex items-center justify-center">
            <svg viewBox="0 0 24 24" class="build-card-forte__icon" fill="currentColor">
              <path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6z" />
            </svg>
          </div>
          <div class="build-card-forte__connector"></div>
        </template>
        <div
          class="build-card-forte__node build-card-forte__node--final flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            class="build-card-forte__icon build-card-forte__icon--final -rotate-45"
            fill="currentColor">
            <path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6z" />
          </svg>
        </div>
      </div>
      <div class="build-card-forte__label text-center mt-2">
        <div class="font-bold text-sm">Lv. {{ col.level }}</div>
        <div class="text-xs opacity-70 whitespace-nowrap">{{ col.label }}</div>
      </div>
      <div v-if="col.extra" class="build-card-forte__extra flex gap-2 mt-2">
        <div
          v-for="n in 2"
          :key="n"
          class="build-card-forte__node build-card-forte__node--minor build-card-forte__node--tiny flex items-center justify-center">
          <svg viewBox="0 0 24 24" class="build-card-forte__icon build-card-forte__icon--tiny -rotate-45" fill="currentColor">
            <path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6z" />
          </svg>
        </div>
      </div>
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

const columns = computed(() => [
  {
    key: "basic",
    label: "Normal Attack",
    level: props.talents.basic ?? 10,
    minorCount: 2,
    extra: false,
  },
  {
    key: "skill",
    label: "Resonance Skill",
    level: props.talents.skill ?? 10,
    minorCount: 2,
    extra: false,
  },
  {
    key: "forte",
    label: "Forte Circuit",
    level: props.talents.forte ?? 10,
    minorCount: 2,
    extra: true,
  },
  {
    key: "liberation",
    label: "Resonance Liberation",
    level: props.talents.liberation ?? 10,
    minorCount: 2,
    extra: false,
  },
  {
    key: "intro",
    label: "Intro Skill",
    level: props.talents.intro ?? 10,
    minorCount: 2,
    extra: false,
  },
]);
</script>

<style scoped lang="scss">
.build-card-forte__node {
  border-radius: 9999px;
  border: 1px solid oklch(var(--bc) / 0.35);
  background: oklch(var(--b2));
  width: 2.1rem;
  height: 2.1rem;
  flex: 0 0 auto;
}

.build-card-forte__node--minor {
  opacity: 0.85;
}

.build-card-forte__node--final {
  border-radius: 0.4rem;
  transform: rotate(45deg);
  width: 3.4rem;
  height: 3.4rem;
  border-color: oklch(var(--p) / 0.7);
  background: oklch(var(--p) / 0.15);
  box-shadow: 0 0 10px 1px oklch(var(--p) / 0.35);
}

.build-card-forte__node--tiny {
  border-radius: 0.3rem;
  transform: rotate(45deg);
  width: 1.6rem;
  height: 1.6rem;
}

.build-card-forte__icon {
  width: 0.9rem;
  height: 0.9rem;
  opacity: 0.7;
}

.build-card-forte__icon--final {
  width: 1.4rem;
  height: 1.4rem;
  opacity: 0.9;
}

.build-card-forte__icon--tiny {
  width: 0.7rem;
  height: 0.7rem;
  opacity: 0.6;
}

.build-card-forte__connector {
  width: 2px;
  height: 0.9rem;
  background: oklch(var(--bc) / 0.25);
}
</style>
