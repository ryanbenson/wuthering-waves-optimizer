<template>
  <!-- Layout C, "Showcase": art fills the card, every stat on one panel -->
  <div class="build-card-showcase" data-test-build-card-layout="showcase">
    <div v-if="card.art.show" class="build-card__identity build-card-showcase__art">
      <CalculatorBuildCardPortraitUpload
        variant="cover"
        :character="card.characterId"
        :current-portrait="card.art.uploadUrl"
        :default-portrait-url="card.art.url"
        :transform="card.art.transform" />
    </div>
    <div class="build-card-showcase__floor"></div>
    <div class="build-card-showcase__footer">
      <BuildCardProfile :username="card.username" :uid="card.uid" />
      <div v-if="card.credits.length" class="build-card__credit mt-2">Art: {{ card.credits.join(", ") }}</div>
    </div>

    <div class="build-card-showcase__slab">
      <div class="build-card-showcase__head">
        <img v-if="card.elementIcon" :src="card.elementIcon" :alt="card.element ?? ''" class="size-10 shrink-0" />
        <div class="min-w-0">
          <h2 class="build-card__name" data-test-build-card-name>{{ card.name }}</h2>
          <div class="flex items-center gap-3 mt-2">
            <BuildCardStars :count="card.rarity" :size="16" />
            <span class="build-card__level">Lv. {{ card.level }}</span>
          </div>
        </div>
        <BuildCardResonance class="ml-4" direction="row" :nodes="card.resonance" :size="40" :gap="8" />
        <div class="flex-1"></div>
        <BuildCardScore v-if="card.score" :score="card.score" :total-cv="card.totalCv" :size="78" align="right" />
      </div>

      <div class="build-card-showcase__gear">
        <div class="w-[420px] shrink-0">
          <BuildCardWeapon v-if="card.weapon" :weapon="card.weapon" :icon-size="84" :name-size="22" />
          <div v-else class="build-card__empty">No weapon selected</div>
        </div>
        <div class="build-card-showcase__forte">
          <BuildCardForte :talents="card.talents" :icons="card.forteIcons" :size="44" :show-labels="false" />
        </div>
      </div>

      <BuildCardStatList :rows="card.statRows" :columns="3" short-labels :font-size="16" :row-padding="7" />

      <div data-test-build-card-echoes class="build-card-showcase__echoes">
        <div class="flex items-center justify-between">
          <span class="build-card-showcase__section">Echoes</span>
          <BuildCardSetPills v-if="card.sets.length" :sets="card.sets" :size="14" justify="end" />
        </div>
        <BuildCardEcho
          v-for="(echo, index) in card.echoes"
          :key="index"
          variant="row"
          v-bind="echo"
          :character-id="card.characterId" />
        <BuildCardWatermark class="self-end" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BuildCardView } from "../../buildCard/view";
import CalculatorBuildCardPortraitUpload from "../CalculatorBuildCardPortraitUpload.vue";
import BuildCardEcho from "./BuildCardEcho.vue";
import BuildCardForte from "./BuildCardForte.vue";
import BuildCardProfile from "./BuildCardProfile.vue";
import BuildCardResonance from "./BuildCardResonance.vue";
import BuildCardScore from "./BuildCardScore.vue";
import BuildCardSetPills from "./BuildCardSetPills.vue";
import BuildCardStars from "./BuildCardStars.vue";
import BuildCardStatList from "./BuildCardStatList.vue";
import BuildCardWatermark from "./BuildCardWatermark.vue";
import BuildCardWeapon from "./BuildCardWeapon.vue";

defineProps<{ card: BuildCardView }>();
</script>

<style scoped>
.build-card-showcase {
  position: absolute;
  inset: 0;
}

.build-card-showcase__art {
  position: absolute;
  left: 0;
  top: 0;
  width: 840px;
  height: 1080px;
  /* Fades the art's right edge into whatever is behind it. */
  -webkit-mask-image: linear-gradient(90deg, #000 70%, transparent 100%);
  mask-image: linear-gradient(90deg, #000 70%, transparent 100%);
}

.build-card-showcase__floor {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 820px;
  height: 300px;
  pointer-events: none;
  background: linear-gradient(0deg, rgba(6, 9, 18, 0.8), rgba(6, 9, 18, 0));
  -webkit-mask-image: linear-gradient(90deg, #000 60%, transparent 100%);
  mask-image: linear-gradient(90deg, #000 60%, transparent 100%);
}

.build-card-showcase__footer {
  position: absolute;
  left: 44px;
  bottom: 40px;
  max-width: 700px;
  pointer-events: none;
}

.build-card-showcase__slab {
  position: absolute;
  left: 812px;
  right: 32px;
  top: 32px;
  bottom: 32px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 28px 34px;
  border-radius: 24px;
  /* More opaque than the other layouts' panels: this one slab carries all
     the data over whatever image fills the card. */
  background: rgba(8, 11, 22, 0.82);
  border: 1px solid var(--card-border);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
}

.build-card-showcase__head {
  display: flex;
  align-items: center;
  gap: 18px;
}

.build-card__name {
  font-size: 54px;
  font-weight: 800;
  line-height: 0.95;
  color: #fff;
  white-space: nowrap;
}

.build-card__level {
  font-size: 16px;
  font-weight: 600;
  color: var(--card-muted);
}

.build-card-showcase__gear {
  display: flex;
  align-items: center;
  gap: 28px;
  padding: 16px 0;
  border-top: 1px solid var(--card-hair);
  border-bottom: 1px solid var(--card-hair);
}

.build-card-showcase__forte {
  flex: 1 1 auto;
  padding-left: 28px;
  border-left: 1px solid var(--card-hair);
}

.build-card-showcase__echoes {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1 1 auto;
  min-height: 0;
}

.build-card-showcase__section {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--card-muted);
}
</style>
