<template>
  <!-- Layout B, "Hero": big art on the left, stats panel top-right, echo columns below -->
  <div class="build-card-hero" data-test-build-card-layout="hero">
    <div v-if="card.art.show" class="build-card__identity build-card-hero__art">
      <CalculatorBuildCardPortraitUpload
        variant="cover"
        :character="card.characterId"
        :current-portrait="card.art.uploadUrl"
        :default-portrait-url="card.art.url"
        :transform="card.art.transform" />
    </div>
    <div class="build-card-hero__art-floor"></div>

    <div class="build-card-hero__profile">
      <BuildCardProfile :username="card.username" :uid="card.uid" :size="20" />
    </div>

    <div class="build-card-hero__identity">
      <div class="build-card-hero__accent"></div>
      <div class="flex items-center gap-3.5">
        <img v-if="card.elementIcon" :src="card.elementIcon" :alt="card.element ?? ''" class="size-11 shrink-0" />
        <h2 class="build-card__name" data-test-build-card-name>{{ card.name }}</h2>
      </div>
      <div class="flex items-center gap-4 mt-3.5">
        <BuildCardStars :count="card.rarity" :size="22" />
        <span class="build-card__level">Lv. {{ card.level }}</span>
      </div>
      <BuildCardResonance class="mt-5" direction="row" :nodes="card.resonance" :size="46" :gap="10" />
      <div v-if="card.credits.length" class="build-card__credit mt-4">Art: {{ card.credits.join(", ") }}</div>
    </div>

    <div class="build-card-hero__content">
      <div class="build-card-glass build-card-hero__panel">
        <div class="flex-1 min-w-0 flex flex-col">
          <div class="build-card-hero__panel-head">
            <BuildCardScore v-if="card.score" :score="card.score" :total-cv="card.totalCv" :size="68" />
          </div>
          <BuildCardStatList class="mt-1" :rows="card.statRows" :columns="2" split-by-group :font-size="17" :row-padding="8" />
        </div>
        <div class="build-card-hero__side">
          <BuildCardWeapon v-if="card.weapon" :weapon="card.weapon" :icon-size="100" :name-size="22" />
          <div v-else class="build-card__empty">No weapon selected</div>
          <div class="build-card-hero__forte">
            <BuildCardForte :talents="card.talents" :icons="card.forteIcons" :size="46" />
          </div>
          <BuildCardSetPills v-if="card.sets.length" :sets="card.sets" :size="15" />
        </div>
      </div>

      <div class="build-card-hero__echoes" data-test-build-card-echoes>
        <BuildCardEcho
          v-for="(echo, index) in card.echoes"
          :key="index"
          class="flex-1 min-w-0"
          variant="column"
          v-bind="echo"
          :character-id="card.characterId" />
      </div>
      <BuildCardWatermark class="build-card-hero__watermark" />
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
.build-card-hero {
  position: absolute;
  inset: 0;
}

.build-card-hero__art {
  position: absolute;
  left: 0;
  top: 0;
  width: 780px;
  height: 1080px;
  /* Fades the art's right edge into whatever is behind it. */
  -webkit-mask-image: linear-gradient(90deg, #000 62%, transparent 100%);
  mask-image: linear-gradient(90deg, #000 62%, transparent 100%);
}

/* Keeps the name readable over any art or background. */
.build-card-hero__art-floor {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 760px;
  height: 480px;
  pointer-events: none;
  background: linear-gradient(0deg, rgba(6, 9, 18, 0.88), rgba(6, 9, 18, 0));
  -webkit-mask-image: linear-gradient(90deg, #000 60%, transparent 100%);
  mask-image: linear-gradient(90deg, #000 60%, transparent 100%);
}

.build-card-hero__profile {
  position: absolute;
  left: 44px;
  top: 40px;
  pointer-events: none;
}

.build-card-hero__identity {
  position: absolute;
  left: 44px;
  bottom: 44px;
  width: 620px;
  pointer-events: none;
}

.build-card-hero__accent {
  width: 64px;
  height: 3px;
  margin-bottom: 18px;
  border-radius: 2px;
  background: var(--card-accent);
}

.build-card__name {
  font-size: 96px;
  font-weight: 800;
  line-height: 0.95;
  color: #fff;
  white-space: nowrap;
  text-shadow: 0 4px 24px rgba(0, 0, 0, 0.6);
}

.build-card__level {
  font-size: 22px;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
}

.build-card-hero__content {
  position: absolute;
  left: 700px;
  right: 32px;
  top: 32px;
  bottom: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.build-card-hero__panel {
  display: flex;
  gap: 26px;
  padding: 20px 26px;
  flex-shrink: 0;
}

.build-card-hero__panel-head {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--card-hair);
}

.build-card-hero__side {
  width: 330px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding-left: 26px;
  border-left: 1px solid var(--card-hair);
}

.build-card-hero__forte {
  padding-top: 18px;
  border-top: 1px solid var(--card-hair);
}

.build-card-hero__echoes {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  gap: 14px;
}

.build-card-hero__watermark {
  align-self: flex-end;
  margin-top: -8px;
}
</style>
