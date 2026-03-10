import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search } from 'lucide-react';
import api from '../../utils/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function CustomersManager() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    api.get('/admin/customers', { signal: controller.signal })
      .then(res => { setCustomers(res.data || []); setLoading(false); })
      .catch(() => { setLoading(false); });
    return () => controller.abort();
  }, []);

  const displayed = search.trim()
    ? customers.filter(c =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase())
      )
    : customers;

  return (
    <>
      <Helmet><title>Customers – Rokit Media Admin</title></Helmet>
      <div className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-black text-rokit-dark">Customers</h1>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 text-sm focus:outline-none focus:border-rokit-orange w-64"
            />
          </div>
        </div>

        {loading ? <LoadingSpinner center /> : (
          <div className="bg-white shadow-sm overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead className="bg-rokit-dark text-white text-xs uppercase tracking-wide text-left">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Joined</th>
                </tr>
              </thead>
              <tbody>
                {displayed.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-10 text-center text-rokit-body">No customers found.</td></tr>
                ) : displayed.map((c, i) => (
                  <tr key={c._id} className={`border-t border-gray-100 ${i % 2 === 0 ? '' : 'bg-gray-50'}`}>
                    <td className="px-4 py-3 font-medium">{c.name}</td>
                    <td className="px-4 py-3 text-rokit-body">{c.email}</td>
                    <td className="px-4 py-3 text-rokit-body">{c.phone || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold capitalize px-2 py-0.5 rounded-full ${c.role === 'admin' ? 'bg-rokit-orange/10 text-rokit-orange' : 'bg-gray-100 text-gray-500'}`}>
                        {c.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{new Date(c.createdAt).toLocaleDateString('en-NG')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
