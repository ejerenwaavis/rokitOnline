import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Link2, Check } from 'lucide-react';
import { findIdea, ideaArticles } from '../lib/ideasContent';
import api from '../utils/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function TutorialPost() {
  const { slug } = useParams();
  const [copied, setCopied] = useState(false);

  // 1. Check static ideas
  const staticIdea = findIdea(slug);

  // 2. Fallback to DB
  const [dbPost, setDbPost] = useState(null);
  const [loading, setLoading] = useState(!staticIdea);

  useEffect(() => {
    if (!staticIdea && slug) {
      setLoading(true);
      api.get(`/tutorials/${slug}`)
        .then((res) => {
          setDbPost(res.data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [slug, staticIdea]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center font-v4-body text-night">
        <LoadingSpinner />
      </div>
    );
  }

  // Static editorial idea
  if (staticIdea) {
    return (
      <>
        <Helmet>
          <title>{staticIdea.title} — rOKIt Ideas</title>
          <meta name="description" content={staticIdea.deck} />
        </Helmet>

        <article className="min-h-screen bg-paper font-v4-body text-night">
          <header className="mx-auto max-w-site px-gutter pb-16 pt-16 border-b border-night/20">
            <Link
              to="/tutorials"
              className="v4-action-link min-h-11 text-night hover:text-signal uppercase text-xs font-mono tracking-wider"
            >
              ← Ideas
            </Link>
            <p className="v4-section-label mt-10 !text-night/65">
              {staticIdea.topic} · {staticIdea.format}
            </p>
            <h1 className="mt-8 max-w-[15ch] font-v4-display text-4xl leading-tight md:text-7xl">
              {staticIdea.title}
            </h1>
            <p className="mt-7 max-w-[35ch] font-v4-display text-2xl italic text-night/85">
              {staticIdea.deck}
            </p>
            <div className="mt-8 flex items-center gap-4 text-xs font-mono text-night/65">
              <button
                type="button"
                onClick={copyLink}
                className="flex items-center gap-2 hover:text-signal transition-colors"
              >
                {copied ? <Check className="size-4 text-signal" /> : <Link2 className="size-4" />}
                {copied ? 'Link copied' : 'Copy link'}
              </button>
            </div>
          </header>

          {staticIdea.answer && (
            <div className="bg-night text-paper">
              <div className="mx-auto grid max-w-site gap-12 px-gutter py-section md:grid-cols-[minmax(0,.4fr)_minmax(0,1fr)]">
                <h2 className="v4-section-label">The short answer</h2>
                <p className="max-w-[45ch] font-v4-display text-2xl leading-relaxed md:text-3xl text-paper">
                  {staticIdea.answer}
                </p>
              </div>
            </div>
          )}

          <div className="mx-auto max-w-site px-gutter py-section">
            <div className="max-w-[46rem] space-y-14 md:ml-auto">
              {staticIdea.body.map((block, i) => (
                <section key={i}>
                  <h2 className="v4-section-label !text-night/65">{block.heading}</h2>
                  {block.paragraphs.map((para, pi) => (
                    <p key={pi} className="mt-5 text-lg leading-relaxed text-night/85">
                      {para}
                    </p>
                  ))}
                </section>
              ))}

              <section className="border-t border-night/20 pt-8">
                <h2 className="v4-section-label !text-night/65">Take it into the work</h2>
                <div className="mt-5 grid gap-4">
                  <Link
                    to="/services/brand-identity"
                    className="v4-action-link min-h-11 justify-start text-night hover:text-signal uppercase text-xs tracking-wider"
                  >
                    Explore Brand & Identity <ArrowRight className="size-3.5 ml-2" aria-hidden="true" />
                  </Link>
                  <Link
                    to="/gallery"
                    className="v4-action-link min-h-11 justify-start text-night hover:text-signal uppercase text-xs tracking-wider"
                  >
                    See Related Work <ArrowRight className="size-3.5 ml-2" aria-hidden="true" />
                  </Link>
                  <Link
                    to="/portal/quotes/new?route=build-my-brief"
                    className="v4-action-link min-h-11 justify-start text-night hover:text-signal uppercase text-xs tracking-wider"
                  >
                    Build Your Brief with rOKIt Discovery <ArrowRight className="size-3.5 ml-2" aria-hidden="true" />
                  </Link>
                </div>
              </section>

              <div className="border-t border-night/20 pt-8">
                <Link to="/tutorials" className="v4-action-link min-h-11 text-night hover:text-signal uppercase text-xs tracking-wider">
                  ← All Ideas
                </Link>
              </div>
            </div>
          </div>
        </article>
      </>
    );
  }

  // Dynamic DB Tutorial
  if (dbPost) {
    return (
      <>
        <Helmet>
          <title>{dbPost.title} — rOKIt Knowledge Hub</title>
          <meta name="description" content={dbPost.excerpt || dbPost.title} />
        </Helmet>

        <article className="min-h-screen bg-paper font-v4-body text-night">
          <header className="mx-auto max-w-site px-gutter pb-16 pt-16 border-b border-night/20">
            <Link
              to="/tutorials"
              className="v4-action-link min-h-11 text-night hover:text-signal uppercase text-xs font-mono tracking-wider"
            >
              ← Ideas & Tutorials
            </Link>
            <p className="v4-section-label mt-10 !text-night/65">
              {dbPost.category || 'Tutorial'}
            </p>
            <h1 className="mt-8 max-w-[15ch] font-v4-display text-4xl leading-tight md:text-6xl">
              {dbPost.title}
            </h1>
            {dbPost.excerpt && (
              <p className="mt-7 max-w-[35ch] font-v4-display text-2xl italic text-night/85">
                {dbPost.excerpt}
              </p>
            )}
          </header>

          <div className="mx-auto max-w-site px-gutter py-section">
            <div
              className="max-w-[46rem] md:ml-auto prose prose-lg text-night/85 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: dbPost.content }}
            />
          </div>
        </article>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-paper font-v4-body text-night flex flex-col items-center justify-center p-6 text-center">
      <h1 className="font-v4-display text-4xl mb-4">Article Not Found</h1>
      <p className="text-neutral mb-8">The tutorial or essay you requested does not exist.</p>
      <Link
        to="/tutorials"
        className="v4-action-link min-h-12 border border-night px-8 text-xs uppercase font-mono tracking-wider text-night hover:bg-night hover:text-paper transition-colors"
      >
        Return to Ideas
      </Link>
    </div>
  );
}
