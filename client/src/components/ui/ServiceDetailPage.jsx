import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const numberFor = (position) => String(position + 1).padStart(2, "0");

function StandardThinking({ variant, sections }) {
  if (variant === "brand") {
    return (
      <div className="service-brand-sequence">
        {sections.map((section, position) => (
          <article key={section} className="service-brand-decision">
            <span aria-hidden="true" className="service-recognition-mark" />
            <span className="service-step-number">{numberFor(position)}</span>
            <h2>{section}</h2>
          </article>
        ))}
      </div>
    );
  }
  if (variant === "digital") {
    return (
      <div className="service-digital-sequence">
        {sections.map((section, position) => (
          <article key={section} className="service-digital-stage">
            <span className="service-step-number">{numberFor(position)}</span>
            <span aria-hidden="true" className="service-digital-node" />
            <h2>{section}</h2>
          </article>
        ))}
      </div>
    );
  }
  if (variant === "marketing") {
    return (
      <div className="service-marketing-sequence">
        {sections.map((section, position) => (
          <article
            key={section}
            className="service-marketing-decision"
            style={{ "--decision-step": position }}
          >
            <span className="service-step-number">{numberFor(position)}</span>
            <h2>{section}</h2>
          </article>
        ))}
      </div>
    );
  }
  return (
    <div className="service-communication-sequence">
      {sections.map((section, position) => (
        <article key={section} className="service-communication-argument">
          <span className="service-step-number">{numberFor(position)}</span>
          <h2>{section}</h2>
        </article>
      ))}
    </div>
  );
}

function PhysicalThinking({ sections }) {
  const groups = [
    { title: "Before production", items: sections.slice(0, 5), start: 0 },
    { title: "Protect the approved outcome", items: sections.slice(5, 7), start: 5 },
    { title: "Quality & delivery", items: sections.slice(7, 10), start: 7 },
  ];
  const controlNote = sections[10];

  return (
    <div className="service-physical-sequence">
      {groups.map((group) => (
        <section key={group.title} className="service-production-group">
          <header>
            <span className="service-production-group-number">{numberFor(group.start)}</span>
            <h2>{group.title}</h2>
          </header>
          <div>
            {group.items.map((section, position) => (
              <article key={section}>
                <span className="service-step-number">{numberFor(group.start + position)}</span>
                <h3>{section}</h3>
              </article>
            ))}
          </div>
        </section>
      ))}
      {controlNote ? (
        <aside className="service-control-note">
          <span className="v4-section-label !text-night/55">Control note</span>
          <p>{controlNote}</p>
        </aside>
      ) : null}
    </div>
  );
}

function ProductionRail({ process }) {
  const stages = process.split("→").map((stage) => stage.trim());
  return (
    <section className="service-production-rail-section">
      <div className="mx-auto max-w-site px-gutter py-16 md:py-20">
        <p className="v4-section-label">Controlled production</p>
        <ol className="service-production-rail">
          {stages.map((stage, position) => (
            <li key={stage}>
              <span>{numberFor(position)}</span>
              <strong>{stage}</strong>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default function ServiceDetailPage({
  variant,
  index,
  title,
  support,
  secondary,
  sections,
  cta,
  discipline,
  capabilities,
  quote,
  process,
  feature,
}) {
  return (
    <div className={`service-detail service-detail-${variant} font-v4-body text-paper`}>
      <section className="service-detail-hero mx-auto grid min-h-[74svh] max-w-site grid-cols-12 content-between gap-x-6 gap-y-12 px-gutter py-14 md:py-20">
        <div className="service-detail-hero-copy col-span-12 md:col-span-10">
          <p className="v4-section-label">{index} — Services</p>
          <h1 className="mt-8 max-w-[13ch] font-v4-display text-[clamp(3.2rem,7.5vw,7rem)] leading-[0.98]">
            {title}
          </h1>
          {secondary ? (
            <p className="mt-6 font-v4-display text-2xl italic text-signal">{secondary}</p>
          ) : null}
          <p className="mt-8 max-w-[60ch] text-lg leading-relaxed text-paper/70">{support}</p>
        </div>
        <div className="col-span-12 flex flex-wrap gap-6 border-t border-paper/15 pt-5 text-xs uppercase font-mono text-neutral">
          <Link to="/services" className="min-h-11 py-3 hover:text-signal">
            All Services
          </Link>
          <Link to="/gallery" className="min-h-11 py-3 hover:text-signal">
            Relevant Work
          </Link>
        </div>
      </section>

      {feature}

      <section className="service-thinking bg-paper text-night">
        <div className="mx-auto max-w-site px-gutter py-section">
          <p className="v4-section-label !text-night/55">How we think about it</p>
          {variant === "physical" ? (
            <PhysicalThinking sections={sections} />
          ) : (
            <StandardThinking variant={variant} sections={sections} />
          )}
          {quote ? (
            <blockquote className="service-founder-quote">
              <p>“{quote.text}”</p>
              <footer>— {quote.attribution}</footer>
            </blockquote>
          ) : null}
        </div>
      </section>

      {capabilities ? (
        <section className="service-capabilities">
          <div className="mx-auto grid max-w-site grid-cols-12 gap-8 px-gutter py-section">
            <div className="col-span-12 md:col-span-4">
              <p className="v4-section-label">Capabilities</p>
              <h2 className="mt-5 font-v4-display text-4xl">Built around the job.</h2>
            </div>
            <ol className="service-digital-stack col-span-12 md:col-span-7 md:col-start-6">
              {capabilities.map((item, position) => (
                <li key={item}>
                  <span>{numberFor(position)}</span>
                  <strong>{item}</strong>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {process ? <ProductionRail process={process} /> : null}

      <section className="border-t border-paper/15">
        <div className="mx-auto grid max-w-site gap-8 px-gutter py-12 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div>
            <h2 className="v4-section-label">Keep following the question</h2>
            <p className="mt-4 max-w-[48ch] font-v4-display text-xl">The work and the thinking belong together.</p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            <Link to="/gallery" className="v4-action-link min-h-11 text-signal hover:text-paper uppercase text-xs tracking-wider">
              See related work <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
            <Link to="/tutorials" className="v4-action-link min-h-11 text-signal hover:text-paper uppercase text-xs tracking-wider">
              Read Ideas <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t-2 border-signal">
        <div className="mx-auto max-w-site px-gutter py-20 md:py-28">
          <h2 className="max-w-[17ch] font-v4-display text-4xl leading-tight md:text-6xl">
            START WITH WHAT YOU HAVE.
          </h2>
          <Link
            to="/portal/quotes/new"
            className="v4-action-link mt-9 min-h-12 bg-signal px-7 font-semibold text-night hover:bg-paper uppercase text-xs tracking-wider"
          >
            Start a Project <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
