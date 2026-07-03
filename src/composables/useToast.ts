import { ref } from "vue";

export type ToastVariant = "info" | "success" | "warning" | "error";

export const toastAlertClasses: Record<ToastVariant, string> = {
  info: "alert-info",
  success: "alert-success",
  warning: "alert-warning",
  error: "alert-error",
};

export interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
  duration: number;
}

const toasts = ref<ToastItem[]>([]);
let nextId = 0;

const DEFAULT_DURATION = 4000;

export function useToast() {
  function showToast(
    message: string,
    variant: ToastVariant = "info",
    duration = DEFAULT_DURATION,
  ) {
    const id = nextId++;
    toasts.value.push({ id, message, variant, duration });

    if (duration > 0) {
      window.setTimeout(() => dismissToast(id), duration);
    }
  }

  function dismissToast(id: number) {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  }

  return { toasts, showToast, dismissToast };
}
