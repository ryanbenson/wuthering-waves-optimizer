<template>
  <div class="bg-base-200 rounded-xl p-4 flex flex-col gap-3">
    <div class="text-[.65rem] font-bold uppercase tracking-wider opacity-50">
      CV &amp; RV
    </div>
    <div>
      <span class="font-bold text-sm">CV</span>
      <span class="opacity-50 text-sm"> — Crit Value</span>
      <p class="text-sm opacity-80 mt-1">
        The amount of crit on an echo: Crit Rate × 2 + Crit DMG.
      </p>
    </div>
    <div>
      <span class="font-bold text-sm">RV</span>
      <span class="opacity-50 text-sm"> — Roll Value</span>
      <p class="text-sm opacity-80 mt-1">
        How lucky an echo's substat rolls were. Not unique per stat — higher
        rolls mean a higher RV.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDocumentTitle } from "../../composables/useDocumentTitle";

useDocumentTitle(
  "CV & RV — Wuthering Waves Calculator & Optimizer",
  "What CV (Crit Value) and RV (Roll Value) mean for Wuthering Waves echo substats.",
);
</script>
