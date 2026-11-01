import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { RokitSiteHeader } from "@/components/rokit-site-header";
import { RokitSiteFooter } from "@/components/rokit-site-footer";

type RouteShellProps = {
  eyebrow: string;
  title: string;
  intro: string;
  children?: ReactNode;
};

export function RouteShell({ eyebrow, title, intro, children }: RouteShellProps) {
  return (
     <div className="min-h-dvh bg-night font-body text-paper selection:bg-signal selection:text-night">
      <RokitSiteHeader />
      <main>
        <section className="mx-auto grid min-h-[72vh] max-w-site grid-cols-12 content-between gap-x-6 px-gutter py-14 md:py-20">
          <div className="col-span-12 md:col-span-9">
            <p className="section-label">{eyebrow}</p>
            <h1 className="mt-8 max-w-[12ch] font-display text-[clamp(3.2rem,8vw,7.4rem)] leading-[0.98]">{title}</h1>
            <p className="mt-8 max-w-[54ch] text-lg leading-relaxed text-paper/70">{intro}</p>
          </div>
          {children ? <div className="col-span-12 mt-16 md:col-span-8 md:col-start-5">{children}</div> : null}
          <div className="col-span-12 mt-20 flex flex-wrap items-center gap-6 border-t border-paper/15 pt-6">
            <Link to="/" className="action-link min-h-11 text-paper hover:text-signal"><ArrowLeft aria-hidden="true" /> Home</Link>
            <Link to="/start-a-project" className="action-link min-h-11 text-signal hover:text-paper">Start a Project <ArrowRight aria-hidden="true" /></Link>
          </div>
        </section>
       </main>
       <RokitSiteFooter />
    </div>
  );
}