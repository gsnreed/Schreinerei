// Content collections. Each service is one MDX file in src/content/services/:
// the frontmatter feeds the tile on the home page, the body is the detail page
// at /services/<filename>/. Adding a file adds both — no other edits needed.
// Projects work the same way: src/content/projects/*.mdx → gallery cards
// (home page + /projects/) and a detail page at /projects/<filename>/.
import { defineCollection } from "astro:content";
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
      /** Short text: card caption on /projects/, intro + meta description on the detail page */
      description: z.string(),
      /** Path relative to the MDX file, e.g. "../../images/projects/foo.jpg" (optimized by astro:assets) */
      image: image(),
      imageAlt: z.string(),
      /** Project date, YYYY-MM-DD */
      date: z.coerce.date(),
      /** Position in the gallery (ascending); the first one is the large featured tile */
      order: z.number().int().default(100),
    }),
});

export const collections = { services, projects };
