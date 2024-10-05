<template>
  <div class="page-privacy prose">
    <h1>Privacy Policy</h1>
    <h2>Analytics</h2>
    <p>
      We use privacy-first analytics, so no personal or identifiable information
      is stored or collected about you and we don't use cookies for analytics.
      Refer to:
      <a href="https://www.simpleanalytics.com/" rel="noreferrer"
        >Simple Analytics</a
      >
      and
      <a href="https://vercel.com/docs/analytics" rel="noreferrer"
        >Vercel Analytics</a
      >
    </p>
    <h2>Changes</h2>
    <p>
      Changes may occur to this policy at any time, so check back to this for
      the latest.
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "PrivacyView",
});
</script>

<style scoped>
.page-privacy {
  padding: 2rem 3rem;
}
</style>
