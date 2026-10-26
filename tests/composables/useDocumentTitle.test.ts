// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { defineComponent, h } from "vue";
import { mount } from "@vue/test-utils";

describe("useDocumentTitle", () => {
  async function setup() {
    document.title = "Base title";
    const meta = document.createElement("meta");
    meta.setAttribute("name", "description");
    meta.setAttribute("content", "Base description");
    document.head.appendChild(meta);
    // The base values are read when the module loads.
    const { useDocumentTitle } = await import("../../src/composables/useDocumentTitle");
    const page = (title: string) =>
      defineComponent({
        setup() {
          useDocumentTitle(title, `${title} description`);
          return () => h("div");
        },
      });
    return { page, meta };
  }

  it("puts back the site-wide title and description when the page goes away", async () => {
    const { page, meta } = await setup();
    const wrapper = mount(page("Scanners"));
    expect(document.title).toBe("Scanners");
    expect(meta.getAttribute("content")).toBe("Scanners description");

    wrapper.unmount();
    expect(document.title).toBe("Base title");
    expect(meta.getAttribute("content")).toBe("Base description");
  });

  it("leaves the next page's title alone if it's already set", async () => {
    const { page } = await setup();
    const first = mount(page("Info"));
    mount(page("Credits"));
    first.unmount();
    expect(document.title).toBe("Credits");
  });
});
