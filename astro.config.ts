import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import { readdirSync } from "node:fs";
import { SITE } from "./src/config/site";

// --- Redirects from the old English URLs ------------------------------------
// The site used to live at /projects/, /services/, /legal-notice/ and
// /privacy-policy/. Old links (Google, bookmarks, shared links) keep working:
// Astro writes a small forwarding page for every old URL. On Apache hosts,
// public/.htaccess additionally answers with a real "301 Moved Permanently".
const slugs = (dir: string) =>
  readdirSync(new URL(dir, import.meta.url))
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
const projectSlugs = slugs("./src/content/projects/");
const serviceSlugs = slugs("./src/content/services/");

const redirects: Record<string, string> = {
  "/projects": "/projekte/",
  "/legal-notice": "/impressum/",
  "/privacy-policy": "/datenschutz/",
  ...Object.fromEntries(projectSlugs.map((s) => [`/projects/${s}`, `/projekte/${s}/`])),
  ...Object.fromEntries(serviceSlugs.map((s) => [`/services/${s}`, `/leistungen/${s}/`])),
};

// `site` is REQUIRED for the sitemap and canonical URLs to be correct.
// It is read from the central config: one single place to change per site.
export default defineConfig({
  site: SITE.url,
  redirects,
  integrations: [
    mdx(),
    // Pages marked noindex (legal notice, privacy policy, 404) stay out of
    // the sitemap: listing them would send Google contradicting signals.
    sitemap({
      // Photo pages of a project (/projekte/<slug>/foto/2/) only switch the
      // main photo; the project page itself is the one for Google.
      filter: (page) =>
        !["/impressum/", "/datenschutz/", "/404/"].some((path) =>
          page.endsWith(path),
        ) && !page.includes("/foto/"),
    }),
  ],
});
