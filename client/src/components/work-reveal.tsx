import { useEffect, useRef } from "react";

import brandIdentity from "@/assets/rokit-brand-identity.jpg";
import digital from "@/assets/rokit-digital.jpg";
import editorial from "@/assets/rokit-editorial.jpg";
import implementation from "@/assets/rokit-implementation.jpg";

const revealItems = [
  { image: brandIdentity, category: "Brand", label: "Identity system study", index: "A—01", ratio: "aspect-[4/3]", className: "work-reveal-card-1" },
  { image: digital, category: "Digital", label: "Website experience study", index: "A—02", ratio: "aspect-[4/5]", className: "work-reveal-card-2" },
  { image: editorial, category: "Communication", label: "Publication system study", index: "A—03", ratio: "aspect-square", className: "work-reveal-card-3" },
  { image: implementation, category: "Physical", label: "Physical implementation study", index: "A—04", ratio: "aspect-[16/10]", className: "work-reveal-card-4" },
] as const;

export function WorkReveal() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactLayout = window.matchMedia("(max-width: 767px)");
    let frame = 0;
    let listening = false;

    const renderProgress = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
      const rawProgress = Math.min(Math.max(-rect.top / travel, 0), 1);
      const settledProgress = Math.min(rawProgress / 0.86, 1);
      const easedProgress = 1 - Math.pow(1 - settledProgress, 3);
      section.style.setProperty("--work-reveal-progress", easedProgress.toFixed(4));
      section.style.setProperty("--work-reveal-inverse", (1 - easedProgress).toFixed(4));
    };

    const requestRender = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(renderProgress);
    };

    const stopListening = () => {
      if (!listening) return;
      listening = false;
      window.removeEventListener("scroll", requestRender);
      window.removeEventListener("resize", requestRender);
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const startListening = () => {
      if (listening || reducedMotion.matches || compactLayout.matches) return;
      listening = true;
      window.addEventListener("scroll", requestRender, { passive: true });
      window.addEventListener("resize", requestRender);
      requestRender();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) startListening();
        else stopListening();
      },
      { rootMargin: "20% 0px" },
    );

    const handlePreferenceChange = () => {
      if (reducedMotion.matches || compactLayout.matches) {
        stopListening();
        section.style.setProperty("--work-reveal-progress", "1");
        section.style.setProperty("--work-reveal-inverse", "0");
      } else {
        startListening();
      }
    };

    section.style.setProperty("--work-reveal-progress", "0");
    section.style.setProperty("--work-reveal-inverse", "1");
    observer.observe(section);
    reducedMotion.addEventListener("change", handlePreferenceChange);
    compactLayout.addEventListener("change", handlePreferenceChange);
    handlePreferenceChange();

    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", handlePreferenceChange);
      compactLayout.removeEventListener("change", handlePreferenceChange);
      stopListening();
    };
  }, []);

  return (
    <section ref={sectionRef} className="work-reveal" aria-label="Selected work reveal">
      <div className="work-reveal-sticky">
        <div className="work-reveal-stage mx-auto max-w-site px-gutter">
          <div className="work-reveal-composition">
            {revealItems.map((item) => (
              <figure key={item.index} className={`work-reveal-card ${item.className}`}>
                <div className="relative overflow-hidden bg-surface">
                  <img
                    src={item.image}
                    alt={`${item.label} replaceable concept image`}
                    width={1280}
                    height={960}
                    loading="lazy"
                    className={`${item.ratio} w-full object-cover`}
                  />
                  <span className="absolute left-3 top-3 bg-night/90 px-2 py-1 text-[10px] uppercase text-paper">Replaceable concept image</span>
                </div>
                <figcaption className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-t border-paper/20 pt-3">
                  <div>
                    <p className="text-[10px] uppercase text-signal">{item.category}</p>
                    <h2 className="mt-1 font-display text-lg text-paper">{item.label}</h2>
                    <p className="mt-2 text-xs text-neutral">Concept placeholder · Awaiting verified project details</p>
                  </div>
                  <span className="text-xs text-signal">{item.index}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}