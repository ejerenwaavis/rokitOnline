import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, CheckCircle, Clock, AlertCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/ui/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

function NegotiateModal({ order, userEmail, onClose, onNegotiated }) {
  const [form, setForm] = useState({
    counterOffer: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.counterOffer || isNaN(form.counterOffer) || Number(form.counterOffer) <= 0) {
      toast.error('Please enter a valid counter-offer amount.');
      return;
    }
    if (!form.message.trim()) {
      toast.error('Please explain your counter-offer.');
      return;
    }
    setSubmitting(true);
    try {
      // 1. Stamp the order as negotiating + add timeline entry
      const res = await api.post(`/orders/${order._id}/counter-offer`, {
        counterAmount: Number(form.counterOffer),
        message: form.message,
      });
      // 2. Send contact message to staff
      await api.post('/contact', {
        name: order.customer?.name || 'Customer',
        email: userEmail,
        phone: order.customer?.phone || '',
        subject: `Price Negotiation – Order #${order._id.slice(-6).toUpperCase()}`,
        message:
          `Order: #${order._id}\n` +
          `Service: ${order.serviceType}\n` +
          `Quoted Price: ₦${Number(order.quotedPrice).toLocaleString()}\n` +
          `Counter-Offer: ₦${Number(form.counterOffer).toLocaleString()}\n\n` +
          form.message,
      });
      onNegotiated(res.data);
      toast.success('Counter-offer sent! We will review and get back to you.');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-rokit-dark">
          <div>
            <h2 className="font-black text-white text-lg">Negotiate Price</h2>
            <p className="text-gray-400 text-xs mt-0.5">Order #{order._id.slice(-6).toUpperCase()} · {order.serviceType?.replace(/-/g, ' ')}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Pre-filled read-only info */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-rokit-dark mb-1">Your Email</label>
              <input value={userEmail} readOnly className="form-input bg-gray-50 text-gray-500 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-rokit-dark mb-1">Quoted Price</label>
              <input value={`₦${Number(order.quotedPrice).toLocaleString()}`} readOnly className="form-input bg-gray-50 text-rokit-orange font-semibold cursor-not-allowed" />
            </div>
          </div>

          {/* Counter offer */}
          <div>
            <label className="block text-xs font-semibold text-rokit-dark mb-1">Your Counter-Offer (₦) *</label>
            <input
              type="number"
              value={form.counterOffer}
              onChange={e => setForm(p => ({ ...p, counterOffer: e.target.value }))}
              className="form-input"
              placeholder="e.g. 15000"
              min="1"
              required
            />
          </div>

          {/* Explanation */}
          <div>
            <label className="block text-xs font-semibold text-rokit-dark mb-1">Reason / Explanation *</label>
            <textarea
              value={form.message}
              onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
              className="form-input"
              rows={4}
              placeholder="Explain your counter-offer — budget constraints, comparisons, project scope clarifications…"
              required
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={submitting} className="btn-primary flex-1">
              {submitting ? 'Sending…' : 'Send Negotiation Request'}
            </button>
            <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function OrderDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [accepting, setAccepting] = useState(false);
  const [negotiating, setNegotiating] = useState(false);

  const handleNegotiated = (updatedOrder) => {
    setOrder(updatedOrder);
  };

  useEffect(() => {
    const controller = new AbortController();
    api.get(`/orders/${id}`, { signal: controller.signal })
      .then(res => {
        if (res.data && typeof res.data === 'object' && res.data._id) setOrder(res.data);
        else setError('Failed to load order. Please try again.');
      })
      .catch(err => {
        // Ignore aborts caused by React Strict Mode double-invoking effects
        if (err.code === 'ERR_CANCELED' || err.name === 'CanceledError' || err.name === 'AbortError') return;
        const status = err.response?.status;
        if (status === 403) setError('You do not have permission to view this order.');
        else if (status === 404) setError('Order not found.');
        else setError('Failed to load order. Please try again.');
      });
    return () => controller.abort();
  }, [id]);

  const handleAcceptPrice = async () => {
    if (!window.confirm(`Accept quoted price of \u20a6${Number(order.quotedPrice).toLocaleString()}?`)) return;
    setAccepting(true);
    try {
      const res = await api.post(`/orders/${id}/accept-price`);
      setOrder(res.data);
      toast.success('Price accepted! Our team will proceed with your order.');
    } catch {
      toast.error('Failed to accept price. Please try again.');
    } finally {
      setAccepting(false);
    }
  };

  if (error) return (
    <div className="pt-24 p-8 text-center">
      <AlertCircle className="mx-auto mb-3 text-red-400" size={40} />
      <p className="text-rokit-body mb-4">{error}</p>
      <Link to="/portal" className="btn-primary">Back to Dashboard</Link>
    </div>
  );

  if (!order) return <LoadingSpinner center />;

  return (
    <>
      <Helmet><title>Order #{order._id.slice(-6).toUpperCase()} – Rokit Media</title></Helmet>
      <div className="pt-24 pb-6 px-6 max-w-3xl mx-auto">
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

        {/* Price Quote Banner */}
        {order.priceStatus === 'quoted' && (
          <div className="bg-rokit-orange/10 border-l-4 border-rokit-orange p-5 mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-black text-rokit-dark text-lg">Price Quote Ready</p>
              <p className="text-rokit-body text-sm mt-0.5">Our team has quoted <strong className="text-rokit-orange text-xl">₦{Number(order.quotedPrice).toLocaleString()}</strong> for this order.</p>
              {order.adminNotes && <p className="text-sm text-rokit-body mt-1"><em>"{order.adminNotes}"</em></p>}
            </div>
            <div className="flex gap-3">
              <button onClick={handleAcceptPrice} disabled={accepting} className="btn-primary">
                {accepting ? 'Processing…' : '✓ Accept Price'}
              </button>
              <button onClick={() => setNegotiating(true)} className="btn-outline">Negotiate</button>
            </div>
          </div>
        )}

        {order.priceStatus === 'negotiating' && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-5 mb-8">
            <p className="font-black text-rokit-dark text-lg">Counter-Offer Sent</p>
            <p className="text-rokit-body text-sm mt-1">
              Your counter-offer of <strong className="text-blue-600">₦{Number(order.customerBudget).toLocaleString()}</strong> has been received.
              Our team will review and respond. Check back here for updates.
            </p>
            {order.quotedPrice > 0 && (
              <p className="text-rokit-body text-sm mt-1">
                Latest quoted price from our team: <strong className="text-rokit-dark">₦{Number(order.quotedPrice).toLocaleString()}</strong>
              </p>
            )}
          </div>
        )}

        {order.priceStatus === 'accepted' && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-8">
            <p className="text-green-700 font-semibold">✓ Price accepted – ₦{Number(order.totalAmount || order.quotedPrice).toLocaleString()}. Our team is now processing your order.</p>
          </div>
        )}

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

      {negotiating && (
        <NegotiateModal
          order={order}
          userEmail={user?.email || order.customer?.email || ''}
          onClose={() => setNegotiating(false)}
          onNegotiated={handleNegotiated}
        />
      )}
    </>
  );
}
