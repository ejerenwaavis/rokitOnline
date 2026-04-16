import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import CountUp from 'react-countup';

// Each headline line springs up from below — satisfying "thud" with Bebas Neue
const stamp = (delay = 0) => ({
  hidden: { y: '115%', opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 130, damping: 16, delay },
  },
});

// Vintage film reel images (split across two strips — 8 each for full-height coverage)
const REEL_A = [
  '/assets/images/strip-1.jpg',
  '/assets/images/reel/banner-print-1.jpg',
  '/assets/images/prints.jpg',
  '/assets/images/reel/web-design-1.jpg',
  '/assets/images/1-no-text.jpg',
  '/assets/images/reel/business-card-1.jpg',
  '/assets/images/brand-elevated.jpg',
  '/assets/images/reel/poster-design-1.jpg',
];
const REEL_B = [
  '/assets/images/strip-2.jpg',
  '/assets/images/reel/flyer-design-1.jpg',
  '/assets/images/okorite.jpg',
  '/assets/images/reel/billboard-1.jpg',
  '/assets/images/about-cover.jpg',
  '/assets/images/reel/creative-desk-1.jpg',
  '/assets/images/ceo.jpg',
  '/assets/images/reel/laptop-website-1.jpg',
];

function FilmStrip({ images, direction = 'up', duration = 30, className = '' }) {
  const doubled = [...images, ...images];
  const anim = direction === 'up' ? 'filmScrollUp' : 'filmScrollDown';

  // One film frame: left sprocket column | image | right sprocket column
  const frame = (src, i) => (
    <div key={i} className="shrink-0 flex" style={{ background: '#111' }}>
      {/* Left sprocket column */}
      <div className="w-[22px] shrink-0 flex flex-col items-center justify-evenly py-[3px]">
        {Array.from({ length: 4 }).map((_, j) => (
          <div key={j} className="w-[16px] h-[16px] rounded-sm bg-white/80" />
        ))}
      </div>
      {/* Image */}
      <div className="flex-1 py-[3px]">
        <div className="w-full h-full overflow-hidden rounded-2xl" style={{ aspectRatio: '16/10' }}>
          <img
            src={src} alt="" loading="lazy"
            className="w-full h-full object-cover reel-img"
          />
        </div>
      </div>
      {/* Right sprocket column */}
      <div className="w-[22px] shrink-0 flex flex-col items-center justify-evenly py-[3px]">
        {Array.from({ length: 4 }).map((_, j) => (
          <div key={j} className="w-[16px] h-[16px] rounded-sm bg-white/80" />
        ))}
      </div>
    </div>
  );

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: '#111' }}>
      <div
        className="flex flex-col"
        style={{ animation: `${anim} ${duration}s linear infinite` }}
      >
        {doubled.map((src, i) => frame(src, i))}
      </div>
    </div>
  );
}

export default function HeroEditorial() {
  return (
    <section
      className="relative min-h-screen bg-rokit-cream flex flex-col justify-center overflow-hidden pt-20"
    >

      {/* ── Cinematic intro scrim — dark flash clears on load ── */}
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-rokit-dark z-40 pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />

      {/* ── Ambient orange glow pools ── */}
      <div aria-hidden className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,151,41,0.07) 0%, transparent 65%)' }}
      />
      <div aria-hidden className="absolute -top-24 right-0 w-[500px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,151,41,0.04) 0%, transparent 70%)' }}
      />

      {/* ── Huge faint "ROKIT" watermark drifts in behind content ── */}
      <div aria-hidden className="absolute inset-0 flex items-end justify-end pointer-events-none overflow-hidden select-none">
        <motion.p
          className="font-hero leading-none text-rokit-dark/[0.04]"
          style={{ fontSize: 'clamp(9rem, 21vw, 22rem)', transform: 'translateX(6%) translateY(12%)' }}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 2.2, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
        >
          ROKIT
        </motion.p>
      </div>

      {/* ── Thin vertical left accent ── */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-rokit-orange/20 hidden lg:block" />

      {/* ── Vintage film-strip reels (desktop only) ── */}
      <div
        aria-hidden
        className="absolute right-0 top-0 bottom-0 w-[44%] hidden lg:flex items-stretch gap-3 p-8 pt-28 pointer-events-auto"
      >
        <div className="flex gap-3 flex-1">
          <FilmStrip images={REEL_A} direction="up" duration={82} className="flex-1" />
          <FilmStrip images={REEL_B} direction="down" duration={96} className="flex-1" />
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full py-24 relative z-10">
        <div className="xl:max-w-[55%]">

          {/* Eyebrow with extending line */}
          <motion.div
            className="flex items-center gap-4 mb-10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <motion.div
              className="bg-rokit-orange h-px"
              initial={{ width: 0 }}
              animate={{ width: 32 }}
              transition={{ duration: 0.5, delay: 0.45 }}
            />
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-rokit-body">
              Rokit Media · Nigeria &amp; United Kingdom
            </span>
          </motion.div>

          {/* ── Headline — line-by-line spring stamp ── */}
          <h1
            className="font-hero text-rokit-dark leading-none mb-8 tracking-wide"
            style={{ fontSize: 'clamp(5rem, 13vw, 12rem)' }}
          >
            <span className="block overflow-hidden">
              <motion.span className="block" initial="hidden" animate="visible" variants={stamp(0.55)}>
                Prints That
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                className="block font-display italic text-rokit-orange"
                style={{ fontSize: 'clamp(3.8rem, 10vw, 9.5rem)' }}
                initial="hidden" animate="visible" variants={stamp(0.74)}
              >
                Move People.
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span className="block" initial="hidden" animate="visible" variants={stamp(0.91)}>
                Brands That Last.
              </motion.span>
            </span>
          </h1>

          {/* Body */}
          <motion.p
            className="text-rokit-body text-lg font-light max-w-xl leading-relaxed mb-12"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Nigeria's leading creative agency for large-format printing, branding, graphic
            design, and web design. Precision-crafted for brands that demand visibility.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap gap-4 mb-20"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 1.28, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Link to="/portal/orders/new" className="btn-primary">
              Start a Project <ArrowRight size={13} />
            </Link>
            <Link to="/services" className="btn-outline">
              Our Services
            </Link>
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.5 }}
          >
            <div className="relative w-5 h-8 border border-rokit-body/25 flex justify-center pt-1.5">
              <div className="w-px h-2 bg-rokit-orange animate-bounce" />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-rokit-body">
              Scroll to explore
            </span>
          </motion.div>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <motion.div
        className="w-full border-t border-rokit-orange/10 bg-rokit-cream-dark"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 1.6 }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 grid grid-cols-3 gap-4 divide-x divide-rokit-orange/10">
          {[
            { end: 500, suffix: '+', label: 'Projects Completed' },
            { end: 350, suffix: '+', label: 'Happy Clients' },
            { end: 10,  suffix: '+', label: 'Years of Excellence' },
          ].map(s => (
            <div key={s.label} className="text-center px-4">
              <p className="font-display text-3xl md:text-4xl font-light text-rokit-dark">
                <CountUp end={s.end} suffix={s.suffix} enableScrollSpy scrollSpyOnce duration={2} />
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-rokit-body mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
