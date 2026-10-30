import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import brandIdentity from "../assets/redesign/rokit-brand-identity.jpg";
import editorial from "../assets/redesign/rokit-editorial.jpg";
import implementation from "../assets/redesign/rokit-implementation.jpg";
import madeReal from "../assets/redesign/rokit-made-real.jpg";

import KineticHeroGrid from "../components/ui/KineticHeroGrid";
import HomeSketch from "../components/ui/HomeSketch";
import { ProblemNavigator, ServicesSystem, LabSystem } from "../components/ui/RokitInteractiveSections";
import ProjectGrid from "../components/ui/ProjectGrid";
import { homepageProjects } from "../lib/workProjects";

const heroThoughts = [
  ["A brand people recognise.", "Strategy · Naming · Logo & Identity · Brand Systems"],
  ["A digital experience that works.", "Websites · E-commerce · Platforms · Digital Products"],
  ["A campaign people notice.", "Campaigns · Content · Social · Activation"],
  ["Communication people understand.", "Reports · Publications · Presentations · Information Design"],
  ["A presence in the real world.", "Print · Apparel · Merchandise · Packaging · Signage · Displays"],
];

const capabilities = [
  "Brand Identity", "Websites", "E-commerce", "Campaigns", "Social", "Publications",
  "Print", "Custom Apparel", "Merchandise", "Packaging", "Signage", "Corporate Gifts",
  "Event Branding", "Production"
];

const serviceNeeds = [
  ["A clear direction.", "Strategy & thinking"],
  ["A recognisable identity.", "Brand & identity"],
  ["A digital home.", "Websites & digital"],
  ["Attention and momentum.", "Marketing & growth"],
  ["A story people understand.", "Communication & content"],
  ["A real-world presence.", "Physical brand & production"],
];

const processStages = [
  ["Understand", "What needs to happen, for whom, and why?"],
  ["Connect", "Bring the right thinking, people and capabilities together."],
  ["Create", "Turn direction into a clear creative response."],
  ["Make", "Build, produce or implement what the job requires."],
  ["Check", "Test the work against its audience, purpose and real-world use."],
  ["Refine", "Improve what needs improving before it goes out into the world."],
];

