import { ref } from "vue";

export type ConfirmVariant = "primary" | "error" | "warning";

export interface ConfirmRequest {
  message: string;
  title?: string;
  confirmLabel: string;
  cancelLabel: string;
  variant: ConfirmVariant;
}

export interface ConfirmOptions {
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
}

export const confirmButtonClasses: Record<ConfirmVariant, string> = {
  primary: "btn btn-primary",
  error: "btn btn-error",
  warning: "btn btn-warning",
};

const confirmRequest = ref<ConfirmRequest | null>(null);
let resolveFn: ((value: boolean) => void) | null = null;

export function useConfirm() {
  function confirm(message: string, options: ConfirmOptions = {}): Promise<boolean> {
    return new Promise((resolve) => {
      if (resolveFn) {
        resolveFn(false);
      }

      resolveFn = resolve;
      confirmRequest.value = {
        message,
        title: options.title,
        confirmLabel: options.confirmLabel ?? "Confirm",
        cancelLabel: options.cancelLabel ?? "Cancel",
        variant: options.variant ?? "primary",
      };
    });
  }

  function settle(result: boolean) {
    const resolve = resolveFn;
    resolveFn = null;
    confirmRequest.value = null;
    resolve?.(result);
  }

  return { confirmRequest, confirm, settle };
}
