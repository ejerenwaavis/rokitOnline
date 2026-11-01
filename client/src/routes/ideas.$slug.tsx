import { createFileRoute, notFound } from "@tanstack/react-router";
import { IdeaArticle } from "@/components/idea-article";
import { findIdea } from "@/lib/ideas-content";

export const Route = createFileRoute("/ideas/$slug")({
  loader: ({ params }) => { const article = findIdea(params.slug); if (!article) throw notFound(); return article; },
  head: ({ loaderData }) => ({ meta: [
    { title: `${loaderData?.title ?? "Unavailable"} — rOKIt Ideas` },
    { name: "description", content: loaderData?.answer ?? loaderData?.deck ?? "Writing shaped by the work at rOKIt." },
    { property: "og:title", content: `${loaderData?.title ?? "Unavailable"} — rOKIt Ideas` },
    { property: "og:description", content: loaderData?.deck ?? "Writing shaped by the work at rOKIt." },
    { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary_large_image" },
    ...(!loaderData ? [{ name: "robots", content: "noindex" }] : []),
  ] }),
  component: ArticlePage,
});
function ArticlePage() { return <IdeaArticle article={Route.useLoaderData()} />; }
