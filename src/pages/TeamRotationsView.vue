<template>
  <TeamRotations></TeamRotations>
</template>

<script setup lang="ts">
import TeamRotations from "../components/TeamRotations.vue";
import { useDocumentTitle } from "../composables/useDocumentTitle";

useDocumentTitle(
  "Team rotations — Wuthering Waves Calculator & Optimizer",
  "Build a Wuthering Waves team of up to 3 characters, chain their actions into a rotation and see the team's total damage and DPS.",
);
</script>
