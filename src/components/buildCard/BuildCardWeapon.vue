<template>
  <div class="build-card-weapon flex items-center" :style="{ gap: `${Math.round(iconSize / 6)}px` }" data-test-build-card-weapon>
    <div class="build-card-weapon__frame" :style="{ width: `${iconSize}px`, height: `${iconSize}px` }">
      <img v-if="weapon.image" :src="weapon.image" :alt="weapon.name" class="w-[90%] h-[90%] object-contain" />
    </div>
    <div class="min-w-0 flex-1">
      <div class="build-card-weapon__name" :style="{ fontSize: `${nameSize}px` }" :class="rarityTextClass">
        {{ weapon.name }}
      </div>
      <div class="flex items-center gap-2.5 mt-1.5">
        <BuildCardStars :count="starCount" :size="13" />
        <span class="build-card-weapon__refine" data-test-build-card-weapon-refinement>R{{ weapon.refinement }}</span>
        <span class="build-card-weapon__level">Lv. {{ weapon.level }}</span>
      </div>
      <div class="flex items-center gap-5 mt-2.5">
        <span v-if="weapon.attack != null" class="build-card-weapon__stat">
          <img :src="atkIcon" alt="ATK" class="size-5" />{{ displayInt(weapon.attack) }}
        </span>
        <span v-if="weapon.modifierLabel && weapon.modifierValue != null" class="build-card-weapon__stat">
          <img v-if="weapon.modifierImage" :src="weapon.modifierImage" :alt="weapon.modifierLabel" class="size-5" />{{
            displayPercentage(weapon.modifierValue * 100)
          }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { displayInt, displayPercentage } from "../../utils/numbers";
import { ICON_BASE } from "../../buildCard/theme";
import type { BuildCardWeaponView } from "../../buildCard/view";
import BuildCardStars from "./BuildCardStars.vue";

const props = withDefaults(
  defineProps<{ weapon: BuildCardWeaponView; iconSize?: number; nameSize?: number }>(),
  { iconSize: 120, nameSize: 26 },
);

const atkIcon = `${ICON_BASE}/atk.png`;
const starCount = computed(() => Number(props.weapon.rarity) || 0);

// Rarity colors on the always-dark card (gold, violet, blue, green, grey).
const rarityTextClass = computed(
  () =>
    ({ 5: "text-amber-300", 4: "text-violet-300", 3: "text-sky-300", 2: "text-emerald-300", 1: "text-slate-300" })[
      starCount.value
    ] ?? "text-white",
);
</script>

<style scoped>
.build-card-weapon__frame {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: radial-gradient(circle at 50% 40%, rgba(243, 196, 90, 0.22), rgba(243, 196, 90, 0.02) 70%);
  border: 1px solid rgba(243, 196, 90, 0.35);
}

.build-card-weapon__name {
  font-weight: 800;
  line-height: 1.1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.build-card-weapon__refine {
  font-size: 13px;
  font-weight: 800;
  line-height: 18px;
  padding: 0 7px;
  border-radius: 6px;
  color: #0b1020;
  background: var(--card-gold);
}

.build-card-weapon__level {
  font-size: 15px;
  color: var(--card-muted);
}

.build-card-weapon__stat {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 21px;
  font-weight: 700;
  color: var(--card-ink);
}
</style>
