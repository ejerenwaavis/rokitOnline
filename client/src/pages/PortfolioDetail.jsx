import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { findProject, servicePaths, publicProjects } from '../lib/workProjects';
import api from '../utils/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';

function RelatedWork({ project }) {
  const related = publicProjects
    .filter(
      (candidate) =>
        candidate.slug !== project.slug &&
        candidate.disciplines.some((discipline) => project.disciplines.includes(discipline))
    )
    .slice(0, 3);

  if (!related.length) return null;

  return (
    <section className="border-t border-paper/15">
      <div className="mx-auto max-w-site px-gutter py-section">
        <p className="v4-section-label">Related work</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {related.map((item) => (
            <Link
              key={item.slug}
              to={`/gallery/${item.slug}`}
              className="group border-t border-paper/20 py-5 block"
            >
              <span className="text-xs uppercase font-mono text-signal">
                {item.disciplines[0]}
              </span>
              <h3 className="mt-3 font-v4-display text-xl text-paper group-hover:text-signal transition-colors">
                {item.name}
              </h3>
              <ArrowRight className="mt-4 size-4 text-signal" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function PortfolioDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. Check if ID matches a static showcase project
  const staticProject = findProject(id);

  // 2. Otherwise load dynamic DB project
  const [dbProject, setDbProject] = useState(null);
  const [loading, setLoading] = useState(!staticProject);

  useEffect(() => {
    if (!staticProject && id) {
      setLoading(true);
      api.get(`/portfolio/${id}`)
        .then((res) => {
          setDbProject(res.data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id, staticProject]);

  if (loading) {
    return (
      <div className="min-h-screen bg-night flex items-center justify-center font-v4-body text-paper">
        <LoadingSpinner />
      </div>
    );
  }

  // Render static editorial project case study
  if (staticProject) {
    const story = staticProject.story;
    const storySections = story
      ? [
          ['Situation', story.situation],
          ['Audience / end user', story.audience],
          ['What we saw', story.observation],
          ['Process', story.process],
          ['Result', story.result],
          ['Lesson', story.lesson],
        ].filter((entry) => Boolean(entry[1]))
      : [];

    return (
      <>
        <Helmet>
          <title>{staticProject.name} — Made by rOKIt</title>
          <meta name="description" content={staticProject.hook} />
        </Helmet>

        <article className="font-v4-body text-paper">
          <header className="mx-auto max-w-site px-gutter pb-16 pt-16">
            <Link
              to="/gallery"
              className="v4-action-link min-h-11 text-signal hover:text-paper uppercase text-xs font-mono tracking-wider"
            >
              ← Made by rOKIt
            </Link>
            <p className="v4-section-label mt-10">
              {staticProject.name}
              {staticProject.sector ? ` · ${staticProject.sector}` : ''}
            </p>
            <h1 className="mt-6 max-w-[19ch] font-v4-display text-[clamp(2.8rem,7vw,6rem)] leading-[1.08]">
              {staticProject.hook}
            </h1>
            {staticProject.secondary && (
              <p className="mt-6 font-v4-display text-2xl text-paper/75">{staticProject.secondary}</p>
            )}
            <p className="mt-8 max-w-[62ch] text-sm leading-relaxed text-neutral">
              {staticProject.disciplines.join(' · ')}
            </p>
          </header>

          <section className="bg-paper text-night">
            <div
              className={`mx-auto grid max-w-site gap-10 px-gutter py-section ${
                staticProject.contribution || staticProject.principle
                  ? 'md:grid-cols-[minmax(0,1.25fr)_minmax(16rem,.75fr)]'
                  : 'md:grid-cols-1'
              }`}
            >
              <figure>
                <div
                  className="evidence-slot aspect-[4/3] flex items-center justify-center border border-night/20 text-xs font-mono text-night/60"
                  role="img"
                  aria-label="MEDIA REQUIRED"
                >
                  MEDIA REQUIRED
                </div>
              </figure>
              {(staticProject.contribution || staticProject.principle) && (
                <div className="border-t border-night/20 pt-5">
                  <p className="v4-section-label !text-night/60">
                    {staticProject.contribution ? 'rOKIt contribution' : 'Principle'}
                  </p>
                  {staticProject.contribution && (
                    <p className="mt-6 font-v4-display text-2xl leading-relaxed">
                      {staticProject.contribution}
                    </p>
                  )}
                  {staticProject.principle && (
                    <p className="mt-8 border-l-2 border-signal pl-4 font-v4-display text-xl leading-relaxed">
                      {staticProject.principle}
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>

          {storySections.length > 0 && (
            <section className="mx-auto max-w-site px-gutter py-section" aria-label="Project story">
              <div className="border-t border-paper/20">
                {storySections.map(([label, copy]) => (
                  <div
                    key={label}
                    className="grid gap-4 border-b border-paper/20 py-8 md:grid-cols-[minmax(0,.35fr)_minmax(0,1fr)]"
                  >
                    <h2 className="text-xs uppercase font-mono text-signal">{label}</h2>
                    <p className="max-w-[65ch] font-v4-display text-xl leading-relaxed md:text-2xl text-paper">
                      {copy}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="mx-auto max-w-site px-gutter py-section">
            <h2 className="v4-section-label">Related services</h2>
            <div className="mt-8 border-t border-paper/20">
              {staticProject.disciplines.map((discipline) => (
                <Link
                  key={discipline}
                  to={servicePaths[discipline] || '/services'}
                  className="group flex min-h-20 items-center justify-between gap-6 border-b border-paper/20 py-4 font-v4-display text-xl hover:text-signal md:text-2xl transition-colors"
                >
                  {discipline}
                  <ArrowRight className="size-5 shrink-0 text-signal" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </section>

          <RelatedWork project={staticProject} />

          <section className="border-t-2 border-signal">
            <div className="mx-auto max-w-site px-gutter py-section">
              <h2 className="font-v4-display text-4xl md:text-5xl">What are you trying to make work?</h2>
              <Link
                to="/portal/quotes/new"
                className="v4-action-link mt-8 min-h-12 bg-signal px-6 font-semibold text-night hover:bg-paper uppercase text-xs tracking-wider"
              >
                Start a Project <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </section>
        </article>
      </>
    );
  }

  // Render dynamic DB project from Portfolio collection
  if (dbProject) {
    const images = dbProject.images || [];
    const milestones = dbProject.milestones || [];
    const obstacles = dbProject.obstacles || [];

    return (
      <>
        <Helmet>
          <title>{dbProject.title} — Made by rOKIt</title>
          <meta name="description" content={dbProject.description || dbProject.title} />
        </Helmet>

        <article className="font-v4-body text-paper">
          <header className="mx-auto max-w-site px-gutter pb-16 pt-16">
            <Link
              to="/gallery"
              className="v4-action-link min-h-11 text-signal hover:text-paper uppercase text-xs font-mono tracking-wider"
            >
              ← Made by rOKIt
            </Link>
            <p className="v4-section-label mt-10">
              {dbProject.category || 'General'}
              {dbProject.clientName ? ` · ${dbProject.clientName}` : ''}
            </p>
            <h1 className="mt-6 max-w-[19ch] font-v4-display text-[clamp(2.8rem,7vw,6rem)] leading-[1.08]">
              {dbProject.title}
            </h1>
            {dbProject.description && (
              <p className="mt-6 font-v4-display text-2xl text-paper/75">{dbProject.description}</p>
            )}
          </header>

          {images.length > 0 && (
            <section className="bg-paper text-night">
              <div className="mx-auto max-w-site px-gutter py-section">
                <div className="grid gap-8 md:grid-cols-2">
                  {images.map((img, i) => (
                    <figure key={i} className="border border-night/20">
                      <img
                        src={img.url}
                        alt={img.caption || dbProject.title}
                        className="aspect-[4/3] w-full object-cover"
                      />
                      {img.caption && (
                        <figcaption className="p-3 text-xs font-mono text-night/70">
                          {img.caption}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </div>
            </section>
          )}

          {milestones.length > 0 && (
            <section className="mx-auto max-w-site px-gutter py-section">
              <h2 className="v4-section-label mb-8">Execution Milestones</h2>
              <div className="border-t border-paper/20">
                {milestones.map((m, i) => (
                  <div
                    key={i}
                    className="grid gap-4 border-b border-paper/20 py-8 md:grid-cols-[minmax(0,.35fr)_minmax(0,1fr)]"
                  >
                    <span className="text-xs uppercase font-mono text-signal">
                      {String(i + 1).padStart(2, '0')} · {m.title}
                    </span>
                    <p className="font-v4-display text-xl text-paper leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {obstacles.length > 0 && (
            <section className="mx-auto max-w-site px-gutter py-section">
              <h2 className="v4-section-label mb-8">Obstacles & Solutions</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {obstacles.map((obs, i) => (
                  <div key={i} className="border border-paper/15 bg-surface p-6">
                    <p className="text-xs uppercase font-mono text-signal mb-2">Challenge</p>
                    <p className="text-paper text-base mb-4 font-v4-display">{obs.challenge}</p>
                    <p className="text-xs uppercase font-mono text-neutral mb-2">How we solved it</p>
                    <p className="text-neutral text-sm leading-relaxed">{obs.solution}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="border-t-2 border-signal">
            <div className="mx-auto max-w-site px-gutter py-section">
              <h2 className="font-v4-display text-4xl md:text-5xl">What are you trying to make work?</h2>
              <Link
                to="/portal/quotes/new"
                className="v4-action-link mt-8 min-h-12 bg-signal px-6 font-semibold text-night hover:bg-paper uppercase text-xs tracking-wider"
              >
                Start a Project <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </section>
        </article>
      </>
    );
  }

  // Not found fallback
  return (
    <div className="min-h-screen bg-night font-v4-body text-paper flex flex-col items-center justify-center p-6 text-center">
      <h1 className="font-v4-display text-4xl mb-4">Project Not Found</h1>
      <p className="text-neutral mb-8">The project or case study you requested could not be located.</p>
      <Link
        to="/gallery"
        className="v4-action-link min-h-12 border border-signal px-8 text-xs uppercase font-mono tracking-wider text-signal hover:bg-signal hover:text-night transition-colors"
      >
        Return to Made by rOKIt
      </Link>
    </div>
  );
}
