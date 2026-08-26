<template>
  <div class="join">
    <input
      v-model="damageType"
      value="Normal"
      class="join-item btn btn-sm"
      type="radio"
      :name="name"
      aria-label="Normal"
      :checked="damageType === 'Normal'" />
    <input
      v-model="damageType"
      value="Average"
      class="join-item btn btn-sm"
      type="radio"
      :name="name"
      aria-label="Average"
      :checked="damageType === 'Average'" />
    <input
      v-model="damageType"
      value="Crit"
      class="join-item btn btn-sm"
      type="radio"
      :name="name"
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
    // Radio inputs of the same name are mutually exclusive document-wide
    // (no <form> boundary here) — every screen stays mounted (v-show), so
    // a second instance elsewhere in the DOM with the default name would
    // fight this one. Override per consumer when more than one can exist
    // at once (see CalculatorLiveResultBar.vue).
    name?: string;
  }>(),
  { currentDamageType: null, name: "options" },
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
