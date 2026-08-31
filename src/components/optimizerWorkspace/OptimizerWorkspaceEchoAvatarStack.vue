<template>
  <div class="flex gap-1" data-test-optimizer-workspace-echo-avatar-stack>
    <div
      v-for="(echo, echoIdx) in sortedLoadout"
      :key="echoIdx"
      class="rounded-full border-2 bg-cover bg-center shrink-0"
      :class="[sizeClass, rankBorderClass((echo as any).rank)]"
      :style="{ backgroundImage: `url(${echoImage(echo as any)})` }"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { getEchoData } from "../../echoes/index";
import { sortLoadoutForDisplay } from "./optimizerLoadoutSort";

defineOptions({ name: "OptimizerWorkspaceEchoAvatarStack" });

const DEFAULT_IMAGE =
  "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/monsters.png";

const props = withDefaults(
  defineProps<{
    loadout: unknown[];
    size?: "sm" | "md";
  }>(),
  { size: "sm" },
);

const sizeClass = computed(() => (props.size === "md" ? "size-8" : "size-5"));

const sortedLoadout = computed(() => sortLoadoutForDisplay(props.loadout as any[]));

function echoImage(echo: { echo?: string }) {
  if (!echo?.echo) return DEFAULT_IMAGE;
  return getEchoData(echo.echo)?.image ?? DEFAULT_IMAGE;
}

function rankBorderClass(rank: number | string | undefined) {
  const r = Number(rank);
  if (r === 5) return "border-amber-300";
  if (r === 4) return "border-violet-600";
  if (r === 3) return "border-blue-500";
  if (r === 2) return "border-green-500";
  return "border-base-300";
}
</script>
