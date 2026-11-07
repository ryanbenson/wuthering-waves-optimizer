<template>
  <div class="flex flex-col gap-16 sm:gap-20" data-test-info-overview>
    <section class="flex flex-col gap-8">
      <div class="flex flex-col gap-4 max-w-3xl">
        <h1 class="text-4xl sm:text-5xl leading-tight font-extrabold text-base-content">
          See exactly how hard your build hits, then make it hit harder
        </h1>
        <p class="text-lg leading-relaxed">
          A free toolkit for planning your Wuthering Waves account. Set up a
          character like you would in the game and get real numbers. No account,
          and everything stays in your browser.
        </p>
        <div class="flex flex-wrap gap-3 pt-1">
          <RouterLink to="/" class="btn btn-primary" data-test-overview-calculator>Open the Calculator</RouterLink>
          <RouterLink to="/scanners" class="btn btn-outline" data-test-overview-scanners>Get your echoes in</RouterLink>
        </div>
      </div>
      <GuideScreenshot :image="GUIDE_IMAGES.echoes" eager />
    </section>

    <section
      v-for="(feature, index) in features"
      :key="feature.title"
      class="grid gap-8 md:gap-12 md:grid-cols-2 items-center"
      :data-test-overview-feature="feature.id">
      <div class="flex flex-col gap-3 min-w-0" :class="{ 'md:order-2': index % 2 === 1 }">
        <h2 class="text-2xl sm:text-3xl font-bold text-balance">{{ feature.title }}</h2>
        <p class="text-lg leading-relaxed">{{ feature.body }}</p>
        <div class="flex flex-wrap gap-x-4 gap-y-1 font-semibold">
          <RouterLink
            v-for="link in feature.links"
            :key="link.to"
            :to="link.to"
            class="link link-primary">
            {{ link.label }}
          </RouterLink>
        </div>
      </div>
      <GuideScreenshot :image="feature.image" class="min-w-0" :class="{ 'md:order-1': index % 2 === 1 }" />
    </section>

    <section class="flex flex-col gap-4" data-test-overview-more>
      <h2 class="text-2xl font-bold">Also in the app</h2>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <RouterLink
          v-for="tool in moreTools"
          :key="tool.to"
          :to="tool.to"
          class="overview__tool flex flex-col gap-1 p-4 bg-base-200 text-base-content/80 rounded-xl border border-base-content/10 hover:border-primary/60 transition-colors">
          <span class="flex items-center justify-between gap-2 font-bold text-base-content">
            {{ tool.title }}
            <GuideChevron />
          </span>
          <span class="text-sm leading-relaxed">{{ tool.body }}</span>
        </RouterLink>
      </div>
      <p class="leading-relaxed">
        The calculations have matched the game when tested with real characters
        and builds, and new content lands regularly. See what's new on the
        <RouterLink to="/updates" class="link link-primary">Updates</RouterLink> page.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useDocumentTitle } from "../../composables/useDocumentTitle";
import { GUIDE_IMAGES } from "../../content/guides/images";
import GuideChevron from "../guides/GuideChevron.vue";
import GuideScreenshot from "../guides/GuideScreenshot.vue";

useDocumentTitle(
  "Info — Wuthering Waves Calculator & Optimizer",
  "What the Wuthering Waves Calculator & Optimizer can do: damage calculator, echo optimizer, Echo Rating, convene simulator, inventory, and more.",
);

const features = [
  {
    id: "calculator",
    title: "Build a character, read every hit",
    body: "Weapon, echoes, resonance chain, team buffs and rotation all count. You get the normal hit, the average and the crit for every attack.",
    image: GUIDE_IMAGES.buildScore,
    links: [
      { label: "Open the Calculator", to: "/" },
      { label: "Read the guide", to: "/info/guides/calculator-basics" },
    ],
  },
  {
    id: "optimizer",
    title: "Let the Optimizer pick your best five echoes",
    body: "It searches your whole inventory for the loadout that gets the most out of a build, and shows how much each option beats what you're wearing now. It runs in the background, so big searches don't freeze the page.",
    image: GUIDE_IMAGES.optimizerTop5,
    links: [
      { label: "Run the Optimizer", to: "/?section=optimizer" },
      { label: "Read the guide", to: "/info/guides/best-loadout" },
    ],
  },
  {
    id: "inventory",
    title: "Every echo graded the moment you add it",
    body: "Keep your echoes and weapons in one place and equip them to any build. Each echo gets an E to SSS grade right away, so you know what to keep while you're still farming.",
    image: GUIDE_IMAGES.inventory,
    links: [
      { label: "Open Inventory", to: "/inventory" },
      { label: "How grades work", to: "/info/cv-echo-rating" },
    ],
  },
  {
    id: "rotations",
    title: "Score a real rotation, not a single hit",
    body: "Start from a preset or build your own, then chain up to 3 characters' actions to see a whole team's damage and DPS.",
    image: GUIDE_IMAGES.team,
    links: [
      { label: "Open Teams", to: "/teams" },
      { label: "Build a rotation", to: "/info/guides/rotations" },
    ],
  },
  {
    id: "convene",
    title: "Know your odds before you pull",
    body: "The Convene simulator takes your pity and resources and estimates your chance of reaching a target number of copies on a character or weapon banner.",
    image: GUIDE_IMAGES.convene,
    links: [{ label: "Open Convene", to: "/convene" }],
  },
];

const moreTools = [
  { title: "Echo scanners", body: "Fill your inventory from the game without typing.", to: "/scanners" },
  { title: "Tuning Planner", body: "See how often a fresh echo reaches the substats you want.", to: "/info/tuning-odds" },
  { title: "Weapon recommendations", body: "Curated picks per character, with the damage change for your build.", to: "/?section=weapon" },
  { title: "Build Card", body: "Turn your build into an image to share.", to: "/?section=build-card" },
];
</script>

<style scoped>
/* The global a:hover colour would tint the cards' text. */
.overview__tool:hover {
  color: inherit;
}
</style>
