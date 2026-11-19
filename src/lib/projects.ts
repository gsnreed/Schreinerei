// Helpers for the "projects" content collection (src/content/projects/).
import { getCollection, type CollectionEntry } from "astro:content";
import { SITE } from "../config/site";

export type Project = CollectionEntry<"projects">;

/** All projects, in the order set by their `order` frontmatter field. */
export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection("projects");
  return projects.sort(
    (a, b) => a.data.order - b.data.order || b.data.date.getTime() - a.data.date.getTime(),
  );
}

/** URL of a project's detail page (the MDX filename is the slug). */
export function projectUrl(project: Project): string {
  return `/projects/${project.id}/`;
}

/** Date in the site's language, e.g. "24. Juni 2025". */
export function formatProjectDate(date: Date): string {
  return new Intl.DateTimeFormat(SITE.lang, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
