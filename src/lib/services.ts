// Helpers for the "services" content collection (src/content/services/).
import { getCollection, type CollectionEntry } from "astro:content";

export type Service = CollectionEntry<"services">;

/** All services, in the order set by their `order` frontmatter field. */
export async function getServices(): Promise<Service[]> {
  const services = await getCollection("services");
  return services.sort(
    (a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title),
  );
}

/** URL of a service's detail page (the MDX filename is the slug). */
export function serviceUrl(service: Service): string {
  return `/services/${service.id}/`;
}
