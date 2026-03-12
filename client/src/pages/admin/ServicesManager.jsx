import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

function ServiceEditForm({ service, onSaved, onCancel }) {
  const [form, setForm] = useState({
    name: service.name || '',
    shortDescription: service.shortDescription || '',
    fullDescription: service.fullDescription || '',
    features: service.features?.join('\n') || '',
    startingPrice: service.startingPrice || '',
    turnaround: service.turnaround || '',
    featured: service.featured || false,
  });
  const [saving, setSaving] = useState(false);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        features: form.features.split('\n').map(f => f.trim()).filter(Boolean),
        startingPrice: form.startingPrice ? Number(form.startingPrice) : undefined,
      };
      const res = await api.put(`/services/${service._id}`, payload);
      toast.success('Service updated!');
      onSaved(res.data);
    } catch {
      toast.error('Failed to update service.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 shadow-sm border-l-4 border-rokit-orange space-y-4 mb-4">
      <h3 className="font-black text-rokit-dark">Edit: {service.name}</h3>
      <div>
        <label className="block text-xs font-semibold text-rokit-dark mb-1">Display Name</label>
        <input name="name" value={form.name} onChange={handleChange} className="form-input" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-rokit-dark mb-1">Short Description</label>
        <textarea name="shortDescription" value={form.shortDescription} onChange={handleChange} rows={2} className="form-input resize-none" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-rokit-dark mb-1">Features (one per line)</label>
        <textarea name="features" value={form.features} onChange={handleChange} rows={4} className="form-input resize-none" placeholder="Each feature on its own line" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-rokit-dark mb-1">Starting Price (₦)</label>
          <input name="startingPrice" type="number" value={form.startingPrice} onChange={handleChange} className="form-input" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-rokit-dark mb-1">Turnaround</label>
          <input name="turnaround" value={form.turnaround} onChange={handleChange} className="form-input" placeholder="e.g. 3–5 business days" />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-rokit-body">
        <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="accent-rokit-orange" />
        Feature on homepage
      </label>
      <div className="flex gap-3">
        <button onClick={handleSave} disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Save Changes'}</button>
        <button onClick={onCancel} className="btn-outline">Cancel</button>
      </div>
    </div>
  );
}

export default function ServicesManager() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    api.get('/services', { signal: controller.signal })
      .then(res => { setServices(Array.isArray(res.data) ? res.data : []); setLoading(false); })
      .catch(() => { setLoading(false); });
    return () => controller.abort();
  }, []);

  const handleSaved = (updated) => {
    setServices(prev => prev.map(s => s._id === updated._id ? updated : s));
    setEditing(null);
  };

  return (
    <>
      <Helmet><title>Services Manager – Rokit Media Admin</title></Helmet>
      <div className="p-6 max-w-4xl">
        <h1 className="text-3xl font-black text-rokit-dark mb-6">Services Manager</h1>
        <p className="text-rokit-body mb-6">Edit service details, pricing, and features displayed on the website.</p>

        {loading ? <LoadingSpinner center /> : (
          <div className="space-y-3">
            {services.map(service => (
              <div key={service._id}>
                {editing === service._id ? (
                  <ServiceEditForm service={service} onSaved={handleSaved} onCancel={() => setEditing(null)} />
                ) : (
                  <div className="bg-white p-5 shadow-sm flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-black text-rokit-dark">{service.name}</h3>
                      <p className="text-rokit-body text-sm mt-0.5">{service.shortDescription}</p>
                      {service.startingPrice && (
                        <p className="text-xs text-rokit-orange font-semibold mt-1">From ₦{Number(service.startingPrice).toLocaleString()}</p>
                      )}
                    </div>
                    <button onClick={() => setEditing(service._id)} className="shrink-0 btn-outline text-sm py-1.5 px-4">Edit</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
