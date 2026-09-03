import { watchEffect, type MaybeRefOrGetter, toValue } from "vue";

const BASE_META_DESCRIPTION_SELECTOR = 'meta[name="description"]';

/**
 * Sets document.title and the page's meta description for as long as the
 * calling component is mounted. No unmount-reset - the next page's own
 * call simply overwrites it, same as any other SPA title composable.
 *
 * This is the first place in the app that manages per-route document
 * metadata (grep confirms zero prior `document.title` usage) - see
 * docs/adr/0024-info-page-nested-routes-redesign.md.
 */
export function useDocumentTitle(
  title: MaybeRefOrGetter<string>,
  description?: MaybeRefOrGetter<string>,
) {
  watchEffect(() => {
    document.title = toValue(title);

    const descriptionValue = description ? toValue(description) : undefined;
    if (!descriptionValue) return;

    let meta = document.querySelector(BASE_META_DESCRIPTION_SELECTOR);
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", descriptionValue);
  });
}
