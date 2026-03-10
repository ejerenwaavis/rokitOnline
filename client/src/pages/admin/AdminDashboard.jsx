import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ShoppingBag, FileText, Paintbrush, Users, Image, BookOpen, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    api.get('/admin/stats', { signal: controller.signal })
      .then(res => { setStats(res.data); })
      .catch(() => { setStats({}); });
    return () => controller.abort();
  }, []);

  const cards = stats ? [
    { icon: ShoppingBag, label: 'Total Orders', value: stats.orders ?? 0, link: '/admin/orders', color: 'bg-rokit-orange' },
    { icon: FileText, label: 'Quotations', value: stats.quotations ?? 0, link: '/admin/orders', color: 'bg-rokit-gold' },
    { icon: Paintbrush, label: 'Design Requests', value: stats.designs ?? 0, link: '/admin/orders', color: 'bg-purple-500' },
    { icon: Users, label: 'Customers', value: stats.customers ?? 0, link: '/admin/customers', color: 'bg-blue-500' },
    { icon: Image, label: 'Portfolio Items', value: stats.portfolio ?? 0, link: '/admin/portfolio', color: 'bg-rokit-green' },
    { icon: BookOpen, label: 'Tutorials', value: stats.tutorials ?? 0, link: '/admin/tutorials', color: 'bg-indigo-500' },
    { icon: MessageSquare, label: 'Messages', value: stats.messages ?? 0, link: '/admin/orders', color: 'bg-red-400' },
  ] : [];

  return (
    <>
      <Helmet><title>Admin Dashboard – Rokit Media</title></Helmet>
      <div className="p-6">
        <h1 className="text-3xl font-black text-rokit-dark mb-2">Admin Dashboard</h1>
        <p className="text-rokit-body mb-8">Overview of your Rokit Media platform.</p>

        {!stats ? (
          <LoadingSpinner center />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
            {cards.map(card => {
              const CardIcon = card.icon;
              return (
                <Link key={card.label} to={card.link} className="bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3">
                  <div className={`w-11 h-11 ${card.color} flex items-center justify-center`}>
                    <CardIcon size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-rokit-dark">{card.value}</p>
                    <p className="text-xs text-rokit-body font-medium">{card.label}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: 'Manage Orders', to: '/admin/orders', desc: 'View and update all job orders, quotations, and design requests.' },
            { label: 'Portfolio', to: '/admin/portfolio', desc: 'Upload new portfolio items and manage existing ones.' },
            { label: 'Tutorials', to: '/admin/tutorials', desc: 'Create, edit, and publish tutorials using the rich text editor.' },
            { label: 'Services', to: '/admin/services', desc: 'Update service descriptions, pricing, and turnaround times.' },
            { label: 'Customers', to: '/admin/customers', desc: 'Browse all registered customer accounts.' },
          ].map(item => (
            <Link key={item.label} to={item.to} className="bg-rokit-tan p-6 hover:bg-rokit-orange/10 transition-colors group">
              <h3 className="font-black text-rokit-dark group-hover:text-rokit-orange text-lg mb-1 transition-colors">{item.label}</h3>
              <p className="text-rokit-body text-sm">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
