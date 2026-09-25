<template>
  <h2 class="text-xl font-bold mb-2">Possible inventory duplicates</h2>
  <p class="mb-4 text-sm opacity-80">
    Some imported echoes already match items in your inventory. New echoes
    are pre-selected and will be added. Possible duplicates are unchecked —
    select any you still want to add, then continue.
  </p>
  <div class="space-y-3 max-h-[60vh] overflow-y-auto">
    <label
      v-for="item in items"
      :key="item.index"
      class="flex gap-3 items-start p-3 rounded-lg border border-base-300 cursor-pointer hover:bg-base-200">
      <input
        type="checkbox"
        class="checkbox checkbox-sm mt-5"
        v-model="item.selected" />
      <div
        class="echo__item__image rounded-full border border-solid neutral-content size-14 shrink-0 bg-cover bg-center"
        :class="getRankBorderClass(item.echo.rank)"
        :style="{
          backgroundImage: `url(${getEchoImage(item.echo)})`,
        }"></div>
      <div class="flex-1 min-w-0">
        <div class="flex flex-wrap items-center gap-2">
          <span
            class="font-semibold"
            :class="getRankTextClass(item.echo.rank)">
            {{ getEchoDisplayName(item.echo) }}
          </span>
          <span class="badge badge-sm badge-primary">
            {{ item.echo.type }} Cost
          </span>
          <img
            v-if="item.echo.echoSet"
            :src="getEchoSetIconByType(item.echo.echoSet)"
            class="size-5 rounded-full"
            :alt="getEchoSetLabelByType(item.echo.echoSet)" />
          <span
            v-if="item.isDuplicate"
            class="badge badge-sm badge-warning">
            Possible duplicate
          </span>
          <span v-else class="badge badge-sm badge-success">
            New — will be added
          </span>
        </div>
        <div
          v-if="item.echo.stat"
          class="mt-1 text-sm flex items-center gap-2">
          <img
            :src="getSubStatIconByType(item.echo.stat)"
            class="size-5" />
          <span>
            Main:
            {{ getReadableSubStatLabel(item.echo.stat) }}
          </span>
          <span v-if="item.echo.echoSet" class="opacity-70">
            · {{ getEchoSetLabelByType(item.echo.echoSet) }}
          </span>
        </div>
        <div
          v-if="getEchoSubstatLabels(item.echo).length"
          class="mt-2 pt-2 border-t border-base-300 text-sm flex flex-wrap gap-x-3 gap-y-1 opacity-90">
          <span
            v-for="(sub, subIndex) in getEchoSubstatLabels(item.echo)"
            :key="subIndex"
            class="inline-flex items-center gap-1">
            <img v-if="sub.icon" :src="sub.icon" class="size-4" />
            {{ sub.label }}
          </span>
        </div>
      </div>
    </label>
  </div>
  <div class="modal-action flex-wrap">
    <button type="button" class="btn" @click="emit('cancel')">Cancel</button>
    <template v-if="inventoryOnly">
      <button
        type="button"
        class="btn btn-primary"
        :disabled="!hasSelectedEchoes"
        @click="emit('confirm')">
        Save {{ selectedCount }} selected
      </button>
    </template>
    <template v-else>
      <button
        type="button"
        class="btn btn-secondary"
        @click="emit('applyToCharacterOnly')">
        Apply to character only
      </button>
      <button
        type="button"
        class="btn btn-primary"
        :disabled="!hasSelectedEchoes"
        @click="emit('confirm')">
        Save {{ selectedCount }} selected & apply
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  getEchoSetIconByType,
  getEchoSetLabelByType,
  getReadableSubStatLabel,
  getSubStatIconByType,
} from "../echoes/stats";
import { getEchoData } from "../echoes/index";
import type { MappedEcho } from "../echoes/parsedEchoMapping";
import type { DuplicateReviewItem } from "../composables/useEchoDuplicateReview";

const props = defineProps<{
  items: DuplicateReviewItem[];
  inventoryOnly: boolean;
  hasSelectedEchoes: boolean;
}>();

const selectedCount = computed(() => props.items.filter((item) => item.selected).length);

const emit = defineEmits<{
  cancel: [];
  confirm: [];
  applyToCharacterOnly: [];
}>();

const DEFAULT_ECHO_IMAGE =
  "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/monsters.png";

function getEchoDisplayName(echo: MappedEcho) {
  if (!echo.echo) {
    return "Unknown echo";
  }
  return getEchoData(echo.echo)?.name ?? echo.echo;
}

function getEchoImage(echo: MappedEcho) {
  if (!echo.echo) {
    return DEFAULT_ECHO_IMAGE;
  }
  return getEchoData(echo.echo)?.image ?? DEFAULT_ECHO_IMAGE;
}

function getRankBorderClass(rank: number) {
  if (rank === 5) return "border-amber-300";
  if (rank === 4) return "border-violet-600";
  if (rank === 3) return "border-blue-500";
  if (rank === 2) return "border-green-500";
  return "";
}

function getRankTextClass(rank: number) {
  if (rank === 5) return "text-amber-300";
  if (rank === 4) return "text-violet-600";
  if (rank === 3) return "text-blue-500";
  if (rank === 2) return "text-green-500";
  return "";
}

function formatSubStatDisplay(
  type: string | null,
  value: number | null,
): { label: string; icon: string } | null {
  if (!type || value === null || value === undefined) {
    return null;
  }
  const name = getReadableSubStatLabel(type) ?? type;
  const label = type.includes("FLAT") ? `${name} ${value}` : `${name} ${value}%`;
  return {
    label,
    icon: getSubStatIconByType(type),
  };
}

function getEchoSubstatLabels(echo: MappedEcho) {
  return [
    formatSubStatDisplay(echo.echoSubStatsType1, echo.echoSubStatsValue1),
    formatSubStatDisplay(echo.echoSubStatsType2, echo.echoSubStatsValue2),
    formatSubStatDisplay(echo.echoSubStatsType3, echo.echoSubStatsValue3),
    formatSubStatDisplay(echo.echoSubStatsType4, echo.echoSubStatsValue4),
    formatSubStatDisplay(echo.echoSubStatsType5, echo.echoSubStatsValue5),
  ].filter((sub): sub is { label: string; icon: string } => Boolean(sub));
}
</script>
