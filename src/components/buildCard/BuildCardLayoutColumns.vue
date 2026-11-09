<template>
  <!-- Layout A, "Columns": art panel | weapon, forte, stats | score + echoes -->
  <div class="build-card-columns" data-test-build-card-layout="columns">
    <div class="build-card__identity build-card-columns__art build-card-glass">
      <CalculatorBuildCardPortraitUpload
        variant="cover"
        :character="card.characterId"
        :current-portrait="card.art.uploadUrl"
        :default-portrait-url="card.art.url"
        :transform="card.art.transform" />
      <div class="build-card-columns__art-scrim"></div>
      <div class="build-card-columns__identity">
        <div class="flex items-center gap-3">
          <img v-if="card.elementIcon" :src="card.elementIcon" :alt="card.element ?? ''" class="size-9 shrink-0" />
          <h2 class="build-card__name" data-test-build-card-name>{{ card.name }}</h2>
        </div>
        <div class="flex items-center gap-3.5 mt-3">
          <BuildCardStars :count="card.rarity" />
          <span class="build-card__level">Lv. {{ card.level }}</span>
        </div>
        <BuildCardResonance class="mt-6" :nodes="card.resonance" :size="48" />
      </div>
      <div class="build-card-columns__footer">
        <BuildCardProfile :username="card.username" :uid="card.uid" />
        <div v-if="card.credits.length" class="build-card__credit">Art: {{ card.credits.join(", ") }}</div>
      </div>
    </div>

    <div class="build-card-columns__middle">
      <div class="build-card-glass p-5">
        <BuildCardWeapon v-if="card.weapon" :weapon="card.weapon" />
        <div v-else class="build-card__empty">No weapon selected</div>
      </div>
      <div class="build-card-glass px-7 pt-5 pb-6">
        <BuildCardForte :talents="card.talents" :icons="card.forteIcons" />
      </div>
      <div class="build-card-glass flex-1 min-h-0 px-5 py-1.5">
        <BuildCardStatList :rows="card.statRows" :font-size="18" :row-padding="9" />
      </div>
      <BuildCardSetPills v-if="card.sets.length" :sets="card.sets" justify="center" />
    </div>

    <div class="build-card-columns__echoes" data-test-build-card-echoes>
      <div class="build-card-glass build-card-columns__score">
        <BuildCardScore v-if="card.score" :score="card.score" :total-cv="card.totalCv" :size="72" />
        <div class="flex-1"></div>
        <BuildCardWatermark />
      </div>
      <BuildCardEcho
        v-for="(echo, index) in card.echoes"
        :key="index"
        class="flex-1 min-h-0"
        variant="card"
        v-bind="echo"
        :character-id="card.characterId" />
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
.build-card-columns {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: 540px 580px 672px;
  gap: 32px;
  padding: 32px;
}

.build-card-columns__art {
  position: relative;
  overflow: hidden;
  border-radius: 22px;
  background: #0b1020;
}

.build-card-columns__art-scrim {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(6, 9, 18, 0.6) 0%, rgba(6, 9, 18, 0) 24%, rgba(6, 9, 18, 0) 62%, rgba(6, 9, 18, 0.92) 100%);
}

.build-card-columns__identity {
  position: absolute;
  top: 28px;
  left: 30px;
  right: 30px;
  pointer-events: none;
}

.build-card-columns__footer {
  position: absolute;
  left: 30px;
  right: 30px;
  bottom: 26px;
  pointer-events: none;
}

.build-card-columns__middle {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
}

.build-card-columns__echoes {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
}

.build-card-columns__score {
  display: flex;
  align-items: center;
  padding: 12px 22px;
}

.build-card__name {
  font-size: 56px;
  font-weight: 800;
  line-height: 1;
  color: #fff;
  white-space: nowrap;
  text-shadow: 0 4px 24px rgba(0, 0, 0, 0.6);
}

.build-card__level {
  font-size: 17px;
  font-weight: 600;
  color: var(--card-ink);
}
</style>
