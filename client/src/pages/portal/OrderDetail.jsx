import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, CheckCircle, Clock } from 'lucide-react';
import api from '../../utils/api';
import StatusBadge from '../../components/ui/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    api.get(`/orders/${id}`, { signal: controller.signal })
      .then(res => { setOrder(res.data); })
      .catch(() => { setError(true); });
    return () => controller.abort();
  }, [id]);

  if (error) return (
    <div className="p-8 text-center">
      <p className="text-rokit-body mb-4">Order not found.</p>
      <Link to="/portal" className="btn-primary">Back to Dashboard</Link>
    </div>
  );

  if (!order) return <LoadingSpinner center />;

  return (
    <>
      <Helmet><title>Order #{order._id.slice(-6).toUpperCase()} – Rokit Media</title></Helmet>
      <div className="p-6 max-w-3xl mx-auto">
        <Link to="/portal" className="inline-flex items-center gap-2 text-rokit-orange hover:underline text-sm mb-6">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-rokit-dark">
              Order #{order._id.slice(-6).toUpperCase()}
            </h1>
            <p className="text-rokit-body mt-1 capitalize">{order.serviceType?.replace(/-/g, ' ')}</p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        {/* Details */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-rokit-tan p-5">
            <p className="text-xs font-bold uppercase text-gray-400 mb-1">Description</p>
            <p className="text-rokit-body text-sm">{order.description}</p>
          </div>
          <div className="bg-rokit-tan p-5 space-y-2">
            {order.specs?.width && <p className="text-sm"><span className="font-semibold text-rokit-dark">Size:</span> {order.specs.width}cm × {order.specs.height}cm</p>}
            {order.specs?.quantity && <p className="text-sm"><span className="font-semibold text-rokit-dark">Qty:</span> {order.specs.quantity}</p>}
            {order.specs?.material && <p className="text-sm"><span className="font-semibold text-rokit-dark">Material:</span> {order.specs.material}</p>}
            {order.depositAmount > 0 && <p className="text-sm"><span className="font-semibold text-rokit-dark">Deposit:</span> ₦{Number(order.depositAmount).toLocaleString()}</p>}
            {order.totalAmount > 0 && <p className="text-sm"><span className="font-semibold text-rokit-dark">Total:</span> ₦{Number(order.totalAmount).toLocaleString()}</p>}
            <p className="text-sm">
              <span className="font-semibold text-rokit-dark">Payment:</span>{' '}
              <StatusBadge status={order.paymentStatus} />
            </p>
          </div>
        </div>

        {/* Timeline */}
        {order.timeline?.length > 0 && (
          <div className="bg-white p-6 shadow-sm">
            <h2 className="font-black text-rokit-dark mb-5">Order Timeline</h2>
            <div className="relative border-l-2 border-rokit-orange/30 pl-6 space-y-6">
              {order.timeline.map((entry, i) => {
                const isLast = i === order.timeline.length - 1;
                const TimeIcon = isLast ? CheckCircle : Clock;
                return (
                  <div key={i} className="relative">
                    <div className={`absolute -left-[1.85rem] top-0.5 w-5 h-5 rounded-full flex items-center justify-center ${isLast ? 'bg-rokit-orange' : 'bg-gray-200'}`}>
                      <TimeIcon size={12} className={isLast ? 'text-white' : 'text-gray-400'} />
                    </div>
                    <p className="font-semibold text-rokit-dark text-sm capitalize">{entry.status?.replace(/-/g, ' ')}</p>
                    {entry.note && <p className="text-xs text-rokit-body mt-0.5">{entry.note}</p>}
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(entry.date).toLocaleString('en-NG')}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
