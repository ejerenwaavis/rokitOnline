import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <>
      <Helmet>
        <title>About rOKIt — Built across disciplines</title>
        <meta name="description" content="Founded by Okorite Isokariari. rOKIt has operated since 2008, bringing disciplines together around the work." />
        <meta property="og:title" content="About rOKIt — Built across disciplines" />
        <meta property="og:description" content="We didn’t choose multidisciplinary. The problems did." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="bg-night font-v4-body text-paper">
        {/* Hero Section */}
        <section className="mx-auto grid min-h-[45svh] max-w-site grid-cols-12 content-center gap-8 px-gutter py-section">
          <div className="col-span-12 min-w-0 md:col-span-8">
            <p className="v4-section-label">About <span className="normal-case">rOKIt</span></p>
            <h1 className="mt-7 max-w-[15ch] font-v4-display text-4xl leading-none md:text-5xl">
              We Didn’t Choose Multidisciplinary. The Problems Did.
            </h1>
            <p className="mt-8 max-w-[64ch] text-lg leading-relaxed text-paper/70">
              Real business problems rarely identify themselves as branding, digital, marketing, communication or production. The job decides what we bring.
            </p>
          </div>
        </section>

        {/* The Work / Heritage */}
        <section className="bg-paper text-night">
          <div className="mx-auto grid max-w-site grid-cols-12 gap-x-6 gap-y-14 px-gutter py-section">
            <div className="col-span-12 md:col-span-6">
              <p className="v4-section-label !text-night/55">The work</p>
              <h2 className="mt-6 max-w-[13ch] font-v4-display text-4xl md:text-5xl">
                The Tools Changed. The Instinct Didn’t.
              </h2>
              <p className="mt-5 text-xs text-neutral uppercase tracking-wider">VERIFY BEFORE PUBLICATION</p>
              <p className="mt-7 max-w-[54ch] text-sm leading-relaxed text-night/65">
                rOKIt has operated since 2008. The work has expanded across disciplines, but the starting point remains the same: understand what needs to work, then bring together what the job requires.
              </p>
            </div>
            <div className="col-span-12 border-l-2 border-signal pl-6 md:col-span-5 md:col-start-8">
              <div className="evidence-slot aspect-[4/3] mb-6 flex items-center justify-center bg-surface text-paper border border-paper/15 text-xs font-mono" role="img" aria-label="MEDIA REQUIRED">
                MEDIA REQUIRED
              </div>
              <h2 className="font-v4-display text-2xl text-night">Founded by Okorite Isokariari. Built across disciplines.</h2>
            </div>
          </div>
        </section>

        {/* Why we work this way */}
        <section className="mx-auto max-w-site px-gutter py-section">
          <p className="v4-section-label">Why we work this way</p>
          <div className="mt-8 grid gap-8 border-t border-paper/20 pt-8 md:grid-cols-[minmax(0,.7fr)_minmax(0,1.3fr)]">
            <h2 className="max-w-[18ch] font-v4-display text-3xl">The problem is the starting point.</h2>
            <p className="max-w-[55ch] text-base leading-relaxed text-neutral">
              A recognisable identity, a useful website, a clear publication and a properly made object are different responses. What connects them is the work they need to do.
            </p>
          </div>
        </section>

        {/* Working principles */}
        <section className="border-y border-paper/15 bg-surface">
          <div className="mx-auto max-w-site px-gutter py-section">
            <p className="v4-section-label">Working principles</p>
            <div className="mt-8 border-t border-paper/20">
              {[
                ["Understand before making.", "Start with the people, purpose and existing reality."],
                ["Make the thinking visible.", "Give the direction a form people can understand and use."],
                ["Carry the work through.", "Check what happens beyond the presentation and the exported file."]
              ].map(([title, copy], index) => (
                <div key={title} className="grid gap-5 border-b border-paper/20 py-8 md:grid-cols-[3rem_minmax(0,1fr)_minmax(0,1fr)]">
                  <span className="text-xs text-signal font-mono">0{index + 1}</span>
                  <h2 className="font-v4-display text-2xl">{title}</h2>
                  <p className="text-sm leading-relaxed text-neutral">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Today / the next question */}
        <section className="mx-auto max-w-site px-gutter py-section">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <p className="v4-section-label">Today / the next question</p>
              <h2 className="mt-5 max-w-[18ch] font-v4-display text-3xl">The work keeps teaching us.</h2>
            </div>
            <div>
              <p className="max-w-[52ch] text-sm leading-relaxed text-neutral">
                Services carry the work into the world. Made by rOKIt records what the job required. Ideas makes the learning useful; Tools and Lab explore what can be reused.
              </p>
              <div className="mt-8 flex flex-wrap gap-6">
                <Link to="/gallery" className="v4-action-link min-h-11 text-signal hover:text-paper uppercase tracking-wider text-xs">
                  See Made by rOKIt <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
                <Link to="/tutorials" className="v4-action-link min-h-11 text-paper hover:text-signal uppercase tracking-wider text-xs">
                  Explore Ideas <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
