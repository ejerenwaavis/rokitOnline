import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import brandIdentity from "@/assets/rokit-brand-identity.jpg";
import digital from "@/assets/rokit-digital.jpg";
import editorial from "@/assets/rokit-editorial.jpg";
import implementation from "@/assets/rokit-implementation.jpg";
import logoAsset from "@/assets/rokit-logo.png.asset.json";
import { Button } from "@/components/ui/button";
import { publicTools } from "@/lib/rokit-public-offerings";

const workItems = [
  { image: brandIdentity, category: "Brand", label: "Identity system study", index: "A—01", className: "col-span-12 md:col-span-7", ratio: "aspect-[4/3]" },
  { image: digital, category: "Digital", label: "Website experience study", index: "A—02", className: "col-span-9 col-start-4 md:col-span-5 md:col-start-auto md:pt-24", ratio: "aspect-[4/5]" },
  { image: editorial, category: "Communication", label: "Publication system study", index: "A—03", className: "col-span-8 md:col-span-4 md:pt-6", ratio: "aspect-square" },
  { image: implementation, category: "Physical", label: "Physical implementation study", index: "A—04", className: "col-span-11 col-start-2 md:col-span-8 md:col-start-auto", ratio: "aspect-[16/10]" },
] as const;

const problems = [
  { title: "I’m starting something.", response: "Give the beginning a clear identity and a system it can grow into.", service: "Brand & Identity", work: "Brand", discipline: "Brand & Identity" },
  { title: "I’m changing something.", response: "Work out what should stay, what should shift and how people will experience the change.", service: "Websites & Digital Solutions", work: "Digital", discipline: "Websites & Digital Solutions" },
  { title: "I need to get noticed.", response: "Clarify who matters, where to reach them and what deserves your marketing effort.", service: "Marketing & Growth", work: "Marketing", discipline: "Marketing & Growth" },
  { title: "I need to make something clearer.", response: "Turn complexity into communication people can understand and use.", service: "Communication & Content", work: "Communication", discipline: "Communication & Content" },
  { title: "I need something made.", response: "Carry the idea through into print, objects, spaces or production.", service: "Physical Brand & Production", work: "Physical", discipline: "Physical Brand & Production" },
  { title: "I’m still figuring it out.", response: "Start with what you’re trying to achieve. We can work out the right route together.", service: "Start with the problem", work: "All work", discipline: "All" },
] as const;

const services = [
  { title: "Brand & Identity", copy: "Strategy, positioning, identity systems and brand standards.", category: "Brand", image: brandIdentity, to: "/services/brand-identity" as const },
  { title: "Websites & Digital Solutions", copy: "Websites, portals, UX direction, digital experiences and useful digital systems.", category: "Digital", image: digital, to: "/services/websites-digital" as const },
  { title: "Marketing & Growth", copy: "Customer clarity, channel decisions, campaigns and practical growth systems.", category: "Marketing", image: implementation, to: "/services/marketing-growth" as const },
  { title: "Communication & Content", copy: "Presentations, campaigns, infographics, editorial, publications and content systems.", category: "Communication", image: editorial, to: "/services/communication-content" as const },
  { title: "Physical Brand & Production", copy: "Print, publications, signage, merchandise, apparel, corporate gifts and physical implementation.", category: "Physical", image: implementation, to: "/services/physical-production" as const },
] as const;

