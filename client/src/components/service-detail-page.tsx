import type { CSSProperties, ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { RokitSiteHeader } from "@/components/rokit-site-header";
import { RokitSiteFooter } from "@/components/rokit-site-footer";
import type { Discipline } from "@/lib/work-projects";

type ServiceVariant = "brand" | "digital" | "marketing" | "communication" | "physical";
type ServiceDetailProps = { variant: ServiceVariant; index: string; title: string; support: string; secondary?: string; sections: string[]; cta: string; discipline: Discipline; capabilities?: string[]; quote?: { text: string; attribution: string }; process?: string; feature?: ReactNode };

const numberFor = (position: number) => String(position + 1).padStart(2, "0");

function StandardThinking({ variant, sections }: { variant: Exclude<ServiceVariant, "physical">; sections: string[] }) {
  if (variant === "brand") return <div className="service-brand-sequence">{sections.map((section, position) => <article key={section} className="service-brand-decision"><span aria-hidden="true" className="service-recognition-mark" /><span className="service-step-number">{numberFor(position)}</span><h2>{section}</h2></article>)}</div>;
  if (variant === "digital") return <div className="service-digital-sequence">{sections.map((section, position) => <article key={section} className="service-digital-stage"><span className="service-step-number">{numberFor(position)}</span><span aria-hidden="true" className="service-digital-node" /><h2>{section}</h2></article>)}</div>;
  if (variant === "marketing") return <div className="service-marketing-sequence">{sections.map((section, position) => <article key={section} className="service-marketing-decision" style={{ "--decision-step": position } as CSSProperties}><span className="service-step-number">{numberFor(position)}</span><h2>{section}</h2></article>)}</div>;
  return <div className="service-communication-sequence">{sections.map((section, position) => <article key={section} className="service-communication-argument"><span className="service-step-number">{numberFor(position)}</span><h2>{section}</h2></article>)}</div>;
}

function PhysicalThinking({ sections }: { sections: string[] }) {
  const groups = [{ title: "Before production", items: sections.slice(0, 5), start: 0 }, { title: "Protect the approved outcome", items: sections.slice(5, 7), start: 5 }, { title: "Quality & delivery", items: sections.slice(7, 10), start: 7 }];
  const controlNote = sections[10];
  return <div className="service-physical-sequence">{groups.map((group) => <section key={group.title} className="service-production-group"><header><span className="service-production-group-number">{numberFor(group.start)}</span><h2>{group.title}</h2></header><div>{group.items.map((section, position) => <article key={section}><span className="service-step-number">{numberFor(group.start + position)}</span><h3>{section}</h3></article>)}</div></section>)}{controlNote ? <aside className="service-control-note"><span className="section-label !text-night/55">Control note</span><p>{controlNote}</p></aside> : null}</div>;
}

function ProductionRail({ process }: { process: string }) {
  const stages = process.split("→").map((stage) => stage.trim());
  return <section className="service-production-rail-section"><div className="mx-auto max-w-site px-gutter py-16 md:py-20"><p className="section-label">Controlled production</p><ol className="service-production-rail">{stages.map((stage, position) => <li key={stage}><span>{numberFor(position)}</span><strong>{stage}</strong></li>)}</ol></div></section>;
}

export function ServiceDetailPage({ variant, index, title, support, secondary, sections, cta, discipline, capabilities, quote, process, feature }: ServiceDetailProps) {
  return <div className="min-h-screen bg-night font-body text-paper selection:bg-signal selection:text-night"><RokitSiteHeader /><main className={`service-detail service-detail-${variant}`}>
    <section className="service-detail-hero mx-auto grid min-h-[74svh] max-w-site grid-cols-12 content-between gap-x-6 gap-y-12 px-gutter py-14 md:py-20"><div className="service-detail-hero-copy col-span-12 md:col-span-10"><p className="section-label">{index} — Services</p><h1 className="mt-8 max-w-[13ch] font-display text-[clamp(3.2rem,7.5vw,7rem)] leading-[0.98]">{title}</h1>{secondary ? <p className="mt-6 font-display text-2xl italic text-signal">{secondary}</p> : null}<p className="mt-8 max-w-[60ch] text-lg leading-relaxed text-paper/70">{support}</p></div><div className="col-span-12 flex flex-wrap gap-6 border-t border-paper/15 pt-5 text-xs uppercase text-neutral"><Link to="/what-we-do" className="min-h-11 py-3 hover:text-signal">All Services</Link><Link to="/work" search={{ discipline }} className="min-h-11 py-3 hover:text-signal">Relevant Work</Link></div></section>
    {feature}
    <section className="service-thinking bg-paper text-night"><div className="mx-auto max-w-site px-gutter py-section"><p className="section-label !text-night/55">How we think about it</p>{variant === "physical" ? <PhysicalThinking sections={sections} /> : <StandardThinking variant={variant} sections={sections} />}{quote ? <blockquote className="service-founder-quote"><p>“{quote.text}”</p><footer>— {quote.attribution}</footer></blockquote> : null}</div></section>
    {capabilities ? <section className="service-capabilities"><div className="mx-auto grid max-w-site grid-cols-12 gap-8 px-gutter py-section"><div className="col-span-12 md:col-span-4"><p className="section-label">Capabilities</p><h2 className="mt-5 font-display text-4xl">Built around the job.</h2></div><ol className="service-digital-stack col-span-12 md:col-span-7 md:col-start-6">{capabilities.map((item, position) => <li key={item}><span>{numberFor(position)}</span><strong>{item}</strong></li>)}</ol></div></section> : null}
    {process ? <ProductionRail process={process} /> : null}
     <section className="border-t border-paper/15"><div className="mx-auto grid max-w-site gap-8 px-gutter py-12 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"><div><h2 className="section-label">Keep following the question</h2><p className="mt-4 max-w-[48ch] font-display text-xl">The work and the thinking belong together.</p></div><div className="flex flex-wrap gap-x-8 gap-y-2"><Link to="/work" search={{ discipline }} className="action-link min-h-11 text-signal hover:text-paper">See related work <ArrowRight aria-hidden="true" /></Link><Link to="/ideas" className="action-link min-h-11 text-signal hover:text-paper">Read Ideas <ArrowRight aria-hidden="true" /></Link></div></div></section>
     <section className="border-t-2 border-signal"><div className="mx-auto max-w-site px-gutter py-20 md:py-28"><h2 className="max-w-[17ch] font-display text-4xl leading-tight md:text-6xl">{cta}</h2><Link to="/start-a-project" className="action-link mt-9 min-h-12 bg-signal px-7 font-semibold text-night hover:bg-paper">Start a Project <ArrowRight aria-hidden="true" /></Link></div></section>
  </main><RokitSiteFooter /></div>;
}