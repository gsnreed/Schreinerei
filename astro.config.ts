import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import { SITE } from "./src/config/site";

// `site` is REQUIRED for the sitemap and canonical URLs to be correct.
// It is read from the central config: one single place to change per site.
export default defineConfig({
  site: SITE.url,
  integrations: [
    mdx(),
    // Pages marked noindex (legal notice, privacy policy, 404) stay out of
    // the sitemap: listing them would send Google contradicting signals.
    sitemap({
      filter: (page) =>
        !["/legal-notice/", "/privacy-policy/", "/404/"].some((path) =>
          page.endsWith(path),
        ),
    }),
  ],
});
