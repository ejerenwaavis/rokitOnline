import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import api from '../utils/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const fallback = [
  { _id: '1', slug: 'large-format', name: 'Large Format Prints', shortDescription: 'Eye-catching banners, posters, and billboards at scale.', features: ['High-resolution output', 'Weather-resistant materials', 'Nationwide delivery'], startingPrice: 15000, turnaround: '3–5 business days' },
  { _id: '2', slug: 'graphic-design', name: 'Graphic Design', shortDescription: 'Creative visuals for print, digital, and social media.', features: ['Unlimited revisions', 'Print-ready files', 'Brand consistency'], startingPrice: 10000, turnaround: '2–4 business days' },
  { _id: '3', slug: 'branding', name: 'Branding', shortDescription: 'Complete brand identity systems from logo to brand guide.', features: ['Logo design', 'Color & typography system', 'Brand guidelines document'], startingPrice: 50000, turnaround: '5–10 business days' },
  { _id: '4', slug: 'web-design', name: 'Web Design', shortDescription: 'Modern, responsive websites and landing pages.', features: ['Mobile-first design', 'SEO optimization', 'CMS integration'], startingPrice: 80000, turnaround: '10–20 business days' },
  { _id: '5', slug: 'idea-creation', name: 'Idea Creation', shortDescription: 'Creative concepts and campaign strategies.', features: ['Concept development', 'Mood boards', 'Presentation deck'], startingPrice: 25000, turnaround: '3–7 business days' },
  { _id: '6', slug: 'roll-up-banners', name: 'Roll-Up Banners', shortDescription: 'Premium roll-up banners for events and promotions.', features: ['Aluminium stand included', 'Carry bag included', 'Reusable hardware'], startingPrice: 18000, turnaround: '2–3 business days' },
];

export default function Services() {
  const [services, setServices] = useState(null);

  useEffect(() => {
    api.get('/services').then(res => setServices(Array.isArray(res.data) && res.data.length ? res.data : fallback)).catch(() => setServices(fallback));
  }, []);

  return (
    <>
      <Helmet>
        <title>Our Services – Rokit Media</title>
        <meta name="description" content="Explore Rokit Media's creative services: large format printing, graphic design, branding, web design, and more." />
      </Helmet>

      {/* Page Hero */}
      <div className="bg-rokit-dark pt-32 pb-16 text-center">
        <p className="text-rokit-orange font-semibold uppercase tracking-widest text-sm mb-2">What We Offer</p>
        <h1 className="text-5xl font-black text-white mb-4">Our Services</h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          From concept to delivery — we have everything your brand needs to look and communicate its best.
        </p>
      </div>

      {/* Services List */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          {!services ? (
            <LoadingSpinner center />
          ) : (
            <div className="space-y-16">
              {services.map((service, idx) => (
                <div
                  key={service._id}
                  className={`grid md:grid-cols-2 gap-10 items-center ${idx % 2 === 1 ? 'md:grid-flow-dense' : ''}`}
                >
                  {/* Text */}
                  <div className={idx % 2 === 1 ? 'md:col-start-2' : ''}>
                    <p className="text-rokit-orange text-sm font-bold uppercase tracking-widest mb-2">
                      0{idx + 1}
                    </p>
                    <h2 className="text-3xl font-black text-rokit-dark mb-4">{service.name}</h2>
                    <p className="text-rokit-body leading-relaxed mb-6">{service.shortDescription}</p>
                    {service.features?.length > 0 && (
                      <ul className="space-y-2 mb-6">
                        {service.features.map(f => (
                          <li key={f} className="flex items-center gap-2 text-sm text-rokit-body">
                            <CheckCircle size={16} className="text-rokit-green shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="flex flex-wrap gap-4 items-center">
                      <Link to={`/services/${service.slug}`} className="btn-primary inline-flex items-center gap-2">
                        Learn More <ArrowRight size={16} />
                      </Link>
                      {service.startingPrice && (
                        <span className="text-rokit-body text-sm">
                          From <span className="text-rokit-orange font-bold">₦{Number(service.startingPrice).toLocaleString()}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Visual tile */}
                  <div className={`bg-rokit-tan aspect-video flex items-center justify-center ${idx % 2 === 1 ? 'md:col-start-1' : ''}`}>
                    <div className="text-center px-8">
                      <div className="text-7xl font-black text-rokit-orange/20 mb-2">0{idx + 1}</div>
                      <p className="text-2xl font-black text-rokit-dark">{service.name}</p>
                      {service.turnaround && (
                        <p className="text-sm text-rokit-body mt-2">Turnaround: {service.turnaround}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <div className="bg-rokit-orange py-12 text-center">
        <h3 className="text-3xl font-black text-white mb-4">Not Sure Which Service You Need?</h3>
        <p className="text-white/90 mb-6">Tell us about your project and we'll recommend the perfect solution.</p>
        <Link to="/portal/quote" className="btn-white">Request a Free Quote</Link>
      </div>
    </>
  );
}
