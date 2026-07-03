<template>
  <ToastLayer :visible="true">
    <div class="toast toast-top toast-end">
      <div :class="['alert shadow-lg', alertClass]">
        <span>
          <slot>{{ message }}</slot>
        </span>
        <button
          v-if="dismissible"
          type="button"
          class="btn btn-sm btn-circle btn-ghost"
          aria-label="Dismiss"
          @click="handleDismiss">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </ToastLayer>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from "vue";
import { toastAlertClasses, type ToastVariant } from "../composables/useToast";
import ToastLayer from "./ToastLayer.vue";

const props = withDefaults(
  defineProps<{
    message?: string;
    variant?: ToastVariant;
    dismissible?: boolean;
    duration?: number;
  }>(),
  {
    message: "",
    variant: "info",
    dismissible: true,
    duration: 0,
  },
);

const emit = defineEmits<{
  dismiss: [];
}>();

const alertClass = computed(() => toastAlertClasses[props.variant]);

let dismissTimer: number | undefined;

function handleDismiss() {
  if (dismissTimer) {
    window.clearTimeout(dismissTimer);
    dismissTimer = undefined;
  }
  emit("dismiss");
}

onMounted(() => {
  if (props.duration > 0) {
    dismissTimer = window.setTimeout(() => handleDismiss(), props.duration);
  }
});

onBeforeUnmount(() => {
  if (dismissTimer) {
    window.clearTimeout(dismissTimer);
  }
});
</script>
