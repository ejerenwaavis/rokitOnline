import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Trash2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const CATEGORIES = ['large-format', 'banner-prints', 'branding', 'roll-up-banners', 'web-design', 'graphic-design'];

function UploadForm({ onCreated }) {
  const [form, setForm] = useState({ title: '', category: '', tags: '' });
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category || files.length === 0) {
      toast.error('Title, category, and at least one image are required.');
      return;
    }
    setUploading(true);
    try {
      const data = new FormData();
      data.append('title', form.title);
      data.append('category', form.category);
      if (form.tags) data.append('tags', form.tags);
      files.forEach(f => data.append('images', f));
      const res = await api.post('/portfolio', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      onCreated(res.data);
      setForm({ title: '', category: '', tags: '' });
      setFiles([]);
      toast.success('Portfolio item added!');
    } catch {
      toast.error('Failed to upload.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-sm mb-8 space-y-4">
      <h2 className="font-black text-rokit-dark text-xl flex items-center gap-2"><Plus size={20} /> Add New Item</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-rokit-dark mb-1">Title *</label>
          <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="form-input" placeholder="Project name" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-rokit-dark mb-1">Category *</label>
          <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="form-input">
            <option value="">Select…</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-rokit-dark mb-1">Tags (comma-separated)</label>
          <input value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} className="form-input" placeholder="e.g. outdoor,event" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-rokit-dark mb-1">Images *</label>
        <input type="file" multiple accept="image/*" onChange={e => setFiles(Array.from(e.target.files))} />
      </div>
      <button type="submit" disabled={uploading} className="btn-primary">
        {uploading ? 'Uploading…' : 'Add to Portfolio'}
      </button>
    </form>
  );
}

export default function PortfolioManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    api.get('/portfolio', { signal: controller.signal })
      .then(res => { setItems(res.data || []); setLoading(false); })
      .catch(() => { setLoading(false); });
    return () => controller.abort();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this portfolio item?')) return;
    try {
      await api.delete(`/portfolio/${id}`);
      setItems(prev => prev.filter(i => i._id !== id));
      toast.success('Item deleted.');
    } catch {
      toast.error('Failed to delete.');
    }
  };

  return (
    <>
      <Helmet><title>Portfolio Manager – Rokit Media Admin</title></Helmet>
      <div className="p-6">
        <h1 className="text-3xl font-black text-rokit-dark mb-6">Portfolio Manager</h1>
        <UploadForm onCreated={item => setItems(prev => [item, ...prev])} />

        {loading ? <LoadingSpinner center /> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map(item => (
              <div key={item._id} className="group relative bg-rokit-tan overflow-hidden">
                <img
                  src={item.images?.[0]?.url || item.images?.[0] || '/assets/images/strip-1.jpg'}
                  alt={item.title}
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                  <p className="text-white font-bold text-sm text-center">{item.title}</p>
                  <span className="text-xs text-rokit-orange capitalize">{item.category}</span>
                  <button onClick={() => handleDelete(item._id)} className="mt-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-xs flex items-center gap-1">
                    <Trash2 size={12} /> Delete
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