function ProcessTeaser() {
  const sectionRef = useRef(null);
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
    <section
      ref={sectionRef}
      className="homepage-process border-t border-paper/15 font-v4-body"
      aria-labelledby="process-title"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}
    >
      <div className="mx-auto grid max-w-site gap-10 px-gutter py-16 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:py-20">
        <div>
          <h2 id="process-title" className="v4-section-label">How we work</h2>
          <Link to="/about" className="v4-action-link mt-7 min-h-11 text-signal hover:text-paper uppercase text-xs tracking-wider">
            Explore our process <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
        <div className="min-w-0">
          <ol className="process-path grid grid-cols-3 gap-y-6 border-t border-paper/20 pt-5 md:grid-cols-6">
            {processStages.map(([stage], index) => (
              <li key={stage} className="min-w-0">
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  aria-pressed={active === index}
                  aria-controls="process-detail"
                  className={`process-point h-auto min-h-11 w-full flex flex-col items-start justify-start gap-2 rounded-none px-1 py-2 text-left text-[10px] uppercase font-mono tracking-wider transition-colors ${
                    active === index ? "text-signal" : "text-paper/70 hover:text-signal"
                  }`}
                >
                  <span
                    className={`block size-2 rounded-full border transition-colors ${
                      active === index ? "border-signal bg-signal" : "border-neutral bg-night"
                    }`}
                    aria-hidden="true"
                  />
                  {stage}
                </button>
              </li>
            ))}
          </ol>
          <p id="process-detail" className="mt-5 min-h-14 max-w-[54ch] text-sm leading-relaxed text-paper/75" aria-live={paused ? "polite" : "off"}>
            <span className="mr-3 text-xs uppercase font-mono tracking-wider text-signal">{currentStage[0]}</span>
            {currentStage[1]}
          </p>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Helmet>
        <title>rOKIt — We Make Ideas RocK.</title>
        <meta
          name="description"
          content="We start with what needs to work—then bring together the brand, digital, communication and production it takes to make it happen."
        />
        <meta property="og:title" content="rOKIt — We Make Ideas RocK." />
        <meta
          property="og:description"
          content="We start with what needs to work—then bring together the brand, digital, communication and production it takes to make it happen."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-night font-v4-body text-paper selection:bg-signal selection:text-night">
        {/* Kinetic Hero */}
        <KineticHeroGrid>
          <div className="homepage-hero mx-auto grid min-h-[calc(100svh-6rem)] max-w-site grid-cols-12 grid-rows-[minmax(0,1fr)_auto] items-center gap-x-6 px-gutter pt-12 md:min-h-[calc(100svh-5rem)] md:pt-16">
            <div data-hero-content className="col-span-12 md:col-span-11">
              <h1 className="v4-rise max-w-[10ch] font-v4-display text-[clamp(3.6rem,8.7vw,8rem)] leading-[0.94]">
                We Make Ideas <span className="text-signal">RocK.</span>
              </h1>
              <div className="hero-thought mt-10 border-l border-signal pl-5" aria-label="Brand, digital, campaigns, communication and physical production.">
                <div className="hero-thought-stage grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-x-12 md:gap-y-6">
                  {heroThoughts.map(([thought, detail]) => (
                    <div className="hero-thought-item flex flex-col gap-1.5" key={thought}>
                      <strong className="font-v4-body text-sm font-medium uppercase tracking-wider text-paper">{thought}</strong>
                      <small className="text-xs text-neutral leading-relaxed">{detail}</small>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3">
                <Link to="/gallery" className="v4-action-link min-h-11 border-b border-paper/25 text-paper hover:border-signal hover:text-signal uppercase text-xs tracking-wider">
                  See Made by rOKIt <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
                <Link to="/portal/quotes/new" className="v4-action-link min-h-11 text-neutral hover:text-signal uppercase text-xs tracking-wider">
                  Start a Project <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="hero-capabilities col-span-12 self-end border-t border-paper/20 py-5" aria-label={`Capabilities: ${capabilities.join(", ")}`}>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-neutral uppercase tracking-wider font-mono">
                {capabilities.map((capability, index) => (
                  <span key={capability}>
                    {capability}
                    {index < capabilities.length - 1 && <i className="not-italic text-signal ml-3">—</i>}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </KineticHeroGrid>

        {/* Problem Navigator Section */}
        <section className="bg-paper text-night">
          <div className="mx-auto max-w-site px-gutter py-section">
            <ProblemNavigator />
          </div>
        </section>

        {/* Wordless Animated Engineering Sketch */}
        <HomeSketch />

        {/* Made by rOKIt Showcase */}
        <section className="homepage-work border-b border-paper/15">
          <div className="mx-auto max-w-site px-gutter py-section">
            <div className="v4-section-heading">
              <div>
                <p className="v4-section-label">Made by <span className="normal-case">rOKIt</span></p>
                <p className="mt-5 max-w-[31ch] font-v4-display text-2xl leading-relaxed md:text-3xl">
                  Ideas are easy to describe. Here’s what happened when they had to work.
                </p>
              </div>
              <Link to="/gallery" className="v4-action-link min-h-11 text-signal hover:text-paper uppercase text-xs tracking-wider">
                Explore Made by rOKIt <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
            <div className="homepage-projects mt-12">
              <ProjectGrid projects={homepageProjects} />
            </div>
          </div>
        </section>

        {/* Services System */}
        <section className="homepage-services border-b border-paper/15">
          <div className="mx-auto max-w-site px-gutter py-section">
            <div className="grid grid-cols-12 gap-x-6 gap-y-10 border-b border-paper/15 pb-12">
              <div className="col-span-12 md:col-span-4">
                <p className="v4-section-label">Services</p>
                <h2 className="mt-4 max-w-[12ch] font-v4-display text-4xl md:text-5xl">What are you trying to make happen?</h2>
                <p className="mt-8 text-xs uppercase font-mono tracking-wider text-neutral">The job decides what we bring.</p>
              </div>
              <ol className="service-needs col-span-12 border-t border-paper/15 md:col-span-7 md:col-start-6">
                {serviceNeeds.map(([need, discipline], index) => (
                  <li key={need} className="grid grid-cols-[2.5rem_minmax(0,1.25fr)_minmax(9rem,.75fr)] gap-4 items-baseline border-b border-paper/15 py-4">
                    <span className="text-signal text-xs font-mono">0{index + 1}</span>
                    <strong className="font-v4-display text-lg md:text-xl font-normal text-paper">{need}</strong>
                    <small className="text-neutral text-xs uppercase tracking-wider">{discipline}</small>
                  </li>
                ))}
              </ol>
            </div>
            <ServicesSystem />
            <div className="mt-10 flex justify-end">
              <Link to="/services" className="v4-action-link min-h-11 text-signal hover:text-paper uppercase text-xs tracking-wider">
                Explore Services <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* Made Real */}
        <section className="homepage-made-real bg-paper text-night">
          <div className="mx-auto max-w-site px-gutter py-section">
            <div className="grid grid-cols-12 gap-x-6 gap-y-12">
              <div className="col-span-12 md:col-span-6">
                <p className="v4-section-label !text-night/55">Made Real</p>
                <h2 className="mt-5 max-w-[14ch] font-v4-display text-4xl leading-tight md:text-5xl">
                  Some Ideas Need to Leave the Screen.
                </h2>
                <p className="mt-8 max-w-[39ch] text-base leading-relaxed text-night/70">
                  We design for the point where an idea becomes something people can hold, wear, read, display, carry, enter or experience.
                </p>
                <div className="mt-9 border-l-2 border-signal pl-5">
                  <p className="font-v4-display text-xl text-night">Good design has to survive the real world.</p>
                  <p className="mt-3 text-sm text-night/60">The job isn’t finished when the file exports.</p>
                </div>
                <Link to="/services/large-format" className="v4-action-link mt-8 min-h-11 border-b border-signal text-night hover:text-signal uppercase text-xs tracking-wider">
                  Explore Made Real <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>
              <div className="col-span-12 grid grid-cols-12 gap-3 md:col-span-6 md:pt-12">
                <figure className="col-span-8">
                  <img src={editorial} alt="Editorial study of a publication" loading="lazy" className="aspect-[4/3] w-full object-cover" />
                </figure>
                <figure className="col-span-4 pt-12">
                  <img src={madeReal} alt="Editorial study of a physical object" loading="lazy" className="aspect-[3/4] w-full object-cover" />
                </figure>
                <figure className="col-span-7 col-start-6">
                  <img src={implementation} alt="Editorial study of a production setting" loading="lazy" className="aspect-[16/9] w-full object-cover" />
                </figure>
              </div>
            </div>
          </div>
        </section>

        {/* Tools · Lab · Ideas */}
        <section className="value-movement bg-surface">
          <div className="mx-auto max-w-site px-gutter py-section">
            <div className="grid grid-cols-12 gap-x-6 gap-y-10">
              <div className="col-span-12 md:col-span-5">
                <p className="v4-section-label">Tools · Lab · Ideas</p>
                <h2 className="mt-5 max-w-[18ch] font-v4-display text-3xl leading-tight md:text-4xl">
                  What the work keeps teaching us.
                </h2>
                <p className="mt-7 text-xs uppercase tracking-wider font-mono text-signal">Use it. Test it. Think with it.</p>
              </div>
              <div className="value-intro col-span-12 grid border-y border-paper/15 md:col-span-7">
                <div className="grid grid-cols-[4rem_minmax(0,1fr)] gap-4 border-b border-paper/15 py-4">
                  <span className="text-signal text-xs font-mono uppercase">Tools</span>
                  <p className="text-neutral text-xs leading-relaxed">Useful things we’ve built from recurring needs.</p>
                </div>
                <div className="grid grid-cols-[4rem_minmax(0,1fr)] gap-4 border-b border-paper/15 py-4">
                  <span className="text-signal text-xs font-mono uppercase">Lab</span>
                  <p className="text-neutral text-xs leading-relaxed">Where unfinished questions get tested.</p>
                </div>
                <div className="grid grid-cols-[4rem_minmax(0,1fr)] gap-4 py-4">
                  <span className="text-signal text-xs font-mono uppercase">Ideas</span>
                  <p className="text-neutral text-xs leading-relaxed">Things we’ve learned that may be useful to someone else.</p>
                </div>
              </div>
            </div>

            <LabSystem />

            <div className="mt-14 grid gap-8 border-t border-paper/15 pt-10 md:grid-cols-[minmax(0,.7fr)_minmax(0,1.3fr)]">
              <div>
                <p className="text-[10px] uppercase tracking-wider font-mono text-signal">Ideas · Think</p>
                <h3 className="mt-4 max-w-[14ch] font-v4-display text-2xl">What the work keeps teaching us.</h3>
              </div>
              <Link to="/tutorials" className="group grid gap-5 md:grid-cols-[minmax(0,1fr)_12rem]">
                <div>
                  <span className="text-xs uppercase tracking-wider font-mono text-neutral">Featured idea</span>
                  <h3 className="mt-4 max-w-[17ch] font-v4-display text-3xl group-hover:text-signal transition-colors">
                    Nobody Cares About Your Logo.
                  </h3>
                  <p className="mt-4 max-w-[48ch] text-sm leading-relaxed text-neutral">
                    They care about what they came for.
                  </p>
                </div>
                <img src={brandIdentity} alt="Editorial study of a brand identity" loading="lazy" className="aspect-square w-full object-cover" />
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-6">
              <Link to="/photo-enhancer" className="v4-action-link min-h-11 text-signal hover:text-paper uppercase text-xs tracking-wider">
                Explore Photo Enhancer <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
              <Link to="/tutorials" className="v4-action-link min-h-11 text-signal hover:text-paper uppercase text-xs tracking-wider">
                Explore Ideas & Tutorials <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* Process Teaser */}
        <ProcessTeaser />

        {/* Heritage Section */}
        <section className="homepage-heritage bg-paper text-night">
          <div className="mx-auto grid max-w-site grid-cols-12 gap-x-6 gap-y-12 border-t border-night/20 px-gutter py-section">
            <figure className="col-span-10 md:col-span-4 md:pt-16">
              <div className="relative overflow-hidden bg-night">
                <img
                  src={implementation}
                  alt="Editorial study of dark panels in a concrete interior"
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover opacity-60 grayscale"
                />
                <span className="absolute left-3 top-3 bg-paper px-2 py-1 text-[10px] uppercase font-mono text-night">
                  Editorial study
                </span>
              </div>
            </figure>
            <div className="col-span-12 md:col-span-7 md:col-start-6">
              <p className="v4-section-label !text-night/55">Heritage</p>
              <h2 className="mt-5 max-w-[14ch] font-v4-display text-4xl leading-tight md:text-5xl">
                The Tools Changed. The Instinct Didn’t.
              </h2>
              <p className="mt-8 max-w-[48ch] text-base leading-relaxed text-night/70">
                Different technologies. Different formats. The same habit of asking what the work needs to do—and finding a way to make it happen.
              </p>
              <p className="mt-8 max-w-[28ch] font-v4-display text-xl leading-relaxed text-night/75">
                Founded by Okorite Isokariari. Built across disciplines.
              </p>
              <Link to="/about" className="v4-action-link mt-9 min-h-11 border-b border-night/25 text-night hover:border-signal hover:text-signal uppercase text-xs tracking-wider">
                About rOKIt <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* Closing Conversation CTA */}
        <section className="homepage-closing border-t-2 border-signal">
          <div className="mx-auto grid max-w-site grid-cols-12 gap-x-6 gap-y-12 px-gutter py-20 md:py-28">
            <div className="col-span-12 md:col-span-7">
              <p className="v4-section-label">Start a conversation</p>
              <h2 className="mt-6 max-w-[12ch] font-v4-display text-[clamp(3rem,6vw,5.75rem)] leading-[1.02]">
                Start With What You Have.
              </h2>
              <p className="mt-7 max-w-[34ch] text-base leading-relaxed text-paper/70">
                A brief. A thought. A sketch. A specification. Something half-formed. Something ready to go.
              </p>
            </div>
            <div className="col-span-12 self-end md:col-span-4 md:col-start-9">
              <p className="text-xs uppercase font-mono tracking-wider text-paper">We’ll help work out what it needs next.</p>
              <div className="mt-7 grid border-t border-paper/20">
                <Link to="/portal/quotes/new" className="v4-action-link min-h-14 justify-between border-b border-paper/20 text-paper hover:text-signal uppercase text-xs tracking-wider">
                  Start a Project <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
                <Link to="/contact" className="v4-action-link min-h-14 justify-between border-b border-paper/20 text-paper hover:text-signal uppercase text-xs tracking-wider">
                  Talk to rOKIt <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
