<template>
  <ToastLayer :visible="toasts.length > 0">
    <div class="toast toast-top toast-end">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['alert shadow-lg', toastAlertClasses[toast.variant]]">
        <span>{{ toast.message }}</span>
        <button
          type="button"
          class="btn btn-sm btn-circle btn-ghost"
          aria-label="Dismiss"
          @click="dismissToast(toast.id)">
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
import { toastAlertClasses, useToast } from "../composables/useToast";
import ToastLayer from "./ToastLayer.vue";

const { toasts, dismissToast } = useToast();
</script>
