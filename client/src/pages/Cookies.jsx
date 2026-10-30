import { Helmet } from 'react-helmet-async';

const cookieTypes = [
  {
    name: 'Essential Cookies',
    required: true,
    description: 'These cookies are necessary for the website to function and cannot be switched off. They are typically set in response to actions made by you such as logging in, session management, or filling in forms.',
    examples: ['Authentication token (rokit_token)', 'Session identifiers', 'CSRF protection'],
  },
  {
    name: 'Preference Cookies',
    required: false,
    description: 'These cookies allow the website to remember choices you make, such as your cookie consent preferences and UI settings.',
    examples: ['Cookie consent status (rokit_cookie_consent)'],
  },
  {
    name: 'Analytics Cookies',
    required: false,
    description: 'These cookies help us understand how visitors interact with our website by collecting and reporting telemetry anonymously.',
    examples: ['Page view counts', 'Navigation paths', 'Error diagnostics'],
  },
];

export default function Cookies() {
  const handleManage = () => {
    localStorage.removeItem('rokit_cookie_consent');
    window.location.reload();
  };

  return (
    <>
      <Helmet>
        <title>Cookie Policy — rOKIt</title>
        <meta name="description" content="Cookie policy for rOKIt and details on session management." />
      </Helmet>

      <div className="font-v4-body text-paper">
        {/* Header */}
        <section className="mx-auto max-w-site px-gutter pt-16 pb-12 border-b border-paper/15">
          <p className="v4-section-label">Privacy & Transparency</p>
          <h1 className="mt-4 font-v4-display text-4xl md:text-6xl">Cookie Policy</h1>
          <p className="mt-4 text-xs font-mono uppercase tracking-wider text-neutral">
            Last updated: January 2026
          </p>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-site px-gutter py-section">
          <div className="max-w-4xl space-y-12 leading-relaxed text-paper/80">
            <section className="border-t border-paper/15 pt-8">
              <h2 className="font-v4-display text-2xl text-paper mb-4">What Are Cookies?</h2>
              <p>
                Cookies are small text records stored on your device when you browse websites. They ensure authentication sessions persist and remember user interface preferences.
              </p>
            </section>

            <section className="border-t border-paper/15 pt-8">
              <h2 className="font-v4-display text-2xl text-paper mb-4">How We Use Cookies</h2>
              <p>
                We use cookies strictly to keep you authenticated, remember consent states, and monitor performance. We do not use third-party behavioral advertising or tracking networks.
              </p>
            </section>

            <div className="space-y-6">
              {cookieTypes.map((type) => (
                <div key={type.name} className="border border-paper/15 bg-surface p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="font-v4-display text-xl text-paper">{type.name}</h3>
                    <span
                      className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 ${
                        type.required ? 'bg-signal text-night font-semibold' : 'border border-neutral text-neutral'
                      }`}
                    >
                      {type.required ? 'Always Active' : 'Optional'}
                    </span>
                  </div>
                  <p className="text-sm text-neutral mb-3">{type.description}</p>
                  <ul className="list-disc pl-5 text-xs font-mono text-neutral/90 space-y-1">
                    {type.examples.map((ex) => (
                      <li key={ex}>{ex}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <section className="border-t border-paper/15 pt-8">
              <h2 className="font-v4-display text-2xl text-paper mb-4">Managing Your Cookie Preferences</h2>
              <p className="mb-6">
                You can reset or change your consent choices at any time. Clicking the button below will clear saved preferences and reload the consent modal.
              </p>
              <button
                type="button"
                onClick={handleManage}
                className="v4-action-link min-h-12 border border-signal px-6 text-xs uppercase font-mono tracking-wider text-signal hover:bg-signal hover:text-night transition-colors"
              >
                Reset Cookie Preferences
              </button>
            </section>

            <section className="border-t border-paper/15 pt-8">
              <h2 className="font-v4-display text-2xl text-paper mb-4">Browser Settings</h2>
              <p>
                You can also manage or block cookies through your browser privacy settings. Note that disabling essential cookies will prevent authentication and session access in the customer and admin portals.
              </p>
            </section>

            <section className="border-t border-paper/15 pt-8">
              <h2 className="font-v4-display text-2xl text-paper mb-4">Contact</h2>
              <p>
                For questions regarding cookies or data practices, contact us at{' '}
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
