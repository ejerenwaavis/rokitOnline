import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Printer, Palette, Globe, Layers, Lightbulb, AlignLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../utils/api';

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.12, ease: [0.25, 0.1, 0.25, 1] } }),
};

const fallbackServices = [
  { _id: '1', slug: 'large-format', name: 'Large Format Prints', shortDescription: 'High-quality banners, billboards, and large-scale printing for maximum visual impact.', icon: 'Printer' },
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
      if (Array.isArray(res.data) && res.data.length) setServices(res.data);
    }).catch(() => {});
  }, []);

  return (
    <section className="bg-rokit-cream py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div className="text-center mb-14"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} custom={0}
        >
          <p className="text-rokit-orange text-xs font-medium uppercase tracking-[0.15em] mb-3">What We Do</p>
          <h2 className="section-title">Our Services</h2>
          <div className="section-divider" />
          <p className="text-rokit-body max-w-xl mx-auto mt-4">
            We deliver world-class creative and printing solutions for businesses of all sizes across Nigeria.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, i) => {
            const ServiceIcon = iconMap[service.icon] || Palette;
            return (
              <motion.div key={service._id}
                initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={fadeUp} custom={i * 0.5}
              >
                <Link
                  to={`/services/${service.slug}`}
                  className="group block bg-white border border-rokit-orange/10 p-7 hover:border-rokit-orange/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 flex items-center justify-center bg-rokit-orange/10 text-rokit-orange mb-5 group-hover:bg-rokit-orange group-hover:text-white transition-colors duration-300">
                    <ServiceIcon size={22} />
                  </div>
                  <h3 className="text-base font-semibold text-rokit-dark mb-2">
                    {service.name}
                  </h3>
                  <p className="text-rokit-body text-sm leading-relaxed mb-5">
                    {service.shortDescription}
                  </p>
                  <div className="text-rokit-orange text-sm font-medium flex items-center gap-1">
                    Learn More <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div className="text-center mt-12"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={fadeUp} custom={0}
        >
          <Link to="/services" className="btn-outline">View All Services</Link>
        </motion.div>
      </div>
    </section>
  );
}
