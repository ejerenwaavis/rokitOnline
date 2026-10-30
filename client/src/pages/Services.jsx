import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const services = [
  {
    number: "01",
    name: "Brand & Identity",
    hook: "Make it recognisable.",
    copy: "When people cannot recognise, remember or use the brand consistently.",
    to: "/services/brand-identity",
  },
  {
    number: "02",
    name: "Websites & Digital",
    hook: "Give it somewhere to work.",
    copy: "When a website, system or workflow is not doing the job it should.",
    to: "/services/websites-digital",
  },
  {
    number: "03",
    name: "Marketing & Growth",
    hook: "Help it reach people.",
    copy: "When it is unclear who matters, where to reach them or what deserves the budget.",
    to: "/services/marketing-growth",
  },
  {
    number: "04",
    name: "Communication & Content",
    hook: "Make it understood.",
    copy: "When the message, argument or information is not being understood.",
    to: "/services/communication-content",
  },
  {
    number: "05",
    name: "Physical Brand & Production",
    hook: "Bring it into the real world.",
    copy: "When an idea must survive material, production, quality control and delivery.",
    to: "/services/physical-production",
  },
];

export default function Services() {
  return (
    <>
      <Helmet>
        <title>Services — Connected Disciplines at rOKIt</title>
        <meta
          name="description"
          content="Five connected rOKIt service families built around the problem at hand: Brand, digital, marketing, communication, and physical production."
        />
        <meta property="og:title" content="Services — Connected Disciplines at rOKIt" />
        <meta
          property="og:description"
          content="Brand, digital, marketing, communication and physical production built to work together."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="font-v4-body text-paper">
        {/* Hero Section */}
        <section className="mx-auto grid min-h-[72svh] max-w-site grid-cols-12 content-center gap-6 px-gutter py-section">
          <div className="col-span-12 min-w-0 md:col-span-10">
            <p className="v4-section-label">Services</p>
            <h1 className="mt-7 max-w-[15ch] font-v4-display text-5xl leading-none md:text-[clamp(3.4rem,8vw,7rem)]">
              WHAT ARE YOU TRYING TO MAKE HAPPEN?
            </h1>
            <p className="mt-8 max-w-[64ch] text-lg leading-relaxed text-paper/70">
              Brand, digital, marketing, communication and production are different disciplines. The problem decides which ones matter.
            </p>
          </div>
        </section>

        {/* The Job Decides What We Bring */}
        <section className="bg-paper text-night">
          <div className="mx-auto max-w-site px-gutter py-section">
            <p className="v4-section-label !text-night/55">The Job Decides What We Bring.</p>
            <p className="mt-4 text-sm text-night/70 font-v4-display text-lg">Problems Don’t Arrive in Departments.</p>
            <div className="mt-8">
              {services.map((service) => (
                <Link
                  key={service.name}
                  to={service.to}
                  className="group grid min-h-28 items-start gap-4 border-t border-night/20 py-8 md:grid-cols-[4rem_minmax(0,1fr)_minmax(16rem,0.65fr)_auto]"
                >
                  <span className="text-xs font-mono text-signal">{service.number}</span>
                  <div>
                    <h2 className="font-v4-display text-2xl group-hover:text-signal md:text-3xl transition-colors">
                      {service.name}
                    </h2>
                    <p className="mt-3 text-sm text-night/75">{service.hook}</p>
                  </div>
                  <p className="text-sm leading-relaxed text-night/65">{service.copy}</p>
                  <ArrowRight className="size-5 text-signal transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Start With What You Have */}
        <section className="border-t-2 border-signal">
          <div className="mx-auto max-w-site px-gutter py-20 md:py-28">
            <h2 className="max-w-[16ch] font-v4-display text-4xl md:text-6xl">
              START WITH WHAT YOU HAVE.
            </h2>
            <Link
              to="/portal/quotes/new"
              className="v4-action-link mt-8 min-h-12 bg-signal px-7 font-semibold text-night hover:bg-paper uppercase text-xs tracking-wider"
            >
              Start a Project <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
