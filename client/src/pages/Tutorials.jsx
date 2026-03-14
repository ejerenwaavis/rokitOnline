import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search } from 'lucide-react';
import api from '../utils/api';
import TutorialCard from '../components/ui/TutorialCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { T } from '../theme';

const tutorialCategories = ['all', 'design tips', 'printing', 'branding', 'web', 'business'];

export default function Tutorials() {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ page, limit: 9 });
    if (activeCategory !== 'all') params.append('category', activeCategory);
    api.get(`/tutorials?${params}`, { signal: controller.signal })
      .then(res => {
        setLoading(false);
        const tuts = Array.isArray(res.data?.tutorials) ? res.data.tutorials
          : Array.isArray(res.data) ? res.data : [];
        setTutorials(tuts);
        setTotalPages(res.data?.totalPages || 1);
      })
      .catch(() => { setLoading(false); setTutorials([]); });
    return () => controller.abort();
  }, [page, activeCategory]);

  const displayed = search.trim()
    ? tutorials.filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
    : tutorials;

  return (
    <>
      <Helmet>
        <title>Tutorials & Tips – Rokit Media</title>
        <meta name="description" content="Learn design, printing, and branding tips from the Rokit Media team." />
      </Helmet>

      {/* Hero */}
      <div className={T.pageHero}>
        <div className={`${T.pageHeroInner} ${T.pageHeroCentered}`}>
          <span className={`${T.eyebrowOrange} mb-3`}>Knowledge Hub</span>
          <h1 className={`${T.h1} mb-4`}>Tutorials &amp; Tips</h1>
          <p className={`${T.body} max-w-xl mx-auto`}>
            Practical guides, design tips, and industry insights from our creative team.
          </p>
        </div>
      </div>

      {/* Filters */}
      {/* Filters */}
      <div className="bg-rokit-cream border-b border-rokit-orange/10 py-4 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {tutorialCategories.map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setPage(1); }}
                className={activeCategory === cat ? T.chipActive : T.chipIdle}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tutorials…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 text-sm focus:outline-none focus:border-rokit-orange w-56 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className={T.sectionAlt}>
        <div className={T.sectionInner}>
          {loading ? (
            <LoadingSpinner center />
          ) : displayed.length === 0 ? (
            <p className="text-center text-rokit-body py-16">No tutorials found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayed.map(t => <TutorialCard key={t._id} tutorial={t} />)}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && !search && (
            <div className="flex justify-center gap-2 mt-12">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 font-mono text-[10px] uppercase tracking-[0.1em] transition-all duration-200 ${
                    page === i + 1 ? 'bg-rokit-orange text-white' : 'bg-white border border-rokit-orange/20 text-rokit-body hover:border-rokit-orange'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
