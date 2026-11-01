import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { RokitSiteFooter } from "@/components/rokit-site-footer";
import { RokitSiteHeader } from "@/components/rokit-site-header";

const services = [
  ["01", "Brand & Identity", "When people cannot recognise, remember or use the brand consistently.", "/services/brand-identity"],
  ["02", "Websites & Digital Solutions", "When a website, system or workflow is not doing the job it should.", "/services/websites-digital"],
  ["03", "Marketing & Growth", "When it is unclear who matters, where to reach them or what deserves the budget.", "/services/marketing-growth"],
  ["04", "Communication & Content", "When the message, argument or information is not being understood.", "/services/communication-content"],
  ["05", "Physical Brand & Production", "When an idea must survive material, production, quality control and delivery.", "/services/physical-production"],
] as const;

export const Route = createFileRoute("/what-we-do")({
  head: () => ({ meta: [{ title: "Services — Connected disciplines at rOKIt" }, { name: "description", content: "Five connected rOKIt service families built around the problem at hand." }, { property: "og:title", content: "Services — Connected disciplines at rOKIt" }, { property: "og:description", content: "Brand, digital, marketing, communication and physical production built to work together." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: ServicesPage,
});

function ServicesPage() {
  return <div className="min-h-screen bg-night font-body text-paper"><RokitSiteHeader /><main>
    <section className="mx-auto grid min-h-[72svh] max-w-site grid-cols-12 content-center gap-6 px-gutter py-section"><div className="col-span-12 min-w-0 md:col-span-10"><p className="section-label">Services</p><h1 className="mt-7 max-w-[15ch] font-display text-5xl leading-none md:text-[clamp(3.4rem,8vw,7rem)]">Problems Don’t Arrive in Departments.</h1><p className="mt-8 max-w-[64ch] text-lg leading-relaxed text-paper/70">Brand, digital, marketing, communication and production are different disciplines. The problem decides which ones matter.</p></div></section>
    <section className="bg-paper text-night"><div className="mx-auto max-w-site px-gutter py-section"><p className="section-label !text-night/55">The Job Decides What We Bring.</p><div className="mt-8">{services.map(([number, name, copy, to]) => <Link key={name} to={to} className="group grid min-h-28 items-start gap-4 border-t border-night/20 py-8 md:grid-cols-[4rem_minmax(0,1fr)_minmax(16rem,0.65fr)_auto]"><span className="text-xs text-signal">{number}</span><h2 className="font-display text-2xl group-hover:text-signal md:text-3xl">{name}</h2><p className="text-sm leading-relaxed text-night/65">{copy}</p><ArrowRight className="size-5" aria-hidden="true" /></Link>)}</div></div></section>
    <section className="border-t-2 border-signal"><div className="mx-auto max-w-site px-gutter py-20 md:py-28"><h2 className="max-w-[16ch] font-display text-4xl md:text-6xl">Start With the Problem. Not the Deliverable.</h2><Link to="/start-a-project" className="action-link mt-8 min-h-12 bg-signal px-7 font-semibold text-night hover:bg-paper">Start a Project <ArrowRight aria-hidden="true" /></Link></div></section>
  </main><RokitSiteFooter /></div>;
}