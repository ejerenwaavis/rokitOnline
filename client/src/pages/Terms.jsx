import { Helmet } from 'react-helmet-async';

export default function Terms() {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions — rOKIt</title>
        <meta name="description" content="Terms and conditions for rOKIt services, job orders, payments, and client relationships." />
      </Helmet>

      <div className="font-v4-body text-paper">
        {/* Header */}
        <section className="mx-auto max-w-site px-gutter pt-16 pb-12 border-b border-paper/15">
          <p className="v4-section-label">Legal</p>
          <h1 className="mt-4 font-v4-display text-4xl md:text-6xl">Terms & Conditions</h1>
          <p className="mt-4 text-xs font-mono uppercase tracking-wider text-neutral">
            Last updated: January 2026 · Governed by Nigerian Law
          </p>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-site px-gutter py-section">
          <div className="max-w-4xl space-y-12 leading-relaxed text-paper/80">
            <section className="border-t border-paper/15 pt-8">
              <h2 className="font-v4-display text-2xl text-paper mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing or using the rOKIt website and services, you agree to be bound by these Terms and Conditions. If you do not agree, please refrain from using our services.
              </p>
            </section>

            <section className="border-t border-paper/15 pt-8">
              <h2 className="font-v4-display text-2xl text-paper mb-4">2. Services</h2>
              <p>
                rOKIt provides creative, digital, and production services including brand identity, digital systems, physical brand and production, large format printing, roll-up banners, and creative direction. All services are subject to availability and production scheduling.
              </p>
            </section>

            <section className="border-t border-paper/15 pt-8">
              <h2 className="font-v4-display text-2xl text-paper mb-4">3. Job Orders & Quotations</h2>
              <ul className="list-disc pl-6 space-y-2 mt-4 text-neutral">
                <li>All quotations are valid for 14 days from the date of issue.</li>
                <li>A deposit of 50% is required before work commences on all job orders unless explicitly agreed otherwise.</li>
                <li>The remaining balance must be paid before final production files are released or physical items are dispatched.</li>
                <li>rOKIt reserves the right to decline any order at its sole discretion.</li>
              </ul>
            </section>

            <section className="border-t border-paper/15 pt-8">
              <h2 className="font-v4-display text-2xl text-paper mb-4">4. Payments</h2>
              <p>
                Payments are processed securely via Stripe or approved electronic transfer methods. rOKIt does not store your payment card details. All prices are quoted in Nigerian Naira (₦) unless stated otherwise.
              </p>
            </section>

            <section className="border-t border-paper/15 pt-8">
              <h2 className="font-v4-display text-2xl text-paper mb-4">5. Revisions & Approval</h2>
              <p>
                Each design service includes up to 3 rounds of revisions within scope. Additional revisions beyond this are billable. Final approval must be given in writing (email or portal sign-off) before production or publication begins.
              </p>
            </section>

            <section className="border-t border-paper/15 pt-8">
              <h2 className="font-v4-display text-2xl text-paper mb-4">6. Refund Policy</h2>
              <p>
                Deposits are non-refundable once creative direction or physical production has commenced. If rOKIt is unable to fulfil an agreed order, a full refund will be issued. Printed items cannot be returned unless there is a demonstrable defect against approved specifications.
              </p>
            </section>

            <section className="border-t border-paper/15 pt-8">
              <h2 className="font-v4-display text-2xl text-paper mb-4">7. Intellectual Property</h2>
              <p>
                All original design work created by rOKIt remains the property of rOKIt until full payment is received, at which point ownership transfers to the client. rOKIt reserves the right to display completed work in its archive and portfolio unless agreed otherwise in writing.
              </p>
            </section>

            <section className="border-t border-paper/15 pt-8">
              <h2 className="font-v4-display text-2xl text-paper mb-4">8. Client-Supplied Materials</h2>
              <p>
                Clients are responsible for ensuring all logos, imagery, text, and data supplied are free from copyright infringement. rOKIt accepts no liability for third-party intellectual property claims arising from client-supplied materials.
              </p>
            </section>

            <section className="border-t border-paper/15 pt-8">
              <h2 className="font-v4-display text-2xl text-paper mb-4">9. Delivery & Turnaround</h2>
              <p>
                Turnaround timelines are estimates and commence once all briefs, approved samples, and payments are received. rOKIt is not liable for logistics delays outside its reasonable control.
              </p>
            </section>

            <section className="border-t border-paper/15 pt-8">
              <h2 className="font-v4-display text-2xl text-paper mb-4">10. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by Nigerian law, rOKIt’s liability for any claim arising from these terms shall not exceed the amount paid for the specific service giving rise to the claim.
              </p>
            </section>

            <section className="border-t border-paper/15 pt-8">
              <h2 className="font-v4-display text-2xl text-paper mb-4">11. Governing Law</h2>
              <p>
                These Terms are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be subject to the exclusive jurisdiction of the competent courts of Nigeria.
              </p>
            </section>

            <section className="border-t border-paper/15 pt-8">
              <h2 className="font-v4-display text-2xl text-paper mb-4">12. Contact</h2>
              <p>
                For questions about these Terms, contact us at{' '}
                <a href="mailto:rokitnow@gmail.com" className="text-signal hover:underline">
                  rokitnow@gmail.com
                </a>.
              </p>
            </section>
          </div>
        </section>
      </div>
    </>
  );
}
