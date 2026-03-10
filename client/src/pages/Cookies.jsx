import { Helmet } from 'react-helmet-async';

const cookieTypes = [
  {
    name: 'Essential Cookies',
    required: true,
    description: 'These cookies are necessary for the website to function and cannot be switched off. They are typically set in response to actions made by you such as logging in or filling in forms.',
    examples: ['Authentication token (rokit_token)', 'Session identifiers'],
  },
  {
    name: 'Preference Cookies',
    required: false,
    description: 'These cookies allow the website to remember choices you make, such as your cookie consent preference.',
    examples: ['Cookie consent status (rokit_cookie_consent)'],
  },
  {
    name: 'Analytics Cookies',
    required: false,
    description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
    examples: ['Page view counts', 'Navigation paths'],
  },
];

export default function Cookies() {
  const handleManage = () => {
    localStorage.removeItem('rokit_cookie_consent');
    window.location.reload();
  };

  return (
    <>
      <Helmet><title>Cookie Policy – Rokit Media</title></Helmet>
      <div className="bg-rokit-dark pt-32 pb-16 text-center">
        <h1 className="text-5xl font-black text-white">Cookie Policy</h1>
        <p className="text-gray-400 mt-3">Last updated: January 2026</p>
      </div>
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 space-y-8 text-rokit-body leading-relaxed">

          <section>
            <h2 className="text-2xl font-black text-rokit-dark mb-3">What Are Cookies?</h2>
            <p>Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences and provide a better experience.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-rokit-dark mb-3">How We Use Cookies</h2>
            <p>We use cookies to keep you logged in, remember your cookie consent preferences, and understand how our site is used. We do not use third-party advertising cookies.</p>
          </section>

          <div className="space-y-6">
            {cookieTypes.map(type => (
              <div key={type.name} className="bg-rokit-tan p-6">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="font-black text-rokit-dark text-lg">{type.name}</h3>
                  <span className={`shrink-0 text-xs font-bold px-3 py-1 rounded-full ${type.required ? 'bg-rokit-orange text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {type.required ? 'Always Active' : 'Optional'}
                  </span>
                </div>
                <p className="text-sm mb-3">{type.description}</p>
                <ul className="list-disc pl-5 text-sm space-y-1 text-rokit-body/80">
                  {type.examples.map(ex => <li key={ex}>{ex}</li>)}
                </ul>
              </div>
            ))}
          </div>

          <section>
            <h2 className="text-2xl font-black text-rokit-dark mb-3">Managing Your Cookie Preferences</h2>
            <p className="mb-4">
              You can withdraw your consent at any time by clicking the button below. This will reload the cookie consent banner so you can update your choices.
            </p>
            <button onClick={handleManage} className="btn-outline">
              Reset Cookie Preferences
            </button>
          </section>

          <section>
            <h2 className="text-2xl font-black text-rokit-dark mb-3">Browser Settings</h2>
            <p>You can also control cookies through your browser settings. Note that disabling essential cookies may impact your ability to use core features of this website, such as staying logged in.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-rokit-dark mb-3">Contact</h2>
            <p>For questions about our use of cookies, contact <a href="mailto:rokitnow@gmail.com" className="text-rokit-orange hover:underline">rokitnow@gmail.com</a>.</p>
          </section>

        </div>
      </div>
    </>
  );
}
