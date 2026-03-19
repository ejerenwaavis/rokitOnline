import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar, Tag, User, ChevronDown } from 'lucide-react';
import api from '../utils/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { T } from '../theme';
import { useAuth } from '../context/AuthContext';

export default function PortfolioDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [ctaOpen, setCtaOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    api.get(`/portfolio/${id}`, { signal: controller.signal })
      .then(res => { setItem(res.data); setLoading(false); })
      .catch(() => { setLoading(false); });
    return () => controller.abort();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-rokit-cream flex items-center justify-center"><LoadingSpinner /></div>;
  if (!item) return (
    <div className={T.notFound}>
      <p className="text-rokit-body mb-4">Project not found.</p>
      <Link to="/gallery" className="btn-primary">Back to Gallery</Link>
    </div>
  );

  const images = item.images || [];
  const coverImage = images[0]?.url || null;
  const hasMilestones = Array.isArray(item.milestones) && item.milestones.length > 0;
  const hasObstacles = Array.isArray(item.obstacles) && item.obstacles.length > 0;
  const sortedMilestones = hasMilestones
    ? [...item.milestones].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : [];

  return (
    <>
      <Helmet>
        <title>{item.title} – Rokit Media Portfolio</title>
        <meta name="description" content={item.description || `Portfolio project: ${item.title}`} />
      </Helmet>

      {/* Back nav */}
      <div className="bg-rokit-cream border-b border-rokit-orange/10 pt-24 pb-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-rokit-body hover:text-rokit-orange transition-colors"
          >
            <ArrowLeft size={13} /> Back to Gallery
          </button>
        </div>
      </div>

      {/* Hero image */}
      {coverImage && (
        <div className="bg-rokit-dark">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
            <img
              src={images[activeImg]?.url || coverImage}
              alt={item.title}
              className="w-full max-h-[70vh] object-contain"
            />
            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`flex-none w-16 h-16 overflow-hidden transition-opacity ${activeImg === i ? 'ring-2 ring-rokit-orange' : 'opacity-50 hover:opacity-80'}`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className={T.sectionCream}>
        <div className={`${T.sectionInner} max-w-4xl`}>

          {/* Title block */}
          <div className="mb-10">
            <span className={`${T.eyebrowOrange} mb-3 block`}>{item.category?.replace(/-/g, ' ')}</span>
            <h1 className={`${T.h1} mb-4`}>{item.title}</h1>
            <div className="flex flex-wrap gap-4 items-center text-sm text-rokit-body">
              {item.client && (
                <span className="flex items-center gap-1.5">
                  <User size={13} className="text-rokit-orange" /> {item.client}
                </span>
              )}
              {item.completedDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-rokit-orange" />
                  {new Date(item.completedDate).toLocaleDateString('en-GB', { year: 'numeric', month: 'long' })}
                </span>
              )}
              {Array.isArray(item.tags) && item.tags.length > 0 && (
                <span className="flex items-center gap-1.5 flex-wrap">
                  <Tag size={13} className="text-rokit-orange" />
                  {item.tags.map(t => (
                    <span key={t} className="bg-rokit-cream-dark border border-rokit-orange/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide">{t}</span>
                  ))}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {item.description && (
            <div className="mb-14">
              <div className="w-8 h-px bg-rokit-orange mb-6" />
              <p className={`${T.body} text-lg max-w-2xl`}>{item.description}</p>
            </div>
          )}

          {/* Milestones / Process Timeline */}
          {hasMilestones && (
            <div className="mb-14">
              <div className="mb-8">
                <span className={`${T.eyebrow} block mb-2`}>Process</span>
                <h2 className={T.h2}>How We Did It</h2>
                <div className="w-8 h-px bg-rokit-orange mt-4" />
              </div>
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-4 top-2 bottom-2 w-px bg-rokit-orange/20" />
                <div className="space-y-8 pl-12">
                  {sortedMilestones.map((m, i) => (
                    <div key={i} className="relative">
                      {/* Dot */}
                      <div className="absolute -left-[2.15rem] top-1 w-4 h-4 rounded-full border-2 border-rokit-orange bg-rokit-cream flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-rokit-orange" />
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-rokit-orange">Step {i + 1}</span>
                      <h3 className={`${T.h3} mt-1 mb-2`}>{m.title}</h3>
                      {m.description && <p className={T.body}>{m.description}</p>}
                      {m.image?.url && (
                        <div className="mt-4">
                          <img src={m.image.url} alt={m.title} className="w-full max-w-md rounded border border-rokit-orange/10 object-cover" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Obstacles & Solutions */}
          {hasObstacles && (
            <div className="mb-14">
              <div className="mb-8">
                <span className={`${T.eyebrow} block mb-2`}>Challenges</span>
                <h2 className={T.h2}>Obstacles & How We Overcame Them</h2>
                <div className="w-8 h-px bg-rokit-orange mt-4" />
              </div>
              <div className="space-y-6">
                {item.obstacles.map((o, i) => (
                  <div key={i} className="border border-rokit-orange/10 overflow-hidden">
                    <div className="grid sm:grid-cols-2 gap-0">
                      <div className="p-6 bg-rokit-cream-dark border-r border-rokit-orange/10">
                        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-rokit-body block mb-3">Challenge</span>
                        <p className={T.body}>{o.challenge}</p>
                      </div>
                      <div className="p-6 bg-white">
                        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-rokit-orange block mb-3">Solution</span>
                        <p className={T.body}>{o.solution}</p>
                      </div>
                    </div>
                    {o.image?.url && (
                      <div className="p-6 bg-white border-t border-rokit-orange/10">
                        <img src={o.image.url} alt={`Obstacle ${i + 1}`} className="w-full max-w-lg rounded border border-rokit-orange/10 object-cover" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="border-t border-rokit-orange/10 pt-10 flex flex-col sm:flex-row gap-4 items-start">
            {isLoggedIn() ? (
              <div className="relative">
                <button
                  onClick={() => setCtaOpen(p => !p)}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  Start a Similar Project <ChevronDown size={14} className={`transition-transform ${ctaOpen ? 'rotate-180' : ''}`} />
                </button>
                {ctaOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-rokit-orange/10 shadow-lg z-50">
                    <Link
                      to={`/portal/quotes/new?serviceType=${encodeURIComponent(item.category || '')}&project=${encodeURIComponent(item.title || '')}`}
                      className="block px-5 py-3 text-sm text-rokit-dark hover:bg-rokit-cream transition-colors font-mono uppercase tracking-wider text-[11px]"
                    >
                      Request a Quote
                    </Link>
                    <Link
                      to={`/portal/orders/new?serviceType=${encodeURIComponent(item.category || '')}&project=${encodeURIComponent(item.title || '')}`}
                      className="block px-5 py-3 text-sm text-rokit-dark hover:bg-rokit-cream transition-colors border-t border-rokit-orange/10 font-mono uppercase tracking-wider text-[11px]"
                    >
                      Create Job Order
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/portal/quotes/new" className="btn-primary">Start a Similar Project</Link>
            )}
            <Link to="/gallery" className="btn-outline">Browse More Work</Link>
          </div>
        </div>
      </div>
    </>
  );
}
