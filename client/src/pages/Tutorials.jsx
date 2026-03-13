import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search } from 'lucide-react';
import api from '../utils/api';
import TutorialCard from '../components/ui/TutorialCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

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
      <div className="bg-gray-50 border-b border-gray-100 pt-32 pb-14 text-center">
        <p className="text-rokit-orange text-xs font-medium tracking-[0.15em] uppercase mb-3">Knowledge Hub</p>
        <h1 className="text-5xl font-bold text-rokit-dark mb-4">Tutorials & Tips</h1>
        <p className="text-rokit-body max-w-xl mx-auto">
          Practical guides, design tips, and industry insights from our creative team.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-100 py-4 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {tutorialCategories.map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setPage(1); }}
                className={`shrink-0 px-4 py-2 text-sm font-medium capitalize rounded-full transition-all duration-200 ${
                  activeCategory === cat ? 'bg-rokit-orange text-white' : 'bg-white border border-gray-200 text-rokit-body hover:border-rokit-orange/40 hover:text-rokit-dark'
                }`}
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
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-rokit-orange w-56"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
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
                  className={`w-10 h-10 font-medium text-sm rounded-lg transition-all duration-200 ${
                    page === i + 1 ? 'bg-rokit-orange text-white' : 'bg-white border border-gray-200 text-rokit-body hover:border-rokit-orange/40'
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
