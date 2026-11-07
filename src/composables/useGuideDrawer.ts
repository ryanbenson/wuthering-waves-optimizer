import { ref } from "vue";
import { trackEvent } from "../utils/analytics";

/**
 * The one guide drawer (guides/GuideDrawer.vue, mounted in AppLayout). Any screen opens
 * a guide beside itself with openGuide(slug); it's the same copy as /info/guides/:slug.
 * v3 only: classic keeps its guide modals (ADR 0055).
 */
const openSlug = ref<string | null>(null);

export function useGuideDrawer() {
  /** `source` names where it was opened from, for analytics. */
  function openGuide(slug: string, source: string) {
    openSlug.value = slug;
    trackEvent("guide-drawer-opened", { guide: slug, source });
  }

  function closeGuide() {
    openSlug.value = null;
  }

  return { openSlug, openGuide, closeGuide };
}
