import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RokitSiteHeader } from "@/components/rokit-site-header";
import { RokitSiteFooter } from "@/components/rokit-site-footer";

export function RokitNotFound() {
  const [connected, setConnected] = useState(false);
  return <div className="min-h-dvh bg-night font-body text-paper"><RokitSiteHeader /><main className="mx-auto max-w-site px-gutter py-section">
    <p className="section-label">404 · A missing connection</p>
    <h1 className="mt-8 max-w-[16ch] font-display text-4xl leading-tight md:text-6xl">This idea lost its way.</h1>
    <p className="mt-6 max-w-[48ch] text-neutral">That page isn’t here. The next connection can still be.</p>
    <div className="my-10 max-w-lg border-y border-paper/20 py-6">
      <svg viewBox="0 0 420 100" className="w-full text-signal" aria-hidden="true"><path d={connected ? "M25 70L130 30L250 65L395 25" : "M25 70L130 30 M250 65L395 25"} stroke="currentColor" fill="none" strokeWidth="2" />{[[25,70],[130,30],[250,65],[395,25]].map(([x,y]) => <circle key={x} cx={x} cy={y} r="5" fill="currentColor" />)}</svg>
      <Button variant="ghost" onClick={() => setConnected(true)} disabled={connected} className="min-h-11 rounded-none px-0 text-paper hover:bg-transparent hover:text-signal"><Link2 aria-hidden="true" />{connected ? "Connected." : "Reconnect the idea"}</Button>
      <p role="status" className="sr-only">{connected ? "Connection restored. Choose a destination." : ""}</p>
    </div>
    <nav aria-label="Find your next page" className="flex flex-wrap gap-x-8 gap-y-3">{[{ to: "/" as const, label: "Home" }, { to: "/work" as const, label: "Made by rOKIt" }, { to: "/start-a-project" as const, label: "Start a Project" }].map(item => <Link key={item.to} to={item.to} className="action-link min-h-11 text-signal hover:text-paper">{item.label}<ArrowRight aria-hidden="true" /></Link>)}</nav>
  </main><RokitSiteFooter /></div>;
}