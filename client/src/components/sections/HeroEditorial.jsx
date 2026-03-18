import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function HeroEditorial() {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVis(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen bg-rokit-cream flex flex-col justify-center overflow-hidden pt-20">
      {/* Decorative background letter */}
      <div
        aria-hidden
        className="absolute right-0 top-1/2 -translate-y-1/2 font-display text-[28rem] font-light leading-none text-rokit-orange/[0.04] select-none pointer-events-none hidden xl:block"
      >
        R
      </div>

      {/* Thin vertical left accent */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-rokit-orange/20 hidden lg:block" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full py-24">
        {/* Eyebrow */}
        <div
          className={`flex items-center gap-4 mb-10 transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <div className="w-8 h-px bg-rokit-orange" />
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-rokit-body">
            Rokit Media · Nigeria &amp; United Kingdom
          </span>
        </div>

        {/* Headline */}
        <h1
          className={`font-display font-light text-rokit-dark leading-none mb-8 transition-all duration-1000 delay-100 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ fontSize: 'clamp(3.5rem, 9vw, 8rem)' }}
        >
          Prints That<br />
          <span className="text-rokit-orange italic">Move People.</span><br />
          Brands That Last.
        </h1>

        {/* Body */}
        <p
          className={`text-rokit-body text-lg font-light max-w-xl leading-relaxed mb-12 transition-all duration-1000 delay-200 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          Nigeria's leading creative agency for large-format printing, branding, graphic
          design, and web design. Precision-crafted for brands that demand visibility.
        </p>

        {/* CTAs */}
        <div
          className={`flex flex-wrap gap-4 mb-20 transition-all duration-1000 delay-300 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <Link to="/portal/orders/new" className="btn-primary">
            Start a Project <ArrowRight size={13} />
          </Link>
          <Link to="/services" className="btn-outline">
            Our Services
          </Link>
        </div>

        {/* Scroll cue */}
        <div
          className={`flex items-center gap-3 transition-all duration-1000 delay-500 ${vis ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="relative w-5 h-8 border border-rokit-body/25 flex justify-center pt-1.5">
            <div className="w-px h-2 bg-rokit-orange animate-bounce" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-rokit-body">
            Scroll to explore
          </span>
        </div>
      </div>
    </section>
  );
}
