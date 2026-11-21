// Content collections. Each service is one MDX file in src/content/services/:
// the frontmatter feeds the tile on the home page, the body is the detail page
// at /leistungen/<filename>/. Adding a file adds both — no other edits needed.
// Projects: one folder per project, src/content/projects/<name>/ with the
// text (index.mdx) and all its photos. The folder name becomes the URL
// (/projekte/<name>/); deleting the folder removes the project completely.
// → project cards
// (home page, /projekte/, /projekte/leistung/<service>/, the service page)
// and a detail page at /projekte/<filename>/.
import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const services = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/services" }),
  schema: z.object({
    title: z.string(),
    /** Short text shown on the tile (also used as meta description) */
    description: z.string(),
    /** Key from the PATHS map in src/components/Icon.astro */
    icon: z.string(),
    /** Position in the services grid (ascending) */
    order: z.number().int().default(100),
    /** Optional SEO overrides; generated from title + description if left out */
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({
    pattern: "*/index.mdx",
    base: "./src/content/projects",
    // "kochinsel-aus-holz/index.mdx" → id "kochinsel-aus-holz" (= the URL)
    generateId: ({ entry }) => entry.split("/")[0],
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Short text: card caption, intro + meta description on the detail page */
      description: z.string(),
      /** Filename (without .mdx) of the matching service in src/content/services/.
          Drives the filter on /projekte/, the label on the cards and the
          "Projekte zu dieser Leistung" block on the service page. */
      service: reference("services"),
      /** Main photo. Photos sit in the project's own folder, next to
          index.mdx, so the path is just "./foo.jpg".
          IMPORTANT: remove the GPS location from phone photos before adding
          them (the original file is published too and would reveal the
          customer's address), e.g. `exiftool -gps:all= foto.jpg`. */
      image: image(),
      /** Describe what is visible (wood, room, details) — read by screen readers and Google */
      imageAlt: z.string(),
      /** Project photos are shown SQUARE (cards and project page). Most photos
          are wider than tall, so the sides get cut off. This sets which part
          stays visible: "center" (default), "left", "right", "top", "bottom",
          combinations like "left top", or percentages like "30% 50%"
          (30 % from the left, 50 % from the top). */
      imagePosition: z.string().default("center"),
      /** Optional extra photos (details, before/after, workshop): square
          thumbnails below the main photo; a click opens the full photo.
          Each one can have its own `position` (same values as imagePosition). */
      gallery: z
        .array(
          z.object({
            image: image(),
            alt: z.string(),
            position: z.string().default("center"),
          }),
        )
        .default([]),
      /** Optional facts shown in the info box on the detail page */
      location: z.string().optional(),
      material: z.string().optional(),
      /** Optional SEO overrides. Leave out and both are generated from
          title, service and description (see src/pages/projekte/[slug].astro) */
      seoTitle: z.string().optional(),
      seoDescription: z.string().optional(),
      /** Optional; only used as a tie-breaker when sorting (not displayed) */
      date: z.coerce.date().optional(),
      /** Position in the lists (ascending); the first ones appear on the home page */
      order: z.number().int().default(100),
    }),
});

// Free-form pages written in MDX: src/content/seiten/<name>.mdx → /<name>/.
// Text, headings, lists and photos in the body; header photo and photo grid
// in the frontmatter. Used for "Werkstatt & Team" (werkstatt.mdx).
const seiten = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/seiten" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Intro under the heading; also the meta description in Google */
      description: z.string(),
      /** Small label above the heading (optional) */
      eyebrow: z.string().optional(),
      /** Large photo next to the intro (optional) */
      image: image().optional(),
      imageAlt: z.string().default(""),
      /** Photo grid below the text (optional) */
      gallery: z
        .array(z.object({ image: image(), alt: z.string(), caption: z.string().optional() }))
        .default([]),
      /** Optional SEO title (otherwise "<title> | Schreinerei Siegfried, Pocking") */
      seoTitle: z.string().optional(),
    }),
});

export const collections = { services, projects, seiten };
