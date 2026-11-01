import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { LabSystem } from "@/components/rokit-interactive-sections";
import { RokitSiteFooter } from "@/components/rokit-site-footer";
import { RokitSiteHeader } from "@/components/rokit-site-header";

export const Route = createFileRoute("/lab")({
  head: () => ({ meta: [{ title: "rOKIt Lab — Problems worth solving again" }, { name: "description", content: "rOKIt Lab investigates recurring problems and develops practical, reusable answers." }, { property: "og:title", content: "rOKIt Lab — Problems worth solving again" }, { property: "og:description", content: "If we keep solving it, we should stop starting over." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: LabPage,
});

function LabPage() { return <div className="min-h-screen bg-night font-body text-paper"><RokitSiteHeader /><main><section className="mx-auto grid min-h-[68svh] max-w-site grid-cols-12 content-center gap-8 px-gutter py-section"><div className="col-span-12 md:col-span-10"><p className="section-label">rOKIt Lab</p><h1 className="mt-7 max-w-[14ch] font-display text-[clamp(3.3rem,8vw,7rem)] leading-none">If We Keep Solving It, We Should Stop Starting Over.</h1><p className="mt-8 max-w-[58ch] text-lg leading-relaxed text-paper/70">When the same problem keeps showing up, we investigate what can be learned, tested and made reusable.</p></div></section><section className="border-y border-paper/15 bg-surface"><div className="mx-auto max-w-site px-gutter py-section"><h2 className="max-w-[18ch] font-display text-4xl">Some problems deserve more than a project.</h2><p className="mt-6 text-sm uppercase leading-relaxed text-neutral">Problem → investigate → test → learn → build / improve / park / drop</p><LabSystem /><div className="mt-10 flex flex-wrap gap-4"><Link to="/tools" className="action-link min-h-12 bg-signal px-6 text-night">Explore Tools <ArrowRight aria-hidden="true" /></Link><Link to="/ideas" className="action-link min-h-12 border border-paper/25 px-6 hover:text-signal">Explore Ideas</Link></div></div></section></main><RokitSiteFooter /></div>; }