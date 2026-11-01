import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { workNeeds, projectsForNeed, capabilitiesForProjects, type WorkProject } from "@/lib/work-projects";

export function ProjectGrid({ projects, compact = false }: { projects: readonly WorkProject[]; compact?: boolean }) {
  return <div className={`grid gap-x-6 gap-y-12 ${compact ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2"}`}>
    {projects.map((project, index) => <figure key={project.slug} className={`min-w-0 ${!compact && index % 4 === 1 ? "md:pt-16" : ""}`}>
      <Link to="/work/$slug" params={{ slug: project.slug }} className="group block focus-visible:outline-signal">
        <div className="overflow-hidden bg-surface"><img src={project.image} alt={project.imageAlt} loading="lazy" width={960} height={720} className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.015] motion-reduce:transition-none" /></div>
         <figcaption className="mt-4 border-t border-paper/20 pt-4"><span className="text-xs uppercase text-signal">{project.disciplines[0]}</span><div className="mt-2 flex items-start justify-between gap-4"><h3 className="font-display text-2xl leading-snug text-paper group-hover:text-signal">{project.name}</h3><ArrowRight className="mt-1 size-5 shrink-0 text-signal" aria-hidden="true" /></div><p className="mt-2 text-sm leading-relaxed text-neutral">{project.hook}</p><p className="mt-3 text-xs text-neutral">Editorial study · Not project documentation</p></figcaption>
      </Link>
    </figure>)}
  </div>;
}

export function WorkBrowser({ projects, initialDiscipline, initialNeed }: { projects: readonly WorkProject[]; initialDiscipline?: string | undefined; initialNeed?: string | undefined }) {
  const navigate = useNavigate({ from: "/work/" });
  const need = workNeeds.find(value => value.id === initialNeed);
  const jobProjects = projectsForNeed(projects, need?.id);
  const capabilities = capabilitiesForProjects(jobProjects);
  const filter = capabilities.find(value => value === initialDiscipline) ?? "All";
  const [view, setView] = useState<"grid" | "list">("grid");
  const visible = jobProjects.filter(project => filter === "All" || project.disciplines.includes(filter));
  const featured = visible.find(project => project.format === "deep" && project.homepage);
  const stories = visible.filter(project => project.format === "deep" && project !== featured);
  const entries = visible.filter(project => project.format === "compact" && project.truthLabel !== "Archive");
  const archive = visible.filter(project => project.truthLabel === "Archive");
  return <section className="mx-auto max-w-site px-gutter pb-section" aria-label="Browse Made by rOKIt">
    <div className="border-t border-paper/20 py-5"><p className="section-label">What needs to work?</p><div className="mt-3 flex flex-wrap gap-x-6 gap-y-1" role="group" aria-label="Filter by job need">{[{ id: "", label: "All jobs" }, ...workNeeds].map(item => <Button key={item.id} variant="ghost" aria-pressed={(need?.id ?? "") === item.id} onClick={() => void navigate({ search: previous => ({ ...previous, need: item.id || undefined, discipline: undefined }), resetScroll: false })} className="min-h-11 rounded-none px-0 text-paper hover:bg-transparent hover:text-signal aria-pressed:text-signal">{item.label}</Button>)}</div><p className="mt-4 text-xs text-neutral">Relevant work, not a promise of the same result.</p></div>
    <div className="flex flex-col justify-between gap-6 border-y border-paper/20 py-5 lg:flex-row lg:items-center">
      <div className="flex flex-wrap gap-x-5 gap-y-1" role="group" aria-label="Filter by capability">
        {(["All", ...capabilities] as const).map((category) => <Button key={category} type="button" variant="ghost" aria-pressed={filter === category} onClick={() => void navigate({ search: previous => ({ ...previous, discipline: category === "All" ? undefined : category }), resetScroll: false })} className={`h-auto min-h-11 whitespace-normal rounded-none px-0 text-left text-xs leading-snug hover:bg-transparent hover:text-signal ${filter === category ? "text-signal" : "text-neutral"}`}>{category}</Button>)}
      </div>
      <div className="flex shrink-0 border border-paper/25" role="group" aria-label="View projects">
        <Button type="button" variant="ghost" title="Grid view" aria-label="Grid view" aria-pressed={view === "grid"} onClick={() => setView("grid")} className={`size-11 rounded-none hover:bg-transparent hover:text-signal ${view === "grid" ? "text-signal" : "text-neutral"}`}><LayoutGrid className="size-4" /></Button>
        <Button type="button" variant="ghost" title="List view" aria-label="List view" aria-pressed={view === "list"} onClick={() => setView("list")} className={`size-11 rounded-none border-l border-paper/25 hover:bg-transparent hover:text-signal ${view === "list" ? "text-signal" : "text-neutral"}`}><List className="size-4" /></Button>
      </div>
    </div>
    <p className="sr-only" role="status">{visible.length} projects shown.</p>
    {view === "grid" ? <div className="mt-10 space-y-14">
      {featured && <section aria-label="Featured story"><h2 className="section-label mb-6">Featured story</h2><Link to="/work/$slug" params={{ slug: featured.slug }} className="group grid items-end gap-6 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]"><img src={featured.image} alt={featured.imageAlt} width={1200} height={900} className="aspect-[16/10] w-full object-cover" /><div><p className="text-xs text-neutral">Editorial study · Not project documentation</p><h3 className="mt-5 font-display text-3xl group-hover:text-signal">{featured.name}</h3><p className="mt-4 max-w-[35ch] font-display text-xl leading-relaxed">{featured.hook}</p><ArrowRight className="mt-6 text-signal" aria-hidden="true" /></div></Link></section>}
      {stories.length > 0 && <section className="work-story-grid" aria-label="Project stories"><h2 className="section-label mb-6">Project stories</h2><ProjectGrid projects={stories} /></section>}
      {entries.length > 0 && <section aria-label="Smaller entries"><h2 className="section-label mb-6">Smaller entries</h2><ProjectGrid projects={entries} compact /></section>}
      {archive.length > 0 && <section aria-label="From the rOKIt archive"><h2 className="section-label mb-6">From the <span className="normal-case">rOKIt</span> archive</h2><ProjectGrid projects={archive} compact /></section>}
    </div> : <div className="mt-6 border-t border-paper/15">{visible.map((project) => <Link key={project.slug} to="/work/$slug" params={{ slug: project.slug }} className="group grid min-h-28 gap-3 border-b border-paper/15 py-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,.5fr)_auto] md:items-center md:gap-6"><span><span className="block font-display text-xl group-hover:text-signal md:text-2xl">{project.name}</span><span className="mt-2 block text-sm text-neutral">{project.hook}</span></span><span className="text-xs leading-relaxed text-neutral">{project.disciplines.join(" · ")}</span><span className="text-xs text-neutral">{project.sector ?? ""}</span><ArrowRight className="size-4 text-signal" aria-hidden="true" /></Link>)}</div>}
    {visible.length === 0 && <p className="py-12 text-neutral">No published entries match these choices. Try another job or service.</p>}
  </section>;
}
