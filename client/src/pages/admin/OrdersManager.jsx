import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import StatusBadge from '../../components/ui/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const ORDER_STATUSES = ['pending', 'confirmed', 'in-progress', 'review', 'completed', 'cancelled'];

function OrderRow({ order, onUpdate }) {
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
    <tr className="border-t border-gray-100">
      <td className="px-4 py-3 font-mono text-xs text-gray-400">#{order._id.slice(-6).toUpperCase()}</td>
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
    </tr>
  );
}

export default function OrdersManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    api.get('/admin/orders', { signal: controller.signal })
      .then(res => { setOrders(res.data || []); setLoading(false); })
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
                </tr>
              </thead>
              <tbody>
                {displayed.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-10 text-center text-rokit-body">No orders found.</td></tr>
                ) : (
                  displayed.map(order => <OrderRow key={order._id} order={order} onUpdate={handleUpdate} />)
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
