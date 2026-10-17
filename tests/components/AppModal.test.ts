import { describe, it, expect, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/vue";
import AppModal from "../../src/components/AppModal.vue";

function renderModal(props: Record<string, unknown> = {}) {
  return render({
    components: { AppModal },
    data: () => ({ props }),
    template: `
      <button @click="$refs.modal.triggerOpenModal()">open</button>
      <AppModal ref="modal" title="Title" data-test-my-dialog v-bind="props">
        <p>Body</p>
      </AppModal>
    `,
  });
}

const dialog = () => document.querySelector("dialog[data-test-my-dialog]") as HTMLDialogElement | null;

describe("AppModal", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    // jsdom doesn't implement <dialog>.showModal()/.close().
    HTMLDialogElement.prototype.showModal = function () {
      this.setAttribute("open", "");
    };
    HTMLDialogElement.prototype.close = function () {
      this.removeAttribute("open");
      this.dispatchEvent(new Event("close"));
    };
  });

  it("passes attributes to the <dialog> and shows the title next to the close button", async () => {
    const { getByText, getByRole } = renderModal();
    await fireEvent.click(getByText("open"));
    expect(dialog()?.hasAttribute("open")).toBe(true);
    expect(getByRole("heading", { name: "Title" }).parentElement?.contains(getByRole("button", { name: "Close" }))).toBe(true);
  });

  it("renders the body only while open by default, and always with lazy=false", async () => {
    expect(renderModal().queryByText("Body")).toBeNull();
    document.body.innerHTML = "";
    expect(renderModal({ lazy: false }).queryByText("Body")).not.toBeNull();
  });

  it("closes on a backdrop click unless closeOnBackdrop is false", async () => {
    const open = renderModal();
    await fireEvent.click(open.getByText("open"));
    await fireEvent.click(dialog()!.querySelector(".modal-backdrop")!);
    expect(dialog()?.hasAttribute("open")).toBe(false);

    document.body.innerHTML = "";
    const kept = renderModal({ closeOnBackdrop: false });
    await fireEvent.click(kept.getByText("open"));
    expect(dialog()!.querySelector(".modal-backdrop")).toBeNull();
  });

  it("is a full-screen sheet on phones unless sheet is false", async () => {
    const sheet = renderModal();
    await fireEvent.click(sheet.getByText("open"));
    expect(dialog()!.querySelector(".modal-box")!.classList.contains("app-modal__box--sheet")).toBe(true);

    document.body.innerHTML = "";
    const card = renderModal({ sheet: false });
    await fireEvent.click(card.getByText("open"));
    expect(dialog()!.querySelector(".modal-box")!.classList.contains("app-modal__box--sheet")).toBe(false);
  });
});
