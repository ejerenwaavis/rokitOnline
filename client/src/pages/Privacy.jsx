import { Helmet } from 'react-helmet-async';

export default function Privacy() {
  return (
    <>
      <Helmet><title>Privacy Policy – Rokit Media</title></Helmet>
      <div className="bg-rokit-dark pt-32 pb-16 text-center">
        <h1 className="text-5xl font-black text-white">Privacy Policy</h1>
        <p className="text-gray-400 mt-3">Last updated: January 2026 — Compliant with the Nigeria Data Protection Act 2023 (NDPA)</p>
      </div>
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 space-y-8 text-rokit-body leading-relaxed">

          <section>
            <h2 className="text-2xl font-black text-rokit-dark mb-3">1. Controller Identity</h2>
            <p>Rokit Media ("we", "us", "our") is the data controller for personal data collected through this website. Our contact email is <a href="mailto:rokitnow@gmail.com" className="text-rokit-orange hover:underline">rokitnow@gmail.com</a>.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-rokit-dark mb-3">2. Data We Collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account data:</strong> Name, email address, phone number, and password (stored as a secure hash).</li>
              <li><strong>Order data:</strong> Service type, project specifications, uploaded reference files, and payment transaction IDs.</li>
              <li><strong>Contact data:</strong> Messages submitted through our contact form.</li>
              <li><strong>Usage data:</strong> IP address, browser type, pages visited, and session duration (collected via server logs).</li>
              <li><strong>Cookie data:</strong> See our Cookie Policy for details.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-rokit-dark mb-3">3. Legal Basis for Processing</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Contractual necessity:</strong> Processing your order and delivering services.</li>
              <li><strong>Legitimate interests:</strong> Communicating about your order, improving our services, and fraud prevention.</li>
              <li><strong>Consent:</strong> Marketing communications (where applicable).</li>
              <li><strong>Legal obligation:</strong> Compliance with applicable Nigerian law and financial regulations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-rokit-dark mb-3">4. How We Use Your Data</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Processing and fulfilling job orders and quotation requests.</li>
              <li>Communicating order updates, invoices, and delivery information.</li>
              <li>Responding to contact form submissions.</li>
              <li>Improving our website and services based on aggregated usage analysis.</li>
              <li>Detecting and preventing fraud or abuse of our platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-rokit-dark mb-3">5. Data Sharing</h2>
            <p className="mb-3">We do not sell your personal data. We may share data with the following third parties:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Stripe:</strong> Payment processing (subject to Stripe's privacy policy).</li>
              <li><strong>Cloudinary:</strong> Media/file storage for uploaded design assets.</li>
              <li><strong>Google (Gmail SMTP):</strong> Transactional email delivery.</li>
              <li><strong>Hosting provider (Railway/Render):</strong> Server infrastructure.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-rokit-dark mb-3">6. Data Retention</h2>
            <p>We retain account and order data for a minimum of 5 years for accounting and legal compliance purposes. Contact messages are retained for 2 years. You may request deletion of your data subject to applicable legal obligations.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-rokit-dark mb-3">7. Your Rights Under NDPA 2023</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Right of access to your personal data.</li>
              <li>Right to rectification of inaccurate data.</li>
              <li>Right to erasure (where no legal basis overrides this).</li>
              <li>Right to data portability.</li>
              <li>Right to object to processing based on legitimate interests.</li>
              <li>Right to lodge a complaint with the Nigeria Data Protection Commission (NDPC).</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, contact us at <a href="mailto:rokitnow@gmail.com" className="text-rokit-orange hover:underline">rokitnow@gmail.com</a>.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-rokit-dark mb-3">8. Security</h2>
            <p>We implement appropriate technical and organisational measures to protect your data, including HTTPS encryption, password hashing (bcrypt), and access controls. However, no internet transmission is completely secure.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-rokit-dark mb-3">9. Changes to This Policy</h2>
            <p>We may update this Policy periodically. Significant changes will be communicated via email or a prominent notice on our website.</p>
          </section>

        </div>
      </div>
    </>
  );
}
