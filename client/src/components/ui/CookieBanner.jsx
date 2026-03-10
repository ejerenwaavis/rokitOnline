import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie } from 'lucide-react';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('rokit_cookies');
    if (!accepted) setVisible(true);
  }, []);

  const accept = () => { localStorage.setItem('rokit_cookies', 'accepted'); setVisible(false); };
  const decline = () => { localStorage.setItem('rokit_cookies', 'declined'); setVisible(false); };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-rokit-dark border-t-2 border-rokit-orange shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Cookie size={20} className="text-rokit-orange mt-0.5 shrink-0" />
          <p className="text-sm text-gray-300">
            We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.{' '}
            <Link to="/cookies" className="text-rokit-orange hover:underline">Learn more</Link>
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button onClick={decline} className="px-4 py-2 text-sm border border-gray-600 text-gray-400 hover:border-gray-400 transition-colors">
            Decline
          </button>
          <button onClick={accept} className="btn-primary px-4 py-2 text-sm">
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
