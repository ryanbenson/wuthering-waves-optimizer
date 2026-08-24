<template>
  <dialog id="modal-echo-rating-guide" class="modal">
    <form method="dialog" class="modal-backdrop" @click="handleClose">
      <button>close</button>
    </form>
    <div class="modal-box max-w-5xl">
      <form method="dialog" @click="handleClose">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
      </form>
      <div class="py-4">
        <h1 class="text-2xl">Echo Rating Guide</h1>
        <p class="mt-2">
          Every echo with revealed substats gets a quality score. This guide
          explains what the scores mean and how they're calculated.
        </p>

        <h1 class="text-lg mt-4">How points work</h1>
        <p class="mt-2">
          Each substat can roll one of several possible values. A higher roll
          is worth more points, from 1 (the worst possible roll) up to 8 (the
          best). Most substats have 8 possible rolls. Two of them, flat ATK
          and flat DEF, only have 4 possible rolls.
        </p>
        <p class="mt-2">
          A fully revealed echo has 5 substats. Adding up the points from all
          5 gives a total between 5 (worst possible) and 40 (best possible).
        </p>

        <h1 class="text-lg mt-4">Echo Rating (E to SSS)</h1>
        <p class="mt-2">
          This is the letter grade shown on every echo, everywhere: the
          inventory, echo browsers, build cards, and optimizer results. It's
          simply that point total turned into a grade:
        </p>
        <div class="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
          <div v-for="band in ECHO_RATING_GRADES" :key="band.grade" class="flex items-center gap-2">
            <span class="badge" :class="getRatingBadgeClasses(band.color)">{{ band.grade }}</span>
            <span class="opacity-70">{{ band.min }} to {{ band.max }}</span>
          </div>
        </div>
        <p class="mt-2">
          By default, every substat counts equally. Click
          <strong>Customize Weights</strong> if you want to tell the app
          which substats matter most to you. The grade still uses this same
          E to SSS scale either way.
        </p>

        <h1 class="text-lg mt-4">Substat Score (0% to 100%)</h1>
        <p class="mt-2">
          This score is different: instead of grading the echo on its own,
          it grades how good the echo is for one specific character. You'll
          see it wherever an echo is tied to a character, like an equipped
          echo or a build card.
        </p>
        <p class="mt-2">
          It uses that character's own substat priorities, and it compares
          the echo to that character's best possible echo, not just to
          itself. So if an echo is missing a substat the character really
          wants, that counts against it, even if every substat it does have
          rolled perfectly.
        </p>

        <h2 class="text-base font-semibold mt-4">Worked example</h2>
        <p class="mt-2">
          Say a character's priorities are Crit Rate (highest), Crit DMG
          (highest), ATK% (medium), and Resonance Liberation DMG Bonus
          (lower). Here's an echo with these 5 substats:
        </p>
        <table class="table table-sm mt-2 max-w-lg">
          <thead>
            <tr>
              <th>Substat</th>
              <th>Roll</th>
              <th>Points for this character</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Crit DMG</td>
              <td>15%</td>
              <td>a decent roll, worth 3 of 8 points</td>
            </tr>
            <tr>
              <td>ATK%</td>
              <td>8.6%</td>
              <td>4 of 8 points</td>
            </tr>
            <tr>
              <td>Energy Regen</td>
              <td>10%</td>
              <td>not a priority for this character, so 0 points</td>
            </tr>
            <tr>
              <td>Resonance Liberation DMG Bonus</td>
              <td>10.9%</td>
              <td>a strong roll, worth 7 of 8 points</td>
            </tr>
            <tr>
              <td>Resonance Skill DMG Bonus</td>
              <td>11.6%</td>
              <td>not a priority for this character, so 0 points</td>
            </tr>
          </tbody>
        </table>
        <p class="mt-2">
          Notice this echo has no Crit Rate substat at all, even though it's
          this character's top priority. That's a real weakness, and the
          score reflects it: the echo only earns points on 3 of its 5
          substats, and it's being compared to this character's ideal echo,
          which would also roll well on Crit Rate. Adding it all up, this
          echo scores about 32%, a "C".
        </p>

        <h2 class="text-base font-semibold mt-4">Setting priorities</h2>
        <p class="mt-2">
          Some characters come with a starting set of priorities already
          filled in. Others start with no priorities set, so every substat
          counts equally until you customize them. Click
          <strong>Customize Weights</strong> from a character's Echoes tab
          to set that character's own priorities.
        </p>
        <p class="mt-2">
          Two substats, flat ATK and flat DEF, only have 4 possible rolls
          instead of 8. Flat HP still has all 8, just like a percent-based
          substat. The score accounts for this automatically, so a substat
          with fewer possible rolls can't outscore one with more just by
          being present.
        </p>

        <h1 class="text-lg mt-4">The asterisk (*)</h1>
        <p class="mt-2">
          An asterisk after a grade or percentage means the echo has fewer
          than 5 revealed substats. The score is provisional, and it will
          likely change as the echo levels up and reveals the rest.
        </p>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ECHO_RATING_GRADES } from "../echoes/rating";
import { getRatingBadgeClasses } from "../composables/useEchoRating";

const MODAL_ID = "modal-echo-rating-guide";

function triggerOpenModal() {
  const modalEl = document.getElementById(MODAL_ID);
  (modalEl as HTMLDialogElement | null)?.showModal();
}

function triggerCloseModal() {
  const modalEl = document.getElementById(MODAL_ID);
  (modalEl as HTMLDialogElement | null)?.close();
}

function handleClose() {
  triggerCloseModal();
}

defineExpose({ triggerOpenModal, triggerCloseModal });
</script>
