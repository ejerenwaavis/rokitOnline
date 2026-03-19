import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { T } from '../theme';

const timeline = [
  { year: '2014', event: 'Rokit Media founded in Osogbo, Osun State.' },
  { year: '2016', event: 'Expanded services to include large format printing and branding.' },
  { year: '2019', event: 'Opened additional offices across South-West Nigeria.' },
  { year: '2022', event: 'Launched digital services including web design and social media management.' },
  { year: '2026', event: 'Serving 350+ clients nationwide with 6 operational offices.' },
];

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us – Rokit Media</title>
        <meta name="description" content="Learn about Rokit Media – Nigeria's trusted creative agency for printing, branding, and design, founded in Osogbo." />
      </Helmet>

      {/* Hero */}
      <div className={T.pageHero}>
        <div className={`${T.pageHeroInner} ${T.pageHeroCentered}`}>
          <span className={`${T.eyebrowOrange} mb-3`}>Who We Are</span>
          <h1 className={`${T.h1} mb-4`}>About Rokit Media</h1>
          <p className={`${T.body} max-w-xl mx-auto`}>Nigeria&apos;s trusted creative agency for printing, branding, and design since 2014.</p>
        </div>
      </div>

      {/* Mission / Vision */}
      <section className={T.sectionCream}>
        <div className={`${T.sectionInner} grid md:grid-cols-2 gap-12 items-center`}>
          <div>
            <span className={`${T.eyebrowOrange} mb-3`}>Our Story</span>
            <h2 className={`${T.h2} mb-6`}>Creating Visual Impact Since 2014</h2>
            <p className="text-rokit-body leading-relaxed mb-4">
              Rokit Media is a full-service creative and printing agency headquartered in Osogbo, Osun State, Nigeria.
              We specialise in large format printing, graphic design, branding, web design, roll-up banners, and
              creative idea development.
            </p>
            <p className="text-rokit-body leading-relaxed mb-4">
              Our mission is simple: to deliver world-class creative solutions that help businesses in Nigeria and
              beyond stand out, communicate powerfully, and grow consistently.
            </p>
            <p className="text-rokit-body leading-relaxed mb-8">
              With 10+ years of experience, a passionate team, and state-of-the-art equipment, we have earned the
              trust of hundreds of organisations — from small businesses to government agencies.
            </p>
            <Link to="/contact" className="btn-primary">Get in Touch</Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-rokit-cream-dark border border-rokit-orange/10 p-6">
              <h4 className="text-rokit-orange font-display text-xl font-light mb-2">Our Mission</h4>
              <p className="text-rokit-body text-sm leading-relaxed">
                To deliver high-quality, impactful creative and printing services that drive growth for every client.
              </p>
            </div>
            <div className="bg-rokit-orange p-6">
              <h4 className="text-white font-display text-xl font-light mb-2">Our Vision</h4>
              <p className="text-white/90 text-sm leading-relaxed">
                To be the most trusted creative agency across West Africa by 2030.
              </p>
            </div>
            <div className="bg-rokit-dark p-6 col-span-2">
              <h4 className="text-rokit-gold font-display text-xl font-light mb-2">Our Values</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {['Creativity', 'Excellence', 'Integrity', 'Speed', 'Customer Focus'].map(v => (
                  <span key={v} className="font-mono text-[10px] uppercase tracking-[0.15em] text-white border border-white/30 px-3 py-1.5 hover:border-rokit-orange hover:text-rokit-orange transition-colors duration-200 cursor-default">{v}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CEO */}
      <section className={T.sectionAlt}>
        <div className={`${T.sectionInner} grid md:grid-cols-2 gap-12 items-center`}>
          <div className="relative">
            <img
              src="/assets/images/images/okorite.jpg"
              alt="Okorite Isokariari – CEO, Rokit Media"
              className="w-full max-w-sm mx-auto object-cover shadow-2xl"
            />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-rokit-orange text-white px-6 py-3 text-center w-72">
              <p className="font-display font-light text-lg">Okorite Isokariari</p>
              <p className="text-sm text-white/80">Founder &amp; CEO</p>
            </div>
          </div>
          <div className="pt-12 md:pt-0">
            <span className={`${T.eyebrowOrange} mb-3`}>Leadership</span>
            <h2 className={`${T.h2} mb-6`}>A Word From Our CEO</h2>
            <blockquote className="border-l-4 border-rokit-orange pl-5 text-rokit-body italic leading-relaxed mb-6">
              "We started Rokit Media with one goal in mind — to give every business in Nigeria access to
              world-class creative and printing excellence. Today, that dream is alive in every banner we print,
              every brand we build, and every website we launch."
            </blockquote>
            <p className="text-rokit-body leading-relaxed">
              Under Okorite's leadership, Rokit Media has grown from a single studio in Osogbo to a nationally
              recognised brand with operations across Nigeria.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className={T.sectionCream}>
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className={T.sectionHeaderCenter}>
            <h2 className="section-title">Our Journey</h2>
            <div className="section-divider" />
          </div>
          <div className="relative border-l-2 border-rokit-orange/30 pl-8 space-y-10">
            {timeline.map(({ year, event }) => (
              <div key={year} className="relative">
                <div className="absolute -left-[2.65rem] top-1 w-4 h-4 bg-rokit-orange border-4 border-rokit-cream" />
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-rokit-orange mb-1">{year}</p>
                <p className="text-rokit-body font-light">{event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
