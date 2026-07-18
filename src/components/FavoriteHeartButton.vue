<template>
  <button
    type="button"
    class="favorite-heart-button"
    :class="{
      'favorite-heart-button--active': active,
      'favorite-heart-button--overlay': overlay,
      'favorite-heart-button--ghost': !overlay,
    }"
    :aria-label="active ? 'Remove from favorites' : 'Add to favorites'"
    :data-test-favorite="testId || undefined"
    v-tooltip="active ? 'Remove from favorites' : 'Add to favorites'"
    @click.stop="$emit('toggle')">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      class="favorite-heart-button__icon"
      aria-hidden="true">
      <path
        v-if="active"
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        fill="currentColor" />
      <path
        v-else
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round" />
    </svg>
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    active: boolean;
    overlay?: boolean;
    testId?: string;
  }>(),
  {
    overlay: false,
    testId: "",
  },
);

defineEmits<{
  toggle: [];
}>();
</script>

<style lang="scss" scoped>
.favorite-heart-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  cursor: pointer;
  color: currentColor;
  transition:
    color 0.15s ease,
    background-color 0.15s ease,
    transform 0.15s ease;

  &:hover {
    transform: scale(1.05);
  }

  &--overlay {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 2;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 9999px;
    background: rgba(0, 0, 0, 0.65);
    color: #fff;

    &.favorite-heart-button--active {
      color: #f472b6;
      background: rgba(0, 0, 0, 0.8);
    }
  }

  &--ghost {
    width: 2rem;
    height: 2rem;
    border-radius: 0.5rem;
    background: transparent;

    &.favorite-heart-button--active {
      color: #f472b6;
    }
  }

  &__icon {
    width: 1rem;
    height: 1rem;
  }
}
</style>
