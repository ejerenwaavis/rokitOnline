import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { T } from '../theme';

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] } }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({ opacity: 1, transition: { duration: 0.6, delay: i * 0.08 } }),
};

const challenges = [
  {
    num: '01',
    title: 'Looking smaller than you are',
    body: 'Customers make split-second judgements. An inconsistent or amateurish brand communicates that your business is not yet serious — even when your product is exceptional.',
  },
  {
    num: '02',
    title: 'Competing with brands who out-spend you',
    body: 'Larger competitors invest in visual presence as standard. When your materials look dated, the gap between you and the market leader widens — in perception if not in quality.',
  },
  {
    num: '03',
    title: 'Inconsistency across touchpoints',
    body: 'Your logo on a business card, your banner at an event, your website — when these don\'t feel like one brand, every interaction is a missed opportunity to build trust.',
  },
  {
    num: '04',
    title: 'No time for creative in-house',
    body: 'You\'re running a business. Sourcing design, briefing printers, managing revisions — that\'s hours every week that belong to growing your company, not managing a vendor.',
  },
];

const outcomes = [
  {
    service: 'Brand Identity',
    outcome: 'Win customers before the first conversation',
    body: 'A logo, colour system, and typography guide that positions you as credible, distinctive, and worth paying attention to — before a single word is exchanged.',
  },
  {
    service: 'Large Format Prints',
    outcome: 'Own the room before you enter it',
    body: 'Billboards, building wraps, and outdoor prints that make your physical presence impossible to ignore — seen by more people in a day than a social post reaches in a week.',
  },
  {
    service: 'Roll-Up Banners',
    outcome: 'Look like the market leader at every event',
    body: 'Portable, professional, and production-ready — your brand stands tall at trade shows, pop-ups, pitches, and retail promotions.',
  },
  {
    service: 'Web Design',
    outcome: 'Turn visitors into customers, consistently',
    body: 'A fast, conversion-focused website that works like your best salesperson — available 24/7, presenting your product or service exactly as it deserves to be seen.',
  },
  {
    service: 'Marketing Collateral',
    outcome: 'Leave something worth keeping',
    body: 'Business cards, flyers, brochures, and menus designed to be kept, shared, and acted on — physical marketing that extends every in-person interaction.',
  },
  {
    service: 'Idea Creation',
    outcome: 'Strategic clarity when direction is unclear',
    body: 'Brand strategy, concept development, and messaging frameworks that give your creative direction a backbone — and your team something to build towards.',
  },
];

const growth = [
  {
    phase: 'Phase I',
    title: 'Foundation',
    items: ['Logo & brand identity', 'Colour system', 'Business cards & stationery'],
    caption: 'The signal you send before you speak.',
  },
  {
    phase: 'Phase II',
    title: 'Presence',
    items: ['Outdoor & large format', 'Roll-up banners', 'Event & exhibition materials'],
    caption: 'Claim your space in the market.',
  },
  {
    phase: 'Phase III',
    title: 'Digital',
    items: ['Website design', 'Social media graphics', 'Digital campaign assets'],
    caption: 'Extend your reach beyond the physical.',
  },
  {
    phase: 'Phase IV',
    title: 'Retention',
    items: ['Brochures & catalogues', 'Packaging design', 'Ongoing brand management'],
    caption: 'Turn customers into advocates.',
  },
];

const stats = [
  { end: 300, suffix: '+', label: 'SME Clients Served' },
  { end: 5000, suffix: '+', label: 'Print Jobs Delivered' },
  { end: 8, suffix: '+', label: 'Years of Excellence' },
  { end: 24, suffix: 'hr', label: 'Quote Turnaround' },
];

const industries = [
  'Food & Beverage', 'Fashion & Retail', 'Professional Services',
  'Real Estate', 'Healthcare & Wellness', 'Tech Startups',
  'Events & Hospitality', 'Finance & Insurance', 'Logistics & Supply',
  'Beauty & Personal Care', 'Education & Training', 'Manufacturing',
];

