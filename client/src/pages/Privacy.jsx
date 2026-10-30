import { Helmet } from 'react-helmet-async';

export default function Privacy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy — rOKIt</title>
        <meta
          name="description"
          content="Privacy policy for rOKIt — compliant with the Nigeria Data Protection Act 2023 (NDPA)."
        />
      </Helmet>

      <div className="font-v4-body text-paper">
        {/* Header */}
        <section className="mx-auto max-w-site px-gutter pt-16 pb-12 border-b border-paper/15">
          <p className="v4-section-label">Legal & Compliance</p>
          <h1 className="mt-4 font-v4-display text-4xl md:text-6xl">Privacy Policy</h1>
          <p className="mt-4 text-xs font-mono uppercase tracking-wider text-neutral">
            Last updated: January 2026 · Compliant with the Nigeria Data Protection Act 2023 (NDPA)
          </p>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-site px-gutter py-section">
          <div className="max-w-4xl space-y-12 leading-relaxed text-paper/80">
            <section className="border-t border-paper/15 pt-8">
              <h2 className="font-v4-display text-2xl text-paper mb-4">1. Controller Identity</h2>
              <p>
                rOKIt ("we", "us", "our") is the data controller for personal data collected through this website and digital platforms. Our contact email is{' '}
                <a href="mailto:rokitnow@gmail.com" className="text-signal hover:underline">
                  rokitnow@gmail.com
                </a>.
              </p>
            </section>

            <section className="border-t border-paper/15 pt-8">
              <h2 className="font-v4-display text-2xl text-paper mb-4">2. Data We Collect</h2>
              <ul className="list-disc pl-6 space-y-2 mt-4 text-neutral">
                <li><strong className="text-paper">Account data:</strong> Name, email address, phone number, and password (stored as a secure salted hash).</li>
                <li><strong className="text-paper">Order data:</strong> Service requirements, project specifications, uploaded reference assets, and payment transaction IDs.</li>
                <li><strong className="text-paper">Contact data:</strong> Inquiries submitted through our contact and quote forms.</li>
                <li><strong className="text-paper">Usage data:</strong> IP address, browser type, pages viewed, and session duration recorded for system security and reliability.</li>
                <li><strong className="text-paper">Cookie data:</strong> Preference and session cookies as detailed in our Cookie Policy.</li>
              </ul>
            </section>

            <section className="border-t border-paper/15 pt-8">
              <h2 className="font-v4-display text-2xl text-paper mb-4">3. Legal Basis for Processing</h2>
              <ul className="list-disc pl-6 space-y-2 mt-4 text-neutral">
                <li><strong className="text-paper">Contractual necessity:</strong> Fulfilling client orders, managing projects, and delivering creative/production assets.</li>
                <li><strong className="text-paper">Legitimate interests:</strong> Responding to client inquiries, preventing platform fraud, and maintaining infrastructure security.</li>
                <li><strong className="text-paper">Consent:</strong> Optional communications where explicitly requested.</li>
                <li><strong className="text-paper">Legal obligation:</strong> Compliance with applicable Nigerian tax, audit, and legal mandates.</li>
              </ul>
            </section>

            <section className="border-t border-paper/15 pt-8">
              <h2 className="font-v4-display text-2xl text-paper mb-4">4. How We Use Your Data</h2>
              <ul className="list-disc pl-6 space-y-2 mt-4 text-neutral">
                <li>Processing and fulfilling job orders and quotation requests.</li>
                <li>Communicating order milestones, invoices, and delivery tracking.</li>
                <li>Responding to customer inquiries and support requests.</li>
                <li>Safeguarding our systems from abusive or unauthorized activity.</li>
              </ul>
            </section>

            <section className="border-t border-paper/15 pt-8">
              <h2 className="font-v4-display text-2xl text-paper mb-4">5. Data Sharing</h2>
              <p className="mb-4">We do not sell your personal data. We securely transmit data to vetted infrastructure partners strictly for service delivery:</p>
              <ul className="list-disc pl-6 space-y-2 text-neutral">
                <li><strong className="text-paper">Stripe:</strong> Payment gateway and transaction processing.</li>
                <li><strong className="text-paper">Cloudinary:</strong> CDN and storage for project media files.</li>
                <li><strong className="text-paper">Mail Infrastructure:</strong> Transactional order confirmations and OTP authentication delivery.</li>
                <li><strong className="text-paper">Hosting Environment:</strong> Encrypted application and database hosting.</li>
              </ul>
            </section>

            <section className="border-t border-paper/15 pt-8">
              <h2 className="font-v4-display text-2xl text-paper mb-4">6. Data Retention</h2>
              <p>
                We retain account and transaction records for a minimum of 5 years to satisfy statutory accounting obligations. General inquiries are retained for 2 years. You may request account deletion subject to applicable legal retention rules.
              </p>
            </section>

            <section className="border-t border-paper/15 pt-8">
              <h2 className="font-v4-display text-2xl text-paper mb-4">7. Your Rights Under NDPA 2023</h2>
              <ul className="list-disc pl-6 space-y-2 mt-4 text-neutral">
                <li>Right to access personal data held about you.</li>
                <li>Right to rectification of inaccurate or incomplete records.</li>
                <li>Right to erasure where no statutory obligation requires continued retention.</li>
                <li>Right to object to processing on legitimate interest grounds.</li>
                <li>Right to lodge a complaint with the Nigeria Data Protection Commission (NDPC).</li>
              </ul>
              <p className="mt-4">
                To exercise any of these rights, contact our data team at{' '}
                <a href="mailto:rokitnow@gmail.com" className="text-signal hover:underline">
                  rokitnow@gmail.com
                </a>.
              </p>
            </section>

            <section className="border-t border-paper/15 pt-8">
              <h2 className="font-v4-display text-2xl text-paper mb-4">8. Security</h2>
              <p>
                We enforce technical and organizational safeguards including HTTPS encryption, password hashing (bcrypt), role-based authorization guards, and isolated infrastructure environments.
              </p>
            </section>

            <section className="border-t border-paper/15 pt-8">
              <h2 className="font-v4-display text-2xl text-paper mb-4">9. Changes to This Policy</h2>
              <p>
                We may periodically update this policy to reflect operational changes or statutory updates. Material changes will be highlighted on our platform.
              </p>
            </section>
          </div>
        </section>
      </div>
    </>
  );
}
