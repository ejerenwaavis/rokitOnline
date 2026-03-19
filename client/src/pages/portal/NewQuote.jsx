import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const serviceTypes = [
  { value: 'large-format', label: 'Large Format Prints' },
  { value: 'graphic-design', label: 'Graphic Design' },
  { value: 'branding', label: 'Branding' },
  { value: 'web-design', label: 'Web Design' },
  { value: 'idea-creation', label: 'Idea Creation' },
  { value: 'roll-up-banners', label: 'Roll-Up Banners' },
  { value: 'other', label: 'Other' },
];

export default function NewQuote() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    serviceType: searchParams.get('serviceType') || '',
    projectDescription: searchParams.get('project') ? `Similar project to: ${searchParams.get('project')}` : '',
  });
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.serviceType || !form.projectDescription) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      files.forEach(f => data.append('files', f));
      await api.post('/quotes', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Quotation request submitted! We\'ll get back to you within 24 hours.');
      navigate('/portal');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to submit request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet><title>Request a Quote – Rokit Media</title></Helmet>
      <div className="pt-24 pb-6 px-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-black text-rokit-dark mb-2">Request a Quote</h1>
        <p className="text-rokit-body mb-8">Tell us about your project and we'll send you a detailed quotation within 24 hours.</p>

        <form onSubmit={handleSubmit} className="space-y-5 bg-white p-8 shadow-sm">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-rokit-dark mb-1">Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required className="form-input" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-rokit-dark mb-1">Email *</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required className="form-input" placeholder="your@email.com" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-rokit-dark mb-1">Phone Number</label>
            <input name="phone" value={form.phone} onChange={handleChange} className="form-input" placeholder="+234 …" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-rokit-dark mb-1">Service Type *</label>
            <select name="serviceType" value={form.serviceType} onChange={handleChange} required className="form-input">
              <option value="">Select a service…</option>
              {serviceTypes.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-rokit-dark mb-1">Project Description *</label>
            <textarea name="projectDescription" value={form.projectDescription} onChange={handleChange} required rows={5} className="form-input resize-none" placeholder="Describe your project — include dimensions, quantities, timeline, and any design references…" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-rokit-dark mb-1">Reference Files (optional)</label>
            <input type="file" multiple accept="image/*,application/pdf" onChange={e => setFiles(Array.from(e.target.files))} className="text-sm text-rokit-body" />
            <p className="text-xs text-gray-400 mt-1">Upload logos, reference images, or PDFs to help us understand your vision.</p>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
            {submitting ? 'Submitting…' : 'Submit Quote Request'}
          </button>
        </form>
      </div>
    </>
  );
}
