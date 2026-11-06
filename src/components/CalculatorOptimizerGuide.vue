<template>
  <dialog id="modal-optimizer-guide" class="modal">
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
    <div class="modal-box max-w-5xl">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
      </form>
      <div class="py-4">
        <h1 class="text-2xl">Optimizer Guide</h1>
        <p class="mt-2">
          This is a quick guide to help you understand how the optimizer works
          and to get the most out of it!
        </p>
        <div class="mt-2">
          <strong>Important to know:</strong>
          <ul>
            <li>
              The optimizer works off of your inventory of echoes. So you'll
              need to pull in your echoes for this to work.
            </li>

            <li v-if="!isV3">
              If you do not have the echo set, or main echo bonuses enabled in
              your Echoes screen, this will not automatically enable it for you.
              You'll need to enable those, otherwise you may see a difference in
              the loadout versus what the right panel says after you equip the
              loadout.
              <strong>This will be supported soon.</strong>
            </li>

            <li>
              More echo sets and main echoes mean many more loadouts to check.
              <strong>If a search is slow</strong>
              try reducing how many loadouts it would process by reducing the
              sets selected, etc.
            </li>
          </ul>
        </div>
        <div class="mt-2">
          How it works is simple:
          <ul>
            <li>
              You configure your character how you normally would. Setup your
              forte, weapon, buffs, team buffs, etc.
            </li>
            <li>
              You configure your optimizer settings, so choose: echo sets, main
              echoes, and your target.
            </li>
            <li>
              Optionally, set
              <strong>minimum stats</strong>
              . Every resulting loadout must meet or exceed
              <em>all</em>
              of the values you add (for example, Energy Regen 120 and ATK
              2500). Skip this if you do not need any floors.
            </li>
            <li>
              Click
              <strong>{{ isV3 ? "Run Optimizer" : "Optimize" }}</strong>
              and it will look through all of your echoes in your inventory that
              match your criteria, and it will find all possible loadouts, then
              figure out the best loadouts given your target.
            </li>
            <li>
              It will give you the top 5 loadouts, and you can review them, and
              equip one you may want.
            </li>
          </ul>
        </div>
        <div class="optimizer-images divide">
          <h3 class="text-lg mt-4">Example:</h3>
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/wt-info/optimizer-guide-setup.png"
            alt="Configuration of optimizer"
            class="shadow rounded my-4 block info-image" />
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/wt-info/optimizer-guide-results.png"
            alt="Results from optimization"
            class="shadow rounded my-4 block info-image" />
        </div>
        <p class="mt-2">
          <strong>Filling your inventory</strong>
          <br />
          You don't have to type your echoes in. See the
          <RouterLink to="/scanners" class="link link-primary">scanners</RouterLink>
          for the four ways to pull them in from the game, or add echoes by hand
          from your inventory.
        </p>
      </div>
      <p v-if="isV3" class="mt-2">
        <RouterLink to="/info/guides/best-loadout" class="link link-primary" data-test-optimizer-guide-full>
          Read the full guide with current pictures
        </RouterLink>
      </p>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useSettingsStore } from "../stores/settings";
import { isV3UiEnabled } from "../utils/uiVersion";

defineOptions({ name: "CalculatorOptimizerGuide" });

const settingsStore = useSettingsStore() as any;
const isV3 = computed(() => isV3UiEnabled(settingsStore));

function triggerOpenModal() {
  const modalEl = document.getElementById(
    "modal-optimizer-guide",
  ) as HTMLDialogElement | null;
  modalEl?.showModal();
}

function triggerCloseModal() {
  const modalEl = document.getElementById(
    "modal-optimizer-guide",
  ) as HTMLDialogElement | null;
  modalEl?.close();
}

defineExpose({
  triggerOpenModal,
  triggerCloseModal,
});
</script>

<style lang="scss" scoped>
ul {
  display: block;
  li {
    margin-left: 1.5rem;
    list-style-type: disc;
    margin-top: 0.25rem;
  }
}
.divide {
  border-bottom: 1px dotted oklch(var(--p));
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}
.info-image {
  margin-left: auto;
  margin-right: auto;
}
</style>
