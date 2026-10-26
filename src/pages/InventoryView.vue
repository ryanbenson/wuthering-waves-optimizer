<template>
<div class="inventory__content">
  <div class="inventory__el">
    <Inventory class="inventory"></Inventory>
  </div>
</div>
</template>

<script setup lang="ts">
import Inventory from "../components/Inventory.vue";
import { useDocumentTitle } from "../composables/useDocumentTitle";

useDocumentTitle(
  "Echo inventory — Wuthering Waves Calculator & Optimizer",
  "Keep your Wuthering Waves echoes and echo presets in one place, rated and ready to equip.",
);
</script>
