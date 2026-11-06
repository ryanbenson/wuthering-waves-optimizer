<template>
  <template v-for="(token, index) in tokens" :key="index">
    <strong v-if="token.kind === 'bold'" class="font-semibold text-base-content">{{ token.text }}</strong>
    <RouterLink v-else-if="token.kind === 'link'" :to="token.to" class="link link-primary">{{ token.text }}</RouterLink>
    <template v-else>{{ token.text }}</template>
  </template>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { parseInline } from "../../content/guides/inline";

const props = defineProps<{ text: string }>();
const tokens = computed(() => parseInline(props.text));
</script>
