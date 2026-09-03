<template>
  <Nav cur-page="updates" :disable-mobile-nav="true"></Nav>
  <article class="prose page-updates">
    <h1>Updates</h1>
    <template v-for="entry in updateEntries" :key="entry.date">
      <h3>{{ entry.dateLabel }}</h3>
      <ul>
        <li v-for="(item, index) in entry.items" :key="index">{{ item }}</li>
      </ul>
    </template>
  </article>
</template>

<script setup lang="ts">
import Nav from "../components/navigation/Nav.vue";
import { updateEntries } from "../content/updates";
</script>

<style scoped lang="scss">
.page-updates {
  padding: 2rem 3rem;
  max-width: 640px;
  @media (max-width: 768px) {
    margin-left: 0;
  }
}
</style>