export default function SolutionSME() {
  return (
    <>
      <Helmet>
        <title>Creative Solutions for SMEs – Rokit Media</title>
        <meta name="description" content="Rokit Media helps small and medium businesses achieve enterprise-quality branding, print, and web design in Nigeria. Stop competing on price — compete on brand." />
      </Helmet>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative bg-rokit-cream min-h-screen flex flex-col justify-end overflow-hidden">
        {/* Decorative vertical line */}
        <div aria-hidden className="absolute left-0 top-0 bottom-0 w-px bg-rokit-orange/20 hidden lg:block" />
        {/* Large background text */}
        <div aria-hidden
          className="absolute right-[-2rem] top-1/2 -translate-y-1/2 font-display font-light leading-none text-rokit-orange/[0.04] select-none pointer-events-none hidden xl:block"
          style={{ fontSize: '32vw' }}
        >
          SME
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full pt-36 pb-24 relative z-10">
          <motion.span
            className="font-mono text-[10px] uppercase tracking-[0.25em] text-rokit-orange block mb-6"
            initial="hidden" animate="visible" variants={fadeUp} custom={0}
          >
            Solutions · Small &amp; Medium Enterprises
          </motion.span>

          <motion.h1
            className="font-display font-light text-rokit-dark leading-none mb-8"
            style={{ fontSize: 'clamp(3rem, 8vw, 7.5rem)' }}
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
          >
            You Built<br />
            Something Real.<br />
            <span className="text-rokit-orange italic">Now Own the Room.</span>
          </motion.h1>

          <motion.p
            className="text-rokit-body text-lg font-light max-w-xl leading-relaxed mb-12"
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
          >
            The gap between where your business is and where it could be is rarely about
            product quality. It's almost always about how you're perceived. Rokit Media gives
            growing businesses the visual power of an enterprise agency — without the enterprise price tag.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4"
            initial="hidden" animate="visible" variants={fadeUp} custom={3}
          >
            <Link to="/portal/quotes/new" className="btn-primary">Build My Brand</Link>
            <Link to="/gallery" className="btn-outline">See Our Work</Link>
          </motion.div>
        </div>

        {/* Capability strip */}
        <motion.div
          className="border-t border-rokit-orange/10 py-6 relative z-10"
          initial="hidden" animate="visible" variants={fadeIn} custom={5}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-wrap gap-8 md:gap-12 items-center">
            {['Branding', 'Large Format', 'Web Design', 'Collateral', 'Idea Creation', 'Strategy'].map((tag) => (
              <span key={tag} className="font-mono text-[9px] uppercase tracking-[0.2em] text-rokit-body/40">{tag}</span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── MANIFESTO BAND ───────────────────────────────────── */}
      <section className="bg-rokit-dark py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <motion.p
            className="font-display font-light italic text-white leading-tight"
            style={{ fontSize: 'clamp(1.6rem, 4vw, 3rem)' }}
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={fadeUp} custom={0}
          >
            "Your competitors are investing in how they look.<br />
            <span className="text-rokit-orange not-italic">&nbsp;Are you?"</span>
          </motion.p>
        </div>
      </section>

      {/* ── THE CHALLENGE ────────────────────────────────────── */}
      <section className={T.sectionCream}>
        <div className={T.sectionInner}>
          <motion.div className="mb-14"
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}
          >
            <span className={`${T.eyebrow} mb-3`}>The SME Reality</span>
            <h2 className={T.h2}>Four things holding great<br />businesses back from great brands</h2>
            <div className="w-8 h-px bg-rokit-orange mt-6" />
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-px bg-rokit-orange/10">
            {challenges.map((c, i) => (
              <motion.div key={c.num}
                className="bg-rokit-cream p-8 lg:p-10 group hover:bg-white transition-colors duration-300"
                initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} custom={i * 0.5}
              >
                <span className="font-mono text-[10px] tracking-[0.2em] text-rokit-orange block mb-5">{c.num}</span>
                <h3 className={`${T.h3} mb-4`}>{c.title}</h3>
                <p className={`${T.body} text-sm leading-relaxed`}>{c.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES AS OUTCOMES ─────────────────────────────── */}
      <section className={T.sectionAlt}>
        <div className={T.sectionInner}>
          <motion.div className="mb-14"
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}
          >
            <span className={`${T.eyebrow} mb-3`}>What We Build For You</span>
            <h2 className={T.h2}>Services built around<br />business outcomes</h2>
            <div className="w-8 h-px bg-rokit-orange mt-6" />
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-rokit-orange/10">
            {outcomes.map((o, i) => (
              <motion.div key={o.service}
                className="bg-rokit-cream-dark p-8 group hover:bg-rokit-cream transition-colors duration-300"
                initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeUp} custom={i * 0.3}
              >
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-rokit-orange block mb-4">{o.service}</span>
                <div className="w-6 h-px bg-rokit-orange mb-5 group-hover:w-10 transition-all duration-300" />
                <h3 className={`${T.h4} mb-3 leading-snug`}>{o.outcome}</h3>
                <p className={`${T.body} text-sm leading-relaxed`}>{o.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GROWTH JOURNEY ───────────────────────────────────── */}
      <section className="bg-rokit-dark py-24 md:py-32">
        <div className={T.sectionInner}>
          <motion.div className="mb-16"
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-rokit-orange block mb-3">The Growth Journey</span>
            <h2 className="font-display text-4xl md:text-5xl font-light text-white leading-tight">We grow with you,<br />phase by phase.</h2>
            <div className="w-8 h-px bg-rokit-orange mt-6" />
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
            {growth.map((g, i) => (
              <motion.div key={g.phase}
                className="bg-rokit-dark p-8 border border-white/[0.04] group hover:border-rokit-orange/40 transition-colors duration-300 relative overflow-hidden"
                initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} custom={i * 0.4}
              >
                <span aria-hidden
                  className="absolute -bottom-4 -right-2 font-display font-light leading-none text-rokit-orange/[0.05] select-none pointer-events-none transition-all duration-500 group-hover:text-rokit-orange/[0.09]"
                  style={{ fontSize: '6rem' }}
                >
                  {i + 1}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-rokit-orange/60 group-hover:text-rokit-orange transition-colors block mb-4">{g.phase}</span>
                <h3 className="font-display text-2xl font-light text-white mb-5">{g.title}</h3>
                <ul className="space-y-2 mb-6">
                  {g.items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-white/50 text-sm font-light">
                      <span className="text-rokit-orange mt-0.5 flex-none">—</span> {item}
                    </li>
                  ))}
                </ul>
                <p className="font-display text-sm italic text-white/30">{g.caption}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────── */}
      <section className={T.sectionCream}>
        <div className={T.sectionInner}>
          <motion.p
            className="font-mono text-[10px] uppercase tracking-[0.25em] text-rokit-orange text-center mb-16"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
          >
            Proven at Scale
          </motion.p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-rokit-orange/10">
            {stats.map((s, i) => (
              <motion.div key={s.label} className="text-center px-4"
                initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }} variants={fadeUp} custom={i * 0.3}
              >
                <p className="font-display font-light text-rokit-dark mb-3" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)' }}>
                  <CountUp end={s.end} suffix={s.suffix} enableScrollSpy scrollSpyOnce duration={2} />
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-rokit-body leading-relaxed">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INDUSTRIES ───────────────────────────────────────── */}
      <section className={T.sectionAlt}>
        <div className={T.sectionInner}>
          <motion.div className="mb-12 text-center"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          >
            <span className={`${T.eyebrow} mb-3`}>Industries We Serve</span>
            <h2 className={T.h2}>Whatever you sell,<br />we make it look irresistible.</h2>
          </motion.div>
          <motion.div
            className="flex flex-wrap gap-3 justify-center"
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeIn}
          >
            {industries.map((ind, i) => (
              <motion.span key={ind}
                className="font-mono text-[10px] uppercase tracking-[0.15em] text-rokit-dark border border-rokit-orange/20 px-4 py-2 hover:border-rokit-orange hover:text-rokit-orange transition-colors duration-200 cursor-default"
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={i * 0.2}
              >
                {ind}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────── */}
      <section className="bg-rokit-dark py-24 md:py-32 relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#FF9729 1px,transparent 1px),linear-gradient(90deg,#FF9729 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
        {/* Orange accent in corner */}
        <div aria-hidden className="absolute bottom-0 left-0 w-[30vw] h-px bg-rokit-orange/20" />
        <div aria-hidden className="absolute bottom-0 left-0 w-px h-[40%] bg-rokit-orange/20" />

        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-rokit-orange block mb-8">Let's Build Something</span>
            <h2
              className="font-display font-light text-white leading-tight mb-8"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
            >
              Your business deserves<br />
              <span className="text-rokit-orange italic">to be seen at its best.</span>
            </h2>
            <p className="text-white/50 font-light text-lg max-w-xl mx-auto mb-12 leading-relaxed">
              Share your brief with us — whether it's a single print job or a full brand build.
              We'll come back with a plan, a price, and a timeline within 24 hours.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/portal/quotes/new" className="btn-primary">Get a Free Quote</Link>
              <Link to="/contact" className="btn-white">Talk to Our Team</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
