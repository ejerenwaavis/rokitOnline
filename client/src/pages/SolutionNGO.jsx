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
    title: 'Limited budgets, unlimited expectations',
    body: 'Donors and stakeholders expect professional materials. In-house design rarely meets that bar, and traditional agencies price you out of the conversation.',
  },
  {
    num: '02',
    title: 'Campaign windows that don\'t forgive delays',
    body: 'A campaign banner that arrives the day after the event is worthless. Time-sensitive communications demand a partner who treats deadlines as non-negotiable.',
  },
  {
    num: '03',
    title: 'Inconsistent identity across materials',
    body: 'When every flyer looks different, trust erodes. Stakeholders, beneficiaries, and donors notice an organisation that hasn\'t taken its brand seriously.',
  },
  {
    num: '04',
    title: 'Grant proposals that should do more work',
    body: 'Written content alone doesn\'t win grants. Beautifully structured proposals and pitch decks communicate professionalism before a single word is read.',
  },
];

const solutions = [
  {
    title: 'Budget-intelligent pricing',
    body: 'We\'ve built tiered packages specifically around NGO operational realities — lean, high-impact, never compromised.',
    num: '01',
  },
  {
    title: '48-hour production pipeline',
    body: 'Our dedicated print floor and in-house design team mean your campaign-critical materials are never waiting in a queue.',
    num: '02',
  },
  {
    title: 'One brand, every medium',
    body: 'From roll-up banners to your organisation\'s website, every touchpoint follows a unified visual language that builds trust at scale.',
    num: '03',
  },
  {
    title: 'Proposal & report design that persuades',
    body: 'We transform your impact data and narrative into visual documents that move funding committees to act.',
    num: '04',
  },
];

const services = [
  { title: 'Campaign Banners & Prints', body: 'Large format prints for awareness drives, community events, and fundraising campaigns — sized for streets and stages.' },
  { title: 'Brand Identity', body: 'Logos, colour systems, and brand guidelines rooted in your mission — built to outlast any single campaign.' },
  { title: 'Grant & Proposal Design', body: 'Professionally structured documents and pitch decks that present impact data with the authority it deserves.' },
  { title: 'Exhibition & Event Materials', body: 'Roll-up banners, pull-up stands, and outdoor materials for conferences, outreach, and donor events.' },
  { title: 'Annual Reports & Collateral', body: 'Impact reports, brochures, and factsheets designed to tell your year\'s story with clarity and conviction.' },
  { title: 'Web Presence', body: 'Clean, fast websites built to communicate your mission, receive donations, and grow your supporter base.' },
];

const stats = [
  { end: 40, suffix: '+', label: 'NGO & Non-Profit Clients' },
  { end: 200, suffix: '+', label: 'Campaign Prints Delivered' },
  { end: 48, suffix: 'hr', label: 'Average Turnaround' },
  { end: 100, suffix: '%', label: 'On-Time Delivery Rate' },
];

const process = [
  { step: '01', title: 'Discovery', body: 'A focused conversation about your mission, upcoming needs, timeline, and budget — no jargon, just clarity.' },
  { step: '02', title: 'Design & Production', body: 'Our creative team produces campaign-ready materials built around your identity. You review, we refine, we execute.' },
  { step: '03', title: 'Delivery & Support', body: 'Materials arrive on time, every time. We remain available for reprints, updates, and next-campaign planning.' },
];

const industries = [
  'Environmental Conservation', 'Education & Literacy', 'Healthcare & Wellbeing',
  'Human Rights', 'Community Development', 'Youth Empowerment',
  'Religious Institutions', 'Women\'s Empowerment', 'Food Security',
  'Disability Advocacy', 'Arts & Culture', 'Refugee Support',
];

