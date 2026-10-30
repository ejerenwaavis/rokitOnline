import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, Phone, Mail, Clock, ArrowRight, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

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

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/contact', form);
      setSent(true);
      toast.success('Message sent! We\'ll get back to you shortly.');
    } catch {
      toast.error('Failed to send message. Please check connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us — rOKIt</title>
        <meta
          name="description"
          content="Start a conversation with rOKIt. Reach our Abuja or UK studios for brand, digital, communication and physical production inquiries."
        />
        <meta property="og:title" content="Contact Us — rOKIt" />
        <meta
          property="og:description"
          content="Start with what you have. Reach rOKIt studios in Nigeria and the UK."
        />
      </Helmet>

      <div className="font-v4-body text-paper">
        {/* Hero */}
        <section className="mx-auto max-w-site px-gutter pt-16 pb-12 border-b border-paper/15">
          <p className="v4-section-label">Start a conversation</p>
          <h1 className="mt-4 font-v4-display text-4xl md:text-6xl">Talk to rOKIt.</h1>
          <p className="mt-4 max-w-[50ch] text-base leading-relaxed text-paper/70">
            A question, a challenge, or a specification. We’ll help work out what it needs next.
          </p>
        </section>

        {/* Main Grid */}
        <section className="mx-auto max-w-site px-gutter py-section">
          <div className="grid grid-cols-12 gap-x-8 gap-y-16">
            {/* Contact Details Column */}
            <div className="col-span-12 md:col-span-5 space-y-10">
              <div>
                <p className="v4-section-label">Studios & Reach</p>
                <h2 className="mt-3 font-v4-display text-2xl text-paper">Where We Work</h2>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info) => {
                  const Icon = info.icon;
                  return (
                    <div key={info.label} className="border-t border-paper/15 pt-5">
                      <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-signal mb-1">
                        <Icon className="size-3.5" aria-hidden="true" />
                        <span>{info.label}</span>
                      </div>
                      {info.href ? (
                        <a
                          href={info.href}
                          target={info.href.startsWith('http') ? '_blank' : undefined}
                          rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="text-base text-paper hover:text-signal transition-colors block leading-relaxed"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-base text-neutral leading-relaxed">{info.value}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="border border-paper/15 bg-surface p-6">
                <p className="text-xs font-mono uppercase tracking-wider text-signal mb-2">Notice</p>
                <p className="text-sm leading-relaxed text-paper/75">
                  Visiting our Abuja or UK offices is by prior appointment to ensure our creative and production leads are dedicated to your session.
                </p>
              </div>
            </div>

            {/* Form Column */}
            <div className="col-span-12 md:col-span-7">
              {sent ? (
                <div className="border-l-2 border-signal pl-6 py-6" role="status">
                  <Check className="size-8 text-signal mb-4" aria-hidden="true" />
                  <h2 className="font-v4-display text-3xl text-paper">WE’VE GOT IT.</h2>
                  <p className="mt-4 max-w-[50ch] text-base leading-relaxed text-paper/75">
                    Your message has been delivered to the rOKIt team. We review every note and will get back to you with clear direction shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSent(false);
                      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
                    }}
                    className="v4-action-link mt-8 min-h-12 border border-signal px-6 text-xs uppercase font-mono tracking-wider text-signal hover:bg-signal hover:text-night transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <p className="v4-section-label">Direct Note</p>
                    <h2 className="mt-3 font-v4-display text-2xl text-paper">Send a Message</h2>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <label className="form-field">
                      <span className="text-xs uppercase font-mono tracking-wider text-neutral mb-2 block">
                        Full Name *
                      </span>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full min-h-[3rem] border border-paper/25 bg-transparent p-3 text-paper focus:outline-none focus:border-signal"
                        placeholder="Your name"
                      />
                    </label>

                    <label className="form-field">
                      <span className="text-xs uppercase font-mono tracking-wider text-neutral mb-2 block">
                        Email Address *
                      </span>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full min-h-[3rem] border border-paper/25 bg-transparent p-3 text-paper focus:outline-none focus:border-signal"
                        placeholder="you@domain.com"
                      />
                    </label>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <label className="form-field">
                      <span className="text-xs uppercase font-mono tracking-wider text-neutral mb-2 block">
                        Phone <small className="text-neutral/60">(optional)</small>
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full min-h-[3rem] border border-paper/25 bg-transparent p-3 text-paper focus:outline-none focus:border-signal"
                        placeholder="+234..."
                      />
                    </label>

                    <label className="form-field">
                      <span className="text-xs uppercase font-mono tracking-wider text-neutral mb-2 block">
                        Subject *
                      </span>
                      <input
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        required
                        className="w-full min-h-[3rem] border border-paper/25 bg-transparent p-3 text-paper focus:outline-none focus:border-signal"
                        placeholder="e.g. Identity & Web consultation"
                      />
                    </label>
                  </div>

                  <label className="form-field block">
                    <span className="text-xs uppercase font-mono tracking-wider text-neutral mb-2 block">
                      Message *
                    </span>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full border border-paper/25 bg-transparent p-3 text-paper focus:outline-none focus:border-signal leading-relaxed"
                      placeholder="Tell us what you are trying to make happen..."
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="v4-action-link min-h-12 border border-signal bg-signal px-8 text-xs uppercase font-mono tracking-wider text-night font-semibold hover:bg-paper transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Sending…' : 'Send Message'}{' '}
                    <ArrowRight className="size-4 ml-2" aria-hidden="true" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
