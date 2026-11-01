import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import brandIdentity from "@/assets/rokit-brand-identity.jpg";
import digital from "@/assets/rokit-digital.jpg";
import editorial from "@/assets/rokit-editorial.jpg";
import implementation from "@/assets/rokit-implementation.jpg";
import madeReal from "@/assets/rokit-made-real.jpg";
import materialProof from "@/assets/rokit-material-proof.jpg";

const transformations = [
  ["an unclear brand", "a coherent identity", brandIdentity],
  ["a website that is not working", "a useful digital experience", digital],
  ["complex information", "communication people can understand", editorial],
  ["a rough idea", "a publication people can hold", materialProof],
  ["a design on screen", "something real people can use", madeReal],
  ["inconsistent visibility", "a clearer growth system", implementation],
] as const;

export function TransformationCanvas() {
  const [active, setActive] = useState(0);
  const [autoPlaying, setAutoPlaying] = useState(true);
  const [interactionPaused, setInteractionPaused] = useState(false);
  const playing = autoPlaying && !interactionPaused;

  useEffect(() => {
    if (!playing || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % transformations.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [playing]);

  const transformation = transformations[active] ?? transformations[0];

  return (
    <section aria-labelledby="transformation-title" className="transformation-canvas border-y border-paper/15 bg-surface text-paper" onMouseEnter={() => setInteractionPaused(true)} onMouseLeave={() => setInteractionPaused(false)} onFocusCapture={() => setInteractionPaused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setInteractionPaused(false); }}>
      <div className="mx-auto grid min-h-[34rem] max-w-site grid-cols-12 content-between gap-x-6 px-gutter py-12 md:py-16">
        <div className="col-span-12 flex items-start justify-between gap-6">
          <div>
            <p className="section-label">The rOKIt transformation canvas</p>
            <h2 id="transformation-title" className="mt-4 font-display text-2xl">From problem <span className="text-signal">→</span> to possibility</h2>
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={autoPlaying ? "Pause transformations" : "Play transformations"}
            aria-pressed={!autoPlaying}
            onClick={() => setAutoPlaying((current) => !current)}
            className="size-11 rounded-none border-paper/25 bg-transparent text-paper shadow-none hover:border-signal hover:bg-transparent hover:text-signal"
          >
            {autoPlaying ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
          </Button>
        </div>

        <div className="col-span-12 my-14 grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_18rem]">
          <p key={active} aria-live="polite" className="transformation-copy font-display text-[clamp(2.35rem,5.2vw,5.5rem)] leading-[1.02]">
            <span className="text-neutral">From </span>{transformation[0]}
            <span className="block pt-4 text-signal md:pl-[7vw]">to {transformation[1]}.</span>
          </p>
          <figure className="overflow-hidden border border-paper/15 bg-night"><img key={transformation[2]} src={transformation[2]} alt="Replaceable visual for the selected transformation" loading="lazy" className="transformation-visual aspect-[4/3] w-full object-cover" /><figcaption className="border-t border-paper/15 p-2 text-[9px] uppercase text-neutral">Replaceable concept image</figcaption></figure>
        </div>

        <div className="col-span-12 flex items-end justify-between gap-6">
          <div className="flex gap-2" aria-label={`Transformation ${active + 1} of ${transformations.length}`}>
            {transformations.map((item, index) => (
              <button
                key={item[0]}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show transformation ${index + 1}`}
                aria-current={index === active ? "true" : undefined}
                className={`h-11 w-7 border-b transition-colors ${index === active ? "border-signal" : "border-paper/25 hover:border-paper"}`}
              />
            ))}
          </div>
          <p className="max-w-64 text-right text-xs leading-relaxed text-neutral">A problem-led way of thinking, from first question to useful outcome.</p>
        </div>
      </div>
    </section>
  );
}