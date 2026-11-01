import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { RokitSiteFooter } from "@/components/rokit-site-footer";
import { RokitSiteHeader } from "@/components/rokit-site-header";
import { servicePaths, publicProjects, type WorkProject } from "@/lib/work-projects";

function RelatedWork({ project }: { project: WorkProject }) {
  const related = publicProjects.filter((candidate) => candidate.slug !== project.slug && candidate.disciplines.some((discipline) => project.disciplines.includes(discipline))).slice(0, 3);
  return <section className="border-t border-paper/15"><div className="mx-auto max-w-site px-gutter py-section"><p className="section-label">Related work</p><div className="mt-8 grid gap-6 md:grid-cols-3">{related.map((item) => <Link key={item.slug} to="/work/$slug" params={{ slug: item.slug }} className="group border-t border-paper/20 py-5"><span className="text-xs text-signal">{item.disciplines[0]}</span><h3 className="mt-3 font-display text-xl group-hover:text-signal">{item.name}</h3><ArrowRight className="mt-4 size-4 text-signal" aria-hidden="true" /></Link>)}</div></div></section>;
}

export function WorkCase({ project }: { project: WorkProject }) {
  const story = project.story;
  const storySections: [string, string | undefined][] = story ? [
    ["Situation", story.situation], ["Audience / end user", story.audience], ["What we saw", story.observation],
    ["Process", story.process], ["Result", story.result], ["Lesson", story.lesson],
  ] : [];
  const publishedSections = storySections.filter((entry): entry is [string, string] => typeof entry[1] === "string" && entry[1].length > 0);
  return <div className="min-h-screen bg-night font-body text-paper"><RokitSiteHeader /><main>
    <article>
      <header className="mx-auto max-w-site px-gutter pb-16 pt-section"><Link to="/work" className="action-link min-h-11 text-signal hover:text-paper">← Made by rOKIt</Link><p className="section-label mt-10">{project.name}{project.sector ? ` · ${project.sector}` : ""}</p><h1 className="mt-6 max-w-[19ch] font-display text-[clamp(2.8rem,7vw,6rem)] leading-[1.08]">{project.hook}</h1>{project.secondary && <p className="mt-6 font-display text-2xl text-paper/75">{project.secondary}</p>}<p className="mt-8 max-w-[62ch] text-sm leading-relaxed text-neutral">{project.disciplines.join(" · ")}</p>{project.truthLabel && <p className="mt-6 text-xs uppercase text-signal">{project.truthLabel}</p>}</header>
      <section className="bg-paper text-night"><div className={`mx-auto grid max-w-site gap-10 px-gutter py-section ${project.contribution || project.principle ? "md:grid-cols-[minmax(0,1.25fr)_minmax(16rem,.75fr)]" : "md:grid-cols-1"}`}><figure><img src={project.image} alt={project.imageAlt} className="aspect-[4/3] w-full object-cover" width={1200} height={900} /><figcaption className="mt-3 text-xs text-night/60">Editorial study · Not project documentation</figcaption></figure>{project.contribution || project.principle ? <div className="border-t border-night/20 pt-5"><p className="section-label !text-night/60">{project.contribution ? "rOKIt contribution" : "Principle"}</p>{project.contribution && <p className="mt-6 font-display text-2xl leading-relaxed">{project.contribution}</p>}{project.principle && <p className="mt-8 border-l-2 border-signal pl-4 font-display text-xl leading-relaxed">{project.principle}</p>}</div> : null}</div></section>
       {publishedSections.length > 0 ? <section className="mx-auto max-w-site px-gutter py-section" aria-label="Project story"><div className="border-t border-paper/20">{publishedSections.map(([label, copy]) => <div key={label} className="grid gap-4 border-b border-paper/20 py-8 md:grid-cols-[minmax(0,.35fr)_minmax(0,1fr)]"><h2 className="text-xs uppercase text-signal">{label}</h2><p className="max-w-[65ch] font-display text-xl leading-relaxed md:text-2xl">{copy}</p></div>)}</div></section> : null}
       {project.evidence?.length ? <section className="mx-auto max-w-site px-gutter pb-section" aria-label="Project evidence"><h2 className="section-label mb-8">Project evidence</h2><div className="grid gap-10 md:grid-cols-2">{project.evidence.map((item) => <figure key={item.src}><img src={item.src} alt={item.alt} loading="lazy" className="aspect-[4/3] w-full object-cover" /><figcaption className="mt-3 text-xs text-neutral">{item.caption}</figcaption></figure>)}</div></section> : null}
       <section className="mx-auto max-w-site px-gutter py-section"><h2 className="section-label">Related services</h2><div className="mt-8 border-t border-paper/20">{project.disciplines.map((discipline) => <Link key={discipline} to={servicePaths[discipline]} className="group flex min-h-20 items-center justify-between gap-6 border-b border-paper/20 py-4 font-display text-xl hover:text-signal md:text-2xl">{discipline}<ArrowRight className="size-5 shrink-0 text-signal" aria-hidden="true" /></Link>)}</div>{story?.relatedIdea ? <p className="mt-8 text-sm text-neutral">{story.relatedIdea}</p> : null}<Link to="/ideas" className="action-link mt-6 min-h-11 text-signal hover:text-paper">Explore Ideas <ArrowRight aria-hidden="true" /></Link></section>
      <RelatedWork project={project} />
      <section className="border-t-2 border-signal"><div className="mx-auto max-w-site px-gutter py-section"><h2 className="font-display text-4xl md:text-5xl">What are you trying to make work?</h2><Link to="/start-a-project" className="action-link mt-8 min-h-12 bg-signal px-6 font-semibold text-night hover:bg-paper">Start a Project <ArrowRight className="size-4" aria-hidden="true" /></Link></div></section>
    </article>
  </main><RokitSiteFooter /></div>;
}
