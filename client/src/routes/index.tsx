import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

import brandIdentity from "@/assets/rokit-brand-identity.jpg";
import editorial from "@/assets/rokit-editorial.jpg";
import implementation from "@/assets/rokit-implementation.jpg";
import madeReal from "@/assets/rokit-made-real.jpg";
import { KineticHeroGrid } from "@/components/kinetic-hero-grid";
import { LabSystem, ProblemNavigator, ServicesSystem } from "@/components/rokit-interactive-sections";
import { ProjectGrid } from "@/components/made-by-rokit";
import { RokitSiteFooter } from "@/components/rokit-site-footer";
import { RokitSiteHeader } from "@/components/rokit-site-header";
import { Button } from "@/components/ui/button";
import { ThinkingSequence } from "@/components/thinking-sequence";
import { homepageProjects } from "@/lib/work-projects";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "rOKIt — We Make Ideas RocK." },
    { name: "description", content: "We start with what needs to work—then bring together the brand, digital, communication and production it takes to make it happen." },
    { property: "og:title", content: "rOKIt — We Make Ideas RocK." },
    { property: "og:description", content: "We start with what needs to work—then bring together the brand, digital, communication and production it takes to make it happen." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: HomePage,
});

const heroThoughts = [
  ["A brand people recognise.", "Strategy · Naming · Logo & Identity · Brand Systems"],
  ["A digital experience that works.", "Websites · E-commerce · Platforms · Digital Products"],
  ["A campaign people notice.", "Campaigns · Content · Social · Activation"],
  ["Communication people understand.", "Reports · Publications · Presentations · Information Design"],
  ["A presence in the real world.", "Print · Apparel · Merchandise · Packaging · Signage · Displays"],
] as const;
const capabilities = ["Brand Identity", "Websites", "E-commerce", "Campaigns", "Social", "Publications", "Print", "Custom Apparel", "Merchandise", "Packaging", "Signage", "Corporate Gifts", "Event Branding", "Production"] as const;
const serviceNeeds = [
  ["A clear direction.", "Strategy & thinking"],
  ["A recognisable identity.", "Brand & identity"],
  ["A digital home.", "Websites & digital"],
  ["Attention and momentum.", "Marketing & growth"],
  ["A story people understand.", "Communication & content"],
  ["A real-world presence.", "Physical brand & production"],
] as const;
const processStages = [
  ["Understand", "What needs to happen, for whom, and why?"],
  ["Connect", "Bring the right thinking, people and capabilities together."],
  ["Create", "Turn direction into a clear creative response."],
  ["Make", "Build, produce or implement what the job requires."],
  ["Check", "Test the work against its audience, purpose and real-world use."],
  ["Refine", "Improve what needs improving before it goes out into the world."],
] as const;
function SectionLabel({ children }: { children: React.ReactNode }) { return <p className="section-label">{children}</p>; }

