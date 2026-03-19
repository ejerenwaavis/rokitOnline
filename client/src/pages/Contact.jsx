import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { T } from '../theme';

const contactInfo = [
  {
    icon: MapPin,
    label: 'Nigeria — Abuja',
    value: '6 Jama Are Close, Garki 2, Abuja, Nigeria',
    href: 'https://www.google.com/maps/search/?api=1&query=6+Jama+Are+Close+Garki+2+Abuja+Nigeria',
  },
  {
    icon: MapPin,
    label: 'United Kingdom',
    value: '25 James Street, Bradford, West Yorkshire, UK',
    href: 'https://www.google.com/maps/search/?api=1&query=25+James+Street+Bradford+West+Yorkshire+UK',
  },
  { icon: Phone, label: 'Phone', value: '+234 703 161 6075', href: 'tel:+2347031616075' },
  { icon: Mail, label: 'Email', value: 'rokitnow@gmail.com', href: 'mailto:rokitnow@gmail.com' },
  { icon: Clock, label: 'Business Hours', value: 'Mon–Fri: 8am–6pm | Sat: 9am–3pm' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/contact', form);
      setSent(true);
      toast.success('Message sent! We\'ll get back to you shortly.');
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us – Rokit Media</title>
        <meta name="description" content="Get in touch with Rokit Media – creative printing and design agency in Osogbo, Nigeria." />
      </Helmet>

      {/* Hero */}
      <div className={T.pageHero}>
        <div className={`${T.pageHeroInner} ${T.pageHeroCentered}`}>
          <span className={`${T.eyebrowOrange} mb-3`}>Reach Out</span>
          <h1 className={`${T.h1} mb-4`}>Contact Us</h1>
          <p className={`${T.body} max-w-xl mx-auto`}>
            Have a project in mind? We&apos;re ready to help. Drop us a message or give us a call.
          </p>
        </div>
      </div>

      <section className={T.sectionCream}>
        <div className={`${T.sectionInner} grid lg:grid-cols-2 gap-16`}>
          {/* Contact Form */}
          <div>
            <h2 className={`${T.h3} mb-8`}>Send Us a Message</h2>
            {sent ? (
              <div className={T.successBox}>
                <p className="font-display text-2xl font-light text-rokit-green mb-2">Message Sent!</p>
                <p className={T.body}>Thank you for reaching out. Our team will respond within 24 hours.</p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }} className="mt-6 btn-outline">
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
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
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-rokit-dark mb-1">Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange} className="form-input" placeholder="+234 …" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-rokit-dark mb-1">Subject *</label>
                    <input name="subject" value={form.subject} onChange={handleChange} required className="form-input" placeholder="Brief subject" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-rokit-dark mb-1">Message *</label>
                  <textarea name="message" value={form.message} onChange={handleChange} required rows={6} className="form-input resize-none" placeholder="Tell us about your project…" />
                </div>
                <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
                  {submitting ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Info Panel */}
          <div>
            <h2 className={`${T.h3} mb-8`}>Our Office</h2>
            <div className="space-y-6 mb-10">
              {contactInfo.map((item) => {
                const ItemIcon = item.icon;
                const content = (
                  <div className="flex gap-4 group">
                    <div className="w-10 h-10 bg-rokit-orange/10 flex items-center justify-center shrink-0">
                      <ItemIcon size={18} className="text-rokit-orange" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-rokit-dark text-sm">{item.label}</p>
                      <p className="text-rokit-body text-sm">{item.value}</p>
                    </div>
                    {item.href && <ExternalLink size={14} className="text-rokit-body/40 group-hover:text-rokit-orange transition-colors shrink-0 mt-3" />}
                  </div>
                );
                return item.href ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="block hover:bg-rokit-cream-dark -mx-3 px-3 py-2 rounded transition-colors"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={item.label} className="px-3 py-2">
                    {content}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
