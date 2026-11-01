import { createFileRoute, notFound } from "@tanstack/react-router";
import { RokitNotFound } from "@/components/rokit-not-found";

export const Route = createFileRoute("/$")({
  loader: () => { throw notFound(); },
  head: () => ({ meta: [
    { title: "A missing connection — rOKIt" },
    { name: "description", content: "Find your next connection: Home, Made by rOKIt or Start a Project." },
    { property: "og:title", content: "A missing connection — rOKIt" },
    { property: "og:description", content: "Find your next connection with rOKIt." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "robots", content: "noindex" },
  ] }),
  notFoundComponent: RokitNotFound,
});