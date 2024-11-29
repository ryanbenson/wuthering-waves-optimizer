import { render } from "@testing-library/vue";
import "@testing-library/jest-dom";
import { test, expect } from "vitest";
import InfoView from "../../src/pages/InfoView.vue";

test("renders content", () => {
  const { getByRole } = render(InfoView);

  const heading = getByRole("heading", {
    name: /wuthering waves calculator & optimizer/i,
  });

  expect(heading).toBeInTheDocument();
});
