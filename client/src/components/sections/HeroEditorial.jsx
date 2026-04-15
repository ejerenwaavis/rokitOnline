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

export default function HeroEditorial() {
  return (
    <section className="relative min-h-screen bg-rokit-cream flex flex-col justify-center overflow-hidden pt-20">

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

      {/* ── Decorative right panel (desktop only) ── */}
      <div
        aria-hidden
        className="absolute right-0 top-0 bottom-0 w-[44%] hidden lg:flex flex-col gap-3 p-8 pt-28 pointer-events-none"
      >
        <div className="flex gap-3 flex-1">
          <motion.div
            className="flex-1 bg-rokit-dark/[0.03] border border-rokit-orange/[0.07] overflow-hidden relative"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.95 }}
          >
            <div className="absolute bottom-4 left-4">
              <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-rokit-orange/60">Large Format</p>
            </div>
            <motion.div
              className="absolute left-0 top-0 w-1 bg-rokit-orange"
              initial={{ height: 0 }} animate={{ height: '100%' }}
              transition={{ duration: 1.1, delay: 1.15, ease: 'easeOut' }}
            />
          </motion.div>
          <motion.div
            className="w-2/5 bg-rokit-orange/[0.08] border border-rokit-orange/[0.12] overflow-hidden relative"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.05 }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="font-display text-9xl font-light leading-none text-rokit-orange/[0.15] select-none"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 1.25 }}
              >R</motion.div>
            </div>
          </motion.div>
        </div>

        <div className="flex gap-3 h-36">
          {['Branding', 'Web', 'Print'].map((label, i) => (
            <motion.div
              key={label}
              className="flex-1 border border-rokit-orange/[0.07] relative overflow-hidden"
              style={{ background: i === 1 ? 'rgba(255,151,41,0.06)' : 'rgba(26,26,26,0.02)' }}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.15 + i * 0.1 }}
            >
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-rokit-orange/[0.08]"
                initial={{ height: 0 }}
                animate={{ height: `${30 + i * 15}%` }}
                transition={{ duration: 1, delay: 1.35 + i * 0.1, ease: 'easeOut' }}
              />
              <p className="absolute bottom-2 left-2 font-mono text-[8px] uppercase tracking-[0.18em] text-rokit-body/40">{label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="absolute top-1/2 right-8 w-2 h-2 rounded-full bg-rokit-orange"
          initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.6 }}
          style={{ translateY: '-50%' }}
        />
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
