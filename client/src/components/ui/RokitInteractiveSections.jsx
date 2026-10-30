import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import brandIdentity from "../../assets/redesign/rokit-brand-identity.jpg";
import digital from "../../assets/redesign/rokit-digital.jpg";
import editorial from "../../assets/redesign/rokit-editorial.jpg";
import implementation from "../../assets/redesign/rokit-implementation.jpg";

export const publicTools = [
  {
    territory: "Clarify",
    title: "rOKIt Brief",
    maturity: "Available",
    copy: "Turn a vague problem or early idea into a clearer, more useful project brief.",
  },
  {
    territory: "Plan",
    title: "Publication Specification Builder",
    maturity: "Pilot",
    copy: "Work through the practical choices that shape a publication before production begins.",
  },
  {
    territory: "Control",
    title: "Institutional Publication Production Toolkit",
    maturity: "Private Pilot",
    copy: "A controlled route from specification and proof to quality checks, packaging and delivery.",
  },
];

const problems = [
  { title: "I’m starting something.", response: "Give the beginning a clear identity and a system it can grow into.", service: "Brand & Identity" },
  { title: "I’m changing something.", response: "Work out what should stay, what should shift and how people will experience the change.", service: "Websites & Digital Solutions" },
  { title: "I need to get noticed.", response: "Clarify who matters, where to reach them and what deserves your marketing effort.", service: "Marketing & Growth" },
  { title: "I need to make something clearer.", response: "Turn complexity into communication people can understand and use.", service: "Communication & Content" },
  { title: "I need something made.", response: "Carry the idea through into print, objects, spaces or production.", service: "Physical Brand & Production" },
  { title: "I’m still figuring it out.", response: "Start with what you’re trying to achieve. We can work out the right route together.", service: "Start with the problem" },
];

const services = [
  { title: "Brand & Identity", copy: "Strategy, positioning, identity systems and brand standards.", category: "Brand", image: brandIdentity, to: "/services/branding" },
  { title: "Websites & Digital Solutions", copy: "Websites, portals, UX direction, digital experiences and useful digital systems.", category: "Digital", image: digital, to: "/services/web-design" },
  { title: "Marketing & Growth", copy: "Customer clarity, channel decisions, campaigns and practical growth systems.", category: "Marketing", image: implementation, to: "/services/idea-creation" },
  { title: "Communication & Content", copy: "Presentations, campaigns, infographics, editorial, publications and content systems.", category: "Communication", image: editorial, to: "/services/graphic-design" },
  { title: "Physical Brand & Production", copy: "Print, publications, signage, merchandise, apparel, corporate gifts and physical implementation.", category: "Physical", image: implementation, to: "/services/large-format" },
];

