import { useEffect, useRef, useState } from "react";

import deliveredImage from "../../assets/redesign/rokit-made-real.jpg";
import productionImage from "../../assets/redesign/rokit-implementation.jpg";
import proofImage from "../../assets/redesign/rokit-material-proof.jpg";
import screenImage from "../../assets/redesign/rokit-editorial.jpg";

const chapters = [
  { label: "Screen", image: screenImage, alt: "Editorial study of a white publication against a dark background" },
  { label: "Proof", image: proofImage, alt: "Editorial study of a white printed piece against a dark background" },
  { label: "Production", image: productionImage, alt: "Editorial study of dark panels in a concrete interior" },
  { label: "Delivered", image: deliveredImage, alt: "Editorial study of printed stationery and material samples" },
];

export default function PhysicalProductionStory() {
  const [activeChapter, setActiveChapter] = useState(0);
  const markerRefs = useRef([]);

  useEffect(() => {
    const visibleMarkers = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visibleMarkers.add(entry.target);
          else visibleMarkers.delete(entry.target);
        });

        const viewportMiddle = window.innerHeight / 2;
        const closest = [...visibleMarkers].sort((a, b) => {
          const aBox = a.getBoundingClientRect();
          const bBox = b.getBoundingClientRect();
          return Math.abs(aBox.top + aBox.height / 2 - viewportMiddle) - Math.abs(bBox.top + bBox.height / 2 - viewportMiddle);
        })[0];
        if (closest?.dataset?.chapter !== undefined) {
          setActiveChapter(Number(closest.dataset.chapter));
        }
      },
      { rootMargin: "-36% 0px -36% 0px", threshold: 0 }
    );

    markerRefs.current.forEach((marker) => {
      if (marker) observer.observe(marker);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <section className="physical-story bg-paper text-night" aria-labelledby="physical-story-title">
      <h2 id="physical-story-title" className="sr-only">Screen to delivered</h2>

      <div className="physical-story-desktop" aria-label="Made Real production stages">
        <div className="physical-story-markers" aria-hidden="true">
          {chapters.map((chapter, index) => (
            <div
              key={chapter.label}
              data-chapter={index}
              ref={(node) => { markerRefs.current[index] = node; }}
            />
          ))}
        </div>

        <div className="physical-story-sticky">
          <div className="physical-story-layout mx-auto max-w-site px-gutter">
            <div className="physical-story-progression">
              <p className="v4-section-label !text-night/55">Made Real</p>
              <ol>
                {chapters.map((chapter, index) => (
                  <li
                    key={chapter.label}
                    className={index === activeChapter ? "is-active" : undefined}
                    aria-current={index === activeChapter ? "step" : undefined}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{chapter.label}</strong>
                  </li>
                ))}
              </ol>
            </div>

            <figure className="physical-story-stage">
              {chapters.map((chapter, index) => (
                <img
                  key={chapter.label}
                  src={chapter.image}
                  alt={chapter.alt}
                  className={index === activeChapter ? "is-active" : undefined}
                  aria-hidden={index !== activeChapter}
                />
              ))}
            </figure>
          </div>
        </div>
      </div>

      <div className="physical-story-static mx-auto max-w-site px-gutter">
        <p className="v4-section-label !text-night/55">Made Real</p>
        <ol>
          {chapters.map((chapter, index) => (
            <li key={chapter.label}>
              <header><span>{String(index + 1).padStart(2, "0")}</span><h3>{chapter.label}</h3></header>
              <figure><img src={chapter.image} alt={chapter.alt} /></figure>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
