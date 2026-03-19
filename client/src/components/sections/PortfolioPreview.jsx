import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../utils/api';

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.12, ease: [0.25, 0.1, 0.25, 1] } }),
};

const categoryColors = {
  'banner-prints': 'bg-rokit-orange',
  'branding': 'bg-rokit-gold',
  'roll-up-banners': 'bg-rokit-green',
  'web-design': 'bg-blue-500',
  'graphic-design': 'bg-purple-500',
  'large-format': 'bg-red-500',
};

const placeholderItems = [
  { _id: '1', title: 'Brand Identity – Tech Startup', category: 'branding', images: [{ url: '/assets/images/strip-1.jpg' }] },
  { _id: '2', title: 'Large Format Banner Campaign', category: 'banner-prints', images: [{ url: '/assets/images/strip-2.jpg' }] },
  { _id: '3', title: 'Roll-Up Series – Annual Summit', category: 'roll-up-banners', images: [{ url: '/assets/images/1-no-text.jpg' }] },
];

export default function PortfolioPreview() {
  const [items, setItems] = useState(placeholderItems);

  useEffect(() => {
    api.get('/portfolio/featured').then(res => {
      if (Array.isArray(res.data) && res.data.length) setItems(res.data);
    }).catch(() => {});
  }, []);

  return (
    <section className="bg-rokit-cream py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div className="text-center mb-14"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} custom={0}
        >
          <p className="text-rokit-orange text-xs font-medium uppercase tracking-[0.15em] mb-3">Our Work</p>
          <h2 className="section-title">Featured Projects</h2>
          <div className="section-divider" />
          <p className="text-rokit-body max-w-xl mx-auto mt-4">
            A snapshot of the creative and printing work we've delivered for brands across Nigeria.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => {
            const badgeColor = categoryColors[item.category] || 'bg-gray-500';
            const imgUrl = item.images?.[0]?.url || '/assets/images/strip-1.jpg';
            return (
              <motion.div key={item._id}
                className="group relative overflow-hidden bg-rokit-dark aspect-[4/3]"
                initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={fadeUp} custom={i * 0.5}
              >
                <img
                  src={imgUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent flex flex-col justify-end p-5">
                  <span className={`text-xs font-medium text-white uppercase tracking-wider px-2.5 py-1 rounded-full ${badgeColor} w-fit mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                    {item.category?.replace(/-/g, ' ')}
                  </span>
                  <h4 className="text-white font-semibold text-base leading-tight translate-y-2 group-hover:translate-y-0 transition-transform duration-300">{item.title}</h4>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div className="text-center mt-12"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={fadeUp} custom={0}
        >
          <Link to="/gallery" className="btn-primary">View Full Gallery</Link>
        </motion.div>
      </div>
    </section>
  );
}
