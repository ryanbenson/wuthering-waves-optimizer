<template>
  <div class="join">
    <input
      v-model="damageType"
      value="Normal"
      class="join-item btn"
      type="radio"
      name="options"
      aria-label="Normal"
      :checked="damageType === 'Normal'" />
    <input
      v-model="damageType"
      value="Average"
      class="join-item btn"
      type="radio"
      name="options"
      aria-label="Average"
      :checked="damageType === 'Average'" />
    <input
      v-model="damageType"
      value="Crit"
      class="join-item btn"
      type="radio"
      name="options"
      aria-label="Crit"
      :checked="damageType === 'Crit'" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    character: string;
    currentDamageType?: string | null;
  }>(),
  { currentDamageType: null },
);

const emit = defineEmits<{
  "optimizer:damage-type-updated": [damageType: string];
}>();

const damageType = ref("Average");

watch(damageType, () => {
  emit("optimizer:damage-type-updated", damageType.value);
});

onMounted(() => {
  damageType.value = props.currentDamageType ?? "Average";
});

watch(
  () => props.currentDamageType,
  (v) => {
    damageType.value = v ?? "Average";
  },
);
</script>
