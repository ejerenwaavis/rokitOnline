import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

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
      <div
        className="relative h-72 md:h-96 bg-cover bg-center flex items-end"
        style={{ backgroundImage: "url('/assets/images/about-cover.jpg')" }}
      >
        <div className="absolute inset-0 bg-rokit-dark/70" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 pb-12 w-full">
          <p className="text-rokit-orange font-semibold uppercase tracking-widest text-sm mb-1">Who We Are</p>
          <h1 className="text-5xl font-black text-white">About Rokit Media</h1>
        </div>
      </div>

      {/* Mission / Vision */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-rokit-orange font-semibold uppercase tracking-widest text-sm mb-2">Our Story</p>
            <h2 className="text-4xl font-black text-rokit-dark mb-6">Creating Visual Impact Since 2014</h2>
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
            <div className="bg-rokit-tan p-6">
              <h4 className="text-rokit-orange font-black text-xl mb-2">Our Mission</h4>
              <p className="text-rokit-body text-sm leading-relaxed">
                To deliver high-quality, impactful creative and printing services that drive growth for every client.
              </p>
            </div>
            <div className="bg-rokit-orange p-6">
              <h4 className="text-white font-black text-xl mb-2">Our Vision</h4>
              <p className="text-white/90 text-sm leading-relaxed">
                To be the most trusted creative agency across West Africa by 2030.
              </p>
            </div>
            <div className="bg-rokit-dark p-6 col-span-2">
              <h4 className="text-rokit-gold font-black text-xl mb-2">Our Values</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {['Creativity', 'Excellence', 'Integrity', 'Speed', 'Customer Focus'].map(v => (
                  <span key={v} className="bg-white/10 text-white text-xs px-3 py-1 rounded-full">{v}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CEO */}
      <section className="bg-rokit-tan py-20">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img
              src="/assets/images/ceo.jpg"
              alt="Okorite Isokariari – CEO, Rokit Media"
              className="w-full max-w-sm mx-auto object-cover shadow-2xl"
            />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-rokit-orange text-white px-6 py-3 text-center w-72">
              <p className="font-black text-lg">Okorite Isokariari</p>
              <p className="text-sm text-white/80">Founder & CEO</p>
            </div>
          </div>
          <div className="pt-12 md:pt-0">
            <p className="text-rokit-orange font-semibold uppercase tracking-widest text-sm mb-2">Leadership</p>
            <h2 className="text-4xl font-black text-rokit-dark mb-6">A Word From Our CEO</h2>
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
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="section-title">Our Journey</h2>
            <div className="section-divider" />
          </div>
          <div className="relative border-l-2 border-rokit-orange/30 pl-8 space-y-10">
            {timeline.map(({ year, event }) => (
              <div key={year} className="relative">
                <div className="absolute -left-[2.65rem] top-1 w-5 h-5 bg-rokit-orange rounded-full border-4 border-white" />
                <p className="text-rokit-orange font-black text-lg mb-1">{year}</p>
                <p className="text-rokit-body">{event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
