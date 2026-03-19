import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { T } from '../theme';

const categories = [
  { value: '', label: 'All' },
  { value: 'large-format', label: 'Large Format' },
  { value: 'banner-prints', label: 'Banner Prints' },
  { value: 'branding', label: 'Branding' },
  { value: 'roll-up-banners', label: 'Roll-Up Banners' },
  { value: 'web-design', label: 'Web Design' },
  { value: 'graphic-design', label: 'Graphic Design' },
];

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const url = activeCategory ? `/portfolio?category=${activeCategory}` : '/portfolio';
    const controller = new AbortController();
    api.get(url, { signal: controller.signal })
      .then(res => { setLoading(false); setItems(Array.isArray(res.data) ? res.data : []); })
      .catch(() => { setLoading(false); setItems([]); });
    return () => controller.abort();
  }, [activeCategory]);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
  };

  return (
    <>
      <Helmet>
        <title>Portfolio & Gallery – Rokit Media</title>
        <meta name="description" content="Browse Rokit Media's portfolio of large format prints, branding, web design, and graphic design projects." />
      </Helmet>

      {/* Hero */}
      <div className={T.pageHero}>
        <div className={`${T.pageHeroInner} ${T.pageHeroCentered}`}>
          <span className={`${T.eyebrowOrange} mb-3`}>Our Portfolio</span>
          <h1 className={`${T.h1} mb-4`}>Gallery</h1>
          <p className={`${T.body} max-w-xl mx-auto`}>
            A curated showcase of creative and printing work delivered for brands across Nigeria.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-rokit-cream sticky top-0 z-40 border-b border-rokit-orange/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex gap-2 overflow-x-auto py-4 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={activeCategory === cat.value ? T.chipActive : T.chipIdle}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <section className={T.sectionCream}>
        <div className={T.sectionInner}>
          {loading ? (
            <LoadingSpinner center />
          ) : items.length === 0 ? (
            <div className="text-center py-20 text-rokit-body">No portfolio items found.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] sm:auto-rows-[220px] lg:auto-rows-[240px] gap-1" style={{ gridAutoFlow: 'dense' }}>
              {items.map((item, index) => {
                const isFeature = index % 5 === 0;
                return (
                <div
                  key={item._id}
                  className={`group relative overflow-hidden cursor-pointer bg-rokit-cream-dark ${isFeature ? 'col-span-2 row-span-2' : ''}`}
                  onClick={() => navigate(`/gallery/${item._id}`)}
                >
                  <img
                    src={item.images?.[0]?.url || item.images?.[0] || ''}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-end justify-end p-4 gap-1">
                    <p className="text-white font-mono text-[10px] uppercase tracking-[0.12em] leading-tight text-right">{item.title}</p>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-rokit-orange">{item.category?.replace(/-/g, ' ')}</span>
                    <span className="font-mono text-[9px] text-white/50 mt-1">View details →</span>
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

    </>
  );
}
