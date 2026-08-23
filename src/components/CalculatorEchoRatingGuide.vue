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
          Every echo with revealed substats gets two quality scores. This is a
          quick guide to what they mean and how to tune them.
        </p>

        <h1 class="text-lg mt-4">Roll points</h1>
        <p class="mt-2">
          Each substat can roll one of 8 possible values, worth 1 to 8 points
          depending on how high it rolled. A fully-revealed echo has 5
          substats, so an unweighted echo scores between 5 (all-minimum
          rolls) and 40 (all-maximum rolls) points.
        </p>

        <h1 class="text-lg mt-4">Echo Rating (E – SSS)</h1>
        <p class="mt-2">
          Shown on every echo everywhere — inventory, browsers, build cards,
          optimizer results. It's the point total banded into a letter grade:
        </p>
        <div class="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
          <div v-for="band in ECHO_RATING_GRADES" :key="band.grade" class="flex items-center gap-2">
            <span class="badge" :class="getRatingBadgeClasses(band.color)">{{ band.grade }}</span>
            <span class="opacity-70">{{ band.min }}–{{ band.max }}</span>
          </div>
        </div>
        <p class="mt-2">
          By default every substat counts equally. Click
          <strong>Customize Weights</strong> to weight the substats you
          personally value more heavily — the grade re-normalizes onto the
          same 5–40 scale either way, so the bands above stay meaningful.
        </p>

        <h1 class="text-lg mt-4">Substat Score (0 – 100%)</h1>
        <p class="mt-2">
          Shown wherever an echo is evaluated for a specific character
          (equipped echoes, build cards): the same roll points, but weighted
          by <strong>that character's</strong> substat priorities and
          normalized to a percentage of the best possible roll for the
          substats it actually has. A perfect roll on stats the character
          doesn't care about still scores 100% — the score only measures how
          well the echo rolled relative to what's achievable for its own
          substats.
        </p>
        <p class="mt-2">
          Characters without a customized profile use a small set of curated
          defaults where available, falling back to the same neutral profile
          as the Echo Rating otherwise. Use <strong>Customize Weights</strong>
          from a character's Echoes tab to set that character's own
          priorities.
        </p>

        <h1 class="text-lg mt-4">The asterisk (*)</h1>
        <p class="mt-2">
          An asterisk after a grade or percentage means the echo has fewer
          than 5 revealed substats — the score is provisional and will likely
          change as the echo levels up and reveals its remaining substats.
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
