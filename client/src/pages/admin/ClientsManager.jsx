import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Trash2, Plus, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

function AddClientForm({ onCreated }) {
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [displayOrder, setDisplayOrder] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !file) {
      toast.error('Brand name and logo image are required.');
      return;
    }
    setUploading(true);
    try {
      const data = new FormData();
      data.append('name', name.trim());
      data.append('logo', file);
      if (website.trim()) data.append('website', website.trim());
      if (displayOrder) data.append('displayOrder', displayOrder);
      const res = await api.post('/admin/clients', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onCreated(res.data);
      setName('');
      setWebsite('');
      setDisplayOrder('');
      setFile(null);
      setPreview(null);
      toast.success('Client logo added!');
    } catch {
      toast.error('Failed to add client.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-sm mb-8 space-y-4">
      <h2 className="font-black text-rokit-dark text-xl flex items-center gap-2">
        <Plus size={20} /> Add Client Logo
      </h2>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-rokit-dark mb-1">Brand Name *</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="form-input"
            placeholder="e.g. Sterling Bank"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-rokit-dark mb-1">Website <span className="font-normal text-gray-400">(optional)</span></label>
          <input
            value={website}
            onChange={e => setWebsite(e.target.value)}
            className="form-input"
            placeholder="https://…"
            type="url"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-rokit-dark mb-1">Display Order <span className="font-normal text-gray-400">(optional)</span></label>
          <input
            value={displayOrder}
            onChange={e => setDisplayOrder(e.target.value)}
            className="form-input"
            placeholder="0"
            type="number"
            min="0"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-rokit-dark mb-1">
          Logo Image * <span className="font-normal text-gray-400">(PNG/SVG with transparent bg works best)</span>
        </label>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          onChange={handleFile}
          required
        />
        {preview && (
          <div className="mt-3 flex items-center gap-3">
            <div className="w-24 h-12 bg-gray-100 rounded flex items-center justify-center p-2">
              <img src={preview} alt="preview" className="max-w-full max-h-full object-contain" />
            </div>
            <span className="text-xs text-gray-500">{file?.name}</span>
          </div>
        )}
      </div>

      <button type="submit" disabled={uploading} className="btn-primary">
        {uploading ? 'Uploading…' : 'Add Client'}
      </button>
    </form>
  );
}

export default function ClientsManager() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <div className="p-6">
        <h1 className="text-3xl font-black text-rokit-dark mb-1">Client Logos</h1>
        <p className="text-rokit-body mb-8">
          These logos appear in the scrolling marquee on the homepage. Upload brand logos of companies you have worked with.
        </p>

        <AddClientForm onCreated={client => setClients(prev => [client, ...prev])} />

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
                <button
                  onClick={() => handleDelete(client._id)}
                  className="text-red-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 text-xs flex items-center gap-1"
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
