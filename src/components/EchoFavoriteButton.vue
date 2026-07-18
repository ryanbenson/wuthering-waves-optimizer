<template>
  <FavoriteHeartButton
    v-if="echoId"
    :active="isFavorite"
    :overlay="overlay"
    :test-id="echoId"
    @toggle="onToggle" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useInventoryStore } from "../stores/inventory";
import { useEchoInventory } from "../composables/useEchoInventory";
import FavoriteHeartButton from "./FavoriteHeartButton.vue";

const props = withDefaults(
  defineProps<{
    echoId: string | null | undefined;
    overlay?: boolean;
  }>(),
  {
    overlay: false,
  },
);

const inventoryStore = useInventoryStore();
const { echoes } = storeToRefs(inventoryStore);
const { toggleEchoFavorite } = useEchoInventory();

const isFavorite = computed(() => {
  void echoes.value;
  if (!props.echoId) return false;
  return Boolean(inventoryStore.getEchoById(props.echoId)?.favorite);
});

function onToggle() {
  if (!props.echoId) return;
  toggleEchoFavorite(props.echoId);
}
</script>
