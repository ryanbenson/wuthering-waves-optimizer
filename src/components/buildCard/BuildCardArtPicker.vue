<template>
  <fieldset class="build-card-art-picker" :data-test-build-card-art-picker="testId">
    <legend class="label-text text-xs pb-1">{{ legend }}</legend>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="option in options"
        :key="option.id"
        type="button"
        class="build-card-art-picker__tile"
        :class="{ 'is-selected': option.id === selectedId }"
        :aria-pressed="option.id === selectedId"
        :title="option.label"
        :data-test-build-card-art-option="option.id"
        @click="$emit('select', option.id)">
        <span
          v-if="option.url"
          class="build-card-art-picker__thumb"
          :class="{ 'is-blurred': option.blurred }"
          :style="{ backgroundImage: `url(${option.url})` }"></span>
        <span v-else class="build-card-art-picker__thumb build-card-art-picker__thumb--empty"></span>
        <span class="build-card-art-picker__label">{{ option.label }}</span>
      </button>
    </div>
  </fieldset>
</template>

<script setup lang="ts">
export interface BuildCardArtPickerOption {
  id: string;
  label: string;
  url: string | null;
  /** Preview the default background the way the card draws it. */
  blurred?: boolean;
}

defineProps<{
  legend: string;
  options: BuildCardArtPickerOption[];
  selectedId: string;
  testId: string;
}>();

defineEmits<{ (e: "select", id: string): void }>();
</script>

<style scoped>
.build-card-art-picker__tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 84px;
  padding: 4px;
  border-radius: 0.5rem;
  border: 2px solid transparent;
  background: oklch(var(--b2));
  cursor: pointer;
}

.build-card-art-picker__tile:hover {
  border-color: oklch(var(--bc) / 0.2);
}

.build-card-art-picker__tile.is-selected {
  border-color: oklch(var(--p));
}

.build-card-art-picker__thumb {
  display: block;
  width: 72px;
  height: 48px;
  border-radius: 0.375rem;
  background-size: cover;
  background-position: center 25%;
  overflow: hidden;
}

.build-card-art-picker__thumb.is-blurred {
  filter: blur(4px) brightness(0.7);
}

.build-card-art-picker__thumb--empty {
  background: oklch(var(--b3));
}

.build-card-art-picker__label {
  width: 100%;
  font-size: 0.7rem;
  line-height: 1.2;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