export default function SolutionNGO() {
  return (
    <>
      <Helmet>
        <title>Creative Solutions for NGOs – Rokit Media</title>
        <meta name="description" content="Rokit Media delivers professional print, branding, and design solutions for NGOs and non-profit organisations across Nigeria. Campaign banners, brand identity, annual reports, and more." />
      </Helmet>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative bg-rokit-cream min-h-screen flex flex-col justify-end overflow-hidden">
        {/* Background grid texture */}
        <div aria-hidden className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{ backgroundImage: 'linear-gradient(#1A1A1A 1px,transparent 1px),linear-gradient(90deg,#1A1A1A 1px,transparent 1px)', backgroundSize: '80px 80px' }} />
        {/* Orange accent corner */}
        <div aria-hidden className="absolute top-0 right-0 w-1 h-[40%] bg-rokit-orange opacity-40" />
        <div aria-hidden className="absolute top-0 right-0 w-[40%] h-px bg-rokit-orange opacity-20" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full pt-36 pb-24">
          <motion.span
            className="font-mono text-[10px] uppercase tracking-[0.25em] text-rokit-orange block mb-6"
            initial="hidden" animate="visible" variants={fadeUp} custom={0}
          >
            Solutions · Non-Governmental Organisations
          </motion.span>

          <motion.h1
            className="font-display font-light text-rokit-dark leading-none mb-8"
            style={{ fontSize: 'clamp(3rem, 8vw, 7.5rem)' }}
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
          >
            Your Mission<br />
            <span className="text-rokit-orange italic">Deserves to</span><br />
            Be Seen.
          </motion.h1>

          <motion.p
            className="text-rokit-body text-lg font-light max-w-xl leading-relaxed mb-12"
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
          >
            NGOs carry the world's most important messages — yet too often those messages are
            under-resourced, under-designed, and overlooked. Rokit Media changes that. Professional
            print, branding, and design built specifically around your budget, your timeline, and your cause.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4"
            initial="hidden" animate="visible" variants={fadeUp} custom={3}
          >
            <Link to="/portal/quotes/new" className="btn-primary">Start a Conversation</Link>
            <Link to="/gallery" className="btn-outline">View Our Work</Link>
          </motion.div>
        </div>

        {/* Bottom edge — capability strip */}
        <motion.div
          className="border-t border-rokit-dark/10 py-6"
          initial="hidden" animate="visible" variants={fadeIn} custom={5}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-wrap gap-8 md:gap-12 items-center">
            {['Campaign Print', 'Brand Identity', 'Proposal Design', 'Exhibition Materials', 'Web Presence'].map((tag) => (
              <span key={tag} className="font-mono text-[9px] uppercase tracking-[0.2em] text-rokit-dark/40">{tag}</span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── MANIFESTO BAND ───────────────────────────────────── */}
      <section className="bg-rokit-cream border-y border-rokit-orange/10 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <motion.p
            className="font-display font-light italic text-rokit-dark leading-tight"
            style={{ fontSize: 'clamp(1.6rem, 4vw, 3rem)' }}
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={fadeUp} custom={0}
          >
            "Every banner you put up is a statement about your organisation.<br />
            <span className="text-rokit-orange not-italic">&nbsp;Make it one worth reading."</span>
          </motion.p>
        </div>
      </section>

      {/* ── THE CHALLENGE ────────────────────────────────────── */}
      <section className={T.sectionAlt}>
        <div className={T.sectionInner}>
          <motion.div className="mb-14"
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} custom={0}
          >
            <span className={`${T.eyebrow} mb-3`}>We Understand Your World</span>
            <h2 className={T.h2}>Four things every NGO<br />knows too well</h2>
            <div className="w-8 h-px bg-rokit-orange mt-6" />
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-px bg-rokit-orange/10">
            {challenges.map((c, i) => (
              <motion.div key={c.num}
                className="bg-rokit-cream-dark p-8 lg:p-10"
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

      {/* ── HOW ROKIT CHANGES THAT ───────────────────────────── */}
      <section className="bg-rokit-dark py-24">
        <div className={T.sectionInner}>
          <motion.div className="mb-14"
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-rokit-orange block mb-3">The Rokit Response</span>
            <h2 className="font-display text-4xl md:text-5xl font-light text-white leading-tight">Built to answer<br />every challenge.</h2>
            <div className="w-8 h-px bg-rokit-orange mt-6" />
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-px bg-white/5">
            {solutions.map((s, i) => (
              <motion.div key={s.num}
                className="bg-rokit-dark p-8 lg:p-10 border border-white/[0.04] group hover:border-rokit-orange/30 transition-colors duration-300"
                initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} custom={i * 0.5}
              >
                <span className="font-mono text-[10px] tracking-[0.2em] text-rokit-orange/60 group-hover:text-rokit-orange transition-colors block mb-5">{s.num}</span>
                <h3 className="font-display text-2xl font-light text-white mb-3 leading-snug">{s.title}</h3>
                <p className="text-white/50 font-light text-sm leading-relaxed">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────── */}
      <section className={T.sectionCream}>
        <div className={T.sectionInner}>
          <motion.div className={`${T.sectionHeaderCenter} mb-14`}
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}
          >
            <span className={`${T.eyebrow} mb-3`}>What We Build For You</span>
            <h2 className={T.h2}>Capabilities built for<br />NGO needs</h2>
            <div className={`${T.divider} mt-6`} />
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-rokit-orange/10">
            {services.map((s, i) => (
              <motion.div key={s.title}
                className="bg-rokit-cream p-8 group hover:bg-white transition-colors duration-300"
                initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeUp} custom={i * 0.3}
              >
                <div className="w-6 h-px bg-rokit-orange mb-6 group-hover:w-10 transition-all duration-300" />
                <h3 className={`${T.h4} mb-3`}>{s.title}</h3>
                <p className={`${T.body} text-sm leading-relaxed`}>{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────── */}
      <section className="bg-rokit-dark py-20 md:py-28">
        <div className={T.sectionInner}>
          <motion.p
            className="font-mono text-[10px] uppercase tracking-[0.25em] text-rokit-orange text-center mb-16"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
          >
            The Numbers
          </motion.p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-white/10">
            {stats.map((s, i) => (
              <motion.div key={s.label} className="text-center px-4"
                initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }} variants={fadeUp} custom={i * 0.3}
              >
                <p className="font-display font-light text-white mb-3" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)' }}>
                  <CountUp end={s.end} suffix={s.suffix} enableScrollSpy scrollSpyOnce duration={2} />
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35 leading-relaxed">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ──────────────────────────────────────────── */}
      <section className={T.sectionCream}>
        <div className={T.sectionInner}>
          <motion.div className="mb-16"
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}
          >
            <span className={`${T.eyebrow} mb-3`}>How We Work</span>
            <h2 className={T.h2}>Simple. Fast. Exactly<br />what you need.</h2>
            <div className="w-8 h-px bg-rokit-orange mt-6" />
          </motion.div>
          <div className="grid md:grid-cols-3 gap-px bg-rokit-orange/10">
            {process.map((p, i) => (
              <motion.div key={p.step}
                className="relative bg-rokit-cream p-8 lg:p-10 overflow-hidden group"
                initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} custom={i * 0.4}
              >
                <span
                  aria-hidden
                  className="absolute -bottom-4 -right-3 font-display font-light text-[8rem] leading-none text-rokit-orange/[0.05] select-none pointer-events-none transition-all duration-500 group-hover:text-rokit-orange/[0.08]"
                >
                  {p.step}
                </span>
                <span className="font-mono text-[10px] tracking-[0.2em] text-rokit-orange block mb-6">{p.step}</span>
                <h3 className={`${T.h3} mb-4`}>{p.title}</h3>
                <p className={`${T.body} text-sm leading-relaxed relative z-10`}>{p.body}</p>
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
            <span className={`${T.eyebrow} mb-3`}>Sectors We've Supported</span>
            <h2 className={T.h2}>If the cause is good,<br />we're already interested.</h2>
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
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-rokit-orange block mb-8">Ready When You Are</span>
            <h2
              className="font-display font-light text-white leading-tight mb-8"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
            >
              Your cause is worth<br />
              <span className="text-rokit-orange italic">fighting for beautifully.</span>
            </h2>
            <p className="text-white/50 font-light text-lg max-w-xl mx-auto mb-12 leading-relaxed">
              Tell us about your organisation and what you're working towards. We'll respond
              within 24 hours with a plan that fits your budget and timeline.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/portal/quotes/new" className="btn-primary">Request a Free Quote</Link>
              <Link to="/contact" className="btn-white">Talk to Us First</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
