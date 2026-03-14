import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { X, Send, FileText, ExternalLink } from 'lucide-react';
import api from '../../utils/api';
import StatusBadge from '../../components/ui/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const ORDER_STATUSES = ['pending', 'confirmed', 'in-progress', 'review', 'completed', 'cancelled'];

/* ─── Order Detail Modal ──────────────────────────────────────────────── */
function OrderDetailModal({ order, onClose }) {
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);
  const overlayRef = useRef();

  // Close on backdrop click
  const handleBackdrop = (e) => { if (e.target === overlayRef.current) onClose(); };

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleForward = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error('Enter a recipient email.');
    setSending(true);
    try {
      await api.post(`/admin/orders/${order._id}/forward`, { email: email.trim(), note: note.trim() });
      toast.success(`Order details sent to ${email.trim()}`);
      setEmail('');
      setNote('');
    } catch {
      toast.error('Failed to send. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const fmt = (val) => val != null && val !== '' ? val : '—';
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
  const fmtMoney = (v) => v > 0 ? `₦${Number(v).toLocaleString()}` : '—';

  return (
    <div
      ref={overlayRef}
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto py-8 px-4"
    >
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between bg-rokit-dark text-white px-6 py-4 rounded-t-xl">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-0.5">Job Order</p>
            <h2 className="text-xl font-black">#{order._id.slice(-6).toUpperCase()}</h2>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={order.status} />
            <button onClick={onClose} className="p-1 hover:text-rokit-orange transition-colors"><X size={20} /></button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-rokit-body mb-3">Customer</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
              <DetailRow label="Name" value={order.customer?.name || '—'} />
              <DetailRow label="Email" value={order.customer?.email || '—'} />
              <DetailRow label="Phone" value={order.customer?.phone || '—'} />
              <DetailRow label="Submitted" value={fmtDate(order.createdAt)} />
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Job Details */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-rokit-body mb-3">Job Details</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm mb-3">
              <DetailRow label="Service" value={fmt(order.serviceType?.replace(/-/g, ' '))} />
              <DetailRow label="Quantity" value={fmt(order.quantity)} />
              <DetailRow label="Dimensions" value={fmt(order.dimensions)} />
              <DetailRow label="Deadline" value={fmtDate(order.deadline)} />
            </div>
            <div className="text-sm mb-2">
              <span className="text-xs font-semibold text-rokit-body uppercase tracking-wide block mb-1">Description</span>
              <p className="bg-gray-50 p-3 rounded text-rokit-dark whitespace-pre-wrap">{fmt(order.description)}</p>
            </div>
            {order.specifications && (
              <div className="text-sm">
                <span className="text-xs font-semibold text-rokit-body uppercase tracking-wide block mb-1">Specifications</span>
                <p className="bg-gray-50 p-3 rounded text-rokit-dark whitespace-pre-wrap">{order.specifications}</p>
              </div>
            )}
          </section>

          {/* Files */}
          {order.files?.length > 0 && (
            <>
              <hr className="border-gray-100" />
              <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-rokit-body mb-3">Attached Files</h3>
                <ul className="space-y-1">
                  {order.files.map((f, i) => (
                    <li key={i}>
                      <a
                        href={f.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-rokit-orange hover:underline"
                      >
                        <FileText size={14} />
                        {f.originalName || `File ${i + 1}`}
                        <ExternalLink size={12} className="opacity-60" />
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}

          <hr className="border-gray-100" />

          {/* Financials */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-rokit-body mb-3">Financials</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
              <DetailRow label="Quoted Price" value={fmtMoney(order.quotedPrice)} />
              <DetailRow label="Customer Budget" value={fmtMoney(order.customerBudget)} />
              <DetailRow label="Total Amount" value={fmtMoney(order.totalAmount)} />
              <DetailRow label="Deposit" value={fmtMoney(order.depositAmount)} />
              <DetailRow label="Price Status" value={fmt(order.priceStatus)} />
              <DetailRow label="Payment Status" value={fmt(order.paymentStatus)} />
            </div>
          </section>

          {/* Notes */}
          {(order.adminNotes || order.customerNotes) && (
            <>
              <hr className="border-gray-100" />
              <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-rokit-body mb-3">Notes</h3>
                {order.customerNotes && (
                  <div className="mb-2">
                    <span className="text-xs font-semibold text-rokit-body uppercase tracking-wide block mb-1">Customer Notes</span>
                    <p className="bg-gray-50 p-3 rounded text-sm whitespace-pre-wrap">{order.customerNotes}</p>
                  </div>
                )}
                {order.adminNotes && (
                  <div>
                    <span className="text-xs font-semibold text-rokit-body uppercase tracking-wide block mb-1">Admin Notes</span>
                    <p className="bg-gray-50 p-3 rounded text-sm whitespace-pre-wrap">{order.adminNotes}</p>
                  </div>
                )}
              </section>
            </>
          )}

          {/* Timeline */}
          {order.timeline?.length > 0 && (
            <>
              <hr className="border-gray-100" />
              <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-rokit-body mb-3">Timeline</h3>
                <ol className="relative border-l border-gray-200 space-y-3 ml-2">
                  {order.timeline.map((t, i) => (
                    <li key={i} className="ml-4">
                      <div className="absolute -left-1.5 mt-1.5 w-3 h-3 rounded-full bg-rokit-orange border-2 border-white" />
                      <p className="text-xs text-gray-400">{fmtDate(t.date)}</p>
                      <p className="text-sm text-rokit-dark font-medium capitalize">{t.status}</p>
                      {t.note && <p className="text-xs text-rokit-body">{t.note}</p>}
                    </li>
                  ))}
                </ol>
              </section>
            </>
          )}

          <hr className="border-gray-100" />

          {/* Forward to Email */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-rokit-body mb-3">Forward to Teammate / External Email</h3>
            <form onSubmit={handleForward} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Recipient email address"
                required
                className="form-input"
              />
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Optional note to include in the email…"
                rows={2}
                className="form-input resize-none"
              />
              <button
                type="submit"
                disabled={sending}
                className="btn-primary w-full justify-center"
              >
                <Send size={15} className="mr-2" />
                {sending ? 'Sending…' : 'Send Order Details'}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <>
      <span className="text-xs font-semibold text-rokit-body uppercase tracking-wide">{label}</span>
      <span className="text-rokit-dark">{value}</span>
    </>
  );
}

/* ─── Order Row ───────────────────────────────────────────────────────── */
function OrderRow({ order, onUpdate, onView }) {
  const [updating, setUpdating] = useState(false);
  const [quoteInput, setQuoteInput] = useState('');
  const [quoting, setQuoting] = useState(false);

  const handleQuotePrice = async (e) => {
    e.preventDefault();
    if (!quoteInput || isNaN(quoteInput) || Number(quoteInput) <= 0) return;
    setQuoting(true);
    try {
      await api.patch(`/admin/orders/${order._id}`, { quotedPrice: Number(quoteInput) });
      onUpdate(order._id, { quotedPrice: Number(quoteInput), priceStatus: 'quoted' });
      toast.success('Price quoted and customer notified.');
      setQuoteInput('');
    } catch {
      toast.error('Failed to send quote.');
    } finally {
      setQuoting(false);
    }
  };

  const handleAcceptOffer = async () => {
    if (!window.confirm(`Accept customer's counter-offer of ₦${Number(order.customerBudget).toLocaleString()}? This will confirm the order at that price.`)) return;
    setQuoting(true);
    try {
      await api.post(`/admin/orders/${order._id}/accept-offer`);
      onUpdate(order._id, { priceStatus: 'accepted', totalAmount: order.customerBudget });
      toast.success('Counter-offer accepted. Customer notified.');
    } catch {
      toast.error('Failed to accept offer.');
    } finally {
      setQuoting(false);
    }
  };

  const handleStatus = async (status) => {
    setUpdating(true);
    try {
      await api.patch(`/admin/orders/${order._id}`, { status });
      onUpdate(order._id, { status });
      toast.success(`Order status updated to "${status}".`);
    } catch {
      toast.error('Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <tr className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 font-mono text-xs text-gray-400">
        <button
          onClick={() => onView(order)}
          className="text-rokit-orange hover:underline font-semibold"
        >
          #{order._id.slice(-6).toUpperCase()}
        </button>
      </td>
      <td className="px-4 py-3 text-sm">{order.customer?.name || 'Guest'}</td>
      <td className="px-4 py-3 text-sm capitalize">{order.serviceType?.replace(/-/g, ' ')}</td>
      <td className="px-4 py-3 text-sm">
        {order.priceStatus === 'accepted' || order.totalAmount > 0
          ? <span className="font-semibold text-rokit-dark">₦{Number(order.totalAmount).toLocaleString()}</span>
          : order.quotedPrice > 0
            ? <span className="text-rokit-orange">₦{Number(order.quotedPrice).toLocaleString()} <span className="text-xs text-gray-400">(quoted)</span></span>
            : order.customerBudget > 0
              ? <span className="text-blue-500">₦{Number(order.customerBudget).toLocaleString()} <span className="text-xs text-gray-400">(budget)</span></span>
              : <span className="text-gray-400">Not set</span>
        }
      </td>
      <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
      <td className="px-4 py-3">
        <select
          disabled={updating}
          value={order.status}
          onChange={e => handleStatus(e.target.value)}
          className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-rokit-orange"
        >
          {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </td>
      <td className="px-4 py-3">
        {order.priceStatus === 'accepted' ? (
          <span className="text-xs text-green-600 font-semibold">✓ Accepted ₦{Number(order.totalAmount).toLocaleString()}</span>
        ) : order.priceStatus === 'negotiating' ? (
          <div className="space-y-1">
            <div className="text-xs text-blue-600 font-semibold">
              Counter: ₦{Number(order.customerBudget).toLocaleString()}
            </div>
            <div className="text-xs text-gray-400">was ₦{Number(order.quotedPrice).toLocaleString()}</div>
            <div className="flex gap-1 mt-1">
              <input
                type="number"
                value={quoteInput || order.customerBudget || ''}
                onChange={e => setQuoteInput(e.target.value)}
                placeholder="New ₦ offer"
                className="w-24 text-xs border border-blue-300 px-2 py-1 focus:outline-none focus:border-rokit-orange"
              />
              <button
                type="button"
                onClick={handleAcceptOffer}
                disabled={quoting}
                className="text-xs bg-green-600 text-white px-2 py-1 hover:bg-green-700 flex-1"
              >
                {quoting ? '…' : '✓ Accept'}
              </button>
            </div>
            <form onSubmit={handleQuotePrice} className="flex gap-1 mt-1">
              <button type="submit" disabled={quoting} className="text-xs bg-rokit-orange text-white px-2 py-1 hover:bg-rokit-orange-dark w-full">
                {quoting ? '…' : 'Re-quote ₦' + (quoteInput || order.customerBudget || '')}
              </button>
            </form>
          </div>
        ) : order.priceStatus === 'quoted' ? (
          <span className="text-xs text-rokit-orange font-semibold">Quoted ₦{Number(order.quotedPrice).toLocaleString()}</span>
        ) : (
          <form onSubmit={handleQuotePrice} className="flex gap-1">
            <input
              type="number"
              value={quoteInput}
              onChange={e => setQuoteInput(e.target.value)}
              placeholder="₦ amount"
              className="w-24 text-xs border border-gray-200 px-2 py-1 focus:outline-none focus:border-rokit-orange"
            />
            <button type="submit" disabled={quoting} className="text-xs bg-rokit-orange text-white px-2 py-1 hover:bg-rokit-orange-dark">
              {quoting ? '…' : 'Send'}
            </button>
          </form>
        )}
      </td>
      <td className="px-4 py-3 text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-NG')}</td>
      <td className="px-4 py-3">
        <button
          onClick={() => onView(order)}
          className="text-xs text-rokit-orange border border-rokit-orange px-2 py-1 rounded hover:bg-rokit-orange hover:text-white transition-colors"
        >
          View
        </button>
      </td>
    </tr>
  );
}

export default function OrdersManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    api.get('/admin/orders', { signal: controller.signal })
      .then(res => { setOrders(Array.isArray(res.data) ? res.data : []); setLoading(false); })
      .catch(() => { setLoading(false); });
    return () => controller.abort();
  }, []);

  const handleUpdate = (id, changes) => {
    setOrders(prev => prev.map(o => o._id === id ? { ...o, ...changes } : o));
  };

  const displayed = filter ? orders.filter(o => o.status === filter) : orders;

  return (
    <>
      <Helmet><title>Orders Manager – Rokit Media Admin</title></Helmet>
      <div className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-black text-rokit-dark">Orders Manager</h1>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="text-sm border border-gray-200 px-3 py-2 focus:outline-none focus:border-rokit-orange"
          >
            <option value="">All Statuses</option>
            {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {loading ? <LoadingSpinner center /> : (
          <div className="overflow-x-auto bg-white shadow-sm">
            <table className="w-full text-sm min-w-[700px]">
              <thead className="bg-rokit-dark text-white text-left text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Update Status</th>
                  <th className="px-4 py-3">Quote Price</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Details</th>
                </tr>
              </thead>
              <tbody>
                {displayed.length === 0 ? (
                  <tr><td colSpan={9} className="px-4 py-10 text-center text-rokit-body">No orders found.</td></tr>
                ) : (
                  displayed.map(order => <OrderRow key={order._id} order={order} onUpdate={handleUpdate} onView={setSelectedOrder} />)
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
}
