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
        <div
          class="card bg-base-100 w-full card-compact shadow-xl border border-primary my-4">
          <div class="card-body">
            <h2 class="card-title">🧪 This is a Lab feature</h2>
            <p class="mt-2">
              Since this is in beta, you may find bugs or inaccuracies. If so,
              please report them in the Discord, and provide as much information
              as possible as well as your export.
            </p>
            <div class="mt-2">
              Also, the
              <strong>following features are still in development</strong>
              :
              <ul>
                <li>Supporting rotations as a target</li>
                <li>
                  Showing the percentage difference of a loadout compared to
                  your current build.
                </li>
                <li>
                  Automatically enable echo buffs on your character profile when
                  equipping a loadout.
                </li>
                <li>
                  Performance enhancements, especially when looking through a
                  very large amount of possible loadouts.
                </li>
                <li>More to come as well!</li>
              </ul>
            </div>
          </div>
        </div>

        <p class="mt-2">
          This is a quick guide to help you understand how the optimizer works
          and to get the most out of it!
        </p>
        <div class="mt-2">
          <strong>Important to know:</strong>
          <ul>
            <li>
              The optimizer works off of your inventory of echoes. Ideally you
              pull in all of your echoes from the game into your inventory. This
              will make the optimizer more effective at giving you the best
              build.
            </li>

            <li>
              If you do not have the echo set, or main echo bonuses enabled in
              your Echoes screen, this will not automatically enable it for you.
              You'll need to enable those, otherwise you may see a difference in
              the loadout versus what the right panel says after you equip the
              loadout.
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
              You can optionally choose to tell it to have minimum stats, like
              if you need a minimum of Energy Regen for example.
            </li>
            <li>
              Click
              <strong>Optimize</strong>
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
            src="https://ryanbenson.github.io/wuthering-waves-assets/wt-info/optimizer-001.png"
            class="shadow rounded my-4 block info-image" />
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/wt-info/optimizer-002.png"
            class="shadow rounded my-4 block info-image" />
        </div>
        <p class="mt-2">
          <strong>Filling your inventory</strong>
          <br />
          There is no way as of now to automatically pull in your echoes from
          the game. You have to do it manually. The best way is to export your
          data from the WuWa bot which will give you those 5 echoes, and using
          the
          <strong>Import echoes</strong>
          feature to pull those into your inventory. You could just repeat this
          process multiple times. Or you can manually add echoes one by one.
        </p>
      </div>
    </div>
  </dialog>
</template>

<script>
export default {
  name: "CalculatorOptimizerGuide",
  methods: {
    triggerOpenModal() {
      const modalEl = document.getElementById("modal-optimizer-guide");
      modalEl.showModal();
    },
    triggerCloseModal() {
      const modalEl = document.getElementById("modal-optimizer-guide");
      modalEl.close();
    },
  },
};
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
