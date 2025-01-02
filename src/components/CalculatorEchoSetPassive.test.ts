import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, afterEach } from "vitest";
import CalculatorEchoSetPassive from "../../src/components/CalculatorEchoSetPassive.vue";
import { setActivePinia, createPinia } from "pinia";
// @ts-expect-error: TO DO: Fix the missing module definition for the store
import { useCharacterStore } from "../stores/character";

describe("CalculatorEchoSetPassive.vue", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  const defaultProps = {
    character: "testCharacter",
    details: "<p>Test details</p>",
    passiveKey: "testPassive",
    hasStacks: true,
    modifier: "attack",
    modifierValue: 10,
    minStacks: 0,
    maxStacks: 5,
    alwaysEnabled: false,
    modifiers: [],
  };

  const pinia = createPinia();
  setActivePinia(pinia);

  const characterStore = useCharacterStore();
  characterStore.setCharacterData = vi.fn();

  it("renders properly with props", () => {
    const wrapper = mount(CalculatorEchoSetPassive, {
      props: defaultProps,
      global: {
        plugins: [pinia],
      },
    });
    expect(wrapper.find(".weapon-passive").exists()).toBe(true);
    expect(wrapper.find("div").html()).toContain("<p>Test details</p>");
  });

  //   it("toggles enabled state on click", async () => {
  //     const wrapper = mount(CalculatorEchoSetPassive, {
  //       props: defaultProps,
  //       global: {
  //         plugins: [pinia],
  //       },
  //     });

  //     const characterStore = useCharacterStore(pinia);

  //     // Update the store state
  //     characterStore.characters.testCharacter = {
  //       echoSetPassives: {
  //         testPassive: {
  //           isEnabled: false,
  //         },
  //       },
  //     };
  //     wrapper.vm.toggleEnabled();
  //     await wrapper.vm.$nextTick();
  //     expect(wrapper.vm.isEnabled).toBe(true);

  //     wrapper.vm.toggleEnabled();
  //     await wrapper.vm.$nextTick();
  //     expect(wrapper.vm.isEnabled).toBe(false);
  //   });

  it("emits updated stats when enabled state changes", async () => {
    const wrapper = mount(CalculatorEchoSetPassive, {
      props: defaultProps,
      global: {
        plugins: [pinia],
      },
    });
    await wrapper.setProps({ alwaysEnabled: true });

    expect(wrapper.emitted("updated-echo-passive-stats")).toBeTruthy();
    const emittedData = wrapper.emitted("updated-echo-passive-stats")?.[0]?.[0];
    expect(emittedData).toHaveProperty("stats");
    expect(emittedData).toHaveProperty("key", "testPassive");
  });

  it("updates stacks through the Pinia store", async () => {
    const pinia = createPinia();
    const wrapper = mount(CalculatorEchoSetPassive, {
      props: defaultProps,
      global: {
        plugins: [pinia],
      },
    });

    const characterStore = useCharacterStore(pinia);

    // Update the store state
    characterStore.characters.testCharacter = {
      echoSetPassives: {
        testPassive: {
          stacks: 10,
        },
      },
    };

    await wrapper.vm.$nextTick(); // Wait for reactivity updates
    expect(wrapper.vm.stacks).toBe(10);
  });

  it("renders the stacks input when hasStacks is true", () => {
    const wrapper = mount(CalculatorEchoSetPassive, {
      props: defaultProps,
      global: {
        plugins: [pinia],
      },
    });
    expect(wrapper.find('input[type="number"]').exists()).toBe(true);
  });

  it("does not render stacks input when hasStacks is false", () => {
    const wrapper = mount(CalculatorEchoSetPassive, {
      props: { ...defaultProps, hasStacks: false },
      global: {
        plugins: [pinia],
      },
    });
    expect(wrapper.find('input[type="number"]').exists()).toBe(false);
  });

  it("stops event propagation on checkbox and number input clicks", async () => {
    const wrapper = mount(CalculatorEchoSetPassive, {
      props: defaultProps,
      global: {
        plugins: [pinia],
      },
    });
    const toggleSpy = vi.spyOn(wrapper.vm, "toggleEnabled");

    await wrapper.find(".checkbox").trigger("click");
    expect(toggleSpy).not.toHaveBeenCalled();

    await wrapper.find('input[type="number"]').trigger("click");
    expect(toggleSpy).not.toHaveBeenCalled();
  });
});
