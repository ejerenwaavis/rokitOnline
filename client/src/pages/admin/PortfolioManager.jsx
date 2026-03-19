import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Trash2, Plus, Pencil, X, ImagePlus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const CATEGORIES = ['large-format', 'banner-prints', 'branding', 'roll-up-banners', 'web-design', 'graphic-design'];

/** Uploads a single image to Cloudinary via the step-image endpoint and returns { url, publicId } */
async function uploadStepImage(file) {
  const fd = new FormData();
  fd.append('image', file);
  const res = await api.post('/portfolio/upload-step-image', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data; // { url, publicId }
}

/** Reusable image picker for a milestone or obstacle card */
function StepImagePicker({ image, onUploaded }) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadStepImage(file);
      onUploaded(result);
    } catch {
      toast.error('Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-2">
      {image?.url ? (
        <div className="relative inline-block">
          <img src={image.url} alt="" className="h-20 w-auto object-cover rounded border border-rokit-orange/20" />
          <button type="button" onClick={() => onUploaded({ url: '', publicId: '' })} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] hover:bg-red-600">×</button>
        </div>
      ) : (
        <label className="inline-flex items-center gap-1.5 text-[10px] font-medium text-rokit-orange cursor-pointer hover:underline uppercase tracking-wide">
          {uploading ? <><Loader2 size={11} className="animate-spin" /> Uploading…</> : <><ImagePlus size={12} /> Add Photo</>}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
      )}
    </div>
  );
}

