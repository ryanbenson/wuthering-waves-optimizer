<template>
  <div class="bg-base-200 rounded-xl p-4 flex flex-col gap-4">
    <div>
      <div class="text-[.65rem] font-bold uppercase tracking-wider opacity-50 mb-2">
        Community
      </div>
      <p class="text-sm opacity-80">
        Want to keep up with the latest, share ideas, or report a bug?
        <a href="https://discord.gg/pDKjxNjJWW" target="_blank" class="link font-semibold">
          Join the Discord!
        </a>
        <br />
        Prefer to browse the source or file an issue directly?
        <a
          href="https://github.com/ryanbenson/wuthering-waves-optimizer"
          target="_blank"
          class="link font-semibold">
          View it on GitHub.
        </a>
      </p>
    </div>

    <div>
      <div class="text-[.65rem] font-bold uppercase tracking-wider opacity-50 mb-2">
        Developers
      </div>
      <ul class="text-sm opacity-80 flex flex-col gap-1">
        <li>Author: @LavaSnake</li>
        <li>Contributors: @flysand</li>
      </ul>
    </div>

    <div>
      <div class="text-[.65rem] font-bold uppercase tracking-wider opacity-50 mb-2">
        Shoutouts
      </div>
      <ul class="text-sm opacity-80 flex flex-col gap-1">
        <li>
          Jäger, Bachelor, Nekuro (NekroLight), AlecJohn, juste — for all of
          your help with the calculations and great ideas!
        </li>
        <li>Namelag, and Dustin for all of your help with the Spectro Frazzle formula!</li>
        <li>noyaosu for your help in data gathering for Aero Erosion!</li>
        <li>F.I.S.H. and invidia.exe for your help in figuring out Tune Break!</li>
      </ul>
    </div>

    <div class="pt-1 border-t border-base-300">
      <RouterLink to="/privacy" class="link text-sm">Privacy Policy →</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDocumentTitle } from "../../composables/useDocumentTitle";

useDocumentTitle(
  "Credits & Community — Wuthering Waves Calculator & Optimizer",
  "Developers, contributors, and community links for the Wuthering Waves Calculator & Optimizer.",
);
</script>