export function ProblemNavigator() {
  const [active, setActive] = useState(0);
  const item = problems[active] ?? problems[0];

  return (
    <div className="grid grid-cols-12 gap-x-6 gap-y-10">
      <div className="col-span-12 md:col-span-5">
        <h2 className="mt-5 max-w-[12ch] font-v4-display text-4xl leading-tight md:text-5xl">What are you trying to make happen?</h2>
        <p className="mt-6 max-w-[42ch] text-sm leading-relaxed text-night/65">You don’t need to know what service you need. Start with what you’re trying to achieve.</p>
        <div className="mt-9 border-l-2 border-signal pl-5" aria-live="polite">
          <p className="max-w-[38ch] text-sm leading-relaxed text-night/70">{item.response}</p>
          <p className="mt-4 text-[10px] uppercase tracking-wider text-night/50">Likely service</p>
          <p className="mt-1 font-medium">{item.service}</p>
          <Link to="/gallery" className="v4-action-link mt-5 min-h-11 text-night hover:text-signal uppercase text-xs tracking-wider">
            See relevant work <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className="col-span-12 border-t border-night/20 md:col-span-7">
        {problems.map((problem, index) => (
          <button
            key={problem.title}
            type="button"
            onClick={() => setActive(index)}
            onFocus={() => setActive(index)}
            aria-expanded={active === index}
            className="group flex h-auto min-h-16 w-full items-center justify-start rounded-none border-b border-night/20 px-0 py-4 text-left text-night hover:text-signal transition-colors"
          >
            <span className="w-8 shrink-0 text-xs font-mono text-night/45">0{index + 1}</span>
            <span className="min-w-0 flex-1 whitespace-normal font-v4-display text-xl font-normal">{problem.title}</span>
            <ArrowRight className={`size-4 shrink-0 transition-transform ${active === index ? "translate-x-1 text-signal" : ""}`} aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
}

export function ServicesSystem() {
  const [active, setActive] = useState(0);

  return (
    <div className="mt-10 grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.72fr)]">
      <div className="border-t border-paper/15">
        {services.map((service, index) => (
          <div key={service.title} className="border-b border-paper/15">
            <button
              type="button"
              onClick={() => setActive(index)}
              onFocus={() => setActive(index)}
              aria-expanded={active === index}
              className="flex h-auto min-h-20 w-full items-center justify-start rounded-none px-0 py-5 text-left text-paper hover:text-signal transition-colors"
            >
              <span className="w-12 shrink-0 text-xs font-mono text-signal">0{index + 1}</span>
              <span className="min-w-0 flex-1 whitespace-normal font-v4-display text-xl font-normal md:text-2xl">{service.title}</span>
              <span className="text-xl font-normal" aria-hidden="true">{active === index ? "−" : "+"}</span>
            </button>
            {active === index ? (
              <div className="pb-6 pl-12 pr-6">
                <p className="max-w-[52ch] text-sm leading-relaxed text-neutral">{service.copy}</p>
                <Link to={service.to} className="v4-action-link mt-4 min-h-11 text-signal hover:text-paper uppercase text-xs tracking-wider">
                  Explore {service.title} <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <figure className="self-start overflow-hidden bg-surface">
        <img
          src={(services[active] ?? services[0]).image}
          alt={`${(services[active] ?? services[0]).category} study`}
          loading="lazy"
          className="aspect-[4/3] w-full object-cover"
        />
        <figcaption className="flex justify-between gap-4 border-t border-paper/15 py-3 text-[10px] uppercase text-neutral">
          <span>{(services[active] ?? services[0]).category}</span>
          <span>Editorial study</span>
        </figcaption>
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
        {publicTools.map((labItem, index) => (
          <span
            key={labItem.territory}
            className={`lab-orbit-point lab-orbit-point-${index + 1} ${active === index ? "text-signal" : "text-neutral"}`}
          >
            {labItem.territory}
          </span>
        ))}
      </div>
      <div>
        <div className="flex flex-wrap gap-2" aria-label="Lab territories">
          {publicTools.map((labItem, index) => (
            <button
              key={labItem.territory}
              type="button"
              onClick={() => setActive(index)}
              aria-pressed={active === index}
              className={`min-h-11 rounded-none border border-paper/20 bg-transparent px-4 text-xs uppercase tracking-wider transition-colors ${
                active === index ? "border-signal text-signal" : "text-neutral hover:border-signal hover:text-signal"
              }`}
            >
              {labItem.territory}
            </button>
          ))}
        </div>
        <div className="mt-10 min-h-56 border-l border-signal pl-6" aria-live="polite">
          <p className="text-xs uppercase tracking-wider text-signal">{item.territory}</p>
          <h3 className="mt-3 font-v4-display text-3xl md:text-4xl">{item.title}</h3>
          <span className="mt-5 inline-block border border-paper/20 px-2 py-1 text-[10px] uppercase text-neutral">{item.maturity}</span>
          <p className="mt-6 max-w-[50ch] text-sm leading-relaxed text-paper/70">{item.copy}</p>
        </div>
      </div>
    </div>
  );
}
