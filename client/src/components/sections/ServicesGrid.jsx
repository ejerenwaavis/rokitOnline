import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Printer, Palette, Globe, Layers, Lightbulb, AlignLeft } from 'lucide-react';
import api from '../../utils/api';

const fallbackServices = [
  { _id: '1', slug: 'large-format-prints', name: 'Large Format Prints', shortDescription: 'High-quality banners, billboards, and large-scale printing for maximum visual impact.', icon: 'Printer' },
  { _id: '2', slug: 'graphic-design', name: 'Graphic Design', shortDescription: 'Creative visual solutions — from social media assets to print-ready artworks.', icon: 'Palette' },
  { _id: '3', slug: 'branding', name: 'Branding', shortDescription: 'Build a memorable identity with cohesive brand strategy and visual systems.', icon: 'Layers' },
  { _id: '4', slug: 'web-design', name: 'Web Design', shortDescription: 'Modern, fast, and responsive websites that convert visitors into customers.', icon: 'Globe' },
  { _id: '5', slug: 'idea-creation', name: 'Idea Creation', shortDescription: 'Concept development and creative direction to bring your vision to life.', icon: 'Lightbulb' },
  { _id: '6', slug: 'roll-up-banners', name: 'Roll-Up Banners', shortDescription: 'Portable, professional display banners for events, exhibitions, and promotions.', icon: 'AlignLeft' },
];

const iconMap = { Printer, Palette, Globe, Layers, Lightbulb, AlignLeft };

export default function ServicesGrid() {
  const [services, setServices] = useState(fallbackServices);

  useEffect(() => {
    api.get('/services').then(res => {
      if (res.data?.length) setServices(res.data);
    }).catch(() => {});
  }, []);

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-rokit-orange font-semibold uppercase tracking-widest text-sm mb-2">What We Do</p>
          <h2 className="section-title">Our Services</h2>
          <div className="section-divider" />
          <p className="text-rokit-body max-w-xl mx-auto mt-4">
            We deliver world-class creative and printing solutions for businesses of all sizes across Nigeria.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const ServiceIcon = iconMap[service.icon] || Palette;
            return (
              <Link
                key={service._id}
                to={`/services/${service.slug}`}
                className="group relative overflow-hidden bg-rokit-tan p-8 transition-all duration-300 hover:bg-rokit-orange hover:shadow-xl"
              >
                <div className="w-14 h-14 flex items-center justify-center bg-rokit-orange text-white mb-5 group-hover:bg-white group-hover:text-rokit-orange transition-colors duration-300">
                  <ServiceIcon size={26} />
                </div>
                <h3 className="text-xl font-bold text-rokit-dark group-hover:text-white mb-3 transition-colors duration-300">
                  {service.name}
                </h3>
                <p className="text-rokit-body group-hover:text-white/90 text-sm leading-relaxed transition-colors duration-300">
                  {service.shortDescription}
                </p>
                <div className="mt-5 text-rokit-orange group-hover:text-white font-semibold text-sm flex items-center gap-1 transition-colors duration-300">
                  Learn More <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link to="/services" className="btn-outline">View All Services</Link>
        </div>
      </div>
    </section>
  );
}
