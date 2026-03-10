import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const contactInfo = [
  { icon: MapPin, label: 'Office Address', value: '7-8 Ikirun Road, Osogbo, Osun State, Nigeria' },
  { icon: Phone, label: 'Phone', value: '+234 80 3348 9869' },
  { icon: Mail, label: 'Email', value: 'rokitnow@gmail.com' },
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
      <div className="bg-rokit-dark pt-32 pb-16 text-center">
        <p className="text-rokit-orange font-semibold uppercase tracking-widest text-sm mb-2">Reach Out</p>
        <h1 className="text-5xl font-black text-white mb-4">Contact Us</h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Have a project in mind? We're ready to help. Drop us a message or give us a call.
        </p>
      </div>

      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-black text-rokit-dark mb-8">Send Us a Message</h2>
            {sent ? (
              <div className="bg-rokit-green/10 border border-rokit-green/30 p-8 text-center">
                <p className="text-2xl font-black text-rokit-green mb-2">Message Sent!</p>
                <p className="text-rokit-body">Thank you for reaching out. Our team will respond within 24 hours.</p>
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
            <h2 className="text-3xl font-black text-rokit-dark mb-8">Our Office</h2>
            <div className="space-y-6 mb-10">
              {contactInfo.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <div key={item.label} className="flex gap-4">
                    <div className="w-12 h-12 bg-rokit-orange flex items-center justify-center shrink-0">
                      <ItemIcon size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-rokit-dark text-sm">{item.label}</p>
                      <p className="text-rokit-body text-sm">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Google Maps iframe */}
            <div className="aspect-video w-full">
              <iframe
                title="Rokit Media Office Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.3!2d4.561!3d7.771!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwNDYnMTUuNiJOIDTCsDMzJzM5LjYiRQ!5e0!3m2!1sen!2sng!4v1600000000000!5m2!1sen!2sng"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
