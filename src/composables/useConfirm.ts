import { ref } from "vue";

export type ConfirmVariant = "primary" | "error" | "warning";

export interface ConfirmRequest {
  message: string;
  title?: string;
  items?: string[];
  confirmLabel: string;
  cancelLabel: string;
  variant: ConfirmVariant;
  /** A third, destructive choice shown on the left (ask() only). */
  discardLabel?: string;
}

export interface ConfirmOptions {
  title?: string;
  items?: string[];
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  discardLabel?: string;
}

/** What ask() resolves to. Dismissing the dialog (Escape, backdrop) is "cancel". */
export type ConfirmChoice = "confirm" | "cancel" | "discard";

export const confirmButtonClasses: Record<ConfirmVariant, string> = {
  primary: "btn btn-primary",
  error: "btn btn-error",
  warning: "btn btn-warning",
};

const confirmRequest = ref<ConfirmRequest | null>(null);
let resolveFn: ((value: ConfirmChoice) => void) | null = null;

export function useConfirm() {
  /** Like confirm(), with an optional discardLabel third choice. */
  function ask(message: string, options: ConfirmOptions = {}): Promise<ConfirmChoice> {
    return new Promise((resolve) => {
      if (resolveFn) {
        resolveFn("cancel");
      }

      resolveFn = resolve;
      confirmRequest.value = {
        message,
        title: options.title,
        items: options.items,
        confirmLabel: options.confirmLabel ?? "Confirm",
        cancelLabel: options.cancelLabel ?? "Cancel",
        variant: options.variant ?? "primary",
        discardLabel: options.discardLabel,
      };
    });
  }

  async function confirm(message: string, options: ConfirmOptions = {}): Promise<boolean> {
    return (await ask(message, { ...options, discardLabel: undefined })) === "confirm";
  }

  function settle(result: boolean | "discard") {
    const resolve = resolveFn;
    resolveFn = null;
    confirmRequest.value = null;
    resolve?.(result === "discard" ? "discard" : result ? "confirm" : "cancel");
  }

  return { confirmRequest, confirm, ask, settle };
}
