import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

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

  const allImages = items.flatMap(item =>
    (item.images || []).map(img => ({ src: img.url || img, title: item.title }))
  );

  const openLightbox = (itemIdx, imgIdx) => {
    const beforeCount = items.slice(0, itemIdx).reduce((acc, i) => acc + (i.images?.length || 0), 0);
    setLightboxIndex(beforeCount + imgIdx);
    setLightboxOpen(true);
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
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {items.map((item, itemIdx) =>
                (item.images || []).map((img, imgIdx) => (
                  <div
                    key={`${item._id}-${imgIdx}`}
                    className="break-inside-avoid group relative overflow-hidden cursor-pointer bg-rokit-cream-dark"
                    onClick={() => openLightbox(itemIdx, imgIdx)}
                  >
                    <img
                      src={img.url || img}
                      alt={item.title}
                      className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <p className="text-white font-mono text-[10px] uppercase tracking-[0.12em] leading-tight">{item.title}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={allImages}
      />
    </>
  );
}
