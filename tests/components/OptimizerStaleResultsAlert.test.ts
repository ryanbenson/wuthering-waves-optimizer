import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/vue";
import OptimizerStaleResultsAlert from "../../src/components/OptimizerStaleResultsAlert.vue";

// Issue #706
describe("OptimizerStaleResultsAlert", () => {
  it("explains the results are from before the change and emits rerun", async () => {
    const { getByRole, emitted } = render(OptimizerStaleResultsAlert);

    expect(getByRole("alert").textContent).toContain("Your setup changed since this run");
    await fireEvent.click(getByRole("button", { name: "Run again" }));
    expect(emitted().rerun).toHaveLength(1);
  });
});
