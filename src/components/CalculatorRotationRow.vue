<template>
  <li
    class="card bg-base-200 shadow hover:bg-base-300 transition-colors cursor-pointer"
    :class="{ 'ring-2 ring-primary/60': favorite }"
    :data-test-rotations-item="name"
    @click="$emit('open')">
    <div class="card-body flex-row flex-wrap items-center gap-3 p-3">
      <span v-if="rank !== null" class="badge badge-sm badge-ghost shrink-0" data-test-rotations-row-rank>
        #{{ rank }}
      </span>
      <div
        class="size-9 rounded-full border border-solid neutral-content bg-cover shrink-0"
        :style="{ backgroundImage: `url(${echoImage})` }"></div>
      <div class="min-w-[8rem] flex-1">
        <div class="font-semibold truncate">{{ name }}</div>
        <div class="text-xs opacity-70 flex flex-wrap gap-x-2">
          <span>{{ actionsCount }} action{{ actionsCount === 1 ? "" : "s" }}</span>
          <span v-if="duration">{{ duration }}s rotation</span>
        </div>
      </div>
      <div v-if="statValue !== null && statValue > 0" class="text-sm shrink-0" data-test-rotations-row-stat>
        <span class="font-bold">{{ statLabel }} DMG:</span> {{ Math.round(statValue).toLocaleString() }}
      </div>
      <div class="flex items-center gap-1 shrink-0" @click.stop>
        <FavoriteHeartButton :active="favorite" :test-id="name" @toggle="$emit('toggle-favorite')" />
        <button
          type="button"
          class="btn btn-ghost btn-xs"
          title="Delete rotation"
          :data-test-rotations-row-delete="name"
          @click="$emit('delete')">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="size-4">
            <path
              d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM184 232l144 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-144 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z"
              fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
import { computed } from "vue";
import FavoriteHeartButton from "./FavoriteHeartButton.vue";
import { getEchoData } from "../echoes/index.ts";

const props = withDefaults(
  defineProps<{
    name: string;
    favorite?: boolean;
    rank?: number | null;
    statValue?: number | null;
    statLabel?: string | null;
    actionsCount: number;
    duration?: string | number | null;
    echo?: string | null;
  }>(),
  {
    favorite: false,
    rank: null,
    statValue: null,
    statLabel: null,
    duration: null,
    echo: null,
  },
);

defineEmits<{
  open: [];
  "toggle-favorite": [];
  delete: [];
}>();

const echoImage = computed(
  () =>
    (props.echo ? (getEchoData(props.echo) as { image?: string } | null)?.image : null) ||
    "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/monsters.png",
);
</script>
