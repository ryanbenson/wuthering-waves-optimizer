<template>
  <div class="flex flex-col gap-8" data-test-info-cv>
    <header class="flex flex-col gap-2 max-w-3xl">
      <h1 class="text-3xl sm:text-4xl leading-tight font-extrabold text-base-content">
        What the badges on your echoes mean
      </h1>
      <p class="text-lg leading-relaxed">
        Every echo shows a Crit Value and a grade. Click the rolls below to see
        how they move.
      </p>
    </header>

    <section class="bg-base-200 rounded-2xl p-4 sm:p-6 flex flex-col gap-5" data-test-cv-scorer>
      <h2 class="text-2xl font-bold">Try it: score an echo</h2>
      <div class="flex flex-col gap-2">
        <div
          v-for="(substat, index) in SAMPLE_ECHO_SUBSTATS"
          :key="substat.stat"
          class="grid grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[13rem_minmax(0,1fr)_4.5rem] gap-x-3 gap-y-1 items-center">
          <span class="font-medium text-base-content">{{ substat.label }}</span>
          <div class="col-span-2 row-start-2 sm:col-span-1 sm:row-start-auto grid grid-cols-8 gap-1">
            <button
              v-for="(roll, rollIndex) in getSampleEchoRolls(index)"
              :key="roll"
              type="button"
              class="h-11 rounded"
              :class="rollIndex < tiers[index] ? 'bg-primary' : 'bg-base-300 hover:bg-base-100'"
              :aria-label="`${substat.label} ${roll}%, worth ${rollIndex + 1} points`"
              :aria-pressed="tiers[index] === rollIndex + 1"
              :data-test-cv-roll="`${substat.stat}:${rollIndex + 1}`"
              @click="setTier(index, rollIndex + 1)"></button>
          </div>
          <span class="font-mono tabular-nums text-right text-base-content">{{ getSampleEchoRolls(index)[tiers[index] - 1] }}%</span>
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-3 pt-4 border-t border-base-300">
        <div class="flex flex-col gap-1">
          <span class="font-semibold">Points</span>
          <span class="font-mono tabular-nums text-4xl leading-none text-base-content" data-test-cv-points>
            {{ score.points }}<span class="text-lg"> of 40</span>
          </span>
          <span class="text-sm leading-snug">
            Each roll is worth 1 to 8. Flat ATK and flat DEF have only 4 rolls and
            are scaled to fit.
          </span>
        </div>
        <div class="flex flex-col gap-1">
          <span class="font-semibold">Echo Rating</span>
          <span class="flex items-center gap-2">
            <span class="badge badge-lg font-bold" :class="getRatingBadgeClasses(score.color)" data-test-cv-grade>
              {{ score.grade }}
            </span>
            <span class="font-mono tabular-nums text-4xl leading-none text-base-content" data-test-cv-percent>{{ score.percent }}%</span>
          </span>
          <span class="text-sm leading-snug">
            The point total as a grade, with every substat counted equally.
          </span>
        </div>
        <div class="flex flex-col gap-1">
          <span class="font-semibold">Crit Value (CV)</span>
          <span class="font-mono tabular-nums text-4xl leading-none text-base-content" data-test-cv-value>{{ formattedCv }}%</span>
          <span class="text-sm leading-snug">
            Crit Rate × 2 + Crit DMG:
            <span class="font-mono">{{ score.critRate }} × 2 + {{ score.critDamage }}</span>
          </span>
        </div>
      </div>

      <div class="flex flex-col gap-1.5">
        <div class="relative">
          <div class="flex gap-0.5 rounded-lg overflow-hidden" aria-hidden="true">
            <span
              v-for="band in ECHO_RATING_SCALE"
              :key="band.grade"
              class="flex items-center justify-center h-11 min-w-0 text-sm font-bold rounded-none"
              :class="getRatingBadgeClasses(band.color)"
              :style="{ flex: band.width }">
              {{ band.grade }}
            </span>
          </div>
          <span
            class="absolute -top-1.5 -bottom-1.5 w-1 -ml-0.5 rounded bg-base-content ring-2 ring-base-200"
            :style="{ left: `${score.scalePosition}%` }"
            aria-hidden="true"
            data-test-cv-marker></span>
        </div>
        <div class="flex gap-0.5" data-test-cv-echo-bands>
          <span
            v-for="band in ECHO_RATING_SCALE"
            :key="band.grade"
            class="min-w-0 text-xs text-center"
            :style="{ flex: band.width }">
            {{ band.min }}–{{ band.max }}
          </span>
        </div>
      </div>
    </section>

    <section class="bg-base-200 rounded-2xl p-4 sm:p-6 flex flex-col gap-5">
      <div class="flex flex-col gap-2 max-w-3xl">
        <h2 class="text-2xl font-bold">Why the same echo shows two grades</h2>
        <p class="leading-relaxed">
          This is one Lioness of Glory. In your inventory it gets an
          <strong class="text-base-content">Echo Rating</strong>, judged on its
          own. Equipped on Lupa it gets a
          <strong class="text-base-content">Substat Score</strong>, judged against
          Lupa's best possible echo using Lupa's substat priorities.
        </p>
      </div>
      <div class="grid gap-5 md:grid-cols-2">
        <GuideScreenshot :image="GUIDE_IMAGES.echoInventoryTile">
          <strong class="text-base-content">In your inventory: S 48%.</strong>
          Good rolls for any character.
        </GuideScreenshot>
        <GuideScreenshot :image="GUIDE_IMAGES.echoEquippedTile">
          <strong class="text-base-content">Equipped on Lupa: B 39%.</strong>
          It has no Crit Rate, which Lupa wants, and that counts against it.
        </GuideScreenshot>
      </div>
      <div class="flex flex-col gap-1.5">
        <h3 class="font-semibold text-base-content">Substat Score has its own, even bands</h3>
        <div class="flex gap-0.5 rounded-lg overflow-hidden" aria-hidden="true">
          <span
            v-for="band in SUBSTAT_SCORE_GRADES"
            :key="band.grade"
            class="flex-1 flex items-center justify-center h-11 min-w-0 text-sm font-bold rounded-none"
            :class="getRatingBadgeClasses(band.color)">
            {{ band.grade }}
          </span>
        </div>
        <div class="flex gap-0.5" data-test-cv-substat-bands>
          <span v-for="band in SUBSTAT_SCORE_GRADES" :key="band.grade" class="flex-1 min-w-0 text-xs text-center">
            {{ band.min }}–{{ band.max }}%
          </span>
        </div>
        <p class="leading-relaxed pt-1.5">
          That's why 48% can be an S as an Echo Rating and a B as a Substat Score.
          Characters without custom priorities weight every substat equally. You
          can change a character's priorities with
          <strong class="text-base-content">Customize Weights</strong> on their
          Echoes screen.
        </p>
      </div>
    </section>

    <section class="flex flex-wrap gap-x-8 gap-y-3 leading-relaxed">
      <p class="flex-[1_1_26rem]">
        An asterisk (*) after a grade means the echo has fewer than 5 revealed
        substats, so the score will likely change once the rest are revealed.
        These scores replaced the older RV (Roll Value), which didn't account for
        which substats matter.
      </p>
      <p class="flex-[1_1_18rem]">
        Next: <RouterLink to="/info/tuning-odds" class="link link-primary">plan your tuning odds</RouterLink>.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useDocumentTitle } from "../../composables/useDocumentTitle";
import { SUBSTAT_SCORE_GRADES } from "../../echoes/rating";
import { getRatingBadgeClasses } from "../../composables/useEchoRating";
import { GUIDE_IMAGES } from "../../content/guides/images";
import {
  ECHO_RATING_SCALE,
  SAMPLE_ECHO_SUBSTATS,
  getSampleEchoRolls,
  scoreSampleEcho,
} from "../../utils/echoScoreExplainer";
import GuideScreenshot from "../guides/GuideScreenshot.vue";

useDocumentTitle(
  "CV & Echo Rating — Wuthering Waves Calculator & Optimizer",
  "What CV (Crit Value), Echo Rating, and Substat Score mean for Wuthering Waves echo substats.",
);

const tiers = ref([4, 6, 5, 3, 4]);
const score = computed(() => scoreSampleEcho(tiers.value));
const formattedCv = computed(() => Number(score.value.critValue.toFixed(1)));

function setTier(index: number, tier: number) {
  tiers.value = tiers.value.map((current, i) => (i === index ? tier : current));
}
</script>
