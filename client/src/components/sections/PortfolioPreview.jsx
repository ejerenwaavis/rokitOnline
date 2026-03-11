import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

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
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-rokit-orange font-semibold uppercase tracking-widest text-sm mb-2">Our Work</p>
          <h2 className="section-title">Featured Projects</h2>
          <div className="section-divider" />
          <p className="text-rokit-body max-w-xl mx-auto mt-4">
            A snapshot of the creative and printing work we've delivered for brands across Nigeria.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const badgeColor = categoryColors[item.category] || 'bg-gray-500';
            const imgUrl = item.images?.[0]?.url || '/assets/images/strip-1.jpg';
            return (
              <div key={item._id} className="group relative overflow-hidden bg-rokit-dark aspect-[4/3]">
                <img
                  src={imgUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  <span className={`text-xs font-bold text-white uppercase tracking-wider px-2 py-1 ${badgeColor} w-fit mb-2`}>
                    {item.category?.replace(/-/g, ' ')}
                  </span>
                  <h4 className="text-white font-bold text-lg leading-tight">{item.title}</h4>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link to="/gallery" className="btn-primary">View Full Gallery</Link>
        </div>
      </div>
    </section>
  );
}
