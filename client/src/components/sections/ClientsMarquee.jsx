import { useEffect, useRef, useState } from 'react';
import api from '../../utils/api';

const placeholderClients = [
  { _id: '1',  name: 'Client 1',  logoUrl: '/assets/images/clients/1.png' },
  { _id: '2',  name: 'Client 2',  logoUrl: '/assets/images/clients/2.png' },
  { _id: '3',  name: 'Client 3',  logoUrl: '/assets/images/clients/3.png' },
  { _id: '4',  name: 'Client 4',  logoUrl: '/assets/images/clients/4.png' },
  { _id: '5',  name: 'Client 5',  logoUrl: '/assets/images/clients/5.png' },
  { _id: '6',  name: 'Client 6',  logoUrl: '/assets/images/clients/6.png' },
  { _id: '7',  name: 'Client 7',  logoUrl: '/assets/images/clients/7.png' },
  { _id: '8',  name: 'Client 8',  logoUrl: '/assets/images/clients/8.png' },
  { _id: '9',  name: 'Client 9',  logoUrl: '/assets/images/clients/9.png' },
  { _id: '10', name: 'Client 10', logoUrl: '/assets/images/clients/10.png' },
  { _id: '11', name: 'Client 11', logoUrl: '/assets/images/clients/11.png' },
  { _id: '12', name: 'Client 12', logoUrl: '/assets/images/clients/12.png' },
  { _id: '13', name: 'Client 13', logoUrl: '/assets/images/clients/13.png' },
  { _id: '14', name: 'Client 14', logoUrl: '/assets/images/clients/14.png' },
];

export default function ClientsMarquee() {
  const [clients, setClients] = useState(placeholderClients);
  const trackRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    api.get('/clients', { signal: controller.signal })
      .then(res => { if (Array.isArray(res.data) && res.data.length >= 3) setClients(res.data); })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  // Duplicate the list for seamless looping
  const doubled = [...clients, ...clients];

  return (
    <section className="bg-gray-50 py-14 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 text-center mb-8">
        <p className="text-rokit-orange text-xs font-medium uppercase tracking-[0.15em] mb-2">Our Clients</p>
        <h2 className="text-3xl font-bold text-rokit-dark">Trusted by Growing Brands</h2>
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
