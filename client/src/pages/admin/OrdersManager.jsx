import { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  X,
  Send,
  FileText,
  ExternalLink,
  Trash2,
  Search,
  ShoppingBag,
  Paintbrush,
  MessageSquare,
  CheckCircle2,
  Bot,
} from 'lucide-react';
import api from '../../utils/api';
import StatusBadge from '../../components/ui/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const ORDER_STATUSES = ['pending', 'confirmed', 'in-progress', 'review', 'completed', 'cancelled'];
const QUOTE_STATUSES = ['pending', 'reviewed', 'quoted', 'accepted', 'declined'];
const DESIGN_STATUSES = ['submitted', 'in-progress', 'revision', 'completed'];

function isSuspectedBotRecord(item) {
  if (!item) return false;
  const name = String(item.name || item.customer?.name || '').trim();
  const email = String(item.email || item.customer?.email || '').trim().toLowerCase();
  const subject = String(item.subject || '').trim();
  const body = String(item.projectDescription || item.message || item.description || item.brief || '').trim();

  if (email.endsWith('@gmail.com') || email.endsWith('@googlemail.com')) {
    const localPart = email.split('@')[0] || '';
    if ((localPart.match(/\./g) || []).length >= 3) return true;
  }
  if (/[bcdfghjklmnpqrstvwxz]{4,}/i.test(name)) return true;
  for (const w of name.split(/\s+/).filter(Boolean)) {
    const letters = w.replace(/[^a-z]/gi, '');
    if (letters.length >= 4 && !/[aeiouy]/i.test(letters)) return true;
  }
  if (/^[A-Za-z]{12,}$/.test(subject) || /^[A-Za-z]{12,}$/.test(body)) return true;
  if (body && /^\d{6,15}$/.test(body)) return true;
  return false;
}

