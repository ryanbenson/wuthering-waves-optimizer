<template>
  <div
    class="echoes-empty-state flex flex-col gap-4 rounded-lg border border-dashed border-primary/50 bg-base-100 p-4"
    data-test-echoes-empty-state>
    <div class="flex flex-col gap-1">
      <h4 class="text-sm font-semibold">Set up your echoes</h4>
      <p class="text-xs opacity-70">
        Add echoes from your account, or apply a preset.
      </p>
    </div>
    <div class="flex flex-wrap gap-2">
      <button
        type="button"
        class="btn btn-sm btn-primary"
        data-test-echoes-empty-import
        @click="emit('import')">
        Import echoes
      </button>
      <button
        type="button"
        class="btn btn-sm"
        data-test-echoes-empty-inventory
        @click="emit('browse-inventory')">
        Pick from inventory
      </button>
      <button
        v-if="savedPresetCount > 0"
        type="button"
        class="btn btn-sm"
        data-test-echoes-empty-saved-presets
        @click="emit('open-saved-presets')">
        Apply a saved preset
        <span class="badge badge-sm">{{ savedPresetCount }}</span>
      </button>
      <button
        v-if="communityPresetCount > 0"
        type="button"
        class="btn btn-sm"
        data-test-echoes-empty-community
        @click="emit('open-community-builds')">
        Use a theorycrafter build
        <span class="badge badge-sm">{{ communityPresetCount }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  savedPresetCount: number;
  communityPresetCount: number;
}>();

const emit = defineEmits<{
  import: [];
  "browse-inventory": [];
  "open-saved-presets": [];
  "open-community-builds": [];
}>();
</script>
