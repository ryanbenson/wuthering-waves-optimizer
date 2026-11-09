<template>
  <div v-if="username || uid" class="build-card-profile" data-test-build-card-profile>
    <div v-if="username" class="build-card-profile__name" :style="{ fontSize: `${size}px` }">{{ username }}</div>
    <div v-if="uid" class="build-card-profile__uid" :style="{ fontSize: `${Math.round(size * 0.72)}px` }">UID {{ uid }}</div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ username: string; uid: string; size?: number }>(), { size: 24 });
</script>

<style scoped>
.build-card-profile {
  line-height: 1.2;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
}

.build-card-profile__name {
  font-weight: 700;
  color: #fff;
}

.build-card-profile__uid {
  white-space: nowrap;
  color: var(--card-muted);
}
</style>
