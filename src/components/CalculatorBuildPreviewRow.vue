<template>
  <div class="build-preview" :data-test-build-preview="buildId">
    <div v-if="!preview" class="build-preview__loading flex items-center gap-2 text-xs opacity-60 py-2">
      <span class="loading loading-spinner loading-xs"></span>
      Loading build details…
    </div>
    <div v-else class="build-preview__body grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs">
      <div class="build-preview__weapon flex items-center gap-2 min-w-0">
        <img
          v-if="preview.weaponIcon"
          :src="preview.weaponIcon"
          alt=""
          class="size-8 rounded shrink-0 bg-base-300 object-cover" />
        <div v-else class="size-8 rounded shrink-0 bg-base-300"></div>
        <span class="truncate" data-test-build-preview-weapon>
          {{ preview.weaponName ?? "No weapon" }}
        </span>
      </div>

      <div class="build-preview__echo-sets flex flex-wrap items-center gap-2 min-w-0">
        <template v-if="preview.echoSets.length">
          <div
            v-for="set in preview.echoSets"
            :key="set.key"
            class="flex items-center gap-1"
            data-test-build-preview-echo-set>
            <img :src="set.icon" alt="" class="size-5 shrink-0" />
            <span class="whitespace-nowrap">{{ set.count }}pc {{ set.label }}</span>
          </div>
        </template>
        <span v-else class="opacity-60">No echo sets</span>
      </div>

      <div class="build-preview__teammates flex items-center gap-3 min-w-0">
        <template v-if="preview.teammates.length">
          <div
            v-for="teammate in preview.teammates"
            :key="teammate.key"
            class="flex items-center gap-1.5 min-w-0"
            data-test-build-preview-teammate>
            <div
              class="size-6 rounded-full bg-cover bg-center border shrink-0"
              :style="{ backgroundImage: `url(${teammate.icon})` }"></div>
            <span class="truncate">{{ teammate.name }}</span>
          </div>
        </template>
        <span v-else class="opacity-60">No assumed teammates</span>
      </div>

      <div v-if="preview.stats" class="build-preview__stats grid grid-cols-3 gap-x-2 gap-y-1">
        <div class="flex items-center gap-1" v-tooltip="'HP'">
          <img src="https://ryanbenson.github.io/wuthering-waves-assets/images/hp.png" class="size-4" />
          <span>{{ displayInt(preview.stats.totalHp) }}</span>
        </div>
        <div class="flex items-center gap-1" v-tooltip="'DEF'">
          <img src="https://ryanbenson.github.io/wuthering-waves-assets/images/def.png" class="size-4" />
          <span>{{ displayInt(preview.stats.totalDef) }}</span>
        </div>
        <div class="flex items-center gap-1" v-tooltip="'ATK'">
          <img src="https://ryanbenson.github.io/wuthering-waves-assets/images/atk.png" class="size-4" />
          <span>{{ displayInt(preview.stats.totalAtk) }}</span>
        </div>
        <div class="flex items-center gap-1" v-tooltip="'Crit Rate'">
          <img src="https://ryanbenson.github.io/wuthering-waves-assets/images/critrate.png" class="size-4" />
          <span>{{ displayPercentage(preview.stats.critRate) }}</span>
        </div>
        <div class="flex items-center gap-1" v-tooltip="'Crit DMG'">
          <img src="https://ryanbenson.github.io/wuthering-waves-assets/images/critdamage.png" class="size-4" />
          <span>{{ displayPercentage(preview.stats.critDMG) }}</span>
        </div>
        <div class="flex items-center gap-1" v-tooltip="'Energy Regen'">
          <img src="https://ryanbenson.github.io/wuthering-waves-assets/images/energyregen.png" class="size-4" />
          <span>{{ displayPercentage(preview.stats.energyRegen) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";
import { computeBuildPreview, type BuildPreview } from "../calculator/buildPreview";
import { displayInt, displayPercentage } from "../utils/numbers";

defineOptions({ name: "CalculatorBuildPreviewRow" });

interface Props {
  characterId: string;
  buildId: string;
}

const props = defineProps<Props>();

const characterStore = useCharacterStore();
const inventoryStore = useInventoryStore();
const { characters } = storeToRefs(characterStore);

const preview = ref<BuildPreview | null>(null);

async function load() {
  preview.value = null;
  const characterId = props.characterId;
  const buildId = props.buildId;
  const result = await computeBuildPreview(characterId, buildId, characters.value, inventoryStore.echoes);
  // Guard against a stale response landing after props already moved on.
  if (characterId === props.characterId && buildId === props.buildId) {
    preview.value = result;
  }
}

watch(() => [props.characterId, props.buildId], load, { immediate: true });
</script>
