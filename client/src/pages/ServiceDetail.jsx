import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, ArrowLeft, Clock, DollarSign } from 'lucide-react';
import api from '../utils/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { T } from '../theme';

export default function ServiceDetail() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.get(`/services/${slug}`)
      .then(res => {
        if (res.data && typeof res.data === 'object' && res.data.name) {
          setService(res.data);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true));
  }, [slug]);

  if (error) return (
    <div className={`${T.notFound} gap-4`}>
      <h2 className={`${T.h3}`}>Service Not Found</h2>
      <Link to="/services" className="btn-primary">Back to Services</Link>
    </div>
  );

  if (!service) return <LoadingSpinner center />;

  return (
    <>
      <Helmet>
        <title>{`${service.name} – Rokit Media`}</title>
        <meta name="description" content={service.shortDescription} />
      </Helmet>

      {/* Hero */}
      <div className={T.pageHero}>
        <div className={T.pageHeroInner}>
          <Link to="/services" className="inline-flex items-center gap-2 text-rokit-body hover:text-rokit-orange text-sm mb-6 font-mono text-[10px] uppercase tracking-[0.12em]">
            <ArrowLeft size={14} /> Back to Services
          </Link>
          <h1 className={`${T.h1} mb-3`}>{service.name}</h1>
          <p className={`${T.body} max-w-2xl`}>{service.shortDescription}</p>
        </div>
      </div>

      {/* Content */}
      <div className={T.sectionCream}>
        <div className={`${T.sectionInner} grid lg:grid-cols-3 gap-12`}>
          {/* Main content */}
          <div className="lg:col-span-2">
            {service.images?.length > 0 && (
              <img
                src={service.images[0]}
                alt={service.name}
                className="w-full h-72 object-cover mb-8"
              />
            )}
            {service.fullDescription && (
              <div
                className="tiptap-content"
                dangerouslySetInnerHTML={{ __html: service.fullDescription }}
              />
            )}
            {service.features?.length > 0 && (
              <>
                <h3 className={`${T.h3} mt-8 mb-4`}>What&apos;s Included</h3>
                <ul className="space-y-3">
                  {service.features.map(f => (
                    <li key={f} className="flex items-start gap-3">
                      <CheckCircle size={18} className="text-rokit-green shrink-0 mt-0.5" />
                      <span className="text-rokit-body">{f}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-white border border-rokit-orange/10 p-6">
              <h4 className="font-display font-light text-rokit-dark text-lg mb-4">Quick Info</h4>
              {service.startingPrice && !isNaN(+service.startingPrice) && (
                <div className="flex items-center gap-3 mb-3 text-rokit-body">
                  <DollarSign size={18} className="text-rokit-orange" />
                  <div>
                    <p className="text-xs uppercase text-gray-400 font-semibold">Starting From</p>
                    <p className="font-bold text-rokit-dark">₦{Number(service.startingPrice).toLocaleString()}</p>
                  </div>
                </div>
              )}
              {service.turnaround && (
                <div className="flex items-center gap-3 text-rokit-body">
                  <Clock size={18} className="text-rokit-orange" />
                  <div>
                    <p className="text-xs uppercase text-gray-400 font-semibold">Turnaround</p>
                    <p className="font-bold text-rokit-dark">{service.turnaround}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-rokit-orange p-6 text-white">
              <h4 className="font-display font-light text-xl mb-3">Ready to Order?</h4>
              <p className="text-white/90 text-sm mb-5">
                Place a job order or request a free quote today — our team is ready to help.
              </p>
              <Link to="/portal/order" className="block w-full bg-white text-rokit-orange font-mono text-[10px] uppercase tracking-[0.12em] text-center py-3 hover:bg-rokit-cream transition-colors mb-3">
                Place an Order
              </Link>
              <Link to="/portal/quote" className="block w-full border border-white text-white font-mono text-[10px] uppercase tracking-[0.12em] text-center py-3 hover:bg-white/10 transition-colors">
                Get a Quote
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
