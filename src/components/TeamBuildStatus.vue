<template>
  <div
    v-if="!interactive"
    class="team-build-status flex items-center gap-1.5 text-xs opacity-80 justify-center"
    :data-test-team-build-status="status">
    <span
      class="team-build-status__dot size-2 rounded-full shrink-0"
      :class="dotClass"></span>
    <span>{{ label }}</span>
  </div>

  <AppRichSelect
    v-else
    class="team-build-status-dropdown"
    :model-value="status"
    :options="statusOptions"
    variant="ghost"
    data-test-team-build-status-toggle
    aria-label="Team build status"
    @update:model-value="selectStatus">
    <template #selected="{ option }">
      <span class="flex items-center gap-1 min-w-0">
        <span
          class="team-build-status__dot size-2 rounded-full shrink-0"
          :class="String(option?.dotClass ?? '')"></span>
        <span class="whitespace-nowrap">{{ option?.label }}</span>
      </span>
    </template>
    <template #option="{ option }">
      <span
        class="team-build-status__dot size-2 rounded-full shrink-0"
        :class="String(option.dotClass ?? '')"></span>
      <span>{{ option.label }}</span>
    </template>
  </AppRichSelect>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  TEAM_BUILD_STATUSES,
  getTeamBuildStatusDotClass,
  getTeamBuildStatusLabel,
  type TeamBuildStatus,
} from "../teamRotations/teamBuildStatus";
import { useTeamRotationsStore } from "../stores/teamRotations";
import AppRichSelect, {
  type AppRichSelectOption,
  type AppRichSelectValue,
} from "./AppRichSelect.vue";

interface Props {
  status: TeamBuildStatus;
  interactive?: boolean;
  teamId?: string;
}

const props = withDefaults(defineProps<Props>(), {
  interactive: false,
  teamId: "",
});

const teamRotationsStore = useTeamRotationsStore();

const label = computed(() => getTeamBuildStatusLabel(props.status));

const dotClass = computed(() => getTeamBuildStatusDotClass(props.status));

const statusOptions = computed((): AppRichSelectOption[] =>
  TEAM_BUILD_STATUSES.map((value) => ({
    value,
    label: getTeamBuildStatusLabel(value),
    dotClass: getTeamBuildStatusDotClass(value),
  })),
);

function selectStatus(nextStatus: AppRichSelectValue) {
  if (!props.teamId || typeof nextStatus !== "string") {
    return;
  }

  teamRotationsStore.setTeamStatus(props.teamId, nextStatus as TeamBuildStatus);
}
</script>
