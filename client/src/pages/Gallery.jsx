import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { publicProjects, workNeeds, projectsForNeed } from '../lib/workProjects';
import ProjectGrid from '../components/ui/ProjectGrid';
import api from '../utils/api';

export default function Gallery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const needId = searchParams.get('need') || '';
  const [dynamicProjects, setDynamicProjects] = useState([]);

  useEffect(() => {
    api.get('/portfolio')
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          // Format dynamic portfolio items so they integrate nicely into the project grid
          const formatted = res.data.map((item) => ({
            slug: item._id,
            name: item.title,
            format: 'compact',
            disciplines: [item.category || 'General'],
            hook: item.description || item.title,
            isDynamic: true,
            coverImage: item.images?.[0]?.url,
          }));
          setDynamicProjects(formatted);
        }
      })
      .catch(() => {});
  }, []);

  const allProjects = [...publicProjects, ...dynamicProjects];
  const filtered = projectsForNeed(allProjects, needId);

  const featured = filtered.find((p) => p.format === 'deep' && p.homepage);
  const stories = filtered.filter((p) => p.format === 'deep' && p !== featured);
  const entries = filtered.filter((p) => p.format === 'compact');

  return (
    <>
      <Helmet>
        <title>Made by rOKIt — Work That Had to Survive the Real World</title>
        <meta
          name="description"
          content="Brands, websites, campaigns, publications and physical work that still had a job to do once the presentation ended."
        />
        <meta property="og:title" content="Made by rOKIt — Work That Had to Survive the Real World" />
        <meta
          property="og:description"
          content="Brands, websites, campaigns, publications and physical work that still had a job to do."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="font-v4-body text-paper">
        {/* Header */}
        <section className="mx-auto max-w-site px-gutter pt-16 pb-12 border-b border-paper/15">
          <p className="v4-section-label">Made by rOKIt</p>
          <h1 className="mt-4 font-v4-display text-4xl md:text-7xl">SEE WHAT IT TOOK.</h1>
          <p className="mt-4 max-w-[50ch] text-base leading-relaxed text-paper/70">
            Brands, websites, campaigns, publications and physical work built for the real world.
          </p>
        </section>

        {/* Filter by Job Need */}
        <section className="mx-auto max-w-site px-gutter py-section" aria-label="Browse Made by rOKIt">
          <div className="border-t border-paper/20 py-5">
            <p className="v4-section-label">What needs to work?</p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2" role="group" aria-label="Filter by job need">
              {[{ id: '', label: 'All jobs' }, ...workNeeds].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={needId === item.id}
                  onClick={() => {
                    if (item.id) setSearchParams({ need: item.id });
                    else setSearchParams({});
                  }}
                  className={`min-h-11 rounded-none px-0 text-xs font-mono uppercase tracking-wider transition-colors ${
                    needId === item.id ? 'text-signal underline' : 'text-paper hover:text-signal'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <p className="sr-only" role="status">
            {filtered.length} projects shown.
          </p>

          <div className="mt-12 space-y-16">
            {featured && (
              <section aria-label="Featured story">
                <h2 className="v4-section-label mb-6">Featured story</h2>
                <Link
                  to={`/gallery/${featured.slug}`}
                  className="group grid items-end gap-6 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]"
                >
                  <div className="overflow-hidden bg-surface">
                    <div
                      className="evidence-slot aspect-[16/10] flex items-center justify-center border border-paper/15 text-xs text-paper/60 font-mono"
                      role="img"
                      aria-label="MEDIA REQUIRED"
                    >
                      MEDIA REQUIRED
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-signal">
                      {featured.disciplines[0]}
                    </span>
                    <h3 className="mt-3 font-v4-display text-3xl md:text-4xl text-paper group-hover:text-signal transition-colors">
                      {featured.name}
                    </h3>
                    <p className="mt-4 max-w-[35ch] font-v4-display text-xl leading-relaxed text-paper/80">
                      {featured.hook}
                    </p>
                    <ArrowRight className="mt-6 text-signal" aria-hidden="true" />
                  </div>
                </Link>
              </section>
            )}

            {stories.length > 0 && (
              <section aria-label="Project stories">
                <h2 className="v4-section-label mb-8">Project stories</h2>
                <ProjectGrid projects={stories} />
              </section>
            )}

            {entries.length > 0 && (
              <section aria-label="Smaller entries">
                <h2 className="v4-section-label mb-8">Case studies & entries</h2>
                <ProjectGrid projects={entries} compact />
              </section>
            )}

            {filtered.length === 0 && (
              <p className="py-12 text-neutral">
                No published entries match these choices. Try another job or service.
              </p>
            )}
          </div>
        </section>

        {/* Start a Project Footer Banner */}
        <section className="border-t-2 border-signal">
          <div className="mx-auto max-w-site px-gutter py-20 md:py-28">
            <h2 className="max-w-[16ch] font-v4-display text-4xl md:text-6xl">
              START WITH WHAT YOU HAVE.
            </h2>
            <Link
              to="/portal/quotes/new"
              className="v4-action-link mt-8 min-h-12 bg-signal px-7 font-semibold text-night hover:bg-paper uppercase text-xs tracking-wider"
            >
              Start a Project <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
