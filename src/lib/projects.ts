// Helpers for the "projects" content collection (src/content/projects/).
import { getCollection, type CollectionEntry } from "astro:content";
import { getServices, type Service } from "./services";

export type Project = CollectionEntry<"projects">;

/** All projects, in the order set by their `order` frontmatter field. */
export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection("projects");
  return projects.sort(
    (a, b) =>
      a.data.order - b.data.order ||
      (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0),
  );
}

/** Projects belonging to one service (same order as getProjects). */
export async function getProjectsForService(serviceId: string): Promise<Project[]> {
  return (await getProjects()).filter((p) => p.data.service.id === serviceId);
}

/** Services that have at least one project, with their project count —
    these become the filter chips on /projects/. */
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
  return `/projects/${project.id}/`;
}

/** URL of the project list filtered to one service. */
export function projectCategoryUrl(serviceId: string): string {
  return `/projects/leistung/${serviceId}/`;
}
