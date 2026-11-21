// Helpers for the "projects" content collection (src/content/projects/).
import { getCollection, type CollectionEntry } from "astro:content";
import { getServices, type Service } from "./services";
import { SITE } from "../config/site";

/** Alphabetical comparison of project titles, German rules (ä after a …) */
const byTitle = (a: Project, b: Project) =>
  a.data.title.localeCompare(b.data.title, SITE.lang);

export type Project = CollectionEntry<"projects">;

/** All projects, newest first (same date: alphabetically). */
export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection("projects");
  return projects.sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime() || byTitle(a, b),
  );
}

/** Projects for the home page: those with `star: true`, alphabetically.
    Stops the build if more than SITE.gallery.featuredCount have a star.
    Without any star, the newest projects are shown instead. */
export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects();
  const max = SITE.gallery.featuredCount;
  const starred = projects.filter((p) => p.data.star).sort(byTitle);

  if (starred.length > max) {
    throw new Error(
      `Zu viele Projekte mit "star: true": ${starred.length}, erlaubt sind höchstens ${max}.\n` +
        starred.map((p) => `  • src/content/projects/${p.id}/index.mdx (${p.data.title})`).join("\n") +
        `\nBitte bei ${starred.length - max} davon "star: false" setzen oder die Zeile entfernen.`,
    );
  }
  return starred.length > 0 ? starred : projects.slice(0, max);
}

/** Projects belonging to one service (same order as getProjects). */
export async function getProjectsForService(serviceId: string): Promise<Project[]> {
  return (await getProjects()).filter((p) => p.data.service.id === serviceId);
}

/** Services that have at least one project, with their project count —
    these become the filter chips on /projekte/. */
export async function getProjectCategories(): Promise<
  { service: Service; count: number }[]
> {
  const [services, projects] = await Promise.all([getServices(), getProjects()]);
  return services
    .map((service) => ({
      service,
      count: projects.filter((p) => p.data.service.id === service.id).length,
    }))
    .filter((c) => c.count > 0);
}

/** Map service id → service title, for the labels on the project cards. */
export async function getServiceTitles(): Promise<Map<string, string>> {
  const services = await getServices();
  return new Map(services.map((s) => [s.id, s.data.title]));
}

/** URL of a project's detail page (the MDX filename is the slug). */
export function projectUrl(project: Project): string {
  return `/projekte/${project.id}/`;
}

/** URL of one photo of a project: 0 = main photo (the project page itself),
    1+ = gallery photos → /projekte/<slug>/foto/2/, /foto/3/ … */
export function projectPhotoUrl(project: Project, index: number): string {
  return index === 0 ? projectUrl(project) : `${projectUrl(project)}foto/${index + 1}/`;
}

/** URL of the project list filtered to one service. */
export function projectCategoryUrl(serviceId: string): string {
  return `/projekte/leistung/${serviceId}/`;
}