export function ProblemNavigator() {
  const [active, setActive] = useState(0);
  const item = problems[active] ?? problems[0];

  return (
    <div className="grid grid-cols-12 gap-x-6 gap-y-10">
      <div className="col-span-12 md:col-span-5">
        <h2 className="mt-5 max-w-[12ch] font-display text-4xl leading-tight md:text-5xl">What are you trying to make happen?</h2>
        <p className="mt-6 max-w-[42ch] text-sm leading-relaxed text-night/65">You don’t need to know what service you need. Start with what you’re trying to achieve.</p>
        <div className="mt-9 border-l-2 border-signal pl-5" aria-live="polite">
          <p className="max-w-[38ch] text-sm leading-relaxed text-night/70">{item.response}</p>
          <p className="mt-4 text-[10px] uppercase text-night/50">Likely service</p>
          <p className="mt-1 font-medium">{item.service}</p>
          <Link to="/work" search={active === 5 ? {} : { need: ["recognition", "digital", "attention", "understanding", "physical"][active] }} className="action-link mt-5 min-h-11 text-night hover:text-signal">See relevant work <ArrowRight aria-hidden="true" /></Link>
        </div>
      </div>
      <div className="col-span-12 border-t border-night/20 md:col-span-7">
        {problems.map((problem, index) => (
          <Button
            key={problem.title}
            type="button"
            variant="ghost"
            onClick={() => setActive(index)}
            onFocus={() => setActive(index)}
            aria-expanded={active === index}
            className="group h-auto min-h-16 w-full justify-start rounded-none border-b border-night/20 px-0 py-4 text-left text-night hover:bg-transparent hover:text-signal"
          >
            <span className="w-8 shrink-0 text-xs font-normal text-night/45">0{index + 1}</span>
            <span className="min-w-0 flex-1 whitespace-normal font-display text-xl font-normal">{problem.title}</span>
            <ArrowRight className={`size-4 shrink-0 transition-transform ${active === index ? "translate-x-1 text-signal" : ""}`} aria-hidden="true" />
          </Button>
        ))}
      </div>
    </div>
  );
}

export function WorkGallery() {
  const [filter, setFilter] = useState("All");
  const categories = ["All", "Brand", "Digital", "Marketing", "Communication", "Physical"] as const;
  const visible = filter === "All" ? workItems : workItems.filter((item) => item.category === filter);

  return (
    <>
      <div className="mt-7 flex flex-wrap gap-x-1 gap-y-2" aria-label="Work categories">
        {categories.map((category) => <Button key={category} type="button" variant="ghost" onClick={() => setFilter(category)} aria-pressed={filter === category} className={`min-h-11 rounded-none px-3 text-xs uppercase hover:bg-transparent hover:text-signal ${filter === category ? "text-signal" : "text-neutral"}`}>{category}</Button>)}
      </div>
      <div className="mt-8 grid grid-cols-12 gap-x-5 gap-y-14 md:gap-y-20">
        {visible.map((item) => (
          <figure key={item.index} className={item.className}>
            <Link to="/work" className="group block">
              <div className="relative overflow-hidden bg-surface"><img src={item.image} alt={`${item.label} replaceable concept image`} width={1280} height={960} loading="lazy" className={`${item.ratio} w-full object-cover transition-transform duration-700 group-hover:scale-[1.015] motion-reduce:transition-none`} /><span className="absolute left-3 top-3 bg-night/90 px-2 py-1 text-[10px] uppercase text-paper">Replaceable concept image</span></div>
              <figcaption className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-t border-paper/20 pt-3"><div><p className="text-[10px] uppercase text-signal">{item.category}</p><h3 className="mt-1 font-display text-xl text-paper">{item.label}</h3><p className="mt-2 text-xs text-neutral">Concept placeholder · Awaiting verified project details</p></div><span className="text-xs text-signal">{item.index}</span></figcaption>
            </Link>
          </figure>
        ))}
        {visible.length === 0 ? <p className="col-span-12 border-y border-paper/15 py-8 text-sm text-neutral">No cleared work is published in this category yet.</p> : null}
      </div>
    </>
  );
}

