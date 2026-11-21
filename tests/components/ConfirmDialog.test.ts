import { describe, it, expect, beforeAll } from "vitest";
import { render, fireEvent } from "@testing-library/vue";
import { flushPromises } from "@vue/test-utils";
import ConfirmDialog from "../../src/components/ConfirmDialog.vue";
import { useConfirm } from "../../src/composables/useConfirm";

describe("ConfirmDialog", () => {
  beforeAll(() => {
    // jsdom has no <dialog> methods.
    HTMLDialogElement.prototype.showModal = function () {
      this.open = true;
    };
    HTMLDialogElement.prototype.close = function () {
      if (!this.open) return;
      this.open = false;
      this.dispatchEvent(new Event("close"));
    };
  });

  const buttons = () => [...document.querySelectorAll(".confirm-dialog .modal-action button")].map((b) => b.textContent?.trim());

  it("shows a discard choice first, on the left, when asked for one", async () => {
    render(ConfirmDialog);
    const pending = useConfirm().ask("Leave?", { discardLabel: "Discard", cancelLabel: "Cancel", confirmLabel: "Keep" });
    await flushPromises();
    expect(buttons()).toEqual(["Discard", "Cancel", "Keep"]);

    await fireEvent.click([...document.querySelectorAll(".confirm-dialog .modal-action button")][0]);
    expect(await pending).toBe("discard");
  });

  it("reads dismissing the dialog as cancel", async () => {
    render(ConfirmDialog);
    const pending = useConfirm().ask("Leave?", { discardLabel: "Discard" });
    await flushPromises();
    (document.querySelector(".confirm-dialog") as HTMLDialogElement).close();
    expect(await pending).toBe("cancel");
  });

  it("keeps confirm() as a yes / no question with two buttons", async () => {
    render(ConfirmDialog);
    const pending = useConfirm().confirm("Delete?", { confirmLabel: "Delete" });
    await flushPromises();
    expect(buttons()).toEqual(["Cancel", "Delete"]);

    await fireEvent.click([...document.querySelectorAll(".confirm-dialog .modal-action button")][1]);
    expect(await pending).toBe(true);
  });
});
