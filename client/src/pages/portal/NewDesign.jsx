import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const designTypes = [
  { value: 'logo', label: 'Logo Design' },
  { value: 'flyer', label: 'Flyer / Poster' },
  { value: 'banner', label: 'Banner' },
  { value: 'brochure', label: 'Brochure' },
  { value: 'social-media', label: 'Social Media Design' },
  { value: 'business-card', label: 'Business Card' },
  { value: 'packaging', label: 'Packaging Design' },
  { value: 'other', label: 'Other' },
];

export default function NewDesign() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ designType: '', brief: '', colorPrefs: '', deadline: '' });
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.designType || !form.brief) {
      toast.error('Please select a design type and provide a brief.');
      return;
    }
    setSubmitting(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) data.append(k, v); });
      files.forEach(f => data.append('referenceFiles', f));
      await api.post('/designs', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Design request submitted!');
      navigate('/portal');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to submit request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet><title>Design Request – Rokit Media</title></Helmet>
      <div className="pt-24 pb-6 px-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-black text-rokit-dark mb-2">Design Request</h1>
        <p className="text-rokit-body mb-8">Submit your design brief and our creative team will get to work.</p>

        <form onSubmit={handleSubmit} className="space-y-5 bg-white p-8 shadow-sm">
          <div>
            <label className="block text-sm font-semibold text-rokit-dark mb-1">Design Type *</label>
            <select name="designType" value={form.designType} onChange={handleChange} required className="form-input">
              <option value="">Select design type…</option>
              {designTypes.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-rokit-dark mb-1">Design Brief *</label>
            <textarea
              name="brief"
              value={form.brief}
              onChange={handleChange}
              required
              rows={5}
              className="form-input resize-none"
              placeholder="Describe what you need — include your brand name, target audience, key messages, and any specific design preferences…"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-rokit-dark mb-1">Colour Preferences</label>
            <input name="colorPrefs" value={form.colorPrefs} onChange={handleChange} className="form-input" placeholder="e.g. Blue and gold, brand orange #FF9729…" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-rokit-dark mb-1">Deadline</label>
            <input type="date" name="deadline" value={form.deadline} onChange={handleChange} className="form-input" min={new Date().toISOString().split('T')[0]} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-rokit-dark mb-1">Reference Files (optional)</label>
            <input type="file" multiple accept="image/*,application/pdf" onChange={e => setFiles(Array.from(e.target.files))} className="text-sm text-rokit-body" />
            <p className="text-xs text-gray-400 mt-1">Upload logos, inspiration images, or PDF briefs.</p>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
            {submitting ? 'Submitting…' : 'Submit Design Request'}
          </button>
        </form>
      </div>
    </>
  );
}
