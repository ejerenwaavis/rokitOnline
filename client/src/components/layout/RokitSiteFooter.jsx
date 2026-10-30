import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export function FooterWordmark() {
  const ref = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setActive(true);
        observer.disconnect();
      }
    }, { threshold: 0.35 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`footer-wordmark relative mx-auto max-w-site px-gutter pt-8 ${active ? "is-active" : ""}`}>
      <img
        src="/assets/images/rokit-logo-white.png"
        alt="rOKIt"
        className="footer-logo-white w-full translate-y-[18%] object-contain"
      />
      <div className="footer-o-activation pointer-events-none absolute inset-x-gutter bottom-0 top-8 overflow-hidden" aria-hidden="true">
        <img
          src="/assets/images/rokit-logo-white.png"
          alt=""
          className="footer-logo-orange h-full w-full translate-y-[18%] object-contain"
        />
      </div>
    </div>
  );
}

export default function RokitSiteFooter() {
  return (
    <footer className="site-footer overflow-hidden border-t border-paper/15 bg-night text-paper font-v4-body">
      <div className="mx-auto grid max-w-site grid-cols-2 gap-8 px-gutter py-12 text-xs text-neutral md:grid-cols-4 md:py-16">
        <div>
          <p className="mb-4 uppercase tracking-wider text-paper font-medium text-xs">Start something</p>
          <div className="space-y-2">
            <Link to="/portal/quotes/new" className="block min-h-8 hover:text-signal transition-colors">Start a Project</Link>
            <Link to="/portal/quotes/new" className="block min-h-8 hover:text-signal transition-colors">Build Your Brief</Link>
            <Link to="/portal/orders/new" className="block min-h-8 hover:text-signal transition-colors">Place an Order / Spec</Link>
            <Link to="/services" className="block min-h-8 hover:text-signal transition-colors">Customise something</Link>
          </div>
        </div>

        <div>
          <p className="mb-4 uppercase tracking-wider text-paper font-medium text-xs">Explore</p>
          <div className="space-y-2">
            <Link to="/gallery" className="block min-h-8 hover:text-signal transition-colors">Made by rOKIt</Link>
            <Link to="/services" className="block min-h-8 hover:text-signal transition-colors">Services</Link>
            <Link to="/solutions/sme" className="block min-h-8 hover:text-signal transition-colors">Solutions for SMEs</Link>
            <Link to="/solutions/ngo" className="block min-h-8 hover:text-signal transition-colors">Solutions for NGOs</Link>
            <Link to="/about" className="block min-h-8 hover:text-signal transition-colors">About Us</Link>
          </div>
        </div>

        <div>
          <p className="mb-4 uppercase tracking-wider text-paper font-medium text-xs">Ideas & Knowledge</p>
          <div className="space-y-2">
            <Link to="/tutorials" className="block min-h-8 hover:text-signal transition-colors">Tutorials & Insights</Link>
            <Link to="/photo-enhancer" className="block min-h-8 hover:text-signal transition-colors">AI Photo Enhancer</Link>
            <Link to="/contact" className="block min-h-8 hover:text-signal transition-colors">Contact</Link>
            <Link to="/terms" className="block min-h-8 hover:text-signal transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="block min-h-8 hover:text-signal transition-colors">Privacy Policy</Link>
            <Link to="/cookies" className="block min-h-8 hover:text-signal transition-colors">Cookie Policy</Link>
          </div>
        </div>

        <div>
          <p className="mb-4 uppercase tracking-wider text-paper font-medium text-xs">We Make Ideas RocK.</p>
          <p className="max-w-44 leading-relaxed text-neutral">Founded by Okorite Isokariari. Built across disciplines.</p>
          <div className="mt-4 space-y-1 text-neutral/75">
            <p className="text-[11px]"><span className="text-paper">Abuja:</span> 6 Jama Are Close, Garki 2</p>
            <p className="text-[11px]"><span className="text-paper">UK:</span> 25 James St, Bradford</p>
            <p className="text-[11px] mt-2"><a href="tel:+2347031616075" className="hover:text-signal transition-colors">+234 703 161 6075</a></p>
          </div>
        </div>
      </div>

      <FooterWordmark />

      <div className="border-t border-paper/15">
        <div className="mx-auto flex max-w-site flex-wrap justify-between gap-3 px-gutter py-5 text-[10px] uppercase text-neutral">
          <span className="normal-case font-medium text-paper">rOKIt Media</span>
          <span>© {new Date().getFullYear()} Rokit Media. We Make Ideas RocK.</span>
        </div>
      </div>
    </footer>
  );
}