function EditModal({ item, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: item.title || '',
    category: item.category || '',
    client: item.client || '',
    description: item.description || '',
    tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || ''),
    featured: item.featured || false,
    milestones: Array.isArray(item.milestones) ? item.milestones : [],
    obstacles: Array.isArray(item.obstacles) ? item.obstacles : [],
  });
  const [saving, setSaving] = useState(false);

  const addMilestone = () => setForm(p => ({ ...p, milestones: [...p.milestones, { title: '', description: '', order: p.milestones.length }] }));
  const removeMilestone = (i) => setForm(p => ({ ...p, milestones: p.milestones.filter((_, idx) => idx !== i) }));
  const updateMilestone = (i, field, val) => setForm(p => {
    const milestones = [...p.milestones];
    milestones[i] = { ...milestones[i], [field]: val };
    return { ...p, milestones };
  });

  const addObstacle = () => setForm(p => ({ ...p, obstacles: [...p.obstacles, { challenge: '', solution: '' }] }));
  const removeObstacle = (i) => setForm(p => ({ ...p, obstacles: p.obstacles.filter((_, idx) => idx !== i) }));
  const updateObstacle = (i, field, val) => setForm(p => {
    const obstacles = [...p.obstacles];
    obstacles[i] = { ...obstacles[i], [field]: val };
    return { ...p, obstacles };
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      };
      const res = await api.put(`/portfolio/${item._id}`, payload);
      onSaved(res.data);
      toast.success('Portfolio item updated!');
      onClose();
    } catch {
      toast.error('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="font-black text-rokit-dark text-lg flex items-center gap-2"><Pencil size={18} /> Edit Project</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-rokit-dark"><X size={20} /></button>
        </div>

        {/* Cover thumb */}
        {item.images?.[0]?.url && (
          <div className="px-6 pt-4">
            <img src={item.images[0].url} alt={item.title} className="w-full h-32 object-cover rounded" />
            <p className="text-xs text-gray-400 mt-1">To replace images, delete this item and re-upload.</p>
          </div>
        )}

        <form onSubmit={handleSave} className="px-6 py-4 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-rokit-dark mb-1">Title *</label>
              <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="form-input" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-rokit-dark mb-1">Category *</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="form-input" required>
                <option value="">Select…</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-rokit-dark mb-1">Client Name</label>
            <input value={form.client} onChange={e => setForm(p => ({ ...p, client: e.target.value }))} className="form-input" placeholder="e.g. Aramyd Ltd" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-rokit-dark mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="form-input" rows={2} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-rokit-dark mb-1">Tags <span className="font-normal text-gray-400">(comma-separated)</span></label>
            <input value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} className="form-input" placeholder="e.g. outdoor, event" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} className="w-4 h-4 accent-rokit-orange" />
            <span className="text-sm font-semibold text-rokit-dark">Show on home page <span className="font-normal text-gray-400">(Featured)</span></span>
          </label>

          {/* Milestones */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-rokit-dark uppercase tracking-wide">Processes / Milestones</label>
              <button type="button" onClick={addMilestone} className="text-xs text-rokit-orange hover:underline flex items-center gap-1"><Plus size={12} /> Add Step</button>
            </div>
            {form.milestones.length === 0 && <p className="text-xs text-gray-400 italic">No milestones added yet.</p>}
            <div className="space-y-3">
              {form.milestones.map((m, i) => (
                <div key={i} className="bg-gray-50 p-3 relative">
                  <button type="button" onClick={() => removeMilestone(i)} className="absolute top-2 right-2 text-gray-300 hover:text-red-400"><X size={13} /></button>
                  <div className="grid sm:grid-cols-3 gap-2 mb-2">
                    <input
                      value={m.title} onChange={e => updateMilestone(i, 'title', e.target.value)}
                      className="form-input text-xs sm:col-span-2" placeholder={`Step ${i + 1} title`}
                    />
                    <input
                      type="number" value={m.order} onChange={e => updateMilestone(i, 'order', Number(e.target.value))}
                      className="form-input text-xs" placeholder="Order"
                    />
                  </div>
                  <textarea
                    value={m.description} onChange={e => updateMilestone(i, 'description', e.target.value)}
                    className="form-input text-xs" rows={2} placeholder="Describe this milestone…"
                  />
                  <StepImagePicker
                    image={m.image}
                    onUploaded={(img) => updateMilestone(i, 'image', img)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Obstacles */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-rokit-dark uppercase tracking-wide">Obstacles & How We Solved Them</label>
              <button type="button" onClick={addObstacle} className="text-xs text-rokit-orange hover:underline flex items-center gap-1"><Plus size={12} /> Add Obstacle</button>
            </div>
            {form.obstacles.length === 0 && <p className="text-xs text-gray-400 italic">No obstacles added yet.</p>}
            <div className="space-y-3">
              {form.obstacles.map((o, i) => (
                <div key={i} className="bg-gray-50 p-3 relative">
                  <button type="button" onClick={() => removeObstacle(i)} className="absolute top-2 right-2 text-gray-300 hover:text-red-400"><X size={13} /></button>
                  <div className="grid sm:grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10px] font-semibold text-rokit-dark mb-1 uppercase tracking-wide">Challenge</p>
                      <textarea
                        value={o.challenge} onChange={e => updateObstacle(i, 'challenge', e.target.value)}
                        className="form-input text-xs" rows={2} placeholder="What was the obstacle?"
                      />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-rokit-orange mb-1 uppercase tracking-wide">Solution</p>
                      <textarea
                        value={o.solution} onChange={e => updateObstacle(i, 'solution', e.target.value)}
                        className="form-input text-xs" rows={2} placeholder="How did you handle it?"
                      />
                    </div>
                  </div>
                  <StepImagePicker
                    image={o.image}
                    onUploaded={(img) => updateObstacle(i, 'image', img)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving…' : 'Save Changes'}</button>
            <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function UploadForm({ onCreated }) {
  const [form, setForm] = useState({ title: '', category: '', tags: '', description: '', client: '', featured: false, milestones: [], obstacles: [] });
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const addMilestone = () => setForm(p => ({ ...p, milestones: [...p.milestones, { title: '', description: '', order: p.milestones.length }] }));
  const removeMilestone = (i) => setForm(p => ({ ...p, milestones: p.milestones.filter((_, idx) => idx !== i) }));
  const updateMilestone = (i, field, val) => setForm(p => {
    const milestones = [...p.milestones];
    milestones[i] = { ...milestones[i], [field]: val };
    return { ...p, milestones };
  });

  const addObstacle = () => setForm(p => ({ ...p, obstacles: [...p.obstacles, { challenge: '', solution: '' }] }));
  const removeObstacle = (i) => setForm(p => ({ ...p, obstacles: p.obstacles.filter((_, idx) => idx !== i) }));
  const updateObstacle = (i, field, val) => setForm(p => {
    const obstacles = [...p.obstacles];
    obstacles[i] = { ...obstacles[i], [field]: val };
    return { ...p, obstacles };
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category || files.length === 0) {
      toast.error('Title, category, and at least one image/video are required.');
      return;
    }
    setUploading(true);
    try {
      const data = new FormData();
      data.append('title', form.title);
      data.append('category', form.category);
      data.append('featured', form.featured);
      if (form.tags) data.append('tags', form.tags);
      if (form.description) data.append('description', form.description);
      if (form.client) data.append('client', form.client);
      if (form.milestones.length > 0) data.append('milestones', JSON.stringify(form.milestones));
      if (form.obstacles.length > 0) data.append('obstacles', JSON.stringify(form.obstacles));
      files.forEach(f => data.append('images', f));
      const res = await api.post('/portfolio', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      onCreated(res.data);
      setForm({ title: '', category: '', tags: '', description: '', client: '', featured: false, milestones: [], obstacles: [] });
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
          <label className="block text-xs font-semibold text-rokit-dark mb-1">Client Name</label>
          <input value={form.client} onChange={e => setForm(p => ({ ...p, client: e.target.value }))} className="form-input" placeholder="e.g. Aramyd Ltd" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-rokit-dark mb-1">Description</label>
        <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="form-input" rows={2} placeholder="Brief description of the project…" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-rokit-dark mb-1">Tags <span className="font-normal text-gray-400">(comma-separated)</span></label>
          <input value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} className="form-input" placeholder="e.g. outdoor, event, corporate" />
        </div>
        <label className="flex items-center gap-2 cursor-pointer pb-2">
          <input type="checkbox" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} className="w-4 h-4 accent-rokit-orange" />
          <span className="text-sm font-semibold text-rokit-dark">Show on home page <span className="font-normal text-gray-400">(Featured)</span></span>
        </label>
      </div>

      {/* Milestones */}
      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold text-rokit-dark uppercase tracking-wide">Processes / Milestones</label>
          <button type="button" onClick={addMilestone} className="text-xs text-rokit-orange hover:underline flex items-center gap-1"><Plus size={12} /> Add Step</button>
        </div>
        {form.milestones.length === 0 && <p className="text-xs text-gray-400 italic">No milestones — optional.</p>}
        <div className="space-y-3">
          {form.milestones.map((m, i) => (
            <div key={i} className="bg-gray-50 p-3 relative">
              <button type="button" onClick={() => removeMilestone(i)} className="absolute top-2 right-2 text-gray-300 hover:text-red-400"><X size={13} /></button>
              <div className="grid sm:grid-cols-3 gap-2 mb-2">
                <input value={m.title} onChange={e => updateMilestone(i, 'title', e.target.value)} className="form-input text-xs sm:col-span-2" placeholder={`Step ${i + 1} title`} />
                <input type="number" value={m.order} onChange={e => updateMilestone(i, 'order', Number(e.target.value))} className="form-input text-xs" placeholder="Order" />
              </div>
              <textarea value={m.description} onChange={e => updateMilestone(i, 'description', e.target.value)} className="form-input text-xs" rows={2} placeholder="Describe this milestone…" />
              <StepImagePicker
                image={m.image}
                onUploaded={(img) => updateMilestone(i, 'image', img)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Obstacles */}
      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold text-rokit-dark uppercase tracking-wide">Obstacles & How We Solved Them</label>
          <button type="button" onClick={addObstacle} className="text-xs text-rokit-orange hover:underline flex items-center gap-1"><Plus size={12} /> Add Obstacle</button>
        </div>
        {form.obstacles.length === 0 && <p className="text-xs text-gray-400 italic">No obstacles — optional.</p>}
        <div className="space-y-3">
          {form.obstacles.map((o, i) => (
            <div key={i} className="bg-gray-50 p-3 relative">
              <button type="button" onClick={() => removeObstacle(i)} className="absolute top-2 right-2 text-gray-300 hover:text-red-400"><X size={13} /></button>
              <div className="grid sm:grid-cols-2 gap-2">
                <div>
                  <p className="text-[10px] font-semibold text-rokit-dark mb-1 uppercase tracking-wide">Challenge</p>
                  <textarea value={o.challenge} onChange={e => updateObstacle(i, 'challenge', e.target.value)} className="form-input text-xs" rows={2} placeholder="What was the obstacle?" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-rokit-orange mb-1 uppercase tracking-wide">Solution</p>
                  <textarea value={o.solution} onChange={e => updateObstacle(i, 'solution', e.target.value)} className="form-input text-xs" rows={2} placeholder="How did you handle it?" />
                </div>
              </div>
              <StepImagePicker
                image={o.image}
                onUploaded={(img) => updateObstacle(i, 'image', img)}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-rokit-dark mb-1">
          Images / Videos * <span className="font-normal text-gray-400">(first file becomes cover · max 100MB each)</span>
        </label>
        <input type="file" multiple accept="image/*,video/*" onChange={e => setFiles(Array.from(e.target.files))} />
        {files.length > 0 && <p className="text-xs text-gray-500 mt-1">{files.length} file(s) selected</p>}
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
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    api.get('/portfolio', { signal: controller.signal })
      .then(res => { setItems(Array.isArray(res.data) ? res.data : []); setLoading(false); })
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

  const handleSaved = (updated) => {
    setItems(prev => prev.map(i => i._id === updated._id ? updated : i));
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
                  src={item.images?.[0]?.url || '/assets/images/strip-1.jpg'}
                  alt={item.title}
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                  <p className="text-white font-bold text-sm text-center">{item.title}</p>
                  <span className="text-xs text-rokit-orange capitalize">{item.category}</span>
                  {item.featured && <span className="text-xs text-green-400 font-semibold">★ Featured</span>}
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => setEditing(item)} className="bg-rokit-orange hover:bg-rokit-orange-dark text-white px-3 py-1 text-xs flex items-center gap-1">
                      <Pencil size={12} /> Edit
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-xs flex items-center gap-1">
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editing && (
        <EditModal item={editing} onClose={() => setEditing(null)} onSaved={handleSaved} />
      )}
    </>
  );
}
