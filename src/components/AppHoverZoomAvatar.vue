<template>
  <button
    type="button"
    class="app-hover-zoom-avatar relative overflow-hidden bg-cover bg-center rounded-full shrink-0 p-0"
    :class="{ 'app-hover-zoom-avatar--empty': !image }"
    :style="image ? { backgroundImage: `url(${image})` } : {}"
    :title="title"
    :aria-label="title"
    @click="emit('click', $event)">
    <svg
      v-if="!image"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      class="app-hover-zoom-avatar__empty-icon"
      aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
    <span class="app-hover-zoom-avatar__overlay">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        class="app-hover-zoom-avatar__icon"
        aria-hidden="true">
        <path
          d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
          fill="#FFFFFF" />
      </svg>
    </span>
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    image?: string | null;
    title?: string;
  }>(),
  { image: null, title: "Click to choose" },
);

// Forwards the real MouseEvent (not a bare emit) so a parent's
// `@click.stop`/`.prevent` modifiers — which operate on the first emitted
// argument — work the same as they would on a native element.
const emit = defineEmits<{ click: [event: MouseEvent] }>();
</script>

<style scoped lang="scss">
.app-hover-zoom-avatar {
  display: block;
  cursor: pointer;
  border-style: solid;
}

.app-hover-zoom-avatar--empty {
  background-color: oklch(var(--b2));
  border-style: dashed;
}

.app-hover-zoom-avatar__empty-icon {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 40%;
  height: 40%;
  opacity: 0.45;
}

.app-hover-zoom-avatar__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  background: rgba(0, 0, 0, 0);
  opacity: 0;
  transition:
    opacity 0.15s ease,
    background-color 0.15s ease;
}

.app-hover-zoom-avatar__icon {
  width: 32%;
  height: 32%;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.app-hover-zoom-avatar:hover .app-hover-zoom-avatar__overlay {
  opacity: 1;
  background: rgba(0, 0, 0, 0.65);
}

.app-hover-zoom-avatar:hover .app-hover-zoom-avatar__icon {
  opacity: 1;
}
</style>
