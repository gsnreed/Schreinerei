// Structured data for the project lists (/projects/ and the filtered pages).
import { SITE } from "../config/site";
import { projectUrl, type Project } from "./projects";
import { absoluteUrl, breadcrumbJsonLd } from "./seo";

export function projectListJsonLd(
  projects: Project[],
  page: { name: string; description: string; path: string },
  breadcrumbs: { name: string; path: string }[],
) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${absoluteUrl(page.path)}#page`,
      name: page.name,
      description: page.description,
      url: absoluteUrl(page.path),
      inLanguage: SITE.lang,
      isPartOf: { "@id": `${SITE.url}/#website` },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: projects.length,
        itemListElement: projects.map((project, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: absoluteUrl(projectUrl(project)),
          name: project.data.title,
        })),
      },
    },
    breadcrumbJsonLd(breadcrumbs),
  ];
}
