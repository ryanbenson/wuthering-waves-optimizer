<template>
  <div class="flex items-center gap-1.5 flex-wrap">
    <div class="workspace-build-switcher flex items-center gap-1 bg-base-200 rounded-lg p-1 max-w-full overflow-x-auto">
      <button
        v-for="build in builds"
        :key="build.id"
        type="button"
        class="workspace-build-chip btn btn-xs"
        :class="build.id === activeBuildId ? 'btn-primary' : 'btn-ghost'"
        :title="build.name"
        :data-test-workspace-build-chip="build.id"
        @click="equip(build.id)">
        {{ build.name }}
      </button>
    </div>
    <button
      type="button"
      class="btn btn-neutral btn-xs"
      data-test-workspace-manage-builds-open
      @click="$emit('manage-builds')">
      Manage
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useCharacterStore } from "../../stores/character";

interface Props {
  character: string;
}

const props = defineProps<Props>();
defineEmits<{
  "manage-builds": [];
}>();

const characterStore = useCharacterStore();

const builds = computed(() => characterStore.getBuilds(props.character));
const activeBuildId = computed(() => characterStore.getActiveBuildId(props.character));

function equip(buildId: string) {
  if (!props.character || buildId === activeBuildId.value) {
    return;
  }
  characterStore.equipBuild(props.character, buildId);
}
</script>

<style scoped lang="scss">
.workspace-build-switcher {
  scrollbar-width: thin;
}
.workspace-build-chip {
  max-width: 9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  flex: none;
}
</style>