/* ─── Order Detail Modal ──────────────────────────────────────────────── */
function OrderDetailModal({ order, onClose }) {
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);
  const overlayRef = useRef();

  const handleBackdrop = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleForward = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error('Enter a recipient email.');
    setSending(true);
    try {
      await api.post(`/admin/orders/${order._id}/forward`, {
        email: email.trim(),
        note: note.trim(),
      });
      toast.success(`Order details sent to ${email.trim()}`);
      setEmail('');
      setNote('');
    } catch {
      toast.error('Failed to send. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const fmt = (val) => (val != null && val !== '' ? val : '—');
  const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
  const fmtMoney = (v) => (v > 0 ? `₦${Number(v).toLocaleString()}` : '—');

  return (
    <div
      ref={overlayRef}
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto py-8 px-4 text-rokit-dark"
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
            <button onClick={onClose} className="p-1 hover:text-rokit-orange transition-colors">
              <X size={20} />
            </button>
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
              <DetailRow label="Quantity" value={fmt(order.quantity || order.specs?.quantity)} />
              <DetailRow label="Dimensions" value={fmt(order.dimensions || (order.specs?.width ? `${order.specs.width}x${order.specs.height}` : ''))} />
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
                        href={f.url || f}
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

          {/* Forward to Email */}
          <hr className="border-gray-100" />
          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-rokit-body mb-3">
              Forward to Teammate / External Email
            </h3>
            <form onSubmit={handleForward} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Recipient email address"
                required
                className="form-input"
              />
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional note to include in the email…"
                rows={2}
                className="form-input resize-none"
              />
              <button type="submit" disabled={sending} className="btn-primary w-full justify-center">
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
function OrderRow({ order, selected, onToggleSelect, onUpdate, onDelete, onView }) {
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
    if (
      !window.confirm(
        `Accept customer's counter-offer of ₦${Number(order.customerBudget).toLocaleString()}?`
      )
    )
      return;
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
    <tr
      className={`border-t border-gray-100 transition-colors ${
        selected ? 'bg-amber-50/70' : 'hover:bg-gray-50'
      }`}
    >
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggleSelect(order._id)}
          className="size-4 accent-rokit-orange cursor-pointer"
        />
      </td>
      <td className="px-4 py-3 font-mono text-xs text-gray-500">
        <button
          onClick={() => onView(order)}
          className="text-rokit-orange hover:underline font-semibold"
        >
          #{order._id.slice(-6).toUpperCase()}
        </button>
      </td>
      <td className="px-4 py-3 text-sm font-semibold text-rokit-dark">
        <div>{order.customer?.name || 'Guest'}</div>
        {order.customer?.email && (
          <div className="text-xs text-gray-500 font-normal">{order.customer.email}</div>
        )}
      </td>
      <td className="px-4 py-3 text-sm capitalize text-gray-800">
        {order.serviceType?.replace(/-/g, ' ')}
      </td>
      <td className="px-4 py-3 text-sm">
        {order.priceStatus === 'accepted' || order.totalAmount > 0 ? (
          <span className="font-semibold text-rokit-dark">
            ₦{Number(order.totalAmount).toLocaleString()}
          </span>
        ) : order.quotedPrice > 0 ? (
          <span className="text-rokit-orange font-semibold">
            ₦{Number(order.quotedPrice).toLocaleString()}{' '}
            <span className="text-xs text-gray-400">(quoted)</span>
          </span>
        ) : order.customerBudget > 0 ? (
          <span className="text-blue-600 font-semibold">
            ₦{Number(order.customerBudget).toLocaleString()}{' '}
            <span className="text-xs text-gray-400">(budget)</span>
          </span>
        ) : (
          <span className="text-gray-400">Not set</span>
        )}
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={order.status} />
      </td>
      <td className="px-4 py-3">
        <select
          disabled={updating}
          value={order.status}
          onChange={(e) => handleStatus(e.target.value)}
          className="text-xs bg-white text-rokit-dark border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-rokit-orange"
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </td>
      <td className="px-4 py-3">
        {order.priceStatus === 'accepted' ? (
          <span className="text-xs text-green-600 font-semibold">
            ✓ Accepted ₦{Number(order.totalAmount).toLocaleString()}
          </span>
        ) : order.priceStatus === 'negotiating' ? (
          <div className="space-y-1">
            <div className="text-xs text-blue-600 font-semibold">
              Counter: ₦{Number(order.customerBudget).toLocaleString()}
            </div>
            <div className="flex gap-1 mt-1">
              <input
                type="number"
                value={quoteInput || order.customerBudget || ''}
                onChange={(e) => setQuoteInput(e.target.value)}
                placeholder="New ₦ offer"
                className="w-24 text-xs bg-white text-rokit-dark border border-blue-300 px-2 py-1 focus:outline-none focus:border-rokit-orange"
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
              <button
                type="submit"
                disabled={quoting}
                className="text-xs bg-rokit-orange text-white px-2 py-1 hover:bg-rokit-orange-dark w-full"
              >
                {quoting ? '…' : 'Re-quote ₦' + (quoteInput || order.customerBudget || '')}
              </button>
            </form>
          </div>
        ) : order.priceStatus === 'quoted' ? (
          <span className="text-xs text-rokit-orange font-semibold">
            Quoted ₦{Number(order.quotedPrice).toLocaleString()}
          </span>
        ) : (
          <form onSubmit={handleQuotePrice} className="flex gap-1">
            <input
              type="number"
              value={quoteInput}
              onChange={(e) => setQuoteInput(e.target.value)}
              placeholder="₦ amount"
              className="w-24 text-xs bg-white text-rokit-dark border border-gray-300 px-2 py-1 focus:outline-none focus:border-rokit-orange"
            />
            <button
              type="submit"
              disabled={quoting}
              className="text-xs bg-rokit-orange text-white px-2 py-1 hover:bg-rokit-orange-dark"
            >
              {quoting ? '…' : 'Send'}
            </button>
          </form>
        )}
      </td>
      <td className="px-4 py-3 text-xs text-gray-500">
        {new Date(order.createdAt).toLocaleDateString('en-NG')}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(order)}
            className="text-xs text-rokit-orange border border-rokit-orange px-2 py-1 rounded hover:bg-rokit-orange hover:text-white transition-colors"
          >
            View
          </button>
          <button
            type="button"
            onClick={() => onDelete(order._id)}
            title="Delete order"
            className="p-1.5 text-red-500 hover:text-white hover:bg-red-600 border border-red-200 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function OrdersManager() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'orders';
  const [activeTab, setActiveTab] = useState(
    ['orders', 'quotations', 'designs', 'messages'].includes(initialTab) ? initialTab : 'orders'
  );

  const [orders, setOrders] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkStatus, setBulkStatus] = useState('');
  const [bulkBusy, setBulkBusy] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['orders', 'quotations', 'designs', 'messages'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      api.get('/admin/orders', { signal: controller.signal }).catch(() => ({ data: [] })),
      api.get('/admin/quotations', { signal: controller.signal }).catch(() => ({ data: [] })),
      api.get('/admin/designs', { signal: controller.signal }).catch(() => ({ data: [] })),
      api.get('/admin/messages', { signal: controller.signal }).catch(() => ({ data: [] })),
    ]).then(([oRes, qRes, dRes, mRes]) => {
      setOrders(Array.isArray(oRes.data) ? oRes.data : []);
      setQuotations(Array.isArray(qRes.data) ? qRes.data : []);
      setDesigns(Array.isArray(dRes.data) ? dRes.data : []);
      setMessages(Array.isArray(mRes.data) ? mRes.data : []);
      setLoading(false);
    });
    return () => controller.abort();
  }, []);

  const switchTab = (tab) => {
    setActiveTab(tab);
    setSelectedIds([]);
    setFilter('');
    setSearch('');
    setBulkStatus('');
    setSearchParams({ tab });
  };

  // Filtered lists for active tab
  const currentList = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (activeTab === 'orders') {
      return orders.filter((o) => {
        if (filter && o.status !== filter) return false;
        if (!q) return true;
        return (
          o.customer?.name?.toLowerCase().includes(q) ||
          o.customer?.email?.toLowerCase().includes(q) ||
          o.serviceType?.toLowerCase().includes(q) ||
          o.description?.toLowerCase().includes(q) ||
          o._id?.toLowerCase().includes(q)
        );
      });
    }
    if (activeTab === 'quotations') {
      return quotations.filter((item) => {
        if (filter && item.status !== filter) return false;
        if (!q) return true;
        return (
          item.name?.toLowerCase().includes(q) ||
          item.email?.toLowerCase().includes(q) ||
          item.phone?.toLowerCase().includes(q) ||
          item.serviceType?.toLowerCase().includes(q) ||
          item.projectDescription?.toLowerCase().includes(q)
        );
      });
    }
    if (activeTab === 'designs') {
      return designs.filter((item) => {
        if (filter && item.status !== filter) return false;
        if (!q) return true;
        return (
          item.customer?.name?.toLowerCase().includes(q) ||
          item.customer?.email?.toLowerCase().includes(q) ||
          item.designType?.toLowerCase().includes(q) ||
          item.brief?.toLowerCase().includes(q)
        );
      });
    }
    if (activeTab === 'messages') {
      return messages.filter((item) => {
        if (filter === 'unread' && item.read) return false;
        if (filter === 'read' && !item.read) return false;
        if (!q) return true;
        return (
          item.name?.toLowerCase().includes(q) ||
          item.email?.toLowerCase().includes(q) ||
          item.subject?.toLowerCase().includes(q) ||
          item.message?.toLowerCase().includes(q)
        );
      });
    }
    return [];
  }, [activeTab, orders, quotations, designs, messages, filter, search]);

  const currentIds = useMemo(() => currentList.map((item) => item._id), [currentList]);
  const botIdsInTab = useMemo(
    () => currentList.filter((item) => isSuspectedBotRecord(item)).map((item) => item._id),
    [currentList]
  );
  const botIdSet = useMemo(() => new Set(botIdsInTab), [botIdsInTab]);
  const allSelected = currentIds.length > 0 && currentIds.every((id) => selectedIds.includes(id));

  const selectAllSuspectedBots = () => {
    if (botIdsInTab.length === 0) {
      toast('No suspected bot records in this tab.');
      return;
    }
    setSelectedIds(botIdsInTab);
    toast.success(`Selected ${botIdsInTab.length} suspected bot record(s).`);
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !currentIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...currentIds])));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Bulk delete for active tab
  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;
    if (
      !window.confirm(
        `Are you sure you want to permanently delete ${selectedIds.length} selected ${activeTab} item(s)?`
      )
    )
      return;

    setBulkBusy(true);
    try {
      const endpoint = `/admin/${activeTab}/bulk-delete`;
      const res = await api.post(endpoint, { ids: selectedIds });
      const deletedSet = new Set(selectedIds);
      if (activeTab === 'orders') setOrders((prev) => prev.filter((i) => !deletedSet.has(i._id)));
      if (activeTab === 'quotations') setQuotations((prev) => prev.filter((i) => !deletedSet.has(i._id)));
      if (activeTab === 'designs') setDesigns((prev) => prev.filter((i) => !deletedSet.has(i._id)));
      if (activeTab === 'messages') setMessages((prev) => prev.filter((i) => !deletedSet.has(i._id)));
      setSelectedIds([]);
      toast.success(res.data?.message || `Deleted ${selectedIds.length} item(s).`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Bulk delete failed.');
    } finally {
      setBulkBusy(false);
    }
  };

  // Bulk status update
  const handleBulkStatusApply = async () => {
    if (!selectedIds.length || !bulkStatus) return;
    setBulkBusy(true);
    try {
      if (activeTab === 'messages') {
        const readVal = bulkStatus === 'read';
        await api.post('/admin/messages/bulk-read', { ids: selectedIds, read: readVal });
        const setIds = new Set(selectedIds);
        setMessages((prev) => prev.map((m) => (setIds.has(m._id) ? { ...m, read: readVal } : m)));
        toast.success(`Updated ${selectedIds.length} message(s).`);
      } else {
        await api.post(`/admin/${activeTab}/bulk-status`, {
          ids: selectedIds,
          status: bulkStatus,
        });
        const setIds = new Set(selectedIds);
        if (activeTab === 'orders')
          setOrders((prev) => prev.map((o) => (setIds.has(o._id) ? { ...o, status: bulkStatus } : o)));
        if (activeTab === 'quotations')
          setQuotations((prev) => prev.map((q) => (setIds.has(q._id) ? { ...q, status: bulkStatus } : q)));
        if (activeTab === 'designs')
          setDesigns((prev) => prev.map((d) => (setIds.has(d._id) ? { ...d, status: bulkStatus } : d)));
        toast.success(`Updated ${selectedIds.length} item(s) to "${bulkStatus}".`);
      }
      setSelectedIds([]);
      setBulkStatus('');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Bulk status update failed.');
    } finally {
      setBulkBusy(false);
    }
  };

  // Single item deletes
  const handleSingleDelete = async (type, id) => {
    if (!window.confirm('Delete this record permanently?')) return;
    try {
      await api.delete(`/admin/${type}/${id}`);
      if (type === 'orders') setOrders((prev) => prev.filter((i) => i._id !== id));
      if (type === 'quotations') setQuotations((prev) => prev.filter((i) => i._id !== id));
      if (type === 'designs') setDesigns((prev) => prev.filter((i) => i._id !== id));
      if (type === 'messages') setMessages((prev) => prev.filter((i) => i._id !== id));
      setSelectedIds((prev) => prev.filter((item) => item !== id));
      toast.success('Deleted successfully.');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete.');
    }
  };

  const handleUpdateOrder = (id, changes) => {
    setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, ...changes } : o)));
  };

  const handleQuotationPatch = async (id, changes) => {
    try {
      const res = await api.patch(`/admin/quotations/${id}`, changes);
      setQuotations((prev) => prev.map((q) => (q._id === id ? res.data : q)));
      toast.success('Quotation updated.');
    } catch {
      toast.error('Failed to update quotation.');
    }
  };

  const handleDesignPatch = async (id, changes) => {
    try {
      const res = await api.patch(`/admin/designs/${id}`, changes);
      setDesigns((prev) => prev.map((d) => (d._id === id ? res.data : d)));
      toast.success('Design brief updated.');
    } catch {
      toast.error('Failed to update design brief.');
    }
  };

  const handleMarkMessageRead = async (id) => {
    try {
      await api.patch(`/admin/messages/${id}/read`);
      setMessages((prev) => prev.map((m) => (m._id === id ? { ...m, read: true } : m)));
      toast.success('Marked as read.');
    } catch {
      toast.error('Failed to update message.');
    }
  };

  const statusOptions =
    activeTab === 'orders'
      ? ORDER_STATUSES
      : activeTab === 'quotations'
      ? QUOTE_STATUSES
      : activeTab === 'designs'
      ? DESIGN_STATUSES
      : ['unread', 'read'];

  return (
    <>
      <Helmet>
        <title>Orders & Enquiries Manager – Rokit Media Admin</title>
      </Helmet>
      <div className="p-6 text-rokit-dark">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-black text-rokit-dark">Orders & Enquiries Manager</h1>
            <p className="text-sm text-rokit-body mt-1">
              Manage job orders, project enquiries/quotations, design briefs, and contact messages with bulk actions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {botIdsInTab.length > 0 && (
              <button
                type="button"
                onClick={selectAllSuspectedBots}
                className="inline-flex items-center gap-2 bg-red-50 border border-red-300 text-red-700 hover:bg-red-100 text-xs font-bold px-3.5 py-2 transition-colors"
              >
                <Bot size={15} />
                Select Suspected Bots ({botIdsInTab.length})
              </button>
            )}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search records…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white border border-gray-300 text-rokit-dark text-sm focus:outline-none focus:border-rokit-orange w-60"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm bg-white text-rokit-dark border border-gray-300 px-3 py-2 focus:outline-none focus:border-rokit-orange"
            >
              <option value="">All Statuses</option>
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 mb-5">
          {[
            { id: 'orders', label: 'Job Orders', count: orders.length, icon: ShoppingBag },
            { id: 'quotations', label: 'Quotations / Enquiries', count: quotations.length, icon: FileText },
            { id: 'designs', label: 'Design Briefs', count: designs.length, icon: Paintbrush },
            { id: 'messages', label: 'Contact Messages', count: messages.length, icon: MessageSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => switchTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
                  active
                    ? 'border-rokit-orange text-rokit-orange bg-white'
                    : 'border-transparent text-gray-600 hover:text-rokit-dark hover:bg-gray-50'
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] ${
                    active ? 'bg-rokit-orange text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bulk Action Bar */}
        {selectedIds.length > 0 && (
          <div className="mb-4 bg-rokit-dark text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center bg-rokit-orange text-white text-xs font-black px-2.5 py-1">
                {selectedIds.length} SELECTED
              </span>
              <span className="text-xs text-gray-300 capitalize">
                Bulk actions for selected {activeTab}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value)}
                className="text-xs bg-white text-rokit-dark border border-gray-300 px-2.5 py-1.5"
              >
                <option value="">Set status…</option>
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={!bulkStatus || bulkBusy}
                onClick={handleBulkStatusApply}
                className="inline-flex items-center gap-1 bg-rokit-orange hover:bg-rokit-orange-dark text-white text-xs font-bold px-3 py-1.5 transition-colors disabled:opacity-40"
              >
                <CheckCircle2 size={13} /> Apply Status
              </button>
              <button
                type="button"
                disabled={bulkBusy}
                onClick={handleBulkDelete}
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
        ) : activeTab === 'orders' ? (
          /* ─── JOB ORDERS TABLE ─── */
          <div className="overflow-x-auto bg-white shadow-sm border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-rokit-dark text-white text-left text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="size-4 accent-rokit-orange cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Update Status</th>
                  <th className="px-4 py-3">Quote Price</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentList.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-10 text-center text-rokit-body">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  currentList.map((order) => (
                    <OrderRow
                      key={order._id}
                      order={order}
                      selected={selectedIds.includes(order._id)}
                      onToggleSelect={toggleSelectOne}
                      onUpdate={handleUpdateOrder}
                      onDelete={(id) => handleSingleDelete('orders', id)}
                      onView={setSelectedOrder}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : activeTab === 'quotations' ? (
          /* ─── QUOTATIONS / PROJECT ENQUIRIES TABLE ─── */
          <div className="overflow-x-auto bg-white shadow-sm border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-rokit-dark text-white text-left text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="size-4 accent-rokit-orange cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Service Type</th>
                  <th className="px-4 py-3">Brief / Description</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentList.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-rokit-body">
                      No quotations or project enquiries found.
                    </td>
                  </tr>
                ) : (
                  currentList.map((q) => {
                    const isSelected = selectedIds.includes(q._id);
                    return (
                      <tr
                        key={q._id}
                        className={`border-t border-gray-100 ${
                          isSelected ? 'bg-amber-50/70' : 'hover:bg-gray-50'
                        }`}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectOne(q._id)}
                            className="size-4 accent-rokit-orange cursor-pointer"
                          />
                        </td>
                        <td className="px-4 py-3 font-semibold text-rokit-dark">
                          <div className="flex items-center gap-2">
                            <span>{q.name || '—'}</span>
                            {botIdSet.has(q._id) && (
                              <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded">
                                <Bot size={11} /> Bot
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-700">
                          <div className="font-mono">{q.email}</div>
                          <div className="text-gray-500">{q.phone || '—'}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-800 capitalize">{q.serviceType}</td>
                        <td className="px-4 py-3 max-w-[220px]">
                          <p className="text-xs text-gray-700 line-clamp-3 whitespace-pre-line break-words">
                            {q.projectDescription}
                          </p>
                          {q.files?.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-2">
                              {q.files.map((f, idx) => (
                                <a
                                  key={idx}
                                  href={f.url || f}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] text-rokit-orange hover:underline"
                                >
                                  <FileText size={12} /> Attachment {idx + 1}
                                </a>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={q.status || 'pending'}
                            onChange={(e) => handleQuotationPatch(q._id, { status: e.target.value })}
                            className="text-xs bg-white text-rokit-dark border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-rokit-orange"
                          >
                            {QUOTE_STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">
                          {q.createdAt ? new Date(q.createdAt).toLocaleDateString('en-NG') : '—'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleSingleDelete('quotations', q._id)}
                            title="Delete quotation"
                            className="inline-flex items-center justify-center p-1.5 text-red-500 hover:text-white hover:bg-red-600 border border-red-200 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : activeTab === 'designs' ? (
          /* ─── DESIGN BRIEFS TABLE ─── */
          <div className="overflow-x-auto bg-white shadow-sm border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-rokit-dark text-white text-left text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="size-4 accent-rokit-orange cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Design Type</th>
                  <th className="px-4 py-3">Brief</th>
                  <th className="px-4 py-3">Deadline</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentList.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-rokit-body">
                      No design requests found.
                    </td>
                  </tr>
                ) : (
                  currentList.map((d) => {
                    const isSelected = selectedIds.includes(d._id);
                    return (
                      <tr
                        key={d._id}
                        className={`border-t border-gray-100 ${
                          isSelected ? 'bg-amber-50/70' : 'hover:bg-gray-50'
                        }`}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectOne(d._id)}
                            className="size-4 accent-rokit-orange cursor-pointer"
                          />
                        </td>
                        <td className="px-4 py-3 font-semibold text-rokit-dark">
                          <div>{d.customer?.name || 'Customer'}</div>
                          <div className="text-xs text-gray-500 font-normal">{d.customer?.email || ''}</div>
                        </td>
                        <td className="px-4 py-3 capitalize text-gray-800">
                          {d.designType?.replace(/-/g, ' ')}
                        </td>
                        <td className="px-4 py-3 max-w-xs">
                          <p className="text-xs text-gray-700 line-clamp-3 whitespace-pre-line">{d.brief}</p>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600">
                          {d.deadline ? new Date(d.deadline).toLocaleDateString('en-NG') : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={d.status || 'submitted'}
                            onChange={(e) => handleDesignPatch(d._id, { status: e.target.value })}
                            className="text-xs bg-white text-rokit-dark border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-rokit-orange"
                          >
                            {DESIGN_STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">
                          {d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-NG') : '—'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleSingleDelete('designs', d._id)}
                            title="Delete design request"
                            className="inline-flex items-center justify-center p-1.5 text-red-500 hover:text-white hover:bg-red-600 border border-red-200 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* ─── CONTACT MESSAGES TABLE ─── */
          <div className="overflow-x-auto bg-white shadow-sm border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-rokit-dark text-white text-left text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="size-4 accent-rokit-orange cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3">Sender</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Message</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-rokit-body">
                      No contact messages found.
                    </td>
                  </tr>
                ) : (
                  currentList.map((m) => {
                    const isSelected = selectedIds.includes(m._id);
                    return (
                      <tr
                        key={m._id}
                        className={`border-t border-gray-100 ${
                          isSelected ? 'bg-amber-50/70' : !m.read ? 'bg-orange-50/30' : 'hover:bg-gray-50'
                        }`}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectOne(m._id)}
                            className="size-4 accent-rokit-orange cursor-pointer"
                          />
                        </td>
                        <td className="px-4 py-3 font-semibold text-rokit-dark">
                          <div className="flex items-center gap-2">
                            <span>{m.name}</span>
                            {botIdSet.has(m._id) && (
                              <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded">
                                <Bot size={11} /> Bot
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 font-mono font-normal">{m.email}</div>
                          {m.phone && <div className="text-xs text-gray-500 font-normal">{m.phone}</div>}
                        </td>
                        <td className="px-4 py-3 text-gray-800 font-medium">{m.subject || 'General Enquiry'}</td>
                        <td className="px-4 py-3 max-w-sm">
                          <p className="text-xs text-gray-700 whitespace-pre-line">{m.message}</p>
                        </td>
                        <td className="px-4 py-3">
                          {m.read ? (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-semibold">
                              Read
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleMarkMessageRead(m._id)}
                              className="text-xs px-2 py-0.5 rounded-full bg-rokit-orange/15 text-rokit-orange font-bold hover:bg-rokit-orange hover:text-white transition-colors"
                            >
                              Mark Read
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">
                          {m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-NG') : '—'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleSingleDelete('messages', m._id)}
                            title="Delete message"
                            className="inline-flex items-center justify-center p-1.5 text-red-500 hover:text-white hover:bg-red-600 border border-red-200 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
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

      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </>
  );
}
