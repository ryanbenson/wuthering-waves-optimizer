// Ad-block-resistant analytics via Umami Cloud, reverse-proxied through this app's own
// domain (see vercel.json rewrites) so requests are same-origin and use nondescript paths.
export function injectAnalytics() {
  const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID;
  if (!websiteId || window?.Cypress) {
    return;
  }

  const script = document.createElement("script");
  script.defer = true;
  script.src = "/assets/init.js";
  script.dataset.websiteId = websiteId;
  script.dataset.hostUrl = "/e";
  document.head.appendChild(script);
}

export function trackEvent(eventName: string, data?: Record<string, unknown>) {
  window.umami?.track(eventName, data);
}
