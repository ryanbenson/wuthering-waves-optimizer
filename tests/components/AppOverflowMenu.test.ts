import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/vue";
import AppOverflowMenu from "../../src/components/AppOverflowMenu.vue";

describe("AppOverflowMenu", () => {
  it("renders the trigger with a default aria-label", () => {
    const { getByRole } = render(AppOverflowMenu);
    expect(getByRole("button", { name: "More actions" })).toBeTruthy();
  });

  it("renders a custom aria-label when provided", () => {
    const { getByRole } = render(AppOverflowMenu, {
      props: { ariaLabel: "More inventory actions" },
    });
    expect(
      getByRole("button", { name: "More inventory actions" }),
    ).toBeTruthy();
  });

  it("renders slotted menu items and fires their click handlers", async () => {
    const { getByText } = render(AppOverflowMenu, {
      slots: {
        default:
          '<li><button type="button" data-test-menu-item>Rating Guide</button></li>',
      },
    });
    const item = getByText("Rating Guide");
    expect(item).toBeTruthy();
    await fireEvent.click(item);
  });
});
