import { Link } from 'react-router-dom';

export default function CTABand() {
  return (
    <section
      className="relative py-24 bg-fixed bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/images/strip-1.jpg')" }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-rokit-dark/80" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <p className="text-rokit-orange text-xs font-medium uppercase tracking-[0.15em] mb-4">
          Ready to Get Started?
        </p>
        <h2 className="font-display text-5xl md:text-6xl font-light text-white leading-tight mb-6">
          Our Jobs Are Constantly<br />
          <span className="text-rokit-orange">Under Construction</span>
        </h2>
        <p className="text-gray-300 text-base max-w-xl mx-auto mb-10">
          From large format banners to complete brand identities — we bring your ideas to life,
          fast and flawlessly. Let's build something great together.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/contact" className="btn-primary">Talk to Us</Link>
          <Link to="/portal/quote" className="btn-white">Request a Quote</Link>
        </div>
      </div>
    </section>
  );
}
