import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { WorkBrowser } from "@/components/made-by-rokit";
import { RokitSiteFooter } from "@/components/rokit-site-footer";
import { RokitSiteHeader } from "@/components/rokit-site-header";
import { publicProjects } from "@/lib/work-projects";

export const Route = createFileRoute("/work/")({
  validateSearch: z.object({ discipline: z.string().optional(), need: z.string().optional() }),
  head: () => ({ meta: [{ title: "Made by rOKIt — Work That Had to Survive the Real World" }, { name: "description", content: "Brands, websites, campaigns, publications and physical work that still had a job to do once the presentation ended." }, { property: "og:title", content: "Made by rOKIt — Work That Had to Survive the Real World" }, { property: "og:description", content: "Brands, websites, campaigns, publications and physical work that still had a job to do once the presentation ended." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: WorkPage,
});

function WorkPage() {
  const { discipline, need } = Route.useSearch();
  return <div className="min-h-screen bg-night font-body text-paper"><RokitSiteHeader /><main>
     <section className="mx-auto max-w-site px-gutter pb-12 pt-section md:pb-20"><p className="section-label">Made by rOKIt</p><h1 className="mt-7 max-w-[16ch] font-display text-[clamp(3.2rem,8vw,7rem)] leading-[1.04]">Don’t Just Look at What We Made. See What the Job Required.</h1><p className="mt-8 max-w-[57ch] text-lg leading-relaxed text-paper/70">The work had to survive the real world.</p><p className="mt-4 max-w-[57ch] text-sm leading-relaxed text-neutral">The work below includes editorial studies where cleared project photography is not yet available; these images are not production evidence.</p></section>
    <WorkBrowser projects={publicProjects} initialDiscipline={discipline} initialNeed={need} />
  </main><RokitSiteFooter /></div>;
}
