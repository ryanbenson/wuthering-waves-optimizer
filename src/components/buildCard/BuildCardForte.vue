<template>
  <div class="build-card-forte flex items-start justify-between" data-test-build-card-talents>
    <div
      v-for="col in columns"
      :key="col.key"
      class="flex flex-col items-center"
      :style="{ gap: '6px' }"
      :title="`${col.label} Lv. ${col.level}`">
      <div class="build-card-forte__icon" :style="{ width: `${size}px`, height: `${size}px` }">
        <img v-if="col.icon" :src="col.icon" alt="" class="w-[80%] h-[80%] object-contain" />
        <svg v-else viewBox="0 0 24 24" class="size-1/2" fill="currentColor" aria-hidden="true">
          <path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6z" />
        </svg>
        <span class="build-card-forte__level" data-test-build-card-talent-level>{{ col.level }}</span>
      </div>
      <span v-if="showLabels" class="build-card-forte__label">{{ col.shortLabel }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { BuildCardForteIcons, BuildCardTalents } from "../../buildCard/view";

const props = withDefaults(
  defineProps<{
    talents: BuildCardTalents;
    icons?: BuildCardForteIcons;
    size?: number;
    showLabels?: boolean;
  }>(),
  { size: 52, showLabels: true },
);

// Order: normal, skill, liberation, forte circuit, intro.
const columns = computed(() => [
  { key: "basic", label: "Normal Attack", shortLabel: "Basic", level: props.talents.basic ?? 10, icon: props.icons?.basic },
  { key: "skill", label: "Resonance Skill", shortLabel: "Skill", level: props.talents.skill ?? 10, icon: props.icons?.skill },
  { key: "liberation", label: "Resonance Liberation", shortLabel: "Liberation", level: props.talents.liberation ?? 10, icon: props.icons?.liberation },
  { key: "forte", label: "Forte Circuit", shortLabel: "Forte", level: props.talents.forte ?? 10, icon: props.icons?.forte },
  { key: "intro", label: "Intro Skill", shortLabel: "Intro", level: props.talents.intro ?? 10, icon: props.icons?.intro },
]);
</script>

<style scoped>
.build-card-forte__icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  color: #fff;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.16);
}

.build-card-forte__level {
  position: absolute;
  bottom: -9px;
  left: 50%;
  transform: translateX(-50%);
  min-width: 26px;
  padding: 0 6px;
  border-radius: 999px;
  background: #0b1020;
  border: 1px solid var(--card-accent);
  color: var(--card-accent);
  font-size: 12px;
  font-weight: 800;
  line-height: 17px;
  text-align: center;
}

.build-card-forte__label {
  margin-top: 6px;
  font-size: 13px;
  color: var(--card-muted);
}
</style>
