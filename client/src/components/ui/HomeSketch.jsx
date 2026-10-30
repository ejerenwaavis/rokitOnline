import { useEffect, useRef, useState } from "react";

export default function HomeSketch() {
  const ref = useRef(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setDrawn(true);
        observer.disconnect();
      }
    }, { threshold: 0.35 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`home-sketch mx-auto max-w-site px-gutter py-8 text-neutral ${drawn ? "is-drawn" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 760 230" className="w-full max-h-[15rem]" fill="none">
        <g className="sketch-lines" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path pathLength="1" d="M115 149 Q155 127 195 131 L268 99 Q299 91 318 109" />
          <path pathLength="1" d="M267 100 L246 54 Q259 45 279 55 L309 72" />
          <path pathLength="1" d="M320 109 C312 70 367 48 397 75 C429 100 415 144 379 151 C342 157 312 136 320 109 Z" />
          <path pathLength="1" d="M396 76 Q451 48 490 67 L523 99" />
          <path pathLength="1" d="M414 123 L490 163 L549 143 M490 163 L463 191" />
          <path className="sketch-reconsider" pathLength="1" d="M316 111 L269 178 M278 151 L301 158 M278 161 L300 147" />
          <path pathLength="1" d="M523 99 Q558 65 590 94 L612 128 L583 161 L549 143 L523 99 Z M584 96 L649 82" />
          <path pathLength="1" d="M195 131 Q227 198 309 184 L365 150 M612 128 L659 142" />
        </g>
        <g className="sketch-nodes" fill="currentColor">
          <circle cx="195" cy="131" r="3" />
          <circle cx="397" cy="76" r="3" />
          <circle cx="549" cy="143" r="3" />
          <path d="M643 77l9 10m-10 0 10-10" stroke="currentColor" />
        </g>
      </svg>
    </div>
  );
}
