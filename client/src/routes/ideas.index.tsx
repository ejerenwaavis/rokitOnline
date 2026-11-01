import { createFileRoute } from "@tanstack/react-router";
import { IdeasPage } from "./ideas";
import { z } from "zod";

export const Route = createFileRoute("/ideas/")({
  validateSearch: z.object({ format: z.enum(["Framework", "Perspective", "Founder note", "Story & lesson", "Practical answer"]).optional().catch(undefined) }),
  head: () => ({ meta: [{ title: "Ideas — Writing shaped by the work at rOKIt" }, { name: "description", content: "Practice notes, founder perspectives and evidence-informed thinking from rOKIt." }, { property: "og:title", content: "Ideas — Writing shaped by the work at rOKIt" }, { property: "og:description", content: "What the work keeps teaching us." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: IdeasPage,
});