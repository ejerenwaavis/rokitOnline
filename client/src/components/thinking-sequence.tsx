import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const stages = [
  ["Think", "Understand what needs to happen."],
  ["Connect", "Bring the relevant disciplines together."],
  ["Make", "Give the thinking a working form."],
  ["Prove", "Check the work against its purpose."],
] as const;

export function ThinkingSequence() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node || finished || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(([entry]) => setPlaying(entry?.isIntersecting ?? false), { threshold: .5 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [finished]);
  useEffect(() => {
    if (!playing || finished) return;
    const timer = window.setTimeout(() => {
      if (active === 3) { setFinished(true); setPlaying(false); }
      else setActive(value => value + 1);
    }, 1400);
    return () => window.clearTimeout(timer);
  }, [active, playing, finished]);
  const choose = (index: number) => { setActive(index); setFinished(true); setPlaying(false); };
  return <section ref={ref} className="thinking-sequence border-b border-paper/15" aria-label="Think, connect, make, prove">
    <div className="mx-auto grid max-w-site gap-8 px-gutter py-12 md:grid-cols-[minmax(0,.6fr)_minmax(0,1.4fr)]">
      <p className="section-label self-start">Thinking becomes work</p>
      <div><ol className="grid grid-cols-2 gap-4 sm:grid-cols-4">{stages.map(([stage, copy], index) => <li key={stage} className="min-w-0 border-t border-paper/25 pt-3"><Button variant="ghost" aria-pressed={active === index} onClick={() => choose(index)} className="h-auto min-h-11 w-full justify-start rounded-none px-0 text-paper hover:bg-transparent hover:text-signal aria-pressed:text-signal"><span className="mr-2 text-xs">0{index + 1}</span>{stage}</Button><p className="mt-2 text-xs leading-relaxed text-neutral">{copy}</p></li>)}</ol>
      <svg viewBox="0 0 600 72" className="mt-6 h-16 w-full text-signal" aria-hidden="true"><path d="M30 36H570" fill="none" stroke="currentColor" opacity=".25" />{stages.map(([stage], index) => <g key={stage} className={active >= index ? "thinking-mark is-connected" : "thinking-mark"}>{index === 0 ? <circle cx="30" cy="36" r="5" fill="currentColor" /> : index === 1 ? <path d="M195 25L207 36L195 47L183 36Z" fill="none" stroke="currentColor" /> : index === 2 ? <rect x="352" y="25" width="22" height="22" fill="none" stroke="currentColor" /> : <path d="M552 36L562 46L580 25" fill="none" stroke="currentColor" strokeWidth="2" />}</g>)}</svg></div>
    </div>
  </section>;
}