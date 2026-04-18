<template>
    <div class="presetEcho">
                <div
              class="echo__item__image rounded-full border border-solid neutral-content size-16 bg-cover min-w-16 text-center"
              :class="{
                'border-amber-300': rank === '5' || rank === 5,
                'border-violet-600': rank === '4' || rank === 4,
                'border-blue-500': rank === '3' || rank === 3,
                'border-green-500': rank === '2' || rank === 2,
              }"
              :style="{
                backgroundImage: `url(${echoImage})`,
              }"></div>
            </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { getEchoData } from "../echoes/index.ts";
import { useInventoryStore } from "../stores/inventory";

const props = defineProps<{
  echoId: string;
}>();

const inventoryStore = useInventoryStore();

const echoData = computed(() => inventoryStore.getEchoById(props.echoId));

const echoImage = computed(() => {
  const defaultImageUrl =
    "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/monsters.png";
  if (!(echoData.value as { echo?: string } | undefined)?.echo) {
    return defaultImageUrl;
  }
  const meta = getEchoData((echoData.value as { echo: string }).echo);
  return (meta as { image?: string } | null)?.image ?? defaultImageUrl;
});

const rank = computed(
  () => (echoData.value as { rank?: string | number } | undefined)?.rank ?? 5,
);
</script>