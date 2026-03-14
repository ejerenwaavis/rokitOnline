import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Trash2, Plus, ExternalLink, X, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const emptyRow = () => ({ id: Date.now() + Math.random(), name: '', website: '', file: null, preview: null });

function AddClientsForm({ onCreated }) {
  const [rows, setRows] = useState([emptyRow()]);
  const [uploading, setUploading] = useState(false);

  const addRow = () => setRows(prev => [...prev, emptyRow()]);

  const removeRow = (id) => setRows(prev => prev.length > 1 ? prev.filter(r => r.id !== id) : prev);

  const updateRow = (id, key, value) =>
    setRows(prev => prev.map(r => r.id === id ? { ...r, [key]: value } : r));

  const handleFile = (id, file) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setRows(prev => prev.map(r => r.id === id ? { ...r, file, preview } : r));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valid = rows.filter(r => r.name.trim() && r.file);
    if (valid.length === 0) {
      toast.error('Add at least one brand name with a logo.');
      return;
    }
    setUploading(true);
    const results = [];
    for (const row of valid) {
      try {
        const data = new FormData();
        data.append('name', row.name.trim());
        data.append('logo', row.file);
        if (row.website.trim()) data.append('website', row.website.trim());
        const res = await api.post('/admin/clients', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        results.push(res.data);
      } catch {
        toast.error(`Failed to upload logo for "${row.name}"`);
      }
    }
    setUploading(false);
    if (results.length > 0) {
      results.forEach(c => onCreated(c));
      toast.success(`${results.length} client logo${results.length > 1 ? 's' : ''} added!`);
      setRows([emptyRow()]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-sm mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-black text-rokit-dark text-xl flex items-center gap-2">
          <Plus size={20} /> Add Client Logos
        </h2>
        <button
          type="button"
          onClick={addRow}
          className="flex items-center gap-1.5 text-sm font-semibold text-rokit-orange border border-rokit-orange/30 hover:bg-rokit-orange/5 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus size={15} /> Add Row
        </button>
      </div>

      <div className="space-y-4">
        {rows.map((row, idx) => (
          <div key={row.id} className="flex gap-3 items-start bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex-shrink-0 w-6 h-6 bg-rokit-orange/10 rounded-full flex items-center justify-center text-xs font-bold text-rokit-orange mt-1">
              {idx + 1}
            </div>

            {/* Logo upload */}
            <div className="shrink-0">
              <label className="block w-20 h-16 bg-white border-2 border-dashed border-gray-200 hover:border-rokit-orange/50 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden transition-colors">
                {row.preview ? (
                  <img src={row.preview} alt="" className="w-full h-full object-contain p-1" />
                ) : (
                  <span className="text-gray-400 text-xs text-center leading-tight px-1">Logo<br/>PNG/SVG</span>
                )}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="hidden"
                  onChange={e => handleFile(row.id, e.target.files[0])}
                />
              </label>
            </div>

            <div className="flex-1 grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-rokit-dark mb-1">Brand Name *</label>
                <input
                  value={row.name}
                  onChange={e => updateRow(row.id, 'name', e.target.value)}
                  className="form-input"
                  placeholder="e.g. Sterling Bank"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-rokit-dark mb-1">Website <span className="font-normal text-gray-400">(optional)</span></label>
                <input
                  value={row.website}
                  onChange={e => updateRow(row.id, 'website', e.target.value)}
                  className="form-input"
                  placeholder="https://…"
                  type="url"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => removeRow(row.id)}
              className="shrink-0 mt-1 text-gray-300 hover:text-red-400 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button type="submit" disabled={uploading} className="btn-primary">
          {uploading ? 'Uploading…' : `Upload ${rows.filter(r => r.name && r.file).length || 'All'} Logo${rows.filter(r => r.name && r.file).length !== 1 ? 's' : ''}`}
        </button>
        <button type="button" onClick={addRow} className="btn-outline flex items-center gap-1.5">
          <Plus size={15} /> Another Brand
        </button>
      </div>
    </form>
  );
}

function EditClientModal({ client, onClose, onSaved }) {
  const [name, setName] = useState(client.name);
  const [website, setWebsite] = useState(client.website || '');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(client.logoUrl);
  const [saving, setSaving] = useState(false);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) { toast.error('Brand name is required.'); return; }
    setSaving(true);
    try {
      const data = new FormData();
      data.append('name', name.trim());
      data.append('website', website.trim());
      if (file) data.append('logo', file);
      const res = await api.put(`/admin/clients/${client._id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onSaved(res.data);
      toast.success('Client updated!');
      onClose();
    } catch {
      toast.error('Failed to update client.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <h3 className="font-black text-rokit-dark text-lg">Edit Client</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Logo */}
          <div>
            <label className="block text-xs font-semibold text-rokit-dark mb-2">Logo</label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-16 bg-gray-50 rounded-lg border flex items-center justify-center p-2 overflow-hidden">
                <img src={preview} alt="" className="max-w-full max-h-full object-contain" />
              </div>
              <label className="cursor-pointer text-sm text-rokit-orange font-semibold hover:underline">
                Change logo
                <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="hidden" onChange={handleFile} />
              </label>
            </div>
          </div>
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-rokit-dark mb-1">Brand Name *</label>
            <input value={name} onChange={e => setName(e.target.value)} className="form-input" required />
          </div>
          {/* Website */}
          <div>
            <label className="block text-xs font-semibold text-rokit-dark mb-1">Website <span className="font-normal text-gray-400">(optional)</span></label>
            <input value={website} onChange={e => setWebsite(e.target.value)} className="form-input" type="url" placeholder="https://…" />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ClientsManager() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingClient, setEditingClient] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    api.get('/admin/clients', { signal: controller.signal })
      .then(res => { setClients(Array.isArray(res.data) ? res.data : []); setLoading(false); })
      .catch(() => { setLoading(false); });
    return () => controller.abort();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this client logo from the marquee?')) return;
    try {
      await api.delete(`/admin/clients/${id}`);
      setClients(prev => prev.filter(c => c._id !== id));
      toast.success('Client removed.');
    } catch {
      toast.error('Failed to delete client.');
    }
  };

  return (
    <>
      <Helmet><title>Client Logos – Rokit Media Admin</title></Helmet>
      {editingClient && (
        <EditClientModal
          client={editingClient}
          onClose={() => setEditingClient(null)}
          onSaved={(updated) => {
            setClients(prev => prev.map(c => c._id === updated._id ? updated : c));
            setEditingClient(null);
          }}
        />
      )}
      <div className="p-6">
        <h1 className="text-3xl font-black text-rokit-dark mb-1">Client Logos</h1>
        <p className="text-rokit-body mb-8">
          These logos appear in the scrolling marquee on the homepage. Upload brand logos of companies you have worked with.
        </p>

        <AddClientsForm onCreated={client => setClients(prev => [client, ...prev])} />

        {loading ? (
          <LoadingSpinner center />
        ) : clients.length === 0 ? (
          <div className="bg-white p-10 text-center shadow-sm">
            <p className="text-rokit-body">No client logos yet. Add your first one above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {clients.map(client => (
              <div
                key={client._id}
                className="bg-white shadow-sm border border-gray-100 rounded-xl p-4 flex flex-col items-center gap-3 group"
              >
                <div className="w-full h-16 flex items-center justify-center bg-gray-50 rounded-lg p-2">
                  <img
                    src={client.logoUrl}
                    alt={client.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <p className="text-xs font-semibold text-rokit-dark text-center leading-tight">{client.name}</p>
                {client.website && (
                  <a
                    href={client.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-rokit-orange flex items-center gap-1 hover:underline"
                  >
                    <ExternalLink size={11} /> Website
                  </a>
                )}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingClient(client)}
                    className="text-rokit-orange hover:text-orange-600 transition-colors text-xs flex items-center gap-1"
                  >
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(client._id)}
                    className="text-red-400 hover:text-red-600 transition-colors text-xs flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
