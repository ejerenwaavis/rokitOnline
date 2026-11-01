import { createFileRoute, notFound } from "@tanstack/react-router";
import { WorkCase } from "@/components/work-case";
import { publicProjects } from "@/lib/work-projects";

export const Route = createFileRoute("/work/$slug")({
  loader: ({ params }) => {
    const project = publicProjects.find((item) => item.slug === params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.project.name} — Made by rOKIt` : "Work not found — rOKIt";
    const description = loaderData?.project.hook ?? "Explore work made by rOKIt.";
    return { meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary_large_image" }, ...(loaderData?.project.image.startsWith("https://") ? [{ property: "og:image", content: loaderData.project.image }, { name: "twitter:image", content: loaderData.project.image }] : [])] };
  },
  component: WorkProjectPage,
});
function WorkProjectPage() {
  const { project } = Route.useLoaderData();
  return <WorkCase project={project} />;
}
