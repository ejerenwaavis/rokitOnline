import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Search,
  ShieldCheck,
  ShieldOff,
  Trash2,
  Bot,
  Ban,
  CheckCircle2,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

/**
 * Detects suspected botnet accounts from the spam registration wave.
 * Never flags admin accounts.
 */
function isSuspectedBotAccount(user) {
  if (!user || user.role === 'admin') return false;
  const name = String(user.name || '').trim();
  const email = String(user.email || '').trim().toLowerCase();
  const phone = String(user.phone || '').trim();

  // 1. Dotted-Gmail generator pattern (3+ dots before @gmail.com)
  if (email.endsWith('@gmail.com') || email.endsWith('@googlemail.com')) {
    const localPart = email.split('@')[0] || '';
    const dotCount = (localPart.match(/\./g) || []).length;
    if (dotCount >= 3) return true;
  }

  // 2. 5+ consecutive consonants in name (e.g. "Zelotpaw Nklzhbp", "Gaenpac Tzwwswqmd")
  if (/[bcdfghjklmnpqrstvwxz]{5,}/i.test(name)) return true;

  // 3. Word of 4+ letters with zero vowels (e.g. "Xqtf Npqhg", "Jzxypry Gjznrvjd")
  const words = name.split(/\s+/).filter(Boolean);
  for (const w of words) {
    const letters = w.replace(/[^a-z]/gi, '');
    if (letters.length >= 4 && !/[aeiouy]/i.test(letters)) return true;
    if (letters.length >= 6) {
      const vowels = (letters.match(/[aeiouy]/gi) || []).length;
      if (vowels / letters.length < 0.2) return true;
    }
  }

  // 4. 4+ consecutive consonants + dotted email or 10-digit raw phone
  if (/[bcdfghjklmnpqrstvwxz]{4,}/i.test(name)) {
    const localPart = email.split('@')[0] || '';
    const dotCount = (localPart.match(/\./g) || []).length;
    if (dotCount >= 2 || /^\d{10}$/.test(phone)) return true;
  }

  return false;
}

