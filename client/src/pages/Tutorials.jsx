import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ideaArticles } from '../lib/ideasContent';
import api from '../utils/api';

const formats = ['All', 'Practical answer', 'Story & lesson', 'Perspective', 'Founder note', 'Framework'];

export default function Tutorials() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeFormat = searchParams.get('format') || 'All';
  const [dbTutorials, setDbTutorials] = useState([]);

  useEffect(() => {
    api.get('/tutorials?limit=12')
      .then((res) => {
        const list = Array.isArray(res.data?.tutorials) ? res.data.tutorials : Array.isArray(res.data) ? res.data : [];
        const formatted = list.map((t) => ({
          slug: t.slug,
          title: t.title,
          deck: t.excerpt || t.title,
          topic: t.category || 'General',
          format: 'Perspective',
          isDb: true,
        }));
        setDbTutorials(formatted);
      })
      .catch(() => {});
  }, []);

  const allArticles = [...ideaArticles, ...dbTutorials];
  const featured = allArticles.find((a) => a.featured) || allArticles[0];
  const visible = allArticles.filter((a) => activeFormat === 'All' || a.format === activeFormat);

  return (
    <>
      <Helmet>
        <title>Ideas — Writing Shaped by the Work at rOKIt</title>
        <meta
          name="description"
          content="Practice notes, founder perspectives and evidence-informed thinking from rOKIt."
        />
        <meta property="og:title" content="Ideas — Writing Shaped by the Work at rOKIt" />
        <meta property="og:description" content="What the work keeps teaching us." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="font-v4-body bg-paper text-night">
        {/* Header */}
        <section className="mx-auto max-w-site px-gutter pt-16 pb-12 border-b border-night/20">
          <p className="v4-section-label !text-night/65">Ideas</p>
          <h1 className="mt-4 font-v4-display text-4xl md:text-7xl leading-tight">
            The Work Taught Us. We Wrote It Down.
          </h1>
        </section>

        {/* Featured Idea */}
        {featured && (
          <section className="bg-night text-paper">
            <div className="mx-auto grid max-w-site grid-cols-12 gap-8 px-gutter py-section">
              <div className="col-span-12 md:col-span-7">
                <p className="v4-section-label">Featured · {featured.format}</p>
                <h2 className="mt-6 max-w-[13ch] font-v4-display text-4xl md:text-5xl">
                  {featured.title}
                </h2>
                <p className="mt-5 font-v4-display text-2xl italic text-signal">{featured.deck}</p>
                <Link
                  to={`/tutorials/${featured.slug}`}
                  className="v4-action-link mt-8 min-h-11 text-paper hover:text-signal uppercase text-xs font-mono tracking-wider"
                >
                  Read the idea <ArrowRight className="size-3.5 ml-2" aria-hidden="true" />
                </Link>
              </div>
              {featured.cover && (
                <figure className="col-span-10 col-start-3 md:col-span-4 md:col-start-9">
                  <img
                    src={featured.cover.src}
                    alt={featured.cover.alt}
                    width={640}
                    height={640}
                    loading="lazy"
                    className="aspect-square w-full object-cover"
                  />
                  <figcaption className="mt-3 text-xs text-neutral font-mono">
                    {featured.cover.caption}
                  </figcaption>
                </figure>
              )}
            </div>
          </section>
        )}

        {/* Format Filter & List */}
        <section className="mx-auto max-w-site px-gutter py-section">
          <h2 className="v4-section-label !text-night/65">Latest Ideas</h2>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-b border-night/20 pb-5" role="group">
            {formats.map((fmt) => (
              <button
                key={fmt}
                type="button"
                aria-pressed={activeFormat === fmt}
                onClick={() => {
                  if (fmt === 'All') setSearchParams({});
                  else setSearchParams({ format: fmt });
                }}
                className={`min-h-11 rounded-none px-0 text-xs font-mono uppercase tracking-wider transition-colors ${
                  activeFormat === fmt ? 'text-signal underline font-semibold' : 'text-night hover:text-signal'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>

          <div className="mt-8 divide-y divide-night/20">
            {visible.map((article) => (
              <Link
                key={article.slug}
                to={`/tutorials/${article.slug}`}
                className="group grid gap-6 py-8 md:grid-cols-[minmax(0,.4fr)_minmax(0,1fr)_auto] items-start"
              >
                <span className="text-xs font-mono uppercase text-night/65">
                  {article.topic} · {article.format}
                </span>
                <div>
                  <h3 className="font-v4-display text-2xl text-night group-hover:text-signal transition-colors">
                    {article.title}
                  </h3>
                  <p className="mt-3 text-sm text-night/75 leading-relaxed">{article.deck}</p>
                </div>
                <ArrowRight className="text-signal size-5 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>

        {/* Tools & Lab */}
        <section className="bg-night text-paper">
          <div className="mx-auto max-w-site px-gutter py-section">
            <p className="v4-section-label">Tools & Knowledge</p>
            <h2 className="mt-5 max-w-[22ch] font-v4-display text-3xl md:text-4xl">
              Templates Start Blank. Problems Don’t.
            </h2>
            <div className="mt-8 border-t border-paper/20 divide-y divide-paper/20">
              <article className="grid gap-4 py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
                <h3 className="font-v4-display text-xl">rOKIt Discovery Brief Builder</h3>
                <p className="text-sm leading-relaxed text-neutral">
                  Step-by-step plain questioning that transforms raw ideas into structured specifications.
                </p>
                <span className="text-xs font-mono uppercase text-signal">Public Utility</span>
              </article>
              <article className="grid gap-4 py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
                <h3 className="font-v4-display text-xl">AI Photo Enhancer</h3>
                <p className="text-sm leading-relaxed text-neutral">
                  Deep facial restoration and print-grade upscaling for legacy and vintage assets.
                </p>
                <span className="text-xs font-mono uppercase text-signal">Production Tool</span>
              </article>
            </div>
            <div className="mt-8 flex flex-wrap gap-6">
              <Link
                to="/portal/quotes/new?route=build-my-brief"
                className="v4-action-link min-h-11 text-signal hover:text-paper uppercase text-xs tracking-wider"
              >
                Build Your Brief <ArrowRight className="size-3.5 ml-1" aria-hidden="true" />
              </Link>
              <Link
                to="/photo-enhancer"
                className="v4-action-link min-h-11 text-paper hover:text-signal uppercase text-xs tracking-wider"
              >
                Try Photo Enhancer <ArrowRight className="size-3.5 ml-1" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
