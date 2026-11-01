import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShoppingBag, FileText, Paintbrush, Plus, ArrowRight } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/ui/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

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
    ])
      .then(([o, q, d]) => {
        setOrders(Array.isArray(o.data) ? o.data : []);
        setQuotes(Array.isArray(q.data) ? q.data : []);
        setDesigns(Array.isArray(d.data) ? d.data : []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-night flex items-center justify-center font-v4-body text-paper">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Client Portal — rOKIt</title>
        <meta name="description" content="Manage your active job orders, quotation requests, and design briefs." />
      </Helmet>

      <div className="font-v4-body text-paper py-16 px-gutter max-w-site mx-auto space-y-12">
        {/* Header */}
        <div className="border-b border-paper/15 pb-8">
          <p className="v4-section-label">Client Portal</p>
          <h1 className="mt-3 font-v4-display text-4xl md:text-5xl text-paper">
            Welcome back, {user?.name?.split(' ')?.[0] ?? 'there'}.
          </h1>
          <p className="mt-3 text-sm text-paper/70 font-mono">
            Active session: {user?.email} · Manage your briefs and production stages.
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: ShoppingBag, label: 'Active Orders', count: orders.length, link: '#orders' },
            { icon: FileText, label: 'Quotations', count: quotes.length, link: '#quotes' },
            { icon: Paintbrush, label: 'Design Requests', count: designs.length, link: '#designs' },
          ].map((stat) => {
            const StatIcon = stat.icon;
            return (
              <a
                key={stat.label}
                href={stat.link}
                className="border border-paper/15 bg-surface p-6 flex items-center gap-5 hover:border-signal transition-colors group"
              >
                <div className="size-12 flex items-center justify-center border border-paper/20 bg-night text-signal group-hover:bg-signal group-hover:text-night transition-colors">
                  <StatIcon size={22} />
                </div>
                <div>
                  <p className="text-3xl font-v4-display text-paper">{stat.count}</p>
                  <p className="text-xs uppercase font-mono tracking-wider text-neutral">{stat.label}</p>
                </div>
              </a>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="border border-paper/15 bg-surface p-6">
          <p className="v4-section-label mb-4">Quick Actions</p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/portal/quotes/new"
              className="action-link inline-flex items-center justify-center gap-2 min-h-12 border border-signal bg-signal px-6 text-xs uppercase font-mono tracking-wider text-night font-semibold hover:bg-paper transition-colors"
            >
              <Plus size={16} className="shrink-0" />
              <span>Start a Project / Quote</span>
            </Link>
            <Link
              to="/portal/orders/new"
              className="action-link inline-flex items-center justify-center gap-2 min-h-12 border border-paper/30 px-6 text-xs uppercase font-mono tracking-wider text-paper hover:border-signal hover:text-signal transition-colors"
            >
              <Plus size={16} className="shrink-0" />
              <span>Direct Job Order</span>
            </Link>
            <Link
              to="/portal/designs/new"
              className="action-link inline-flex items-center justify-center gap-2 min-h-12 border border-paper/30 px-6 text-xs uppercase font-mono tracking-wider text-paper hover:border-signal hover:text-signal transition-colors"
            >
              <Plus size={16} className="shrink-0" />
              <span>Submit Design Brief</span>
            </Link>
          </div>
        </div>

        {/* Orders Section */}
        <section id="orders" className="space-y-4">
          <div className="flex items-center justify-between border-b border-paper/15 pb-3">
            <h2 className="font-v4-display text-2xl text-paper">Job Orders</h2>
            <Link to="/portal/orders/new" className="text-xs font-mono text-signal hover:underline">
              + New Order
            </Link>
          </div>
          {orders.length === 0 ? (
            <div className="border border-paper/15 bg-surface/50 text-center py-10 text-neutral text-sm font-mono">
              No orders yet. <Link to="/portal/orders/new" className="text-signal hover:underline">Place an order</Link>.
            </div>
          ) : (
            <div className="overflow-x-auto border border-paper/15">
              <table className="w-full text-sm text-left">
                <thead className="border-b border-paper/20 bg-surface text-neutral font-mono text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Service</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-paper/10 bg-night">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-surface/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-paper">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-4 py-3 capitalize text-paper">{order.serviceType?.replace(/-/g, ' ')}</td>
                      <td className="px-4 py-3 font-mono text-paper">
                        ₦{Number(order.totalAmount || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-neutral">
                        {new Date(order.createdAt).toLocaleDateString('en-NG')}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/portal/orders/${order._id}`}
                          className="v4-action-link text-xs font-mono text-signal hover:underline"
                        >
                          View <ArrowRight size={13} className="ml-1" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Quotations Section */}
        <section id="quotes" className="space-y-4">
          <div className="flex items-center justify-between border-b border-paper/15 pb-3">
            <h2 className="font-v4-display text-2xl text-paper">Quotations</h2>
            <Link to="/portal/quotes/new" className="text-xs font-mono text-signal hover:underline">
              + Request Quote
            </Link>
          </div>
          {quotes.length === 0 ? (
            <div className="border border-paper/15 bg-surface/50 text-center py-10 text-neutral text-sm font-mono">
              No quotations yet. <Link to="/portal/quotes/new" className="text-signal hover:underline">Request a quote</Link>.
            </div>
          ) : (
            <div className="overflow-x-auto border border-paper/15">
              <table className="w-full text-sm text-left">
                <thead className="border-b border-paper/20 bg-surface text-neutral font-mono text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Service</th>
                    <th className="px-4 py-3">Quoted Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-paper/10 bg-night">
                  {quotes.map((q) => (
                    <tr key={q._id} className="hover:bg-surface/30 transition-colors">
                      <td className="px-4 py-3 capitalize text-paper">{q.serviceType?.replace(/-/g, ' ')}</td>
                      <td className="px-4 py-3 font-mono text-paper">
                        {q.quotedAmount ? `₦${Number(q.quotedAmount).toLocaleString()}` : 'Review in progress'}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={q.status} />
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-neutral">
                        {new Date(q.createdAt).toLocaleDateString('en-NG')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Design Requests Section */}
        <section id="designs" className="space-y-4">
          <div className="flex items-center justify-between border-b border-paper/15 pb-3">
            <h2 className="font-v4-display text-2xl text-paper">Design Briefs</h2>
            <Link to="/portal/designs/new" className="text-xs font-mono text-signal hover:underline">
              + Submit Brief
            </Link>
          </div>
          {designs.length === 0 ? (
            <div className="border border-paper/15 bg-surface/50 text-center py-10 text-neutral text-sm font-mono">
              No design briefs submitted. <Link to="/portal/designs/new" className="text-signal hover:underline">Submit one here</Link>.
            </div>
          ) : (
            <div className="overflow-x-auto border border-paper/15">
              <table className="w-full text-sm text-left">
                <thead className="border-b border-paper/20 bg-surface text-neutral font-mono text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Design Type</th>
                    <th className="px-4 py-3">Deadline</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-paper/10 bg-night">
                  {designs.map((d) => (
                    <tr key={d._id} className="hover:bg-surface/30 transition-colors">
                      <td className="px-4 py-3 capitalize text-paper">{d.designType?.replace(/-/g, ' ')}</td>
                      <td className="px-4 py-3 font-mono text-xs text-neutral">
                        {d.deadline ? new Date(d.deadline).toLocaleDateString('en-NG') : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={d.status} />
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-neutral">
                        {new Date(d.createdAt).toLocaleDateString('en-NG')}
                      </td>
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