export function ServicesSystem() {
  const [active, setActive] = useState(0);

  return (
    <div className="mt-10 grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.72fr)]">
      <div className="border-t border-paper/15">
        {services.map((service, index) => (
          <div key={service.title} className="border-b border-paper/15">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setActive(index)}
              onFocus={() => setActive(index)}
              aria-expanded={active === index}
              className="h-auto min-h-20 w-full justify-start rounded-none px-0 py-5 text-left text-paper hover:bg-transparent hover:text-signal"
            >
              <span className="w-12 shrink-0 text-xs font-normal text-signal">0{index + 1}</span>
              <span className="min-w-0 flex-1 whitespace-normal font-display text-xl font-normal md:text-2xl">{service.title}</span>
              <span className="text-xl font-normal" aria-hidden="true">{active === index ? "−" : "+"}</span>
            </Button>
            {active === index ? <div className="pb-6 pl-12 pr-6"><p className="max-w-[52ch] text-sm leading-relaxed text-neutral">{service.copy}</p><Link to={service.to} className="action-link mt-4 min-h-11 text-signal hover:text-paper">Explore {service.title} <ArrowRight aria-hidden="true" /></Link></div> : null}
          </div>
        ))}
      </div>
      <figure className="self-start overflow-hidden bg-surface">
        <img src={(services[active] ?? services[0]).image} alt={`${(services[active] ?? services[0]).category} editorial study, not client project documentation`} loading="lazy" className="aspect-[4/3] w-full object-cover" />
        <figcaption className="flex justify-between gap-4 border-t border-paper/15 py-3 text-[10px] uppercase text-neutral"><span>{(services[active] ?? services[0]).category}</span><span>Editorial study</span></figcaption>
      </figure>
    </div>
  );
}

export function LabSystem() {
  const [active, setActive] = useState(0);
  const item = publicTools[active] ?? publicTools[0];

  return (
    <div className="mt-12 grid items-center gap-10 md:grid-cols-[minmax(18rem,0.8fr)_minmax(0,1.2fr)]">
      <div className="lab-orbit relative mx-auto aspect-square w-full max-w-[28rem]" aria-hidden="true">
        <div className="absolute inset-[16%] flex items-center justify-center rounded-full border border-paper/15">
          <div className="size-3 bg-signal" />
        </div>
        {publicTools.map((labItem, index) => <span key={labItem.territory} className={`lab-orbit-point lab-orbit-point-${index + 1} ${active === index ? "text-signal" : "text-neutral"}`}>{labItem.territory}</span>)}
      </div>
      <div>
        <div className="flex flex-wrap gap-2" aria-label="Lab territories">
          {publicTools.map((labItem, index) => <Button key={labItem.territory} type="button" variant="outline" onClick={() => setActive(index)} aria-pressed={active === index} className="min-h-11 rounded-none border-paper/20 bg-transparent px-4 text-xs uppercase text-neutral shadow-none hover:border-signal hover:bg-transparent hover:text-signal aria-pressed:border-signal aria-pressed:text-signal">{labItem.territory}</Button>)}
        </div>
        <div className="mt-10 min-h-56 border-l border-signal pl-6" aria-live="polite">
          <p className="text-xs uppercase text-signal">{item.territory}</p>
          <h3 className="mt-3 font-display text-3xl md:text-4xl">{item.title}</h3>
          <span className="mt-5 inline-block border border-paper/20 px-2 py-1 text-[10px] uppercase text-neutral">{item.maturity}</span>
          <p className="mt-6 max-w-[50ch] text-sm leading-relaxed text-paper/70">{item.copy}</p>
        </div>
      </div>
    </div>
  );
}

export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setActive(true);
        observer.disconnect();
      }
    }, { threshold: 0.35 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`footer-wordmark relative mx-auto max-w-site px-gutter pt-8 ${active ? "is-active" : ""}`}>
      <img src={logoAsset.url} alt="rOKIt" className="footer-logo-white w-full translate-y-[18%] object-contain" />
      <div className="footer-o-activation pointer-events-none absolute inset-x-gutter bottom-0 top-8 overflow-hidden" aria-hidden="true">
        <img src={logoAsset.url} alt="" className="footer-logo-orange h-full w-full translate-y-[18%] object-contain" />
      </div>
    </div>
  );
}

const heritageNeeds = ["its brand", "its website", "its message", "its visibility", "its physical presence"] as const;

export function HeritageStatement() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % heritageNeeds.length), 3200);
    return () => window.clearInterval(timer);
  }, []);
  return <p className="mt-7 font-display text-2xl leading-snug">The work changed. The instinct didn’t. <span className="text-signal" aria-live="polite">{heritageNeeds[active]}</span></p>;
}