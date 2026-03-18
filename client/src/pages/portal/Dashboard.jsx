import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShoppingBag, FileText, Paintbrush, Plus } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/ui/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { T } from '../../theme';

export default function PortalDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      api.get('/orders/mine', { signal: controller.signal }),
      api.get('/quotes/mine', { signal: controller.signal }),
      api.get('/designs/mine', { signal: controller.signal }),
    ]).then(([o, q, d]) => {
      setOrders(Array.isArray(o.data) ? o.data : []);
      setQuotes(Array.isArray(q.data) ? q.data : []);
      setDesigns(Array.isArray(d.data) ? d.data : []);
      setLoading(false);
    }).catch(() => { setLoading(false); });
    return () => controller.abort();
  }, []);

  if (loading) return <LoadingSpinner center />;

  return (
    <>
      <Helmet><title>My Dashboard – Rokit Media</title></Helmet>
      <div className="min-h-screen bg-rokit-cream pt-24 pb-12 px-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-light text-rokit-dark">Welcome back, {user?.name?.split(' ')?.[0] ?? 'there'}</h1>
          <p className={`${T.body} mt-1`}>Here&apos;s an overview of your Rokit Media account.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: ShoppingBag, label: 'Job Orders', count: orders.length, color: 'bg-rokit-orange', link: '#orders' },
            { icon: FileText, label: 'Quotations', count: quotes.length, color: 'bg-rokit-gold', link: '#quotes' },
            { icon: Paintbrush, label: 'Design Requests', count: designs.length, color: 'bg-rokit-green', link: '#designs' },
          ].map(stat => {
            const StatIcon = stat.icon;
            return (
              <a key={stat.label} href={stat.link} className="bg-white p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 flex items-center justify-center ${stat.color} text-white`}>
                  <StatIcon size={22} />
                </div>
                <div>
                  <p className="text-2xl font-black text-rokit-dark">{stat.count}</p>
                  <p className="text-xs text-rokit-body font-medium">{stat.label}</p>
                </div>
              </a>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-rokit-cream-dark border border-rokit-orange/10 p-6 mb-10">
          <h2 className="font-display font-light text-rokit-dark text-lg mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link to="/portal/orders/new" className="btn-primary inline-flex items-center gap-2"><Plus size={16} /> New Job Order</Link>
            <Link to="/portal/quotes/new" className="btn-outline inline-flex items-center gap-2"><Plus size={16} /> Request Quote</Link>
            <Link to="/portal/designs/new" className="btn-gold inline-flex items-center gap-2"><Plus size={16} /> Design Request</Link>
          </div>
        </div>

        {/* Orders Table */}
        <section id="orders" className="mb-10">
          <h2 className="font-display font-light text-rokit-dark text-xl mb-4">Job Orders</h2>
          {orders.length === 0 ? (
            <div className="bg-rokit-cream-dark border border-rokit-orange/10 text-center py-10 text-rokit-body">
              No orders yet. <Link to="/portal/orders/new" className="text-rokit-orange hover:underline">Place your first order</Link>.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm bg-white border border-rokit-orange/10">
                <thead className="bg-rokit-dark text-white text-left">
                  <tr>
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em]">Order ID</th>
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em]">Service</th>
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em]">Amount</th>
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em]">Status</th>
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em]">Date</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, i) => (
                    <tr key={order._id} className={i % 2 === 0 ? 'bg-white' : 'bg-rokit-cream'}>
                      <td className="px-4 py-3 font-mono text-xs text-rokit-body">#{order._id.slice(-6).toUpperCase()}</td>
                      <td className="px-4 py-3 capitalize">{order.serviceType?.replace(/-/g, ' ')}</td>
                      <td className="px-4 py-3">₦{Number(order.totalAmount || 0).toLocaleString()}</td>
                      <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                      <td className="px-4 py-3 text-rokit-body">{new Date(order.createdAt).toLocaleDateString('en-NG')}</td>
                      <td className="px-4 py-3">
                        <Link to={`/portal/orders/${order._id}`} className="text-rokit-orange text-xs hover:underline">View</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Quotes */}
        <section id="quotes" className="mb-10">
          <h2 className="font-display font-light text-rokit-dark text-xl mb-4">Quotation Requests</h2>
          {quotes.length === 0 ? (
            <div className="bg-rokit-cream-dark border border-rokit-orange/10 text-center py-10 text-rokit-body">
              No quotes yet. <Link to="/portal/quotes/new" className="text-rokit-orange hover:underline">Request a quote</Link>.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm bg-white border border-rokit-orange/10">
                <thead className="bg-rokit-dark text-white text-left">
                  <tr>
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em]">Service</th>
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em]">Quoted Amount</th>
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em]">Status</th>
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em]">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {quotes.map((q, i) => (
                    <tr key={q._id} className={i % 2 === 0 ? 'bg-white' : 'bg-rokit-cream'}>
                      <td className="px-4 py-3 capitalize">{q.serviceType?.replace(/-/g, ' ')}</td>
                      <td className="px-4 py-3">{q.quotedAmount ? `₦${Number(q.quotedAmount).toLocaleString()}` : 'Pending'}</td>
                      <td className="px-4 py-3"><StatusBadge status={q.status} /></td>
                      <td className="px-4 py-3 text-rokit-body">{new Date(q.createdAt).toLocaleDateString('en-NG')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Design Requests */}
        <section id="designs">
          <h2 className="font-display font-light text-rokit-dark text-xl mb-4">Design Requests</h2>
          {designs.length === 0 ? (
            <div className="bg-rokit-cream-dark border border-rokit-orange/10 text-center py-10 text-rokit-body">
              No design requests yet. <Link to="/portal/designs/new" className="text-rokit-orange hover:underline">Submit one</Link>.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm bg-white border border-rokit-orange/10">
                <thead className="bg-rokit-dark text-white text-left">
                  <tr>
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em]">Design Type</th>
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em]">Deadline</th>
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em]">Status</th>
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em]">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {designs.map((d, i) => (
                    <tr key={d._id} className={i % 2 === 0 ? 'bg-white' : 'bg-rokit-cream'}>
                      <td className="px-4 py-3 capitalize">{d.designType?.replace(/-/g, ' ')}</td>
                      <td className="px-4 py-3 text-rokit-body">{d.deadline ? new Date(d.deadline).toLocaleDateString('en-NG') : '—'}</td>
                      <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                      <td className="px-4 py-3 text-rokit-body">{new Date(d.createdAt).toLocaleDateString('en-NG')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
