import { describe, it, expect } from "vitest";
import { render } from "@testing-library/vue";
import AppBulkActionBar from "../../src/components/AppBulkActionBar.vue";

describe("AppBulkActionBar", () => {
  it("shows the selected count", () => {
    const { getByText } = render(AppBulkActionBar, {
      props: { visible: true, count: 3 },
    });
    expect(getByText("3 selected")).toBeTruthy();
  });

  it("renders nothing — and reserves no space — when not visible", () => {
    const { container } = render(AppBulkActionBar, {
      props: { visible: false, count: 0 },
    });
    expect(container.querySelector("[data-test-bulk-actions]")).toBeNull();
  });

  it("renders the bar once visible", () => {
    const { container } = render(AppBulkActionBar, {
      props: { visible: true, count: 1 },
    });
    expect(container.querySelector("[data-test-bulk-actions]")).not.toBeNull();
  });

  it("renders selection and default slot content", () => {
    const { getByText } = render(AppBulkActionBar, {
      props: { visible: true, count: 2 },
      slots: {
        selection: "<button>Select page</button>",
        default: "<button>Favorite</button>",
      },
    });
    expect(getByText("Select page")).toBeTruthy();
    expect(getByText("Favorite")).toBeTruthy();
  });
});
