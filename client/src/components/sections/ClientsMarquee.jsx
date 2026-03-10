import { useEffect, useRef, useState } from 'react';
import api from '../../utils/api';

const placeholderClients = [
  { _id: '1', name: 'Client A', logoUrl: '/assets/images/rokit-logo.png' },
  { _id: '2', name: 'Client B', logoUrl: '/assets/images/rokit-logo-lite.png' },
  { _id: '3', name: 'Client C', logoUrl: '/assets/images/rokit-logo-white-2.png' },
  { _id: '4', name: 'Client D', logoUrl: '/assets/images/rokit-logo.png' },
  { _id: '5', name: 'Client E', logoUrl: '/assets/images/rokit-logo-lite.png' },
  { _id: '6', name: 'Client F', logoUrl: '/assets/images/rokit-logo-white-2.png' },
];

export default function ClientsMarquee() {
  const [clients, setClients] = useState(placeholderClients);
  const trackRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    api.get('/admin/clients', { signal: controller.signal })
      .then(res => { if (res.data?.length >= 3) setClients(res.data); })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  // Duplicate the list for seamless looping
  const doubled = [...clients, ...clients];

  return (
    <section className="bg-rokit-tan py-14">
      <div className="max-w-7xl mx-auto px-4 text-center mb-8">
        <p className="text-rokit-orange font-semibold uppercase tracking-widest text-sm mb-1">Our Clients</p>
        <h2 className="text-3xl font-black text-rokit-dark">Trusted by Growing Brands</h2>
      </div>

      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex items-center gap-12 animate-marquee whitespace-nowrap px-8"
          style={{ width: 'max-content' }}
        >
          {doubled.map((client, idx) => (
            <div
              key={`${client._id}-${idx}`}
              className="flex items-center justify-center w-32 h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 shrink-0"
              title={client.name}
            >
              <img
                src={client.logoUrl}
                alt={client.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
