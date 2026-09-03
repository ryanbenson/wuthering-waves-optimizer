<template>
  <div class="flex flex-col gap-4">
    <div class="bg-base-200 rounded-xl p-4">
      <div class="text-[.65rem] font-bold uppercase tracking-wider opacity-50 mb-2">
        CV
      </div>
      <span class="font-bold text-sm">CV</span>
      <span class="opacity-50 text-sm"> — Crit Value</span>
      <p class="text-sm opacity-80 mt-1">
        The amount of crit on an echo: Crit Rate × 2 + Crit DMG.
      </p>
    </div>

    <div class="bg-base-200 rounded-xl p-4 flex flex-col gap-3">
      <div>
        <div class="text-[.65rem] font-bold uppercase tracking-wider opacity-50 mb-2">
          Echo Rating &amp; Substat Score
        </div>
        <p class="text-sm opacity-80">
          RV (Roll Value) has been retired in favor of two more precise
          scores: <strong>Echo Rating</strong>, a letter grade for the echo
          on its own, and <strong>Substat Score</strong>, how good that echo
          is for one specific character. Both replace "how lucky were the
          rolls" with something that accounts for which substats actually
          matter.
        </p>
      </div>

      <div class="border-t border-base-300 pt-3">
        <div class="text-xs font-bold mb-1">How points work</div>
        <p class="text-sm opacity-80">
          Each substat rolls one of several possible values — a higher roll
          is worth more points, from 1 (worst) up to 8 (best). Most substats
          have 8 possible rolls; flat ATK and flat DEF only have 4. A fully
          revealed echo has 5 substats, so the points add up to somewhere
          between 5 (worst possible) and 40 (best possible).
        </p>
      </div>

      <div class="border-t border-base-300 pt-3">
        <div class="text-xs font-bold mb-2">Echo Rating (E to SSS)</div>
        <p class="text-sm opacity-80 mb-2">
          Shown on every echo everywhere — inventory, browsers, build cards,
          optimizer results. It's simply that point total turned into a
          grade, every substat counted equally:
        </p>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
          <div v-for="band in ECHO_RATING_GRADES" :key="band.grade" class="flex items-center gap-2">
            <span class="badge" :class="getRatingBadgeClasses(band.color)">{{ band.grade }}</span>
            <span class="opacity-70">{{ band.min }}–{{ band.max }}</span>
          </div>
        </div>
      </div>

      <div class="border-t border-base-300 pt-3">
        <div class="text-xs font-bold mb-1">Substat Score (0% to 100%)</div>
        <p class="text-sm opacity-80">
          Grades an echo for one specific character instead of on its own —
          shown wherever an echo is tied to a character, like an equipped
          echo or a build card. It uses that character's own substat
          priorities and compares the echo to that character's best possible
          echo, not just to itself — so a missing substat the character
          really wants counts against it, even if every substat it does
          have rolled perfectly. Characters without customized priorities
          weight every substat equally, same as Echo Rating.
        </p>
      </div>

      <div class="border-t border-base-300 pt-3">
        <p class="text-sm opacity-60">
          An asterisk (*) after a grade or percentage means the echo has
          fewer than 5 revealed substats — the score is provisional and will
          likely change once the rest are revealed.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDocumentTitle } from "../../composables/useDocumentTitle";
import { ECHO_RATING_GRADES } from "../../echoes/rating";
import { getRatingBadgeClasses } from "../../composables/useEchoRating";

useDocumentTitle(
  "CV & Echo Rating — Wuthering Waves Calculator & Optimizer",
  "What CV (Crit Value), Echo Rating, and Substat Score mean for Wuthering Waves echo substats.",
);
</script>
