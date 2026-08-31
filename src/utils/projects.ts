import { getCollection, type CollectionEntry } from "astro:content";

export type ProjectEntry = CollectionEntry<"projects">;

export async function getPublishedProjects(): Promise<ProjectEntry[]> {
  const projects = await getCollection("projects", ({ data }) => !data.draft);

  return projects.sort(
    (left, right) =>
      Number(right.data.featured) - Number(left.data.featured)
      || left.data.order - right.data.order
      || left.data.title.localeCompare(right.data.title)
  );
}

export function projectUrl(project: ProjectEntry): string {
  return `/projects/${project.id}/`;
}
