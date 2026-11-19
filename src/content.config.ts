// Content collections. Each service is one MDX file in src/content/services/:
// the frontmatter feeds the tile on the home page, the body is the detail page
// at /services/<filename>/. Adding a file adds both — no other edits needed.
// Projects work the same way: src/content/projects/*.mdx → project cards
// (home page, /projects/, /projects/leistung/<service>/, the service page)
// and a detail page at /projects/<filename>/.
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
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Short text: card caption, intro + meta description on the detail page */
      description: z.string(),
      /** Filename (without .mdx) of the matching service in src/content/services/.
          Drives the filter on /projects/, the label on the cards and the
          "Projekte zu dieser Leistung" block on the service page. */
      service: reference("services"),
      /** Main photo. Path relative to the MDX file, e.g. "../../images/projects/foo.jpg".
          IMPORTANT: remove the GPS location from phone photos before adding
          them (the original file is published too and would reveal the
          customer's address), e.g. `exiftool -gps:all= foto.jpg`. */
      image: image(),
      /** Describe what is visible (wood, room, details) — read by screen readers and Google */
      imageAlt: z.string(),
      /** Optional extra photos (details, before/after, workshop), shown below the main photo */
      gallery: z
        .array(z.object({ image: image(), alt: z.string() }))
        .default([]),
      /** Optional facts shown in the info box on the detail page */
      location: z.string().optional(),
      material: z.string().optional(),
      /** Optional SEO overrides. Leave out and both are generated from
          title, service and description (see src/pages/projects/[slug].astro) */
      seoTitle: z.string().optional(),
      seoDescription: z.string().optional(),
      /** Optional; only used as a tie-breaker when sorting (not displayed) */
      date: z.coerce.date().optional(),
      /** Position in the lists (ascending); the first ones appear on the home page */
      order: z.number().int().default(100),
    }),
});

export const collections = { services, projects };
