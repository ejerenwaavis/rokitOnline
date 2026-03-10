import { Helmet } from 'react-helmet-async';

export default function Terms() {
  return (
    <>
      <Helmet><title>Terms & Conditions – Rokit Media</title></Helmet>
      <div className="bg-rokit-dark pt-32 pb-16 text-center">
        <h1 className="text-5xl font-black text-white">Terms & Conditions</h1>
        <p className="text-gray-400 mt-3">Last updated: January 2026</p>
      </div>
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 prose prose-sm max-w-none text-rokit-body leading-relaxed space-y-8">

          <section>
            <h2 className="text-2xl font-black text-rokit-dark mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using the Rokit Media website and services, you agree to be bound by these Terms and Conditions. If you do not agree, please refrain from using our services.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-rokit-dark mb-3">2. Services</h2>
            <p>Rokit Media provides creative and printing services including large format printing, graphic design, branding, web design, roll-up banners, and creative concept development. All services are subject to availability and our production capacity.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-rokit-dark mb-3">3. Job Orders & Quotations</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>All quotations are valid for 14 days from the date of issue.</li>
              <li>A deposit of 50% is required before work commences on all job orders.</li>
              <li>The remaining balance must be paid before final files are released or products are delivered.</li>
              <li>Rokit Media reserves the right to decline any order at its sole discretion.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-rokit-dark mb-3">4. Payments</h2>
            <p>Payments are processed securely via Stripe. Rokit Media does not store your payment card details. All prices are quoted in Nigerian Naira (₦) unless otherwise stated.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-rokit-dark mb-3">5. Revisions & Approval</h2>
            <p>Each design service includes up to 3 rounds of revisions. Additional revisions beyond this are billable. Final approval must be given in writing (email or platform message) before files are sent to print.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-rokit-dark mb-3">6. Refund Policy</h2>
            <p>Deposits are non-refundable once design or production work has commenced. If Rokit Media is unable to fulfil an order, a full refund will be issued. Printed items cannot be returned unless there is a demonstrable production defect.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-rokit-dark mb-3">7. Intellectual Property</h2>
            <p>All original design work created by Rokit Media remains the intellectual property of Rokit Media until full payment is received, after which ownership transfers to the client. Rokit Media reserves the right to display completed work in its portfolio unless otherwise agreed in writing.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-rokit-dark mb-3">8. Client-Supplied Materials</h2>
            <p>Clients are responsible for ensuring all logos, images, text, and other content supplied to Rokit Media are free from copyright infringement. Rokit Media accepts no liability for third-party intellectual property violations arising from client-supplied materials.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-rokit-dark mb-3">9. Delivery & Turnaround</h2>
            <p>Turnaround times are estimates and begin from the point at which all required materials and approval are received from the client. Rokit Media is not liable for delays caused by factors outside its control, including logistics, force majeure, or client communication delays.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-rokit-dark mb-3">10. Limitation of Liability</h2>
            <p>To the maximum extent permitted by Nigerian law, Rokit Media's liability for any claim arising from these terms shall not exceed the amount paid for the specific service giving rise to the claim.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-rokit-dark mb-3">11. Governing Law</h2>
            <p>These Terms are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be subject to the exclusive jurisdiction of the courts of Osun State, Nigeria.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-rokit-dark mb-3">12. Contact</h2>
            <p>For questions about these Terms, contact us at <a href="mailto:rokitnow@gmail.com" className="text-rokit-orange hover:underline">rokitnow@gmail.com</a>.</p>
          </section>

        </div>
      </div>
    </>
  );
}
