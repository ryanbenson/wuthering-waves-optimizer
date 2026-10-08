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
  script.addEventListener("load", flushPendingEvents);
  document.head.appendChild(script);
}

export function trackEvent(eventName: string, data?: Record<string, unknown>) {
  window.umami?.track(eventName, data);
}

// Events fired before the deferred Umami script has loaded (e.g. on app start).
const pendingEvents: Array<[string, Record<string, unknown> | undefined]> = [];

function flushPendingEvents() {
  for (const [eventName, data] of pendingEvents.splice(0)) {
    window.umami?.track(eventName, data);
  }
}

/** Like `trackEvent`, but queues the event until Umami has loaded instead of dropping it. */
export function trackEventWhenReady(eventName: string, data?: Record<string, unknown>) {
  if (window.umami) {
    window.umami.track(eventName, data);
  } else {
    pendingEvents.push([eventName, data]);
  }
}
