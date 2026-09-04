<template>
  <div
    class="card card-bordered card-compact bg-base-200 shadow-sm hover:bg-base-300 transition-colors">
    <div class="card-body flex-row items-center gap-3 py-2">
      <div
        class="rounded-full border-2 bg-cover bg-center size-11 shrink-0"
        :class="rarityBorderClass"
        :style="{ backgroundImage: `url(${portrait})` }"></div>

      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-1.5 flex-wrap">
          <span class="font-semibold text-sm" :class="rarityTextClass">
            {{ name }}
          </span>
          <img
            v-if="elementImage"
            :src="elementImage"
            :class="elementClass"
            class="size-4 shrink-0"
            :alt="element" />
          <img
            v-if="weaponImage"
            :src="weaponImage"
            class="size-4 shrink-0 workspace-character-row__weapon"
            :alt="weapon" />
        </div>
        <div class="flex items-center gap-1.5 flex-wrap mt-1">
          <CharacterBuildStatus
            v-if="buildStatus"
            :status="buildStatus"
            :interactive="false"
            :character-key="nameKey" />
          <span
            v-if="substatScoreRollup"
            class="badge badge-xs text-nowrap"
            :class="substatScoreRollupBadgeClass"
            v-tooltip="'Build Score — average Substat Score across this character\'s equipped echoes'">
            {{ substatScoreRollup.grade }}
            {{ Math.round(substatScoreRollup.percent) }}%{{ substatScoreRollup.provisional ? "*" : "" }}
          </span>
        </div>
      </div>

      <div class="flex items-center gap-1.5 shrink-0">
        <FavoriteHeartButton
          :active="isFavorite"
          :test-id="nameKey"
          @toggle="toggleFavorite" />
        <button
          type="button"
          class="btn btn-sm btn-primary"
          :data-test-character-browse-select="nameKey"
          @click="emit('choose')">
          Use
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  characterElementsSetImageMap,
  weaponTypesImageMap,
} from "../../characters/characters";
import type { CharacterBuildStatus as CharacterBuildStatusType } from "../../characters/characterBuildStatus";
import { useCharacterStore } from "../../stores/character";
import CharacterBuildStatus from "../CharacterBuildStatus.vue";
import FavoriteHeartButton from "../FavoriteHeartButton.vue";
import { getRatingBadgeClasses } from "../../composables/useEchoRating";
import { useTeamSubstatScoreRollup } from "../../composables/useTeamSubstatScoreRollup";

const props = defineProps<{
  nameKey: string;
  name: string;
  rarity: number;
  element: string;
  weapon: string;
  buildStatus?: CharacterBuildStatusType;
}>();

const emit = defineEmits<{ choose: [] }>();

const characterStore = useCharacterStore();

const portrait = computed(
  () => `https://ryanbenson.github.io/wuthering-waves-assets/images/${props.nameKey}.png`,
);
const elementImage = computed(
  () => characterElementsSetImageMap[props.element] ?? null,
);
const weaponImage = computed(() => weaponTypesImageMap[props.weapon] ?? null);
const elementClass = computed(() => `${props.element.toLowerCase()}--active`);

const rarityBorderClass = computed(() => ({
  "border-amber-300": props.rarity === 5,
  "border-violet-600": props.rarity === 4,
}));
const rarityTextClass = computed(() => ({
  "text-amber-300": props.rarity === 5,
  "text-violet-600": props.rarity === 4,
}));

const isFavorite = computed(() => characterStore.isFavoriteCharacter(props.nameKey));
function toggleFavorite() {
  characterStore.toggleFavoriteCharacter(props.nameKey);
}

const { rollup: substatScoreRollup } = useTeamSubstatScoreRollup(() => props.nameKey);
const substatScoreRollupBadgeClass = computed(() =>
  substatScoreRollup.value
    ? getRatingBadgeClasses(substatScoreRollup.value.color)
    : null,
);
</script>

<style lang="scss" scoped>
html[data-theme-style="light"] {
  .workspace-character-row__weapon {
    filter: invert(1);
  }
}
</style>