function ProcessTeaser() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry?.isIntersecting ?? false), { threshold: 0.1 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!visible || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % processStages.length), 4200);
    return () => window.clearInterval(timer);
  }, [visible, paused]);
  const currentStage = processStages[active] ?? processStages[0];
  return (
    <section ref={sectionRef} className="homepage-process border-t border-paper/15" aria-labelledby="process-title" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}>
      <div className="mx-auto grid max-w-site gap-10 px-gutter py-16 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:py-20">
        <div><h2 id="process-title" className="section-label">How we work</h2><Link to="/about" className="action-link mt-7 min-h-11 text-signal hover:text-paper">Explore our process <ArrowRight aria-hidden="true" /></Link></div>
        <div className="min-w-0"><ol className="process-path grid grid-cols-3 gap-y-6 border-t border-paper/20 pt-5 md:grid-cols-6">
          {processStages.map(([stage], index) => <li key={stage} className="min-w-0"><Button type="button" variant="ghost" onClick={() => setActive(index)} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} aria-pressed={active === index} aria-controls="process-detail" className={`process-point h-auto min-h-11 w-full flex-col items-start justify-start gap-2 rounded-none px-1 py-2 text-left text-[10px] font-normal uppercase whitespace-normal hover:bg-transparent hover:text-signal ${active === index ? "text-signal" : "text-paper/70"}`}><span className="process-dot" aria-hidden="true" />{stage}</Button></li>)}
        </ol><p id="process-detail" className="mt-5 min-h-14 max-w-[54ch] text-sm leading-relaxed text-paper/75" aria-live={paused ? "polite" : "off"}><span className="mr-3 text-xs uppercase text-signal">{currentStage[0]}</span>{currentStage[1]}</p></div>
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen bg-night font-body text-paper selection:bg-signal selection:text-night">
      <RokitSiteHeader />
      <main>
        <KineticHeroGrid>
          <div className="homepage-hero mx-auto grid min-h-[calc(100svh-6rem)] max-w-site grid-cols-12 grid-rows-[minmax(0,1fr)_auto] items-center gap-x-6 px-gutter pt-12 md:min-h-[calc(100svh-5rem)] md:pt-16">
            <div data-hero-content className="col-span-12 md:col-span-11">
              <h1 className="rise max-w-[10ch] font-display text-[clamp(3.6rem,8.7vw,8rem)] leading-[0.94]">We Make Ideas <span className="text-signal">RocK.</span></h1>
               <div className="hero-thought mt-10 border-l border-signal pl-5" aria-label="Brand, digital, campaigns, communication and physical production.">
                 <div className="hero-thought-stage" aria-hidden="true">{heroThoughts.map(([thought, detail], index) => <div className="hero-thought-item" key={thought} style={{ "--thought-index": index } as React.CSSProperties}><strong>{thought}</strong><small>{detail}</small></div>)}</div>
               </div>
              <div className="mt-9 flex flex-wrap gap-x-7 gap-y-2"><Link to="/work" className="action-link min-h-11 border-b border-paper/25 text-paper hover:border-signal hover:text-signal">See Made by rOKIt <ArrowRight aria-hidden="true" /></Link><Link to="/start-a-project" className="action-link min-h-11 text-neutral hover:text-signal">Start a Project <ArrowRight aria-hidden="true" /></Link></div>
            </div>
             <div className="hero-capabilities col-span-12 self-end border-t border-paper/20 py-5" aria-label={`Capabilities: ${capabilities.join(", ")}`}><div aria-hidden="true">{capabilities.map((capability, index) => <span key={capability}>{capability}{index < capabilities.length - 1 && <i>—</i>}</span>)}</div></div>
          </div>
        </KineticHeroGrid>

        <section className="border-y border-paper/15"><div className="mx-auto max-w-site px-gutter py-7"><p className="section-label">Connecting the dots</p><ol className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase text-neutral">{["Proximity", "Response", "Relationship", "Connection"].map((stage, i) => <li key={stage}><span className="mr-2 text-signal">0{i + 1}</span>{stage}</li>)}</ol></div></section>

        <ThinkingSequence />

        <section className="bg-paper text-night"><div className="mx-auto max-w-site px-gutter py-section"><ProblemNavigator /></div></section>

        <section className="homepage-work border-b border-paper/15"><div className="mx-auto max-w-site px-gutter py-section"><div className="section-heading"><div><SectionLabel>Made by <span className="normal-case">rOKIt</span></SectionLabel><p className="mt-5 max-w-[31ch] font-display text-2xl leading-relaxed md:text-3xl">Ideas are easy to describe. Here’s what happened when they had to work.</p></div><Link to="/work" className="action-link min-h-11 text-signal hover:text-paper">Explore Made by rOKIt <ArrowRight aria-hidden="true" /></Link></div><div className="homepage-projects mt-12"><ProjectGrid projects={homepageProjects} /></div></div></section>


         <section className="homepage-services border-b border-paper/15"><div className="mx-auto max-w-site px-gutter py-section"><div className="grid grid-cols-12 gap-x-6 gap-y-10 border-b border-paper/15 pb-12"><div className="col-span-12 md:col-span-4"><SectionLabel>Services</SectionLabel><h2 className="mt-4 max-w-[12ch] font-display text-4xl md:text-5xl">What are you trying to make happen?</h2><p className="mt-8 text-xs uppercase text-neutral">The job decides what we bring.</p></div><ol className="service-needs col-span-12 border-t border-paper/15 md:col-span-7 md:col-start-6">{serviceNeeds.map(([need, discipline], index) => <li key={need}><span>0{index + 1}</span><strong>{need}</strong><small>{discipline}</small></li>)}</ol></div><ServicesSystem /><div className="mt-10 flex justify-end"><Link to="/what-we-do" className="action-link min-h-11 text-signal hover:text-paper">Explore Services <ArrowRight aria-hidden="true" /></Link></div></div></section>

         <section className="homepage-made-real bg-paper text-night"><div className="mx-auto max-w-site px-gutter py-section"><div className="grid grid-cols-12 gap-x-6 gap-y-12"><div className="col-span-12 md:col-span-6"><p className="section-label !text-night/55">Made Real</p><h2 className="mt-5 max-w-[14ch] font-display text-4xl leading-tight md:text-5xl">Some Ideas Need to Leave the Screen.</h2><p className="mt-8 max-w-[39ch] text-base leading-relaxed text-night/70">We design for the point where an idea becomes something people can hold, wear, read, display, carry, enter or experience.</p><div className="mt-9 border-l-2 border-signal pl-5"><p className="font-display text-xl">Good design has to survive the real world.</p><p className="mt-3 text-sm text-night/60">The job isn’t finished when the file exports.</p></div><Link to="/services/physical-production" className="action-link mt-8 min-h-11 border-b border-signal text-night hover:text-signal">Explore Made Real <ArrowRight aria-hidden="true" /></Link></div><div className="col-span-12 grid grid-cols-12 gap-3 md:col-span-6 md:pt-12"><figure className="col-span-8"><img src={editorial} alt="Editorial study of a publication" loading="lazy" className="aspect-[4/3] w-full object-cover" /></figure><figure className="col-span-4 pt-12"><img src={madeReal} alt="Editorial study of a physical object" loading="lazy" className="aspect-[3/4] w-full object-cover" /></figure><figure className="col-span-7 col-start-6"><img src={implementation} alt="Editorial study of a production setting" loading="lazy" className="aspect-[16/9] w-full object-cover" /></figure></div></div></div></section>

         <section className="value-movement bg-surface"><div className="mx-auto max-w-site px-gutter py-section"><div className="grid grid-cols-12 gap-x-6 gap-y-10"><div className="col-span-12 md:col-span-5"><SectionLabel>Tools · Lab · Ideas</SectionLabel><h2 className="mt-5 max-w-[18ch] font-display text-3xl leading-tight md:text-4xl">What the work keeps teaching us.</h2><p className="mt-7 text-xs uppercase text-signal">Use it. Test it. Think with it.</p></div><div className="value-intro col-span-12 grid border-y border-paper/15 md:col-span-7"><div><span>Tools</span><p>Useful things we’ve built from recurring needs.</p></div><div><span>Lab</span><p>Where unfinished questions get tested.</p></div><div><span>Ideas</span><p>Things we’ve learned that may be useful to someone else.</p></div></div></div><LabSystem /><div className="mt-14 grid gap-8 border-t border-paper/15 pt-10 md:grid-cols-[minmax(0,.7fr)_minmax(0,1.3fr)]"><div><p className="text-[10px] uppercase text-signal">Ideas · Think</p><h3 className="mt-4 max-w-[14ch] font-display text-2xl">What the work keeps teaching us.</h3></div><Link to="/ideas/$slug" params={{ slug: "nobody-cares-about-your-logo" }} className="group grid gap-5 md:grid-cols-[minmax(0,1fr)_12rem]"><div><span className="text-xs uppercase text-neutral">Featured idea</span><h3 className="mt-4 max-w-[17ch] font-display text-3xl group-hover:text-signal">Nobody Cares About Your Logo.</h3><p className="mt-4 max-w-[48ch] text-sm leading-relaxed text-neutral">They care about what they came for.</p></div><img src={brandIdentity} alt="Editorial study of a brand identity" loading="lazy" className="aspect-square w-full object-cover" /></Link></div><div className="mt-10 flex flex-wrap gap-6"><Link to="/tools" className="action-link min-h-11 text-signal hover:text-paper">Explore Tools <ArrowRight aria-hidden="true" /></Link><Link to="/lab" className="action-link min-h-11 text-signal hover:text-paper">Explore Lab <ArrowRight aria-hidden="true" /></Link><Link to="/ideas" className="action-link min-h-11 text-signal hover:text-paper">Explore Ideas <ArrowRight aria-hidden="true" /></Link></div></div></section>

         <ProcessTeaser />

        <section className="homepage-heritage bg-paper text-night"><div className="mx-auto grid max-w-site grid-cols-12 gap-x-6 gap-y-12 border-t border-night/20 px-gutter py-section"><figure className="col-span-10 md:col-span-4 md:pt-16"><div className="relative overflow-hidden bg-night"><img src={implementation} alt="Editorial study of dark panels in a concrete interior; not an archive photograph" loading="lazy" className="aspect-[4/3] w-full object-cover opacity-60 grayscale" /><span className="absolute left-3 top-3 bg-paper px-2 py-1 text-[10px] uppercase text-night">Editorial study</span></div></figure><div className="col-span-12 md:col-span-7 md:col-start-6"><p className="section-label !text-night/55">Heritage</p><h2 className="mt-5 max-w-[14ch] font-display text-4xl leading-tight md:text-5xl">The Tools Changed. The Instinct Didn’t.</h2><p className="mt-8 max-w-[48ch] text-base leading-relaxed text-night/70">Different technologies. Different formats. The same habit of asking what the work needs to do—and finding a way to make it happen.</p><p className="mt-8 max-w-[28ch] font-display text-xl leading-relaxed text-night/75">Founded by Okorite Isokariari. Built across disciplines.</p><Link to="/about" className="action-link mt-9 min-h-11 border-b border-night/25 text-night hover:border-signal hover:text-signal">About rOKIt <ArrowRight aria-hidden="true" /></Link></div></div></section>

         <section className="homepage-closing border-t-2 border-signal"><div className="mx-auto grid max-w-site grid-cols-12 gap-x-6 gap-y-12 px-gutter py-20 md:py-28"><div className="col-span-12 md:col-span-7"><SectionLabel>Start a conversation</SectionLabel><h2 className="mt-6 max-w-[12ch] font-display text-[clamp(3rem,6vw,5.75rem)] leading-[1.02]">Start With What You Have.</h2><p className="mt-7 max-w-[34ch] text-base leading-relaxed text-paper/70">A brief. A thought. A sketch. A specification. Something half-formed. Something ready to go.</p></div><div className="col-span-12 self-end md:col-span-4 md:col-start-9"><p className="text-xs uppercase text-paper">We’ll help work out what it needs next.</p><div className="mt-7 grid border-t border-paper/20"><Link to="/start-a-project" className="action-link min-h-14 justify-between border-b border-paper/20 text-paper hover:text-signal">Start a Project <ArrowRight aria-hidden="true" /></Link><Link to="/start-a-project" search={{ route: "build-my-brief" }} className="action-link min-h-14 justify-between border-b border-paper/20 text-paper hover:text-signal">Talk to rOKIt <ArrowRight aria-hidden="true" /></Link></div></div></div></section>
      </main>
      <RokitSiteFooter />
    </div>
  );
}
