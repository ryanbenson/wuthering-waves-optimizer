<template>
  <div class="bg-base-200 rounded-xl p-4">
    <div class="text-[.65rem] font-bold uppercase tracking-wider opacity-50 mb-2">
      Overview
    </div>
    <p class="text-sm leading-relaxed opacity-80">
      A free, browser-based toolkit for planning and optimizing your
      Wuthering Waves account. Configure a character like you would in the
      game — weapon, echoes, resonance chain, team buffs, and skill rotation
      — and it tells you the normal hit (without crit or crit damage), the
      average damage, and the crit damage (assuming 100% crit rate). So far
      the calculations match up with the game when using real characters and
      builds.
    </p>
    <p class="text-sm leading-relaxed opacity-80 mt-3">
      This is still a work in progress, so keep an eye on the
      <RouterLink to="/updates" class="link">Updates</RouterLink>
      page. A banner goes up when something notable happens, like a new
      character being added.
    </p>
    <div class="mt-4 pt-3 border-t border-base-300">
      <div class="text-xs font-bold mb-2">What's included</div>
      <ul class="text-sm opacity-80 flex flex-col gap-2">
        <li>
          <strong>Calculator</strong> — build a character and see exactly how
          hard it hits, hit by hit.
        </li>
        <li>
          <strong>Optimizer</strong> — searches your whole echo inventory for
          the 5-echo loadout that squeezes the most damage (or whichever
          stat you choose) out of a build. It runs in the background, so
          working through huge numbers of combinations doesn't freeze the
          page.
        </li>
        <li>
          <strong>Echo Rating</strong> — still farming? Every echo gets an
          instant E–SSS grade the moment you add it, from its own substats
          alone, no finished build required. See
          <RouterLink to="/info/cv-echo-rating" class="link">CV & Echo Rating</RouterLink>.
        </li>
        <li>
          <strong>Recommendations</strong> — curated weapon suggestions for
          each character, each showing the estimated damage change for your
          own build, plus community-sourced substat priority weightings.
        </li>
        <li>
          <strong>Convene Simulator</strong> — estimates your odds of
          reaching a target number of copies on a character or weapon
          banner, based on your current pity and resources.
        </li>
        <li>
          <strong>Inventory</strong> — track every echo and weapon you own
          in one place, then equip them to any character's build without
          re-entering anything.
        </li>
        <li>
          <strong>Echo Importer</strong> — skip manual entry and bulk-import
          echoes straight from an exported summary image.
        </li>
        <li>
          <strong>Team Rotations</strong> — chain up to 3 characters'
          actions together and see the whole team's damage and DPS, not
          just one character on their own.
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDocumentTitle } from "../../composables/useDocumentTitle";

useDocumentTitle(
  "Info — Wuthering Waves Calculator & Optimizer",
  "What the Wuthering Waves Calculator & Optimizer can do: damage calculator, echo optimizer, Echo Rating, convene simulator, inventory, and more.",
);
</script>
