// Small helpers for page titles, meta descriptions and JSON-LD.
import { SITE } from "../config/site";

/** Google shows about 60 characters of a title and 155–160 of a description. */
export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 158;

/** Shorten text to at most `max` characters: at the end of a sentence if
    that keeps most of the text, otherwise at a word boundary with "…". */
export function truncate(text: string, max = DESCRIPTION_MAX): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const sentenceEnd = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "));
  if (sentenceEnd >= max * 0.6) return cut.slice(0, sentenceEnd + 1);
  const words = cut.slice(0, max - 1);
  return words.slice(0, words.lastIndexOf(" ")).replace(/[,;:–-]$/, "") + "…";
}

/** The first candidate that fits into `max` characters (candidates go from
    most to least detailed); the last one is truncated if nothing fits. */
export function firstThatFits(candidates: string[], max: number): string {
  const clean = candidates.map((c) => c.replace(/\s+/g, " ").trim());
  return clean.find((c) => c.length <= max) ?? truncate(clean[clean.length - 1], max);
}

/** Absolute URL for a site path ("/projects/" → "https://…/projects/"). */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE.url).href;
}

/** schema.org BreadcrumbList — Google shows it instead of the raw URL
    in search results ("schreinerei-siegfried.de › Projekte › …"). */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