export default function CustomersManager() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); // 'all' | 'customer' | 'admin' | 'bots'
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkBusy, setBulkBusy] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    api
      .get('/admin/customers', { signal: controller.signal })
      .then((res) => {
        setCustomers(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
    return () => controller.abort();
  }, []);

  const botIds = useMemo(
    () => customers.filter((c) => isSuspectedBotAccount(c)).map((c) => c._id),
    [customers]
  );

  const botIdSet = useMemo(() => new Set(botIds), [botIds]);

  const displayed = useMemo(() => {
    return customers.filter((c) => {
      if (roleFilter === 'customer' && c.role !== 'customer') return false;
      if (roleFilter === 'admin' && c.role !== 'admin') return false;
      if (roleFilter === 'bots' && !botIdSet.has(c._id)) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = c.name?.toLowerCase().includes(q);
        const matchEmail = c.email?.toLowerCase().includes(q);
        const matchPhone = c.phone?.toLowerCase().includes(q);
        return matchName || matchEmail || matchPhone;
      }
      return true;
    });
  }, [customers, roleFilter, search, botIdSet]);

  const selectableDisplayedIds = useMemo(
    () => displayed.filter((c) => c.role !== 'admin').map((c) => c._id),
    [displayed]
  );

  const allDisplayedSelected =
    selectableDisplayedIds.length > 0 &&
    selectableDisplayedIds.every((id) => selectedIds.includes(id));

  const toggleSelectAll = () => {
    if (allDisplayedSelected) {
      setSelectedIds((prev) => prev.filter((id) => !selectableDisplayedIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...selectableDisplayedIds])));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllSuspectedBots = () => {
    if (botIds.length === 0) {
      toast('No suspected bot accounts detected.');
      return;
    }
    setSelectedIds(botIds);
    toast.success(`Selected ${botIds.length} suspected bot account(s).`);
  };

  const handleBulkDelete = async (idsToDelete = selectedIds) => {
    if (!idsToDelete.length) return;
    if (
      !window.confirm(
        `Are you sure you want to permanently delete ${idsToDelete.length} selected customer account(s)? Admin accounts are automatically protected.`
      )
    ) {
      return;
    }
    setBulkBusy(true);
    try {
      const res = await api.post('/admin/customers/bulk-delete', { ids: idsToDelete });
      const deletedSet = new Set(idsToDelete);
      setCustomers((prev) => prev.filter((c) => c.role === 'admin' || !deletedSet.has(c._id)));
      setSelectedIds((prev) => prev.filter((id) => !deletedSet.has(id)));
      toast.success(res.data?.message || `Deleted ${idsToDelete.length} account(s).`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Bulk delete failed.');
    } finally {
      setBulkBusy(false);
    }
  };

  const handleBulkStatus = async (status) => {
    if (!selectedIds.length) return;
    setBulkBusy(true);
    try {
      const res = await api.post('/admin/customers/bulk-status', {
        ids: selectedIds,
        status,
      });
      const updatedSet = new Set(selectedIds);
      setCustomers((prev) =>
        prev.map((c) => (c.role !== 'admin' && updatedSet.has(c._id) ? { ...c, status } : c))
      );
      toast.success(res.data?.message || `Updated ${selectedIds.length} account(s) to ${status}.`);
      setSelectedIds([]);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Bulk status update failed.');
    } finally {
      setBulkBusy(false);
    }
  };

  const handleSingleDelete = async (user) => {
    if (user.role === 'admin') {
      toast.error('Cannot delete an admin account directly. Demote first.');
      return;
    }
    if (!window.confirm(`Delete user "${user.name}" (${user.email}) permanently?`)) return;
    try {
      await api.delete(`/admin/customers/${user._id}`);
      setCustomers((prev) => prev.filter((c) => c._id !== user._id));
      setSelectedIds((prev) => prev.filter((id) => id !== user._id));
      toast.success(`Deleted ${user.name}.`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete user.');
    }
  };

  const toggleRole = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    const label = newRole === 'admin' ? 'promote to admin' : 'remove admin access';
    if (!window.confirm(`Are you sure you want to ${label} for this user?`)) return;
    try {
      await api.patch(`/admin/customers/${id}/role`, { role: newRole });
      setCustomers((prev) => prev.map((c) => (c._id === id ? { ...c, role: newRole } : c)));
      toast.success(`User ${newRole === 'admin' ? 'promoted to admin' : 'demoted to customer'}.`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update role.');
    }
  };

  const toggleStatus = async (id, currentStatus = 'active') => {
    const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    try {
      await api.patch(`/admin/customers/${id}/status`, { status: newStatus });
      setCustomers((prev) => prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c)));
      toast.success(`User account ${newStatus}.`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update status.');
    }
  };

  return (
    <>
      <Helmet>
        <title>Customers – Rokit Media Admin</title>
      </Helmet>
      <div className="p-6 text-rokit-dark">
        {/* Header & Search */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-black text-rokit-dark">Customers & Users</h1>
            <p className="text-sm text-rokit-body mt-1">
              Manage customer accounts, roles, and bulk-remove automated bot registrations.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {botIds.length > 0 && (
              <button
                type="button"
                onClick={selectAllSuspectedBots}
                className="inline-flex items-center gap-2 bg-red-50 border border-red-300 text-red-700 hover:bg-red-100 text-xs font-bold px-3.5 py-2 transition-colors"
              >
                <Bot size={15} />
                Select Suspected Bots ({botIds.length})
              </button>
            )}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, phone…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white border border-gray-300 text-rokit-dark text-sm focus:outline-none focus:border-rokit-orange w-64"
              />
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {[
            { id: 'all', label: `All (${customers.length})` },
            {
              id: 'customer',
              label: `Customers (${customers.filter((c) => c.role === 'customer').length})`,
            },
            {
              id: 'admin',
              label: `Admins (${customers.filter((c) => c.role === 'admin').length})`,
            },
            {
              id: 'bots',
              label: `Suspected Bots (${botIds.length})`,
              danger: botIds.length > 0,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider border transition-colors ${
                roleFilter === tab.id
                  ? tab.danger
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-rokit-dark text-white border-rokit-dark'
                  : tab.danger
                  ? 'bg-white text-red-600 border-red-300 hover:bg-red-50'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-rokit-orange'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bulk Action Bar */}
        {selectedIds.length > 0 && (
          <div className="mb-4 bg-rokit-dark text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center bg-rokit-orange text-white text-xs font-black px-2.5 py-1">
                {selectedIds.length} SELECTED
              </span>
              <span className="text-xs text-gray-300">
                Bulk actions apply to selected customer accounts (admins are protected).
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={bulkBusy}
                onClick={() => handleBulkStatus('suspended')}
                className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-1.5 transition-colors disabled:opacity-50"
              >
                <Ban size={13} /> Suspend Selected
              </button>
              <button
                type="button"
                disabled={bulkBusy}
                onClick={() => handleBulkStatus('active')}
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 transition-colors disabled:opacity-50"
              >
                <CheckCircle2 size={13} /> Activate Selected
              </button>
              <button
                type="button"
                disabled={bulkBusy}
                onClick={() => handleBulkDelete(selectedIds)}
                className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3.5 py-1.5 transition-colors disabled:opacity-50"
              >
                <Trash2 size={13} /> Delete Selected ({selectedIds.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="inline-flex items-center gap-1 text-xs text-gray-300 hover:text-white px-2 py-1"
              >
                <X size={14} /> Clear
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <LoadingSpinner center />
        ) : (
          <div className="bg-white shadow-sm overflow-x-auto border border-gray-200">
            <table className="w-full text-sm min-w-[760px]">
              <thead className="bg-rokit-dark text-white text-xs uppercase tracking-wide text-left">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={allDisplayedSelected}
                      onChange={toggleSelectAll}
                      aria-label="Select all displayed customer accounts"
                      className="size-4 accent-rokit-orange cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Role / Status</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayed.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-rokit-body">
                      No accounts match your filter.
                    </td>
                  </tr>
                ) : (
                  displayed.map((c, i) => {
                    const isBot = botIdSet.has(c._id);
                    const isSelected = selectedIds.includes(c._id);
                    return (
                      <tr
                        key={c._id}
                        className={`border-t border-gray-100 transition-colors ${
                          isSelected
                            ? 'bg-amber-50/70'
                            : i % 2 === 0
                            ? 'bg-white'
                            : 'bg-gray-50/70'
                        } hover:bg-gray-100/70`}
                      >
                        <td className="px-4 py-3">
                          {c.role === 'admin' ? (
                            <input
                              type="checkbox"
                              disabled
                              title="Admin accounts are protected from bulk deletion"
                              className="size-4 opacity-30 cursor-not-allowed"
                            />
                          ) : (
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectOne(c._id)}
                              aria-label={`Select ${c.name}`}
                              className="size-4 accent-rokit-orange cursor-pointer"
                            />
                          )}
                        </td>
                        <td className="px-4 py-3 font-semibold text-rokit-dark">
                          <div className="flex items-center gap-2">
                            <span>{c.name || 'Unnamed'}</span>
                            {isBot && (
                              <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded">
                                <Bot size={11} /> Bot
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-700 font-mono text-xs">{c.email}</td>
                        <td className="px-4 py-3 text-gray-700">{c.phone || '—'}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`text-xs font-bold capitalize px-2 py-0.5 rounded-full ${
                                c.role === 'admin'
                                  ? 'bg-rokit-orange/15 text-rokit-orange'
                                  : 'bg-gray-200 text-gray-700'
                              }`}
                            >
                              {c.role}
                            </span>
                            {c.status === 'suspended' && (
                              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                                Suspended
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-NG') : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => toggleRole(c._id, c.role)}
                              title={c.role === 'admin' ? 'Remove admin access' : 'Promote to admin'}
                              className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 border transition-colors ${
                                c.role === 'admin'
                                  ? 'border-red-200 text-red-600 hover:bg-red-50'
                                  : 'border-orange-200 text-rokit-orange hover:bg-orange-50'
                              }`}
                            >
                              {c.role === 'admin' ? (
                                <>
                                  <ShieldOff size={13} /> Demote
                                </>
                              ) : (
                                <>
                                  <ShieldCheck size={13} /> Make Admin
                                </>
                              )}
                            </button>
                            {c.role !== 'admin' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => toggleStatus(c._id, c.status)}
                                  title={
                                    c.status === 'suspended' ? 'Activate user' : 'Suspend user'
                                  }
                                  className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                  {c.status === 'suspended' ? 'Activate' : 'Suspend'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSingleDelete(c)}
                                  title="Delete user permanently"
                                  className="inline-flex items-center justify-center p-1.5 text-red-500 hover:text-white hover:bg-red-600 border border-red-200 transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
