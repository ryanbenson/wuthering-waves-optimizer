<template>
  <div class="bg-base-200 rounded-xl p-4">
    <div class="text-[.65rem] font-bold uppercase tracking-wider opacity-50 mb-2">
      Overview
    </div>
    <p class="text-sm leading-relaxed opacity-80">
      Configure your character like you would in the game and it will tell
      you the normal hit (without crit or crit damage), average damage, and
      crit damage (assuming 100% crit rate). So far the calculations match
      up with the game when using real characters and builds.
    </p>
    <p class="text-sm leading-relaxed opacity-80 mt-3">
      This is still a work in progress, so keep an eye on the
      <RouterLink to="/updates" class="link">Updates</RouterLink>
      page. A banner goes up when something notable happens, like a new
      character being added.
    </p>
  </div>
</template>

<script setup lang="ts">
import { useDocumentTitle } from "../../composables/useDocumentTitle";

useDocumentTitle(
  "Info — Wuthering Waves Calculator & Optimizer",
  "How the Wuthering Waves Calculator & Optimizer works, its formulas, and how to get in touch.",
);
</script>
