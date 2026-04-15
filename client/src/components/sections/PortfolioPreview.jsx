import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import api from '../../utils/api';

const placeholderItems = [
  { _id: '1', title: 'Brand Identity â€“ Tech Startup', category: 'branding', images: [{ url: '/assets/images/strip-1.jpg' }] },
  { _id: '2', title: 'Large Format Banner Campaign', category: 'banner-prints', images: [{ url: '/assets/images/strip-2.jpg' }] },
  { _id: '3', title: 'Roll-Up Series â€“ Annual Summit', category: 'roll-up-banners', images: [{ url: '/assets/images/1-no-text.jpg' }] },
];

function PortfolioCard({ item, className = '', delay = 0 }) {
  const imgUrl = item.images?.[0]?.url || '/assets/images/strip-1.jpg';
  const label  = item.category?.replace(/-/g, ' ') || '';

  return (
    <motion.div
      className={`group relative overflow-hidden rounded-2xl cursor-pointer border border-white/[0.07] ${className}`}
      style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)' }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.012 }}
    >
      {/* Image layer */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={imgUrl}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
        />
        {/* Base gradient â€” always on */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.25) 55%, transparent 100%)' }}
        />
        {/* Orange glow tint â€” appears on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{ background: 'linear-gradient(to top, rgba(255,151,41,0.18) 0%, transparent 55%)' }}
        />
      </div>

      {/* Card content */}
      <div className="relative z-10 flex flex-col justify-end h-full min-h-[260px] p-6">
        {/* Category badge â€” slides up on hover */}
        <span className="inline-block self-start px-3 py-1 rounded-full border border-rokit-orange/30 bg-rokit-orange/10 font-mono text-[10px] tracking-[0.2em] text-rokit-orange uppercase mb-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
          {label}
        </span>

        {/* Title */}
        <h3 className="font-hero text-2xl md:text-3xl text-white tracking-wide transition-colors duration-500 group-hover:text-rokit-orange leading-none">
          {item.title}
        </h3>

        {/* Accent line â€” extends on hover */}
        <div className="h-0.5 bg-rokit-orange rounded-full mt-4 w-0 group-hover:w-12 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out" />
      </div>
    </motion.div>
  );
}

export default function PortfolioPreview() {
  const [items, setItems] = useState(placeholderItems);

  useEffect(() => {
    api.get('/portfolio/featured').then(res => {
      if (Array.isArray(res.data) && res.data.length) setItems(res.data);
    }).catch(() => {});
  }, []);

  const featured = items[0];
  const rest     = items.slice(1);

  return (
    <section className="bg-rokit-dark py-24 relative overflow-hidden">
      {/* Ambient glow crown */}
      <div aria-hidden className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[280px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(255,151,41,0.07) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* â”€â”€ Section header â”€â”€ */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-mono text-rokit-orange text-[10px] uppercase tracking-[0.28em] mb-4">Our Work</p>
          <h2 className="font-hero text-white leading-none mb-4 tracking-wide"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
            Featured Projects
          </h2>
          <div className="w-8 h-px bg-rokit-orange mx-auto mb-6" />
          <p className="text-white/35 max-w-xl mx-auto font-light text-sm tracking-wide leading-relaxed">
            A snapshot of the creative and printing work we've delivered for brands across Nigeria.
          </p>
        </motion.div>

        {/* â”€â”€ Bento grid â”€â”€ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[260px]">
          {/* Featured card â€” occupies 2Ã—2 */}
          {featured && (
            <PortfolioCard
              item={featured}
              className="md:col-span-2 md:row-span-2"
              delay={0}
            />
          )}
          {/* Supporting cards */}
          {rest.map((item, i) => (
            <PortfolioCard
              key={item._id}
              item={item}
              delay={0.1 + i * 0.08}
            />
          ))}
        </div>

        {/* â”€â”€ CTA â”€â”€ */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/gallery" className="btn-primary">
            View Full Gallery <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}


